"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Ambil semua data lapangan untuk User
export async function getLapangans() {
  try {
    const data = await prisma.lapangan.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengambil data lapangan";
    console.error("Error getLapangans:", error);
    return { success: false, error: msg };
  }
}

// 2. Ambil riwayat booking user berdasarkan email
export async function getUserBookings(userEmail: string) {
  try {
    if (!userEmail) return { success: true, data: [] };

    const customer = await prisma.customer.findUnique({
      where: { email: userEmail },
      include: {
        bookings: {
          include: {
            lapangan: true,
            payments: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) {
      return { success: true, data: [] };
    }

    return { success: true, data: customer.bookings };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengambil riwayat booking";
    console.error("Error getUserBookings:", error);
    return { success: false, error: msg };
  }
}

// 3. Simpan data booking baru dari user
export async function createBookingAction({
  userId,
  userEmail,
  userName,
  lapanganId, 
  startTime,
  endTime,
  amount,
  paymentType,
}: {
  userId: string;
  userEmail: string;
  userName: string;
  lapanganId: string;
  startTime: string;
  endTime: string;
  amount: number;
  paymentType: string;
}) {
  try {
    // Pastikan Customer ada di database
    let customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email: userEmail },
          ...(userId ? [{ userId }] : []),
        ],
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          userId: userId || `user-${Date.now()}`,
          email: userEmail,
          name: userName || "Pelanggan",
          username: `${userEmail.split("@")[0]}_${Date.now().toString().slice(-6)}`,
          password: "oauth-managed-account",
        },
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Cek apakah slot lapangan bentrok dengan booking lain
    const existingBooking = await prisma.booking.findFirst({
      where: {
        lapanganId: lapanganId,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        OR: [
          {
            startTime: { lte: start },
            endTime: { gt: start },
          },
          {
            startTime: { lt: end },
            endTime: { gte: end },
          },
          {
            startTime: { gte: start },
            endTime: { lte: end },
          },
        ],
      },
    });

    if (existingBooking) {
      return {
        success: false,
        error: "Jadwal pada jam ini sudah dipesan orang lain. Silakan pilih jam atau lapangan lain.",
      };
    }

    // Buat data Booking
    const newBooking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        lapanganId: lapanganId,
        startTime: start,
        endTime: end,
        status: paymentType === "QRIS" ? "CONFIRMED" : "PENDING",
        payments: {
          create: {
            amount: amount,
            status: paymentType === "QRIS" ? "SUCCESS" : "PENDING",
            paymentDate: new Date(),
            paymentType: paymentType,
          },
        },
      },
      include: {
        lapangan: true,
        payments: true,
      },
    });

    revalidatePath("/user");
    revalidatePath("/user/riwayat");
    revalidatePath("/admin");

    return { success: true, data: newBooking };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal membuat reservasi";
    console.error("Error createBookingAction:", error);
    return { success: false, error: msg };
  }
}

// 4. Cek role user langsung dari database MySQL
export async function getUserRoleAction(userEmail: string) {
  try {
    if (!userEmail) return { success: false, role: "USER" };
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true },
    });
    return { success: true, role: user?.role || "USER" };
  } catch (error: unknown) {
    console.error("Error getUserRoleAction:", error);
    return { success: false, role: "USER" };
  }
}

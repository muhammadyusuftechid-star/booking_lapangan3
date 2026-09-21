"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Ambil semua data lapangan nyata dari MySQL
export async function getLapangans() {
  try {
    const data = await prisma.lapangan.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error: any) {
    console.error("Error getLapangans:", error);
    return { success: false, error: error.message || "Gagal mengambil data lapangan" };
  }
}

// 2. Tambah Data Lapangan Baru (Admin)
export async function createLapanganAction({
  name,
  description,
  location,
  price,
  picture_url,
}: {
  name: string;
  description: string;
  location: string;
  price: number;
  picture_url: string;
}) {
  try {
    const newLapangan = await prisma.lapangan.create({
      data: {
        name,
        description,
        location,
        price: Number(price),
        picture_url: picture_url || null,
      },
    });

    revalidatePath("/dashboard");

    return { success: true, data: newLapangan };
  } catch (error: any) {
    console.error("Error createLapanganAction:", error);
    return { success: false, error: error.message || "Gagal menambah lapangan" };
  }
}

// 3. Hapus Data Lapangan (Admin)
export async function deleteLapanganAction(id: string) {
  try {
    // Hapus booking & payments terkait terlebih dahulu
    await prisma.payment.deleteMany({
      where: { booking: { lapanganId: id } },
    });
    await prisma.booking.deleteMany({
      where: { lapanganId: id },
    });
    await prisma.lapangan.delete({
      where: { id },
    });

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleteLapanganAction:", error);
    return { success: false, error: error.message || "Gagal menghapus lapangan" };
  }
}

// 4. Hapus Semua Lapangan Seed / Reset Data
export async function deleteAllLapangansAction() {
  try {
    await prisma.payment.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.lapangan.deleteMany({});

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleteAllLapangansAction:", error);
    return { success: false, error: error.message || "Gagal mengosongkan data" };
  }
}

// 5. Ambil riwayat booking pengguna nyata berdasarkan email
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
  } catch (error: any) {
    console.error("Error getUserBookings:", error);
    return { success: false, error: error.message || "Gagal mengambil riwayat booking" };
  }
}

// 6. Simpan data booking nyata ke MySQL
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
    let customer = await prisma.customer.findUnique({
      where: { email: userEmail },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          userId: userId || `user-${Date.now()}`,
          email: userEmail,
          name: userName || "Pelanggan",
          username: userEmail.split("@")[0] + `_${Math.floor(Math.random() * 1000)}`,
          password: "oauth-managed-account",
        },
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Cek apakah lapangan pada jam tersebut sudah dipesan (Bukan CANCELLED)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        lapanganId: lapanganId,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
        OR: [
          {
            // Slot baru mulai di tengah-tengah slot yang sudah ada
            startTime: { lte: start },
            endTime: { gt: start },
          },
          {
            // Slot baru selesai di tengah-tengah slot yang sudah ada
            startTime: { lt: end },
            endTime: { gte: end },
          },
          {
            // Slot baru mencakup keseluruhan slot yang sudah ada
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

    revalidatePath("/dashboard");

    return { success: true, data: newBooking };
  } catch (error: any) {
    console.error("Error createBookingAction:", error);
    return { success: false, error: error.message || "Gagal membuat reservasi" };
  }
}

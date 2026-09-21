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
        picture_url: picture_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/admin");

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
    revalidatePath("/dashboard/admin");

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
    revalidatePath("/dashboard/admin");

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

    // Buat data Booking
    const newBooking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        lapanganId: lapanganId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
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
    revalidatePath("/dashboard/admin");

    return { success: true, data: newBooking };
  } catch (error: any) {
    console.error("Error createBookingAction:", error);
    return { success: false, error: error.message || "Gagal membuat reservasi" };
  }
}

// 7. Ambil semua data booking untuk Admin
export async function getAllBookingsAdmin() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        lapangan: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: bookings };
  } catch (error: any) {
    console.error("Error getAllBookingsAdmin:", error);
    return { success: false, error: error.message || "Gagal mengambil data booking admin" };
  }
}

// 8. Update Status Booking oleh Admin
export async function updateBookingStatusAction(
  bookingId: string,
  status: "CONFIRMED" | "CANCELLED"
) {
  try {
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/admin");

    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updateBookingStatusAction:", error);
    return { success: false, error: error.message || "Gagal mengubah status booking" };
  }
}

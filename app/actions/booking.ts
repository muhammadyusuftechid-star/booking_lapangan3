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

    revalidatePath("/user");

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

    revalidatePath("/user");

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

    revalidatePath("/user");

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

    revalidatePath("/user");
    revalidatePath("/admin");

    return { success: true, data: newBooking };
  } catch (error: any) {
    console.error("Error createBookingAction:", error);
    return { success: false, error: error.message || "Gagal membuat reservasi" };
  }
}

// 7. Ambil semua reservasi untuk Panel Admin
export async function getAllBookingsForAdmin() {
  try {
    const data = await prisma.booking.findMany({
      include: {
        customer: true,
        lapangan: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error: any) {
    console.error("Error getAllBookingsForAdmin:", error);
    return { success: false, error: error.message || "Gagal mengambil data booking admin" };
  }
}

// 8. Update status booking (Setujui / Batalkan oleh Admin)
export async function updateBookingStatusAction(
  bookingId: string,
  newStatus: "CONFIRMED" | "CANCELLED"
) {
  try {
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: newStatus,
        payments: {
          updateMany: {
            where: { bookingId },
            data: {
              status: newStatus === "CONFIRMED" ? "SUCCESS" : "FAILED",
            },
          },
        },
      },
    });

    revalidatePath("/admin");
    revalidatePath("/user");

    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updateBookingStatusAction:", error);
    return { success: false, error: error.message || "Gagal memperbarui status booking" };
  }
}

// 9. Aksi pembantu untuk mengubah role user menjadi ADMIN (untuk tes)
export async function setUserRoleAction(userEmail: string, role: "USER" | "ADMIN") {
  try {
    await prisma.user.update({
      where: { email: userEmail },
      data: { role },
    });
    revalidatePath("/admin");
    revalidatePath("/user");
    return { success: true, message: `Role akun ${userEmail} berhasil diubah menjadi ${role}` };
  } catch (error: any) {
    console.error("Error setUserRoleAction:", error);
    return { success: false, error: error.message || "Gagal mengubah role pengguna" };
  }
}

// 10. Cek role user langsung dari database MySQL
export async function getUserRoleAction(userEmail: string) {
  try {
    if (!userEmail) return { success: false, role: "USER" };
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { role: true },
    });
    return { success: true, role: user?.role || "USER" };
  } catch (error: any) {
    console.error("Error getUserRoleAction:", error);
    return { success: false, role: "USER" };
  }
}

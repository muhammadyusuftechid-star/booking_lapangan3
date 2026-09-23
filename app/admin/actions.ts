"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Ambil semua data booking untuk Admin
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengambil data booking admin";
    console.error("Error getAllBookingsForAdmin:", error);
    return { success: false, error: msg };
  }
}

// 2. Setujui atau Tolak Booking
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
    revalidatePath("/user/riwayat");

    return { success: true, data: updated };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui status booking";
    console.error("Error updateBookingStatusAction:", error);
    return { success: false, error: msg };
  }
}

// 3. Ambil data lapangan
export async function getLapangansAdmin() {
  try {
    const data = await prisma.lapangan.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengambil data lapangan";
    console.error("Error getLapangansAdmin:", error);
    return { success: false, error: msg };
  }
}

// 4. Tambah Lapangan Baru (Admin)
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

    revalidatePath("/admin");
    revalidatePath("/user");
    revalidatePath("/user/lapangan");

    return { success: true, data: newLapangan };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal menambah lapangan";
    console.error("Error createLapanganAction:", error);
    return { success: false, error: msg };
  }
}

// 5. Hapus Lapangan (Admin)
export async function deleteLapanganAction(id: string) {
  try {
    await prisma.payment.deleteMany({
      where: { booking: { lapanganId: id } },
    });
    await prisma.booking.deleteMany({
      where: { lapanganId: id },
    });
    await prisma.lapangan.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/user");
    revalidatePath("/user/lapangan");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal menghapus lapangan";
    console.error("Error deleteLapanganAction:", error);
    return { success: false, error: msg };
  }
}

// 6. Reset Seluruh Data (Admin)
export async function deleteAllLapangansAction() {
  try {
    await prisma.payment.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.lapangan.deleteMany({});

    revalidatePath("/admin");
    revalidatePath("/user");

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengosongkan data";
    console.error("Error deleteAllLapangansAction:", error);
    return { success: false, error: msg };
  }
}

// 7. Ubah Role User (Admin)
export async function setUserRoleAction(userEmail: string, role: "USER" | "ADMIN") {
  try {
    await prisma.user.update({
      where: { email: userEmail },
      data: { role },
    });
    revalidatePath("/admin");
    revalidatePath("/user");
    return { success: true, message: `Role akun ${userEmail} berhasil diubah menjadi ${role}` };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengubah role pengguna";
    console.error("Error setUserRoleAction:", error);
    return { success: false, error: msg };
  }
}

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Tambah Lapangan Baru
export async function createLapangan(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const location = (formData.get("location") as string) || "Area Utama";
  const description = (formData.get("description") as string) || "Lapangan berkualitas";
  const picture_url = ((formData.get("picture_url") as string) || "").trim() || null;

  if (!name || isNaN(price)) return;

  try {
    await prisma.lapangan.create({
      data: {
        id: "lap-" + Date.now(),
        name,
        price,
        location,
        description,
        picture_url,
        updatedAt: new Date(),
      },
    });
    revalidatePath("/admin/lapangan");
    revalidatePath("/admin");
    revalidatePath("/user");
    revalidatePath("/user/lapangan");
    revalidatePath("/user/pesan");
  } catch (error) {
    console.error("Gagal menambah data ke database:", error);
  }
}

// 2. Edit / Perbarui Data Lapangan
export async function updateLapangan(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const location = (formData.get("location") as string) || "Area Utama";
  const description = (formData.get("description") as string) || "";
  const picture_url = ((formData.get("picture_url") as string) || "").trim() || null;

  if (!id || !name || isNaN(price)) return;

  try {
    await prisma.lapangan.update({
      where: { id },
      data: {
        name,
        price,
        location,
        description,
        picture_url,
        updatedAt: new Date(),
      },
    });
    revalidatePath("/admin/lapangan");
    revalidatePath("/admin");
    revalidatePath("/user");
    revalidatePath("/user/lapangan");
    revalidatePath("/user/pesan");
  } catch (error) {
    console.error("Gagal mengupdate data lapangan:", error);
  }
}

// 3. Hapus Lapangan (beserta transaksi terkait)
export async function removeLapangan(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    // Bersihkan pembayaran dan booking yang mengikat ke lapangan ini terlebih dahulu
    await prisma.payment.deleteMany({
      where: { booking: { lapanganId: id } },
    });
    await prisma.booking.deleteMany({
      where: { lapanganId: id },
    });
    await prisma.lapangan.delete({
      where: { id },
    });
    revalidatePath("/admin/lapangan");
    revalidatePath("/admin");
    revalidatePath("/user");
    revalidatePath("/user/lapangan");
    revalidatePath("/user/pesan");
  } catch (error) {
    console.error("Gagal menghapus data dari database:", error);
  }
}
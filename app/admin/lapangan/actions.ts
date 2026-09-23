"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createLapangan(formData: FormData) {
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const location = (formData.get("location") as string) || "Area Utama";
  const description = (formData.get("description") as string) || "Lapangan berkualitas";

  if (!name || isNaN(price)) return;

  try {
    await prisma.lapangan.create({
      data: {
        id: "lap-" + Date.now(),
        name,
        price,
        location,
        description,
        updatedAt: new Date(),
      },
    });
    revalidatePath("/admin/lapangan");
  } catch (error) {
    console.error("Gagal menambah data ke database:", error);
  }
}

export async function removeLapangan(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    await prisma.lapangan.delete({
      where: { id },
    });
    revalidatePath("/admin/lapangan");
  } catch (error) {
    console.error("Gagal menghapus data dari database:", error);
  }
}
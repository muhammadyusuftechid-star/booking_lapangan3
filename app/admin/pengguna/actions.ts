"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleUserRoleAction(userId: string, newRole: "USER" | "ADMIN") {
  try {
    if (!userId || !newRole) {
      return { success: false, error: "Parameter tidak valid" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath("/admin/pengguna");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui role pengguna";
    console.error("Error toggleUserRoleAction:", error);
    return { success: false, error: msg };
  }
}

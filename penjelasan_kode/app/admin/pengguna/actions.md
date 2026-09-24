# ⚙️ Penjelasan File: `app/admin/pengguna/actions.ts`

* **File Asli**: [`app/admin/pengguna/actions.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/pengguna/actions.ts)
* **Kategori**: Server Actions Manajemen Role Pengguna
* **Tingkat Akses**: **Backend Only (`"use server"`)**

---

## 🎯 Peran Utama File Ini
Menyediakan operasi backend untuk mengubah hak akses (*role*) pengguna di database MySQL antara status `USER` (pengguna biasa) dan `ADMIN` (pengelola).

---

## 🔍 Bedah & Terjemahan Kode

```typescript
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleUserRoleAction(userId: string, newRole: "USER" | "ADMIN") {
  try {
    if (!userId || !newRole) {
      return { success: false, error: "Parameter tidak valid" };
    }

    // 1. Perbarui kolom 'role' pada baris user yang dipilih
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    // 2. Segarkan cache Next.js agar perubahan langsung terlihat di layar
    revalidatePath("/admin/pengguna");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui role pengguna";
    console.error("Error toggleUserRoleAction:", error);
    return { success: false, error: msg };
  }
}
```

---

## 💡 Konsep Penting untuk Presentasi

1. **`revalidatePath("/admin/pengguna")`**:
   Setelah database MySQL diperbarui, Next.js otomatis menghapus cache halaman `/admin/pengguna` sehingga data terbaru langsung dirender ke layar tanpa perlu me-refresh halaman browser secara manual (*F5*).

2. **Validasi Parameter**:
   Sebelum mengeksekusi ke database, sistem memastikan `userId` dan `newRole` terisi valid untuk mencegah eksekusi error yang tidak diinginkan.

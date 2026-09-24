# ⚙️ Penjelasan File: `app/admin/lapangan/actions.ts`

* **File Asli**: [`app/admin/lapangan/actions.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/lapangan/actions.ts)
* **Kategori**: Server Actions Khusus Manajemen Lapangan
* **Tingkat Akses**: **Backend Only (`"use server"`)**

---

## 🎯 Peran Utama File Ini
File backend yang menangani aksi formulir (*form actions*) pada halaman kelola lapangan:
1. **`createLapangan(formData)`**: Menangkap data isian form (nama, harga, lokasi, deskripsi) dan menyimpannya sebagai baris baru di tabel `lapangan` MySQL.
2. **`removeLapangan(formData)`**: Menghapus lapangan tertentu secara aman dengan menghapus data pembayaran dan booking terkait terlebih dahulu agar terhindar dari konflik kunci asing (*foreign key constraint error*).

---

## 🔍 Bedah & Terjemahan Kode

### 1. `createLapangan` (Form Action Tambah)
```typescript
export async function createLapangan(formData: FormData) {
  // Ambil data yang diketik admin di form HTML
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const location = (formData.get("location") as string) || "Area Utama";
  const description = (formData.get("description") as string) || "Lapangan berkualitas";

  if (!name || isNaN(price)) return; // Validasi agar data kosong tidak masuk

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
    revalidatePath("/admin/lapangan"); // Segarkan halaman admin
  } catch (error) {
    console.error("Gagal menambah data ke database:", error);
  }
}
```

---

### 2. `removeLapangan` (Form Action Hapus Aman)
```typescript
export async function removeLapangan(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    // 1. Bersihkan pembayaran dan booking yang terkait dengan lapangan ini
    await prisma.payment.deleteMany({
      where: { booking: { lapanganId: id } },
    });
    await prisma.booking.deleteMany({
      where: { lapanganId: id },
    });
    
    // 2. Hapus lapangan
    await prisma.lapangan.delete({
      where: { id },
    });

    revalidatePath("/admin/lapangan");
    revalidatePath("/admin");
    revalidatePath("/user");
    revalidatePath("/user/lapangan");
  } catch (error) {
    console.error("Gagal menghapus data dari database:", error);
  }
}
```
* **`formData.get(...)`**: Standar bawaan HTML/React untuk mengekstrak data dari elemen form `<input name="...">` tanpa perlu membuat state `useState` manual.

# ⚙️ Penjelasan File: `app/admin/lapangan/actions.ts`

* **File Asli**: [`app/admin/lapangan/actions.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/lapangan/actions.ts)
* **Kategori**: Server Actions Khusus Manajemen Lapangan (Full CRUD)
* **Tingkat Akses**: **Backend Only (`"use server"`)**

---

## 🎯 Peran Utama File Ini
File backend yang menangani seluruh operasi siklus hidup fasilitas lapangan (*CRUD*):
1. **`createLapangan(formData)`**: Menangkap data isian form (nama, harga, lokasi, deskripsi, dan URL foto) dan menyimpannya sebagai baris baru di tabel `lapangan` MySQL.
2. **`updateLapangan(formData)`**: Memperbarui informasi lapangan yang sudah ada (mengubah tarif, nama, lokasi, deskripsi, atau mengganti link foto).
3. **`removeLapangan(formData)`**: Menghapus lapangan tertentu secara aman dengan membersihkan data pembayaran dan booking terkait terlebih dahulu agar terhindar dari konflik kunci asing (*foreign key constraint error*).

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
  const picture_url = ((formData.get("picture_url") as string) || "").trim() || null;

  if (!name || isNaN(price)) return; // Validasi agar data kosong tidak masuk

  try {
    await prisma.lapangan.create({
      data: {
        id: "lap-" + Date.now(),
        name,
        price,
        location,
        description,
        picture_url, // Menyimpan tautan gambar lapangan
        updatedAt: new Date(),
      },
    });
    revalidatePath("/admin/lapangan"); // Segarkan halaman admin
    revalidatePath("/admin");
    revalidatePath("/user");
    revalidatePath("/user/lapangan");
    revalidatePath("/user/pesan");
  } catch (error) {
    console.error("Gagal menambah data ke database:", error);
  }
}
```

---

### 2. `updateLapangan` (Form Action Edit / Perbarui)
```typescript
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
```
* **Terjemahan**:
  * Mencari baris lapangan berdasarkan `id` (`where: { id }`).
  * Memperbarui kolom tarif, nama, lokasi, deskripsi, dan foto dengan data baru dari form modal edit.
  * Memanggil `revalidatePath` agar halaman admin maupun user langsung menampilkan harga atau foto baru tanpa perlu refresh manual.

---

### 3. `removeLapangan` (Form Action Hapus Aman)
```typescript
export async function removeLapangan(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    // 1. Bersihkan pembayaran dan booking yang terkait dengan lapangan ini terlebih dahulu
    await prisma.payment.deleteMany({
      where: { booking: { lapanganId: id } },
    });
    await prisma.booking.deleteMany({
      where: { lapanganId: id },
    });
    
    // 2. Hapus data lapangan
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
```

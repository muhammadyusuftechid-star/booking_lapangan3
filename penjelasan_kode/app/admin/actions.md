# 🛡️ Penjelasan File: `app/admin/actions.ts`

* **File Asli**: [`app/admin/actions.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/actions.ts)
* **Kategori**: Logika Bisnis & Server Actions Administrator
* **Tingkat Akses**: **Backend Only (`"use server"`)**

---

## 🎯 Peran Utama File Ini
File ini memuat seluruh kumpulan fungsi backend khusus pengelola/administrator:
1. Mengambil seluruh data booking dari semua pelanggan (`getAllBookingsForAdmin`).
2. Menyetujui atau menolak pesanan booking (`updateBookingStatusAction`).
3. Mengambil data lapangan untuk panel admin (`getLapangansAdmin`).
4. Menambah lapangan baru (`createLapanganAction`).
5. Menghapus lapangan beserta pembayaran terkait secara aman (`deleteLapanganAction`).
6. Mengubah role hak akses akun pengguna (`setUserRoleAction`).

---

## 🔍 Bedah & Terjemahan Fungsi-Fungsi Kunci

### 1. `updateBookingStatusAction(bookingId, newStatus)`
Fungsi yang dieksekusi saat admin mengklik tombol **Setujui** atau **Tolak**:
```typescript
export async function updateBookingStatusAction(
  bookingId: string,
  newStatus: "CONFIRMED" | "CANCELLED"
) {
  try {
    // 1. Perbarui status di tabel Booking
    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: newStatus,
        // 2. Otomatis perbarui status transaksi di tabel Payment terkait
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

    // 3. Bersihkan cache halaman agar data di layar admin & user langsung sinkron
    revalidatePath("/admin");
    revalidatePath("/user");
    revalidatePath("/user/riwayat");

    return { success: true, data: updated };
  } catch (error: unknown) {
    return { success: false, error: "Gagal memperbarui status booking" };
  }
}
```
* **Sinkronisasi Otomatis**: Ketika admin menyetujui pesanan (`CONFIRMED`), status pembayaran terkait otomatis diubah menjadi `SUCCESS`. Sebaliknya, jika ditolak (`CANCELLED`), status pembayaran menjadi `FAILED`.

---

### 2. `deleteLapanganAction(id)` — Penghapusan Bertingkat Aman (Cascade Delete)
```typescript
export async function deleteLapanganAction(id: string) {
  try {
    // 1. Hapus catatan pembayaran yang menempel pada booking lapangan ini
    await prisma.payment.deleteMany({
      where: { booking: { lapanganId: id } },
    });
    // 2. Hapus seluruh data booking lapangan ini
    await prisma.booking.deleteMany({
      where: { lapanganId: id },
    });
    // 3. Baru hapus lapangan itu sendiri
    await prisma.lapangan.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/user");
    revalidatePath("/user/lapangan");

    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: "Gagal menghapus lapangan" };
  }
}
```
* **Mencegah Error MySQL Foreign Key**: Basis data relasional melarang penghapusan data induk jika anak datanya masih ada. Dengan menghapus payment dan booking terlebih dahulu, proses hapus lapangan berjalan mulus tanpa error.

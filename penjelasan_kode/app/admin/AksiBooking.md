# ⚡ Penjelasan File: `app/admin/components/AksiBooking.tsx`

* **File Asli**: [`app/admin/components/AksiBooking.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/components/AksiBooking.tsx)
* **Kategori**: Tombol Interaktif Persetujuan Booking (Action Buttons Component)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen interaktif yang dipasang di setiap baris tabel pesanan dashboard admin.
Fungsinya:
1. Jika status pesanan masih **`PENDING`**:
   * Menampilkan tombol hijau **"Setujui"** (mengubah status menjadi `CONFIRMED` dan pembayaran menjadi `SUCCESS`).
   * Menampilkan tombol merah **"Tolak"** (mengubah status menjadi `CANCELLED` dan pembayaran menjadi `FAILED`).
2. Jika pesanan sudah bukan pending (sudah pernah disetujui atau dibatalkan):
   * Menampilkan label tenang berwarna abu-abu bertuliskan *"Selesai"*.

---

## 🔍 Bedah & Terjemahan Eksekusi Aksi

```typescript
const handleUpdate = async (newStatus: "CONFIRMED" | "CANCELLED") => {
  try {
    setLoadingAction(newStatus); // Munculkan spinner di tombol yang diklik

    // Panggil Server Action backend di app/admin/actions.ts
    const res = await updateBookingStatusAction(bookingId, newStatus);
    
    if (!res.success) {
      alert(res.error || "Gagal mengubah status pesanan");
    } else {
      router.refresh(); // Segarkan data tabel di layar secara instan
    }
  } catch (err) {
    console.error("Error updating booking:", err);
  } finally {
    setLoadingAction(null);
  }
};
```
* **`router.refresh()`**: Fitur bawaan Next.js untuk meminta server mengirimkan data tabel terbaru tanpa membuat halaman browser berkedip atau memuat ulang dari nol.

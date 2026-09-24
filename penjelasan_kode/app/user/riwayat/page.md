# 📜 Penjelasan File: `app/user/riwayat/page.tsx`

* **File Asli**: [`app/user/riwayat/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/riwayat/page.tsx)
* **Kategori**: Halaman Riwayat Transaksi Pengguna (User Booking History View)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Halaman yang menampilkan seluruh daftar pesanan yang pernah dibuat oleh pelanggan yang sedang login.
Fitur utamanya:
1. Memanggil Server Action `getUserBookings(session.user.email)` dari database MySQL.
2. Menyediakan tab filter status: **Semua**, **Menunggu**, **Disetujui**, dan **Dibatalkan**.
3. Menyediakan kolom pencarian teks untuk mencari arena atau lokasi lapangan.
4. Menampilkan kartu riwayat pesanan (`<KartuRiwayat />`) atau pesan kosong (`<RiwayatKosong />`) jika belum ada data.

---

## 🔍 Bedah & Terjemahan Optimasi Memo (`useMemo`)

```typescript
const filteredBookings = useMemo(() => {
  return bookings.filter((b) => {
    // 1. Cek kecocokan tab status
    const matchStatus = filterStatus === "ALL" || b.status === filterStatus;

    // 2. Cek kecocokan ketikan pencarian (nama atau lokasi lapangan)
    const matchQuery =
      searchQuery === "" ||
      (b.lapangan?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.lapangan?.location || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchQuery;
  });
}, [bookings, filterStatus, searchQuery]);
```

* **Konsep Penting (`useMemo`)**:
  `useMemo` adalah hook optimasi performa React. Fungsi filter hanya akan dihitung ulang jika salah satu dari `bookings`, `filterStatus`, atau `searchQuery` berubah. Jika tidak ada perubahan, React menggunakan hasil yang sudah tersimpan di memori cache sehingga aplikasi terasa sangat ringan dan responsif.

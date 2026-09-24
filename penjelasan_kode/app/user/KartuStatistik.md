# 📈 Penjelasan File: `app/user/components/KartuStatistik.tsx`

* **File Asli**: [`app/user/components/KartuStatistik.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/components/KartuStatistik.tsx)
* **Kategori**: Kartu Ringkasan Angka Statistik (Dashboard Widget)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen visual 4 kolom di dashboard yang menampilkan ringkasan data penting pengguna:
1. **Total Booking**: Jumlah total pesanan yang pernah dibuat pengguna.
2. **Menunggu**: Pesanan yang masih berstatus `PENDING` (warna kuning amber).
3. **Disetujui**: Pesanan yang siap pakai / berstatus `CONFIRMED` (warna hijau).
4. **Arena Tersedia**: Total jumlah lapangan aktif yang ada di sistem.

---

## 🔍 Bedah & Terjemahan Props Interface

```typescript
interface KartuStatistikProps {
  totalBooking: number;
  menunggu: number;
  disetujui: number;
  arenaTersedia: number;
}
```
* **Props (Properties)**: Komponen ini menerima 4 angka dari halaman induk [app/user/page.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/page.tsx) dan merendernya dalam susunan grid responsif:
  * Di layar HP (`grid-cols-2`): Ditampilkan 2 kolom menyamping.
  * Di layar Laptop (`sm:grid-cols-4`): Ditampilkan 4 kolom sejajar menyamping.

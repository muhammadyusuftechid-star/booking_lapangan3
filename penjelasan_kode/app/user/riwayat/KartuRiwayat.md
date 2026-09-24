# 🗂️ Penjelasan File: `app/user/riwayat/components/KartuRiwayat.tsx`

* **File Asli**: [`app/user/riwayat/components/KartuRiwayat.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/riwayat/components/KartuRiwayat.tsx)
* **Kategori**: Kartu Tampilan Item Riwayat Booking (History Item Card)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen kartu yang merender informasi satu pesanan yang pernah dibuat oleh pelanggan.
Menampilkan:
1. **Nama & Lokasi Lapangan**: Ikon gedung dan nama arena olahraga.
2. **Badge Status Warna-Warni**:
   * **Hijau (Disetujui)**: Ikon centang jika status `CONFIRMED`.
   * **Kuning (Menunggu)**: Ikon seru jika status `PENDING`.
   * **Merah (Dibatalkan)**: Ikon silang jika status `CANCELLED`.
3. **Waktu Main Terformat**: Hari, tanggal, bulan, tahun (contoh: *"Sabtu, 26 September 2026"*), dan rentang jam main (contoh: *"08:00 - 10:00 WIB"*).
4. **Rincian Pembayaran**: Total nominal uang Rupiah dan jenis pembayaran yang dipakai (QRIS atau Transfer Bank).

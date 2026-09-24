# 🧾 Penjelasan File: `app/user/pesan/components/BuktiSukses.tsx`

* **File Asli**: [`app/user/pesan/components/BuktiSukses.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/pesan/components/BuktiSukses.tsx)
* **Kategori**: Nota Tanda Bukti Pemesanan Sukses (Success Receipt Modal)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen nota digital yang otomatis muncul setelah data reservasi berhasil disimpan ke MySQL.
Menampilkan:
1. Ikon centang hijau besar bertuliskan *"Reservasi Berhasil Dibuat!"*.
2. **Nomor ID Reservasi**: Kode transaksi unik 8 digit kapital (contoh: `#A1B2C3D4`).
3. **Rincian Pemesanan**: Nama lapangan, tanggal bermain berformat bahasa Indonesia, rentang jam main, metode pembayaran, dan total tagihan.
4. **Navigasi Cepat**:
   * Tombol *"Pesan Lagi"*: Mereset form untuk membuat pesanan baru.
   * Tombol *"Lihat Dashboard"*: Kembali ke beranda portal pelanggan `/user`.

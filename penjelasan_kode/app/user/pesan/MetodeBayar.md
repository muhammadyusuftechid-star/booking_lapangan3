# 💳 Penjelasan File: `app/user/pesan/components/MetodeBayar.tsx`

* **File Asli**: [`app/user/pesan/components/MetodeBayar.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/pesan/components/MetodeBayar.tsx)
* **Kategori**: Langkah 3 Formulir Pemesanan (Payment Method & Checkout Button)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen langkah ketiga sekaligus tombol eksekusi pemesanan:
1. **Pilihan Metode Pembayaran**:
   * **QRIS**: Berlabel *"Otomatis Lunas"*. Status booking langsung menjadi `CONFIRMED`.
   * **Transfer Bank**: Berlabel *"Verifikasi Manual"*. Status booking menjadi `PENDING` menunggu persetujuan admin.
2. **Kotak Total Biaya**: Menampilkan angka total yang harus dibayarkan dengan format Rupiah tebal.
3. **Tombol "Konfirmasi & Pesan Sekarang"**: Tombol biru utama yang memicu fungsi pengiriman data ke server.
   * Saat sedang diproses (`isSubmitting`), tombol memunculkan animasi spinner `Loader2` bertuliskan *"Memproses Reservasi..."*.

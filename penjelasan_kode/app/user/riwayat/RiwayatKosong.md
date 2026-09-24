# 📭 Penjelasan File: `app/user/riwayat/components/RiwayatKosong.tsx`

* **File Asli**: [`app/user/riwayat/components/RiwayatKosong.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/riwayat/components/RiwayatKosong.tsx)
* **Kategori**: Tampilan Saat Data Kosong (Empty State Component)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen yang secara ramah menyapa pengguna ketika tidak ada data riwayat yang bisa ditampilkan.
Dua kondisi yang ditangani:
1. **Belum Pernah Memesan sama sekali**:
   Menampilkan teks *"Anda belum pernah melakukan pemesanan jadwal lapangan"* dan menyediakan tombol biru *"Mulai Pesan Lapangan"* yang mengarahkan user ke `/user/pesan`.
2. **Tidak Ada yang Cocok dengan Filter**:
   Jika user mengetik kata kunci yang tidak ada hasilnya, teks menyesuaikan menjadi *"Tidak ada pesanan yang sesuai dengan filter atau kata kunci pencarian Anda"*.

# ⏰ Penjelasan File: `app/user/pesan/components/PilihJadwal.tsx`

* **File Asli**: [`app/user/pesan/components/PilihJadwal.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/pesan/components/PilihJadwal.tsx)
* **Kategori**: Langkah 2 Formulir Pemesanan (Schedule & Time Slot Selector)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen langkah kedua yang menangani penanggalan dan durasi bermain:
1. **Pemilih Tanggal**: Menggunakan `<input type="date">` dengan batas minimal hari ini (`min={todayStr}`) agar user tidak bisa memesan tanggal di masa lalu.
2. **Slot Jam Mulai**: Pilihan dropdown dari jam `07:00` sampai `21:00` WIB.
3. **Pilihan Durasi**: Dropdown opsi durasi 1 Jam, 2 Jam, 3 Jam, atau 4 Jam.
4. **Kotak Estimasi Jam Selesai**: Menampilkan secara dinamis jam berapa sewa lapangan akan berakhir (misal: "10:00 WIB").

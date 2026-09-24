# ⏰ Penjelasan File: `app/user/pesan/components/PilihJadwal.tsx`

* **File Asli**: [`app/user/pesan/components/PilihJadwal.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/pesan/components/PilihJadwal.tsx)
* **Kategori**: Langkah 2 Formulir Pemesanan (Schedule & Time Slot Selector)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen langkah kedua yang menangani penanggalan, durasi bermain, serta **pencegahan bentrok jadwal langsung di layar pengguna**:
1. **Pemilih Tanggal**: Menggunakan `<input type="date">` dengan batas minimal hari ini (`min={todayStr}`) agar user tidak bisa memesan tanggal di masa lalu.
2. **Pengecekan Slot Terisi (`bookedSlots`)**: Menerima data slot jadwal yang sudah dipesan dari database MySQL.
3. **Pencegahan Bentrok Visual**:
   - Jika suatu jam sudah dipesan orang lain, opsi jam tersebut diberi label **(Penuh / Sudah Dipesan)** dan otomatis dinonaktifkan (`disabled={isBooked}`) dengan teks abu-abu.
   - Peringatan kuning (*alert*) akan muncul jika jam yang sedang dipilih bertabrakan dengan pesanan yang sudah ada.
4. **Pilihan Durasi**: Dropdown opsi durasi 1 Jam, 2 Jam, 3 Jam, atau 4 Jam.
5. **Kotak Estimasi Jam Selesai**: Menampilkan secara dinamis jam berapa sewa lapangan akan berakhir (misal: "08:00 - 10:00 WIB").

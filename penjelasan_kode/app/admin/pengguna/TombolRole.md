# 🛡️ Penjelasan File: `app/admin/pengguna/components/TombolRole.tsx`

* **File Asli**: [`app/admin/pengguna/components/TombolRole.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/pengguna/components/TombolRole.tsx)
* **Kategori**: Komponen Interaktif Pengubah Role Pengguna
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Tombol interaktif di baris tabel pengguna yang menampilkan status role saat ini (`ADMIN` atau `USER`) dan memungkinkan admin untuk mengubah role tersebut dengan satu kali klik.

---

## 🔍 Alur Kerja & Kode

1. Menampilkan badge status:
   - Jika `ADMIN`: Tampil badge hijau bertuliskan **ADMIN** dengan ikon perisai (`ShieldCheck`).
   - Jika `USER`: Tampil badge abu-abu bertuliskan **USER** dengan ikon orang (`UserCheck`).
2. Saat tombol diklik:
   - Jika saat ini `ADMIN`, akan meminta konfirmasi untuk mengubah ke `USER` (Demosi).
   - Jika saat ini `USER`, akan meminta konfirmasi untuk mempromosikan menjadi `ADMIN`.
3. Memanggil server action `toggleUserRoleAction(userId, newRole)`.
4. Menampilkan indikator loading animasi (`Loader2`) selama proses update database berlangsung.

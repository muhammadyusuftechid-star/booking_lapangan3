# 📚 Dokumentasi & Terjemahan Lengkap Kode "Booking Lapangan"

Selamat datang di folder dokumentasi dan penjelasan kode aplikasi **Booking Lapangan**!
Folder ini dibuat khusus untuk membedah, menerjemahkan, dan menjelaskan setiap file kodingan di dalam aplikasi ini dengan bahasa Indonesia yang santai, terstruktur, dan mudah dipahami oleh pemula maupun pengembang.

---

## 🗺️ Peta Navigasi File & Modul

Klik link di bawah ini untuk langsung membaca penjelasan detail dari masing-masing file:

### ⚙️ 1. Konfigurasi & Basis Data
* [**env.md**](./env.md) — Penjelasan variabel lingkungan, kredensial database MySQL, dan rahasia Google OAuth di `.env`.
* [**package_json.md**](./package_json.md) — Penjelasan dependencies, library (Next.js, Prisma, Better-Auth, Tailwind), dan skrip perintah.
* [**types/booking.md**](./types/booking.md) — Penjelasan tipe data TypeScript (`Lapangan`, `BookingWithRelations`, `Payment`, `Customer`).
* [**prisma/schema_prisma.md**](./prisma/schema_prisma.md) — Bedah skema database Prisma: model `User`, `Session`, `Lapangan`, `Booking`, dan `Payment`.
* [**prisma/prisma_config.md**](./prisma/prisma_config.md) — Penjelasan konfigurasi Prisma Client dan driver adapter.

---

### 🔌 2. Pustaka Pembantu (Folder `lib/`)
* [**lib/prisma.md**](./lib/prisma.md) — Inisialisasi koneksi database MySQL melalui MariaDB adapter dan pola singleton.
* [**lib/auth.md**](./lib/auth.md) — Konfigurasi backend Better-Auth (Role USER/ADMIN, Email/Password, dan Google OAuth).
* [**lib/auth_client.md**](./lib/auth_client.md) — SDK frontend Better-Auth untuk login, register, logout, dan cek sesi di browser.

---

### 🌐 3. Rute Utama & API (Folder `app/`)
* [**app/layout.md**](./app/layout.md) — Root layout aplikasi, konfigurasi font Geist, dan metadata website.
* [**app/page.md**](./app/page.md) — Halaman awal pintu masuk (pengalihan otomatis ke login, user, atau admin berdasarkan sesi).
* [**app/globals_css.md**](./app/globals_css.md) — Penjelasan file CSS global dan integrasi Tailwind CSS v4.
* [**app/api/auth/route.md**](./app/api/auth/route.md) — Endpoint REST API handler untuk sistem autentikasi Better-Auth.

---

### 🔐 4. Modul Login & Autentikasi (Folder `app/login/`)
* [**app/login/page.md**](./app/login/page.md) — Halaman login utama, deteksi status sesi, dan penanganan error.
* [**app/login/FormEmail.md**](./app/login/FormEmail.md) — Formulir interaktif untuk masuk (Sign In) dan mendaftar akun baru (Sign Up).
* [**app/login/TombolGoogle.md**](./app/login/TombolGoogle.md) — Tombol login sekali klik menggunakan akun Google (OAuth).

---

### 👤 5. Modul Pengguna (Folder `app/user/`)
* [**app/user/actions.md**](./app/user/actions.md) — **(Backend)** Server Actions untuk mengambil lapangan, reservasi baru, dan riwayat booking.
* [**app/user/layout.md**](./app/user/layout.md) — Layout halaman user, proteksi akses login, header, dan navigasi bawah mobile.
* [**app/user/page.md**](./app/user/page.md) — Dashboard ringkasan user, sapaan nama akun, dan kartu statistik.
* [**app/user/HeaderUser.md**](./app/user/HeaderUser.md) — Header atas portal user dengan foto inisial dan tombol logout.
* [**app/user/BottomNav.md**](./app/user/BottomNav.md) — Navigasi tab bar melayang di bagian bawah khusus layar HP/mobile.
* [**app/user/KartuStatistik.md**](./app/user/KartuStatistik.md) — Komponen rekap jumlah pesanan (menunggu, disetujui, arena tersedia).

#### 🏟️ Sub-Modul Lapangan User:
* [**app/user/lapangan/page.md**](./app/user/lapangan/page.md) — Halaman katalog pencarian dan eksplorasi seluruh lapangan.
* [**app/user/lapangan/CariLapangan.md**](./app/user/lapangan/CariLapangan.md) — Bilah pencarian kata kunci dan filter kategori olahraga.
* [**app/user/lapangan/KartuLapangan.md**](./app/user/lapangan/KartuLapangan.md) — Kartu tampilan informasi foto, tarif per jam, lokasi, dan tombol pesan.

#### 📅 Sub-Modul Pemesanan (Pesan):
* [**app/user/pesan/page.md**](./app/user/pesan/page.md) — Halaman formulir pemesanan lengkap dan pengirim data booking.
* [**app/user/pesan/PilihLapangan.md**](./app/user/pesan/PilihLapangan.md) — Komponen pemilihan lapangan yang ingin disewa.
* [**app/user/pesan/PilihJadwal.md**](./app/user/pesan/PilihJadwal.md) — Komponen pemilihan tanggal, jam mulai, dan durasi sewa.
* [**app/user/pesan/MetodeBayar.md**](./app/user/pesan/MetodeBayar.md) — Pilihan pembayaran QRIS (lunas otomatis) atau Transfer Bank.
* [**app/user/pesan/BuktiSukses.md**](./app/user/pesan/BuktiSukses.md) — Tampilan nota/tanda bukti setelah pesanan berhasil dicatat.

#### 📜 Sub-Modul Riwayat Pesanan:
* [**app/user/riwayat/page.md**](./app/user/riwayat/page.md) — Halaman daftar riwayat seluruh transaksi pemesanan user.
* [**app/user/riwayat/FilterStatus.md**](./app/user/riwayat/FilterStatus.md) — Filter tab status (Semua, Menunggu, Disetujui, Dibatalkan).
* [**app/user/riwayat/KartuRiwayat.md**](./app/user/riwayat/KartuRiwayat.md) — Kartu riwayat transaksi dengan badge warna status.
* [**app/user/riwayat/RiwayatKosong.md**](./app/user/riwayat/RiwayatKosong.md) — Tampilan ramah saat user belum memiliki pesanan.

---

### 🛡️ 6. Modul Administrator (Folder `app/admin/`)
* [**app/admin/actions.md**](./app/admin/actions.md) — **(Backend)** Server Actions admin untuk kelola status booking dan data lapangan.
* [**app/admin/layout.md**](./app/admin/layout.md) — Sidebar navigasi admin dan proteksi ketat (hanya akun role `ADMIN` yang diizinkan).
* [**app/admin/page.md**](./app/admin/page.md) — Dashboard utama ringkasan pendapatan, statistik, dan tabel 10 booking terbaru.
* [**app/admin/AksiBooking.md**](./app/admin/AksiBooking.md) — Tombol interaktif untuk menyetujui (**Setujui**) atau membatalkan (**Tolak**) pesanan.
* [**app/admin/lapangan/page.md**](./app/admin/lapangan/page.md) — Halaman kelola fasilitas lapangan dan visualisasi jadwal terisi/kosong.
* [**app/admin/lapangan/actions.md**](./app/admin/lapangan/actions.md) — Operasi database penambahan dan penghapusan lapangan secara aman.
* [**app/admin/laporan/page.md**](./app/admin/laporan/page.md) — Haporan rekapitulasi transaksi dengan filter rentang tanggal dan omset total.

---

## 💡 Tips Membaca Penjelasan
Setiap file dokumen disusun dengan format:
1. **Identitas & Kategori**: Apakah file ini berjalan di sisi browser (Frontend) atau server (Backend).
2. **Peran File**: Apa kegunaannya dalam alur pemesanan lapangan.
3. **Terjemahan Baris per Baris**: Cuplikan kode asli beserta terjemahan bahasa Indonesianya.
4. **Konsep Penting**: Penjelasan kata kunci koding seperti `export`, `async`, `await`, `useState`, `useEffect`, `revalidatePath`, dan perintah database Prisma.

# 📦 Penjelasan File: `package.json`

* **File Asli**: [`package.json`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/package.json)
* **Kategori**: Konfigurasi Manajer Paket Node.js & Daftar Pustaka
* **Tingkat Akses**: Konfigurasi Proyek

---

## 🎯 Peran Utama File Ini
`package.json` adalah kartu identitas sekaligus daftar belanja kebutuhan proyek. File ini mencatat nama aplikasi, skrip perintah terminal (seperti `pnpm dev` atau `pnpm build`), serta daftar seluruh library eksternal yang diinstal agar aplikasi bisa berjalan.

---

## 🔍 Bedah & Terjemahan Kode

### 1. Informasi Proyek & Skrip Terminal
```json
{
  "name": "booking_lapangan",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```
* **Terjemahan**:
  * `"name"`: Nama paket proyek, yaitu `booking_lapangan`.
  * `"private": true`: Mencegah proyek ini terpublikasi secara tidak sengaja ke repositori publik npm.
  * `"scripts"`: Jalan pintas perintah terminal:
    * `pnpm dev`: Menjalankan server lokal pengembangan (*development*) di komputer (`http://localhost:3000`).
    * `pnpm build`: Mengompilasi dan mengoptimasi seluruh kode menjadi bundel siap pakai untuk produksi (*production*).
    * `pnpm start`: Menjalankan server aplikasi dari hasil kompilasi produksi.
    * `pnpm lint`: Memeriksa kerapian dan standar penulisan kode dengan ESLint.

---

### 2. Kebutuhan Utama (`dependencies`)
Pustaka yang dibutuhkan agar aplikasi berfungsi saat digunakan pengguna:
```json
"dependencies": {
  "@prisma/adapter-mariadb": "^7.10.0",
  "@prisma/client": "^7.10.0",
  "better-auth": "^1.7.5",
  "dotenv": "^18.0.0",
  "lucide-react": "^1.47.0",
  "next": "16.3.5",
  "react": "19.2.8",
  "react-dom": "19.2.8"
}
```
* **Terjemahan & Fungsi Masing-Masing**:
  * **`next` (v16.3.5)**: Framework utama berbasis React yang menyediakan routing halaman (App Router), server-side rendering, dan Server Actions.
  * **`react` & `react-dom` (v19.2.8)**: Pustaka inti untuk membangun antarmuka pengguna berbasis komponen interaktif.
  * **`@prisma/client`**: Pustaka ORM untuk menjalankan query database MySQL dalam bentuk kode TypeScript modern (seperti `findMany`, `create`).
  * **`@prisma/adapter-mariadb`**: Driver adapter resmi dari Prisma v7 untuk menghubungkan koneksi ke database MySQL / MariaDB lokal.
  * **`better-auth`**: Framework autentikasi modern lengkap untuk mengelola registrasi akun, login dengan kata sandi, Google OAuth, token sesi, dan role `ADMIN`/`USER`.
  * **`lucide-react`**: Kumpulan ratusan ikon vektor modern (seperti ikon kalender, jam, gembok, spinner loading).
  * **`dotenv`**: Pustaka pembantu untuk memuat variabel dari file `.env` ke dalam sistem komputer.

---

### 3. Kebutuhan Pengembang (`devDependencies`)
Pustaka yang hanya dipakai oleh programmer saat koding di komputer dan tidak diikutkan dalam hasil akhir produksi:
```json
"devDependencies": {
  "@tailwindcss/postcss": "^4",
  "tailwindcss": "^4",
  "typescript": "^5",
  "prisma": "^7.10.0",
  "eslint": "^9",
  "eslint-config-next": "16.3.5"
}
```
* **Terjemahan**:
  * **`tailwindcss` (v4)**: Framework CSS utilitas untuk styling tampilan secara cepat langsung di class HTML.
  * **`typescript` (v5)**: Bahasa pemrograman JavaScript dengan sistem tipe data yang ketat guna mencegah terjadinya bug salah ketik.
  * **`prisma` (CLI)**: Alat baris perintah terminal Prisma untuk membuat migrasi database (`npx prisma migrate dev`), membuat client (`npx prisma generate`), atau membuka antarmuka visual tabel (`npx prisma studio`).

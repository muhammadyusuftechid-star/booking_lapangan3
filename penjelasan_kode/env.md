# 📄 Penjelasan File: `.env`

* **File Asli**: [`.env`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/.env)
* **Kategori**: Konfigurasi & Variabel Lingkungan (*Environment Variables*)
* **Tingkat Akses**: **Sangat Rahasia (Backend Only)**

---

## 🎯 Peran Utama File Ini
File `.env` (*Environment*) bertindak sebagai "brankas rahasia" aplikasi. File ini menyimpan kredensial sensitif seperti alamat database, password, dan kunci API pihak ketiga.
Alasan file ini dipisahkan adalah agar data rahasia tidak sengaja ter-upload ke Git/GitHub publik.

---

## 🔍 Bedah & Terjemahan Kode

### 1. Koneksi Database MySQL
```bash
DATABASE_URL="mysql://root:password@localhost:3306/booking_lapangan"
```
* **Terjemahan**:
  * `mysql://`: Protokol database yang digunakan, yaitu MySQL.
  * `root`: Nama pengguna (*username*) database MySQL di komputer Anda.
  * `password`: Kata sandi (*password*) pengguna `root`.
  * `localhost:3306`: Alamat server database (komputer sendiri) yang berjalan pada port standar `3306`.
  * `booking_lapangan`: Nama basis data (*database*) tempat tabel-tabel disimpan.
* **Fungsinya**: Digunakan oleh **Prisma ORM** di [lib/prisma.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/lib/prisma.ts) untuk membaca, menulis, mengubah, dan menghapus data lapangan serta pesanan.

---

### 2. Konfigurasi Autentikasi (Better-Auth)
```bash
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-better-auth-secret-key-min-32-chars
```
* **Terjemahan**:
  * `BETTER_AUTH_URL`: Alamat domain dasar aplikasi saat dijalankan di server lokal (`http://localhost:3000`).
  * `NEXT_PUBLIC_BETTER_AUTH_URL`: Variabel yang sama namun diawali `NEXT_PUBLIC_` agar kodenya bisa dibaca oleh komponen sisi browser/klien (Frontend) untuk memanggil API login.
  * `BETTER_AUTH_SECRET`: Kunci enkripsi rahasia acak (*secret key*) yang digunakan untuk mengunci token sesi pengguna agar cookie login tidak bisa dipalsukan oleh peretas.

---

### 3. Kredensial Login Google (Google OAuth)
```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
```
* **Terjemahan**:
  * `GOOGLE_CLIENT_ID`: Identitas unik aplikasi Anda yang didaftarkan di Google Cloud Console.
  * `GOOGLE_CLIENT_SECRET`: Kunci sandi rahasia yang hanya diketahui oleh server Anda dan server Google.
* **Fungsinya**: Ketika pengguna menekan tombol **"Lanjutkan dengan Google"**, Google akan memeriksa dua kunci ini untuk memvalidasi bahwa aplikasi ini resmi berhak meminta info profil dan email user.

---

## 💡 Konsep Koding Penting yang Perlu Diingat
1. **`process.env.<NAMA_VARIABEL>`**: Cara memanggil variabel ini di dalam kode TypeScript (contoh: `process.env.DATABASE_URL`).
2. **Awalan `NEXT_PUBLIC_`**: Di Next.js, variabel lingkungan secara default disembunyikan dari browser demi keamanan. Jika Anda ingin suatu variabel bisa dibaca di frontend (komponen bertanda `"use client"`), nama variabel harus diawali dengan `NEXT_PUBLIC_`.

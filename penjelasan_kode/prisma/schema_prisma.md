# 🗄️ Penjelasan File: `prisma/schema.prisma`

* **File Asli**: [`prisma/schema.prisma`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/prisma/schema.prisma)
* **Kategori**: Desain & Skema Basis Data (Database Schema)
* **Tingkat Akses**: **Backend / Database Layer**

---

## 🎯 Peran Utama File Ini
File `schema.prisma` adalah cetak biru (*blueprint*) dari seluruh basis data MySQL aplikasi Anda. Di sini kita menentukan:
1. Jenis database yang dipakai (MySQL).
2. Lokasi output kode Prisma Client.
3. Tabel-tabel apa saja yang ada, kolom-kolomnya, tipe datanya, dan bagaimana satu tabel terhubung (*relation*) dengan tabel lainnya.

---

## 🔍 Bedah & Terjemahan Bagian per Bagian

### 1. Konfigurasi Generator & Sumber Data
```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mysql"
}
```
* **Terjemahan**:
  * `generator client`: Memerintahkan Prisma untuk membuat kode pembantu TypeScript (Prisma Client) dan menyimpannya di folder `generated/prisma`.
  * `datasource db`: Memberitahu bahwa basis data yang menjadi tujuan koneksi adalah **MySQL**.

---

### 2. Tabel Autentikasi (Better-Auth)

#### a. Model `User` (Tabel Akun Pengguna)
```prisma
enum UserRole {
  USER
  ADMIN
}

model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean
  image         String?
  role          UserRole  @default(USER)
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]

  @@map("user")
}
```
* **Terjemahan**:
  * Menyimpan data login setiap akun.
  * `role`: Menentukan hak akses pengguna (`USER` atau `ADMIN`). Secara default setiap akun baru bernilai `USER`.
  * `@unique`: Menjamin bahwa tidak boleh ada dua akun dengan alamat email yang sama.
  * `image`: Foto profil (opsional karena ada tanda tanya `?`).
  * `@@map("user")`: Menamai tabel di database MySQL dengan nama huruf kecil `user`.

#### b. Model `Session` & `Account`
* **`Session`**: Mencatat riwayat login aktif. Saat pengguna login, dibuatkan baris token sesi yang memiliki masa kedaluwarsa (`expiresAt`).
* **`Account`**: Menyimpan tautan login penyedia sosial (seperti token Google OAuth atau hash kata sandi akun email).

---

### 3. Tabel Inti Bisnis Booking Lapangan

#### a. Model `Lapangan` (Fasilitas Olahraga)
```prisma
model Lapangan {
  id          String    @id @default(uuid())
  name        String
  description String?
  location    String
  price       Float
  picture_url String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  bookings    Booking[]
}
```
* **Terjemahan**:
  * Menyimpan daftar lapangan (misal: Futsal A, Badminton 1).
  * `id`: Dibuatkan kode unik otomatis menggunakan standar UUID (`@default(uuid())`).
  * `price`: Tarif sewa per jam (tipe angka pecahan / desimal `Float`).
  * `bookings Booking[]`: Menandakan satu lapangan bisa dipesan berkali-kali oleh banyak orang (*One-to-Many*).

#### b. Model `Customer` (Data Pelanggan Lapangan)
```prisma
model Customer {
  id          String    @id @default(uuid())
  userId      String    @unique
  email       String    @unique
  name        String?
  username    String    @unique
  password    String
  picture_url String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  bookings    Booking[]
}
```
* **Terjemahan**:
  * Menyimpan profil identitas pelanggan yang melakukan reservasi. Terhubung dengan akun login melalui `userId` dan `email`.

#### c. Model `Booking` (Transaksi Pemesanan Jadwal)
```prisma
enum StatusBooking {
  PENDING
  CONFIRMED
  CANCELLED
}

model Booking {
  id         String        @id @default(uuid())
  customerId String
  lapanganId String
  startTime  DateTime
  endTime    DateTime
  status     StatusBooking @default(PENDING)

  customer Customer @relation(fields: [customerId], references: [id])
  lapangan Lapangan @relation(fields: [lapanganId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  payments Payment[]
}
```
* **Terjemahan**:
  * `customerId`: ID pelanggan yang memesan (kunci asing / *Foreign Key* ke tabel `Customer`).
  * `lapanganId`: ID lapangan yang dipesan (kunci asing / *Foreign Key* ke tabel `Lapangan`).
  * `startTime` & `endTime`: Jam mulai dan jam selesai sewa.
  * `status`: Status persetujuan pesanan:
    * `PENDING`: Menunggu persetujuan atau bukti transfer.
    * `CONFIRMED`: Disetujui oleh admin atau otomatis lunas dengan QRIS.
    * `CANCELLED`: Dibatalkan atau ditolak admin.
  * `payments Payment[]`: Satu pesanan terhubung ke rincian catatan pembayaran.

#### d. Model `Payment` (Rincian Transaksi Pembayaran)
```prisma
model Payment {
  id            String   @id @default(uuid())
  bookingId     String
  amount        Float
  status        String
  paymentDate   DateTime
  paymentType   String?
  ...
  booking       Booking  @relation(fields: [bookingId], references: [id])
}
```
* **Terjemahan**:
  * Mencatat bukti transfer atau status lunas dari pesanan.
  * `amount`: Jumlah uang yang dibayarkan.
  * `paymentType`: Jenis pembayaran (misal `QRIS` atau `TRANSFER_BANK`).
  * `status`: Status pembayaran (`SUCCESS`, `PENDING`, `FAILED`).

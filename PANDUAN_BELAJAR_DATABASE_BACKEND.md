# 📖 Panduan Lengkap: Belajar Database & Backend dari Nol
### Proyek: Sistem Informasi Pemesanan Lapangan Olahraga (Pelatihan BPVP)

Panduan ini disusun secara berurutan (*step-by-step*) untuk membantu Anda memahami **fondasi kerja database dan logika backend** secara mendalam, beralih dari sekadar *vibe coding* (terima jadi) menjadi pemahaman menyeluruh atas arsitektur sistem.

---

## 📑 Daftar Isi
1. [Konsep Dasar Database Relasional & Peran ORM](#1-konsep-dasar-database-relasional--peran-orm)
2. [Membedah Skema Database (`prisma/schema.prisma`)](#2-membedah-skema-database-prismaschemaprisma)
3. [Jalur Koneksi Database (`.env` & `lib/prisma.ts`)](#3-jalur-koneksi-database-env--libprismats)
4. [Membedah Kode Server Actions (`app/actions/booking.ts`)](#4-membedah-kode-server-actions-appactionsbookingts)
5. [Mesin Keamanan & Otentikasi (`lib/auth.ts`)](#5-mesin-keamanan--otentikasi-libauthts)
6. [Alur Komunikasi Lengkap (Frontend ⇄ Backend ⇄ Database)](#6-alur-komunikasi-lengkap)
7. [Kumpulan Pertanyaan Ujian & Jawaban Konseptual](#7-kumpulan-pertanyaan-ujian--jawaban-konseptual)

---

## 💡 1. Konsep Dasar Database Relasional & Peran ORM

### A. Mengapa Disebut Database Relasional (RDBMS)?
Bayangkan database MySQL seperti buku kas toko atau file Excel dengan banyak *sheet*. Jika kita menaruh seluruh data penyewa, nama lapangan, jam sewa, tarif, dan nomor resi pembayaran ke dalam satu tabel raksasa, data akan menjadi sangat berantakan dan terjadi pemborosan penyimpanan (*data redundancy*).

Maka dari itu, data dipecah menjadi beberapa **tabel khusus** yang dihubungkan oleh **tali pengait (Relasi / Foreign Key)**:
- **Tabel `Lapangan`:** Hanya bertugas mencatat fisik lapangan (nama, lokasi, harga, fasilitas).
- **Tabel `Customer`:** Hanya mencatat data orang yang memesan (nama, email, username).
- **Tabel `Booking`:** Tabel transaksi penghubung yang mencatat *siapa menyewa apa, kapan, dan statusnya apa*.
- **Tabel `Payment`:** Mencatat bukti uang masuk dari transaksi sewa tersebut.

```mermaid
erDiagram
    CUSTOMER ||--o{ BOOKING : "membuat"
    LAPANGAN ||--o{ BOOKING : "disewa pada"
    BOOKING ||--o{ PAYMENT : "memiliki bukti bayar"
```

---

### B. Apa Tugas Prisma ORM?
ORM (*Object-Relational Mapping*) adalah penerjemah antara kode bahasa pemrograman (TypeScript/JavaScript) dengan bahasa basis data (SQL).

| Tanpa ORM (SQL Manual) | Dengan Prisma ORM |
| :--- | :--- |
| Harus menulis string SQL: <br>`SELECT * FROM Lapangan WHERE price <= 150000;` | Menggunakan fungsi TypeScript: <br>`await prisma.lapangan.findMany({ where: { price: { lte: 150000 } } });` |
| Rawan kesalahan ketik nama kolom. | Otomatis memiliki fitur *Auto-complete* dan validasi tipe data. |
| Rawan celah peretasan (*SQL Injection*). | Parameter query diamankan secara otomatis oleh Prisma Engine. |

---

## 📐 2. Membedah Skema Database ([`prisma/schema.prisma`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/prisma/schema.prisma))

Skema database adalah cetak biru (*blueprint*) dari seluruh tabel yang ada di MySQL Anda.

### 1. Model `Lapangan` (Data Master)
```prisma
model Lapangan {
  id          String    @id @default(cuid())
  name        String
  description String?   @db.Text
  location    String
  price       Int
  picture_url String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  bookings    Booking[] // Relasi: 1 lapangan bisa memiliki banyak riwayat booking
}
```
* `@id @default(cuid())`: Kunci utama (*Primary Key*). Setiap baris lapangan otomatis diberi ID unik string acak yang tidak mungkin kembar.
* `String?`: Tanda tanya `?` menandakan kolom tersebut bernilai opsional (*nullable*), boleh tidak diisi.
* `price Int`: Tarif disimpan sebagai bilangan bulat (angka), bukan teks, agar bisa dijumlahkan dan dikalikan.

---

### 2. Model `Booking` (Tabel Transaksi Utama)
```prisma
model Booking {
  id         String    @id @default(cuid())
  startTime  DateTime  // Waktu mulai main
  endTime    DateTime  // Waktu selesai main
  status     String    @default("PENDING") // PENDING, CONFIRMED, CANCELLED
  createdAt  DateTime  @default(now())

  // Kunci Relasi ke Customer
  customerId String
  customer   Customer  @relation(fields: [customerId], references: [id])

  // Kunci Relasi ke Lapangan
  lapanganId String
  lapangan   Lapangan  @relation(fields: [lapanganId], references: [id])

  // Relasi ke tabel pembayaran
  payments   Payment[]
}
```
* `@relation(fields: [lapanganId], references: [id])`: Bagian ini memerintahkan database: *"Nilai di kolom `lapanganId` harus merujuk pada nilai `id` yang valid di tabel `Lapangan`."* Jika ID lapangan tidak ada, database akan menolak penyimpanan.

---

### 3. Model `Payment` (Rincian Pembayaran)
```prisma
model Payment {
  id          String   @id @default(cuid())
  amount      Int      // Jumlah uang yang ditagihkan/dibayar
  status      String   @default("PENDING") // SUCCESS / PENDING / FAILED
  paymentDate DateTime @default(now())
  paymentType String?  // "QRIS" atau "TRANSFER"

  bookingId   String
  booking     Booking  @relation(fields: [bookingId], references: [id])
}
```

---

## 🔌 3. Jalur Koneksi Database ([`.env`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/.env) & [`lib/prisma.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/lib/prisma.ts))

Agar server Node.js tahu di mana database berada, sistem membaca kredensial dari file [`.env`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/.env):

```env
DATABASE_URL="mysql://root:admin123@localhost:3306/booking_lapangan"
```
Format URL ini dibaca sebagai:
1. `mysql://` ➡️ Menggunakan protokol database MySQL.
2. `root:admin123` ➡️ Username `root` dengan kata sandi `admin123`.
3. `localhost:3306` ➡️ Berjalan di komputer lokal pada port standar 3306.
4. `booking_lapangan` ➡️ Nama basis data yang dituju.

Lalu di [`lib/prisma.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/lib/prisma.ts), dibuat objek koneksi tunggal (*Singleton Pattern*):
```typescript
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Menggunakan adapter native MariaDB/MySQL untuk performa maksimal
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

export const prisma = new PrismaClient({ adapter });
```
> **Kenapa Pola Singleton?**
> Supaya setiap kali ada aksi pemesanan, aplikasi tidak membuka koneksi baru berulang kali yang bisa menyebabkan database kehabisan memori (*Connection Pool Exhaustion*).

---

## ⚙️ 4. Membedah Kode Server Actions ([`app/actions/booking.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/actions/booking.ts))

File ini berisi seluruh fungsi backend operasional. Ciri khasnya adalah kata kunci di baris 1:
```typescript
"use server";
```

### Operasi 1: Mengambil Data Lapangan (READ)
```typescript
export async function getLapangans() {
  try {
    const data = await prisma.lapangan.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error: any) {
    console.error("Error getLapangans:", error);
    return { success: false, error: error.message || "Gagal mengambil data lapangan" };
  }
}
```
* **Alur Logika:** Menjalankan perintah pembacaan seluruh baris di tabel `Lapangan`, diurutkan dari yang terbaru (`createdAt: "desc"`), dan dibungkus blok `try...catch` agar server tidak mati jika koneksi MySQL tiba-tiba terputus.

---

### Operasi 2: Menambah Lapangan Baru (CREATE)
```typescript
export async function createLapanganAction({ name, description, location, price, picture_url }) {
  try {
    const newLapangan = await prisma.lapangan.create({
      data: {
        name,
        description,
        location,
        price: Number(price), // Memastikan tipe data berupa angka integer
        picture_url: picture_url || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/admin");

    return { success: true, data: newLapangan };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```
* **Konsep Kunci: `revalidatePath(...)`**
  Next.js memiliki mekanisme penyimpanan cache halaman. Fungsi `revalidatePath("/dashboard")` bertugas menghapus cache lama dan mengambil data terbaru dari database, sehingga saat admin selesai menambah lapangan, lapangan tersebut **langsung muncul di halaman pengguna tanpa perlu refresh paksa**.

---

### Operasi 3: Membuat Transaksi Booking (CREATE Berelasi)
Ini adalah fungsi inti aplikasi:
```typescript
export async function createBookingAction({
  userId,
  userEmail,
  userName,
  lapanganId,
  startTime,
  endTime,
  amount,
  paymentType,
}) {
  // 1. Cek apakah pengguna sudah memiliki data Customer di database
  let customer = await prisma.customer.findUnique({
    where: { email: userEmail },
  });

  // Jika belum pernah ada (pengguna baru), buat profil Customer otomatis
  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        userId: userId || `user-${Date.now()}`,
        email: userEmail,
        name: userName || "Pelanggan",
        username: userEmail.split("@")[0],
        password: "oauth-managed-account",
      },
    });
  }

  // 2. Simpan Transaksi Booking + Catatan Pembayaran dalam 1 Kali Eksekusi
  const newBooking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      lapanganId: lapanganId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      // Aturan Bisnis: Jika QRIS langsung Dikonfirmasi, jika Transfer perlu dicek Admin
      status: paymentType === "QRIS" ? "CONFIRMED" : "PENDING",
      payments: {
        create: {
          amount: amount,
          status: paymentType === "QRIS" ? "SUCCESS" : "PENDING",
          paymentDate: new Date(),
          paymentType: paymentType,
        },
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin");

  return { success: true, data: newBooking };
}
```

---

### Operasi 4: Mengambil Riwayat Booking dengan *Nested Include* (READ RELASI)
```typescript
export async function getUserBookings(userEmail: string) {
  const customer = await prisma.customer.findUnique({
    where: { email: userEmail },
    include: {
      bookings: {
        include: {
          lapangan: true,  // Mengikutsertakan detail nama & harga lapangan
          payments: true,  // Mengikutsertakan detail status pembayaran
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return { success: true, data: customer?.bookings || [] };
}
```
* **Kelebihan Prisma:** Hanya dengan 1 perintah `include`, Prisma secara otomatis menyusun query `JOIN` SQL yang kompleks di balik layar untuk menggabungkan 3 tabel sekaligus: `Customer ➡️ Booking ➡️ Lapangan & Payment`.

---

### Operasi 5: Validasi Status oleh Admin (UPDATE)
```typescript
export async function updateBookingStatusAction(
  bookingId: string,
  status: "CONFIRMED" | "CANCELLED"
) {
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin");

  return { success: true, data: updated };
}
```

---

## 🛡️ 5. Mesin Keamanan & Otentikasi ([`lib/auth.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/lib/auth.ts))

Sistem login menggunakan library **Better Auth**:
1. **Otentikasi Server:** Berjalan di [`lib/auth.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/lib/auth.ts) menggunakan `prismaAdapter` untuk menyimpan data pengguna ke tabel `User` dan `Session`.
2. **Endpoint REST API:** Disediakan melalui [`app/api/auth/[...all]/route.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/api/auth/[...all]/route.ts) untuk menangani jalur redirect Google OAuth.
3. **Cookie HTTP-Only:** Sesi login disimpan di browser dalam bentuk cookie yang terenkripsi dan tidak bisa dibaca oleh script jahat (*XSS protection*).

---

## 🔄 6. Alur Komunikasi Lengkap

```mermaid
sequenceDiagram
    autonumber
    actor Pengguna as Browser (Frontend)
    participant ServerAction as Backend (Server Actions)
    participant Prisma as Prisma ORM Client
    participant DB as MySQL Database

    Pengguna->>ServerAction: Klik "Pilih Jadwal" -> kirim data booking
    ServerAction->>Prisma: createBookingAction({ lapanganId, slots, ... })
    Prisma->>DB: INSERT INTO Booking & INSERT INTO Payment
    DB-->>Prisma: ID Booking terbit (Status: CONFIRMED / PENDING)
    Prisma-->>ServerAction: Objek booking berhasil dibuat
    ServerAction->>ServerAction: revalidatePath('/dashboard')
    ServerAction-->>Pengguna: Return { success: true, data: newBooking }
    Pengguna->>Pengguna: Tutup Modal & Render baris baru di tabel
```

---

## 🎓 7. Kumpulan Pertanyaan Ujian & Jawaban Konseptual

Gunakan poin-poin ini jika instruktur atau penguji menanyakan aspek teknis:

1. **T: Mengapa menggunakan Next.js Server Actions daripada membuat file REST API biasa?**
   * *J:* Server Actions memungkinkan kita memanggil fungsi backend secara langsung seperti fungsi TypeScript lokal dengan jaminan keamanan server (*RPC - Remote Procedure Call*), tanpa perlu menulis rute `fetch('/api/booking')` berulang-ulang dan bebas dari overhead JSON parsing manual.

2. **T: Bagaimana cara mencegah bentrok pemesanan atau data rusak?**
   * *J:* Melalui relasi *Foreign Key* di `prisma/schema.prisma` yang menjamin bahwa setiap data booking wajib memiliki referensi lapangan dan pengguna yang nyata, serta penyimpanan ganda booking dan payment dilakukan dalam satu transaksi terstruktur.

3. **T: Apa perbedaan peran `lib/prisma.ts` dan `app/actions/booking.ts`?**
   * *J:* `lib/prisma.ts` berperan sebagai **jembatan infrastruktur** (membuka dan mengatur koneksi ke database MySQL), sedangkan `app/actions/booking.ts` berperan sebagai **logika aplikasi** (menentukan aturan bisnis, validasi harga, status pemesanan, dan pengembalian hasil ke antarmuka).

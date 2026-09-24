# 🏷️ Penjelasan File: `types/booking.ts`

* **File Asli**: [`types/booking.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/types/booking.ts)
* **Kategori**: Definisi Tipe Data TypeScript (*Type Definitions / Contracts*)
* **Tingkat Akses**: Digunakan bersama oleh **Frontend** dan **Backend**

---

## 🎯 Peran Utama File Ini
Di TypeScript, kita mendefinisikan bentuk (*shape*) dari setiap objek data agar editor (seperti VS Code / Cursor / Windsurf) dapat memberikan fitur *autocomplete* dan mendeteksi kesalahan penulisan (*typo*) sebelum aplikasi dijalankan.
File ini menjadi kontrak data bagi lapangan, pelanggan, pembayaran, dan pemesanan.

---

## 🔍 Bedah & Terjemahan Bagian per Bagian

### 1. `interface Lapangan`
```typescript
export interface Lapangan {
  id: string;
  name: string;
  description: string | null;
  location: string;
  price: number;
  picture_url: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
```
* **Terjemahan**:
  * Menentukan bahwa setiap objek lapangan wajib memiliki `id` (teks), `name` (nama lapangan), `location` (lokasi), dan `price` (angka tarif sewa).
  * `string | null`: Berarti kolom tersebut boleh berupa teks, atau boleh kosong (`null`). Contohnya `picture_url` jika foto belum diunggah.
  * Tanda tanya `?` pada `createdAt?`: Menandakan properti ini bersifat opsional (boleh ada atau tidak saat ditampilkan).

---

### 2. `interface Payment`
```typescript
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: string;
  paymentDate: Date;
  paymentType: string | null;
}
```
* **Terjemahan**:
  * Menjelaskan bentuk data pembayaran: ada nomor ID, ID booking yang dibayar (`bookingId`), total uang (`amount`), status pembayaran (contoh: "SUCCESS" atau "PENDING"), serta metode bayar (`paymentType` seperti "QRIS").

---

### 3. `interface Customer`
```typescript
export interface Customer {
  id: string;
  userId: string;
  email: string;
  name: string | null;
  username: string;
}
```
* **Terjemahan**:
  * Menjelaskan bentuk data pelanggan yang memesan: mencakup alamat email, nama pengguna, dan keterhubungan dengan akun login (`userId`).

---

### 4. `interface BookingWithRelations`
```typescript
export interface BookingWithRelations {
  id: string;
  customerId: string;
  lapanganId: string;
  startTime: Date | string;
  endTime: Date | string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt?: Date;
  updatedAt?: Date;
  lapangan?: Lapangan;
  customer?: Customer;
  payments?: Payment[];
}
```
* **Terjemahan**:
  * Merupakan tipe data pemesanan yang **lengkap beserta relasinya**.
  * `status`: Hanya boleh diisi salah satu dari tiga kata pasti: `"PENDING"`, `"CONFIRMED"`, atau `"CANCELLED"`.
  * `lapangan?: Lapangan`: Membawa data objek lapangan terkait (nama, harga, lokasi).
  * `customer?: Customer`: Membawa data pelanggan yang memesan (nama dan email).
  * `payments?: Payment[]`: Membawa daftar array pembayaran yang terkait dengan booking tersebut.
* **Fungsinya**: Digunakan di halaman dashboard user [app/user/page.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/page.tsx) dan riwayat [app/user/riwayat/page.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/riwayat/page.tsx) agar komponen bisa langsung membaca `booking.lapangan.name` atau `booking.payments[0].amount` dengan aman.

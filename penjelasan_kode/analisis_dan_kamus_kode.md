# 📖 Analisis Lengkap Kode & Glosarium Sintaks (Booking Lapangan)

Dokumen ini membedah secara mendalam semua sintaksis, kata kunci (*keywords*), konsep pemrograman, dan pola arsitektur (*design patterns*) yang digunakan di seluruh kode aplikasi **Booking Lapangan** (Next.js, TypeScript, Prisma ORM, Better-Auth, Tailwind CSS).

---

## 📑 Daftar Isi

1. [Kata Kunci Deklarasi & Modul (`export`, `import`, `const`, `let`)](#1-kata-kunci-deklarasi--modul)
2. [Arsitektur Driver Database: Apa itu `adapter`?](#2-arsitektur-driver-database-apa-itu-adapter)
3. [Direktif & Arsitektur Next.js Modern (`use client` & `use server`)](#3-direktif--arsitektur-nextjs-modern)
4. [Pemrograman Asinkron (`async`, `await`, `Promise`, `try...catch`)](#4-pemrograman-asinkron)
5. [React Hooks & State Management](#5-react-hooks--state-management)
6. [Sistem Tipe TypeScript (`type`, `interface`, `enum`, Generics)](#6-sistem-tipe-typescript)
7. [Operator Khusus JavaScript Modern (`?.`, `??`, Destructuring, Spread)](#7-operator-khusus-javascript-modern)
8. [Pola Desain (*Design Pattern*) yang Digunakan di Proyek Ini](#8-pola-desain-design-pattern)
9. [Tabel Rangkuman Cepat (*Cheat Sheet*)](#9-tabel-rangkuman-cepat)

---

## 1. Kata Kunci Deklarasi & Modul

### A. `export` dan `export default`

Dalam JavaScript/TypeScript modern (ES Modules), setiap file dianggap sebagai modul terisolasi. Variabel, fungsi, atau komponen di dalam file **tidak bisa** diakses oleh file lain kecuali dikeluarkan (*export*) dan dimasukkan (*import*).

Ada dua jenis `export`:

#### 1. Named Export (`export const`, `export function`, `export type`)
Digunakan saat satu file ingin mengeluarkan **banyak hal sekaligus**, dan saat di-import namanya harus sama persis di dalam kurung kurawal `{ ... }`.

*Contoh nyata dari proyek ([app/user/actions.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/actions.ts)):*
```typescript
// Mengeluarkan fungsi satu per satu dengan nama spesifik
export async function getLapangans() { ... }
export async function getUserBookings(userEmail: string) { ... }
export async function createBookingAction(...) { ... }
```
Saat di-import di file lain:
```typescript
import { getLapangans, getUserBookings } from "@/app/user/actions";
```

#### 2. Default Export (`export default`)
Digunakan sebagai **nilai utama** dari file tersebut. Satu file hanya boleh memiliki satu `export default`. Saat di-import, namanya bebas dan tidak memakai kurung kurawal.

*Contoh nyata dari proyek ([app/login/page.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/login/page.tsx)):*
```typescript
export default function LoginPage() {
  return <Suspense>...</Suspense>;
}
```
Saat di-import:
```typescript
import LoginPage from "@/app/login/page"; // Nama bisa disesuaikan bebas
```

---

### B. `const`, `let`, dan `var`

Di proyek ini, Anda akan melihat hampir **99% variabel menggunakan `const`**.

#### 1. `const` (*Constant*)
* Mendeklarasikan variabel yang **referensinya tidak bisa diubah lagi** (*immutable reference*).
* Memiliki sifat *block-scoped* (hanya hidup di dalam kurung kurawal `{}` tempat ia dibuat).
* Mencegah bug akibat tidak sengaja menimpa nilai variabel.

*Contoh:*
```typescript
const router = useRouter(); // router tidak akan pernah diganti objek lain
const initial = (userName || "M").charAt(0).toUpperCase();
```
> **Catatan Penting:** Jika `const` berupa Objek atau Array, isi properti di dalamnya masih bisa dimodifikasi, tetapi variabel itu sendiri tidak bisa diisi ulang (`reassign`) dengan objek baru.

#### 2. `let`
* Mendeklarasikan variabel yang **nilainya bisa berubah / dihitung ulang** sewaktu-waktu.
* Digunakan jika nilainya akan diisi dalam percabangan `if` atau perulangan `for`.

*Contoh jika digunakan pada penghitungan:*
```typescript
let statusColor = "bg-gray-100";
if (status === "CONFIRMED") {
  statusColor = "bg-green-100";
}
```

#### 3. Mengapa tidak ada `var` di proyek ini?
`var` adalah cara usang (sebelum tahun 2015/ES6) yang memiliki masalah *hoisting* dan cakupan fungsi (*function scope*) yang sering memicu kebocoran variabel antar blok kode. Oleh karena itu, standar industri modern **melarang penggunaan `var`**.

---

## 2. Arsitektur Driver Database: Apa itu `adapter`?

Di dalam file [lib/prisma.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/lib/prisma.ts), Anda menemukan kode ini:

```typescript
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
```

### Apa Sebenarnya `adapter` Itu?

Secara konsep umum dalam *Software Engineering*, **Adapter Pattern** adalah perantara/penerjemah yang menghubungkan dua sistem yang awalnya tidak bisa berbicara secara langsung (mirip colokan konverter listrik internasional).

Di dalam **Prisma ORM Versi 7**:
1. **Prisma Client** bertugas memahami model tabel (`Lapangan`, `User`, `Booking`) dan menyediakan fungsi query TypeScript seperti `prisma.lapangan.findMany()`.
2. Namun, Prisma sendiri tidak lagi mengunci engine C++/Rust biner monolitik langsung ke port TCP database.
3. Sebagai gantinya, Prisma menggunakan **Driver Adapter** (dalam kasus ini `@prisma/adapter-mariadb` / Node.js native driver).
4. Variabel `adapter` bertindak sebagai **jembatan koneksi fisik**: ia yang membuka soket jaringan ke MySQL/MariaDB di `localhost:3306`, mengelola *Connection Pool*, mengirim query SQL mentah (`SELECT * FROM Lapangan...`), dan mengembalikan hasilnya ke Prisma dalam format JSON yang rapi.

**Keuntungan menggunakan Adapter:**
* Aplikasi jauh lebih ringan dan hemat memori RAM.
* Kompatibel dengan lingkungan *Serverless* dan *Edge Runtime*.
* Koneksi database lebih stabil dan aman.

---

## 3. Direktif & Arsitektur Next.js Modern (`use client` & `use server`)

Next.js App Router membagi ekosistem menjadi dua dunia: **Server** dan **Client (Browser)**.

### A. Direktif `"use client"`
Diletakkan di baris paling pertama file untuk memberi tahu Next.js bahwa komponen ini berjalan di peramban pengguna (*browser*).

* **Wajib dipakai jika komponen membutuhkan:**
  1. Interaksi pengguna langsung: `onClick`, `onChange`, `onSubmit`.
  2. React Hooks: `useState`, `useEffect`.
  3. API browser: `window`, `localStorage`, `useRouter()`.
* *Contoh di proyek:*
  * [app/login/page.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/login/page.tsx)
  * [app/user/lapangan/components/CariLapangan.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/lapangan/components/CariLapangan.tsx)

### B. Direktif `"use server"`
Diletakkan di baris paling pertama file fungsi backend (disebut **Server Actions**).

* **Karakteristik:**
  1. Kode di dalam file ini **hanya dieksekusi di server** (komputer backend Anda), tidak pernah dikirim atau dibocorkan ke browser client.
  2. Aman untuk memegang password database, query Prisma, atau API keys rahasia.
  3. Fungsi di dalamnya bisa dipanggil langsung dari komponen frontend seperti memanggil fungsi biasa (RPC - *Remote Procedure Call*).
* *Contoh di proyek:*
  * [app/user/actions.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/actions.ts) (mengambil data lapangan, memproses reservasi, cek role pengguna).
  * [app/admin/lapangan/actions.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/lapangan/actions.ts) (tambah, edit, dan hapus lapangan).

### C. Server Component vs Event Handler (`onClick`, `onError`)
Secara default di Next.js App Router, file `page.tsx` tanpa `"use client"` adalah **Server Component** (contoh: [`app/admin/lapangan/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/lapangan/page.tsx)).
* **Aturan Mutlak:** Server Component dirender menjadi HTML mentah di server sebelum dikirim ke browser. Karena itu, ia **TIDAK BISA** menerima fungsi JavaScript browser seperti `onClick`, `onError`, `onChange`, atau `useState`.
* **Solusinya:** Jika memerlukan interaktivitas (seperti modal pop-up edit atau penanganan gambar error), bagian tersebut dipecah ke dalam file terpisah dengan `"use client"` (contoh: [`ModalEditLapangan.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/lapangan/components/ModalEditLapangan.tsx)), lalu di-import ke dalam Server Component.

---

## 4. Pemrograman Asinkron

Aplikasi web modern sering berkomunikasi dengan database atau internet yang membutuhkan waktu respons (tidak instan). Di sinilah konsep *asynchronous* bekerja.

### A. `Promise`
Janji bahwa sebuah proses akan menghasilkan data di masa mendatang (bisa *resolved/sukses* atau *rejected/gagal*).

### B. `async` dan `await`
* `async`: Ditaruh sebelum nama fungsi untuk menandakan bahwa fungsi ini berjalan di latar belakang dan mengembalikan `Promise`.
* `await`: Ditaruh di dalam fungsi async untuk **menjeda langkah sementara** sampai data dari database selesai diambil, tanpa membekukan (*freeze*) aplikasi secara keseluruhan.

*Contoh di [app/user/actions.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/actions.ts):*
```typescript
export async function getLapangans() {
  try {
    // Tunggu sampai MySQL selesai mencari seluruh baris data lapangan
    const data = await prisma.lapangan.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error: unknown) {
    // Tangkap jika terjadi kegagalan koneksi atau error query
    return { success: false, error: "Gagal mengambil data" };
  }
}
```

### C. `try ... catch`
Mekanisme pengaman. Kode berbahaya yang berpotensi error (seperti koneksi internet terputus atau database mati) dimasukkan ke dalam blok `try`. Jika terjadi kegagalan, program tidak akan mengalami *crash* layar putih, melainkan langsung lompat ke blok `catch` untuk dicatat log error-nya.

---

## 5. React Hooks & State Management

React Hooks adalah fungsi sakti yang diawali dengan kata `use` untuk mengendalikan logika komponen:

| Nama Hook | Penjelasan & Fungsi | Contoh Nyata di Proyek |
| :--- | :--- | :--- |
| **`useState`** | Menyimpan memori sementara pada layar (misal: teks input pencarian, pilihan kategori, status loading spinner). Setiap state berubah, tampilan ter-update otomatis. | `const [searchQuery, setSearchQuery] = useState("");` |
| **`useEffect`** | Menjalankan efek samping (*side effect*) saat halaman pertama kali dibuka, seperti otomatis mendownload data riwayat booking dari backend. | Digunakan di `app/user/page.tsx` untuk memuat data dashboard saat user login. |
| **`useRouter`** | Mengontrol navigasi URL peramban secara halus (*Single Page Application*) tanpa me-refresh seluruh halaman browser. | `router.replace("/admin");` atau `router.push("/user/pesan");` |
| **`usePathname`** | Mengetahui di halaman mana pengguna sedang berada saat ini untuk mengaktifkan warna menu navigasi yang sedang aktif. | Digunakan di `BottomNav.tsx` untuk mewarnai tab yang aktif. |
| **`useSearchParams`**| Membaca parameter tanda tanya di URL (misal: `?fieldId=xxx` atau `?error=google_failed`). | Digunakan di halaman login untuk mendeteksi pesan gagal login. |
| **`<Suspense>`** | Komponen pembungkus penahan yang menampilkan layar tunggu (*fallback*) sementara data halaman/URL diurai oleh Next.js. | Membungkus `KontenLogin()` di `app/login/page.tsx`. |

---

## 6. Sistem Tipe TypeScript

TypeScript menambahkan lapisan tipe data statis di atas JavaScript agar kode bebas dari salah ketik (*typo*) sebelum program dijalankan.

### A. `type` vs `interface`

*Contoh di [types/booking.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/types/booking.ts):*

```typescript
// Interface: Kontrak bentuk data objek
export interface Lapangan {
  id: string;
  name: string;
  description: string | null; // Boleh teks atau kosong (null)
  location: string;
  price: number;
  picture_url?: string | null; // Tanda tanya (?) berarti properti ini opsional
}

// Type: Alias tipe atau penggabungan (Union/Intersection)
export type StatusBooking = "PENDING" | "CONFIRMED" | "CANCELLED";
```

* **`interface`**: Digunakan untuk mendefinisikan bentuk objek model entitas (seperti struktur tabel `Lapangan` atau `Customer`).
* **`type`**: Lebih fleksibel, bisa membuat tipe gabungan (*union type*) seperti `StatusBooking` yang nilainya hanya boleh satu dari 3 pilihan di atas.

### B. `enum` (*Enumeration*)
Mendefinisikan kumpulan konstanta bernama. Contoh di [prisma/schema.prisma](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/prisma/schema.prisma):
```prisma
enum UserRole {
  USER
  ADMIN
}
```
Ini memastikan kolom `role` di database tidak bisa diisi sembarang teks selain `USER` atau `ADMIN`.

### C. Generics (`<T>`)
Fungsi atau tipe yang fleksibel menerima tipe apapun. Contoh:
```typescript
const [lapangans, setLapangans] = useState<Lapangan[]>([]);
```
`<Lapangan[]>` memberitahu React bahwa state `lapangans` adalah Array yang berisi kumpulan objek berstruktur `Lapangan`.

---

## 7. Operator Khusus JavaScript Modern

Dalam kode proyek ini banyak terdapat simbol-simbol cerdas:

### 1. Optional Chaining (`?.`)
Membaca properti objek yang bersarang tanpa takut program error jika objek induknya masih kosong/undefined.
```typescript
// Jika session masih loading (null), tidak akan melempar crash "Cannot read properties of null"
const userEmail = session?.user?.email || "";
```

### 2. Nullish Coalescing (`??`)
Memberikan nilai pengganti default HANYA JIKA sisi kiri bernilai `null` atau `undefined` (bukan jika bernilai `0` atau `false`).
```typescript
// Ambil prisma yang sudah ada di globalThis, JIKA BELUM ADA (null) maka buat baru
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
```

### 3. Destructuring Assignment (`{ ... }`)
Mengekstrak properti langsung dari objek atau array agar kode lebih ringkas:
```typescript
// Cara lama:
const session = useSession().data;
// Cara destructuring di proyek ini:
const { data: session, isPending } = useSession();
```

### 4. Spread Operator (`...`)
Menyalin atau menggabungkan seluruh isi array/objek:
```typescript
// Menyalin semua properti yang ada dan memperbarui statusnya saja
const updatedBooking = { ...oldBooking, status: "CONFIRMED" };
```

---

## 8. Pola Desain (*Design Pattern*) yang Digunakan di Proyek Ini

### 1. Singleton Pattern (`lib/prisma.ts`)
Pada mode *development*, Next.js terus melakukan *Hot Module Replacement* (HMR) setiap kali file di-save. Jika kita langsung memanggil `new PrismaClient()` biasa, setiap save akan membuka koneksi database baru sampai MySQL kehabisan batas koneksi (*error: Too many connections*).
Solusinya:
```typescript
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma; // Simpan di memori global Node.js
}
```
Objek Prisma hanya dibuat **1 kali saja** dan disimpan di objek global (`globalThis`).

### 2. Role-Based Access Control (RBAC) Pattern
Pola pemisahan hak akses:
* Jika user biasa mencoba masuk ke halaman admin `/admin`, mereka dialihkan kembali ke `/user`.
* Jika admin mencoba masuk ke portal user, sistem mendeteksi role `ADMIN` dan memindahkannya ke dashboard manajemen `/admin`.

---

## 9. Tabel Rangkuman Cepat

| Sintaks / Istilah | Kategori | Arti & Fungsinya di Aplikasi Ini |
| :--- | :--- | :--- |
| **`export`** | ES Module | Membuka fungsi/variabel agar bisa dipanggil file lain. |
| **`import`** | ES Module | Mengambil fungsi/variabel dari modul/file lain. |
| **`const`** | Deklarasi | Variabel permanen yang referensinya tidak dapat diisi ulang. |
| **`let`** | Deklarasi | Variabel fleksibel yang nilainya dapat diubah-ubah. |
| **`adapter`** | Database / ORM | Driver jembatan koneksi jaringan antara Prisma Client dan MySQL. |
| **`"use client"`** | Next.js Directive | Komponen dieksekusi di browser pengguna (mendukung tombol, hooks). |
| **`"use server"`** | Next.js Directive | Fungsi Server Action backend dieksekusi eksklusif di server. |
| **`async` / `await`** | Asinkron | Menunggu respons database tanpa membuat aplikasi macet/freeze. |
| **`interface`** | TypeScript | Kontrak cetak biru struktur objek (misal: data lapangan). |
| **`enum`** | TypeScript/Prisma | Daftar nilai pilihan tetap yang tidak boleh diisi selain opsi itu. |
| **`useState`** | React Hook | Wadah memori komponen untuk menyimpan data interaktif di layar. |
| **`useEffect`** | React Hook | Menjalankan aksi otomatis saat komponen pertama kali muncul. |
| **`?.`** | Operator JS | Melindungi kode dari error saat membaca objek yang bernilai kosong. |
| **`??`** | Operator JS | Memberikan nilai cadangan jika nilai utama kosong (`null`/`undefined`). |

---
*Dokumen ini dirancang sebagai referensi belajar dan pedoman standar untuk seluruh kodingan aplikasi **Booking Lapangan**.*

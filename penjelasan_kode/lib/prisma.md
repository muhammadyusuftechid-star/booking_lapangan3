# 🔌 Penjelasan File: `lib/prisma.ts`

* **File Asli**: [`lib/prisma.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/lib/prisma.ts)
* **Kategori**: Inisialisasi Koneksi Database (Prisma Client Singleton)
* **Tingkat Akses**: **Backend Only**

---

## 🎯 Peran Utama File Ini
File ini bertugas membuat satu koneksi utama (*instance*) ke database MySQL yang bisa dipakai bersama oleh semua file backend di aplikasi.
File ini menggunakan teknik yang disebut **Singleton Pattern**. Tujuannya agar saat kita melakukan coding di mode pengembangan (*Next.js Hot Reload*), aplikasi tidak terus-menerus membuka koneksi database baru yang bisa menyebabkan server MySQL kehabisan kuota koneksi (*too many connections*).

---

## 🔍 Bedah & Terjemahan Kode Baris per Baris

```typescript
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

* **Baris 1-3 (`import ...`)**:
  * Membaca file `.env` dan mengimpor `PrismaClient` yang dibuat oleh Prisma, serta adapter resmi `PrismaMariaDb` untuk komunikasi ke MySQL.
* **Baris 5 (`const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);`)**:
  * Menyiapkan adapter koneksi menggunakan alamat URL dari variabel lingkungan `DATABASE_URL`. Tanda seru `!` memberitahu TypeScript: *"Yakinlah bahwa variabel ini pasti ada di file .env"*.
* **Baris 7 (`const globalForPrisma = globalThis as unknown as ...`)**:
  * Menyiapkan wadah penyimpanan di memori global komputer (`globalThis`).
* **Baris 9 (`export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });`)**:
  * **Terjemahan Logika**:
    *"Jika di memori global sudah ada koneksi prisma yang pernah dibuat (`globalForPrisma.prisma`), pakai saja yang sudah ada itu. Jika belum ada (simbol `??`), baru buatkan koneksi baru dengan adapter MySQL."*
* **Baris 11-13 (`if (process.env.NODE_ENV !== "production") ...`)**:
  * Jika aplikasi sedang dijalankan di komputer programmer (bukan server produksi), simpan koneksi ini di memori global agar awet dan tidak dibuat ulang saat Anda menyimpan perubahan kode (*live reload*).

---

## 💡 Diimpor Oleh File Mana Saja?
Objek `export const prisma` ini diimpor oleh hampir semua file backend:
* [app/user/actions.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/actions.ts)
* [app/admin/actions.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/actions.ts)
* [app/admin/page.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/page.tsx)
* [lib/auth.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/lib/auth.ts)

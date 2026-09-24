# 🔐 Penjelasan File: `lib/auth.ts`

* **File Asli**: [`lib/auth.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/lib/auth.ts)
* **Kategori**: Konfigurasi Server Autentikasi (Better-Auth Server)
* **Tingkat Akses**: **Backend Only**

---

## 🎯 Peran Utama File Ini
File ini adalah pusat otak sistem autentikasi di sisi server. File ini mengatur:
1. Cara Better-Auth menyimpan akun ke database MySQL menggunakan Prisma Adapter.
2. Kolom tambahan `role` pada pengguna (`USER` atau `ADMIN`).
3. Mengaktifkan fitur login dengan Email dan Kata Sandi biasa.
4. Mengaktifkan fitur login dengan Google OAuth menggunakan kredensial dari file `.env`.

---

## 🔍 Bedah & Terjemahan Kode Baris per Baris

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
```

* **Baris 1-3 (`import ...`)**:
  * Mengimpor pustaka utama `betterAuth`, penghubung Prisma `prismaAdapter`, dan koneksi database MySQL `prisma` dari [lib/prisma.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/lib/prisma.ts).
* **Baris 6-8 (`database: prismaAdapter(prisma, { provider: "mysql" })`)**:
  * Menginstruksikan Better-Auth agar menyimpan data pengguna, sesi, dan akun langsung ke tabel-tabel MySQL yang sudah dibuat oleh Prisma (`User`, `Session`, `Account`).
* **Baris 9-18 (`user.additionalFields.role`)**:
  * Menambahkan kolom khusus bernama `role` pada setiap user:
    * `type: "string"`: Tipe teks (`USER` atau `ADMIN`).
    * `defaultValue: "USER"`: Setiap orang yang mendaftar baru otomatis memiliki hak akses `USER`.
    * `input: false`: Pengguna tidak bisa memanipulasi atau mengisi sendiri rolenya saat mendaftar (mencegah user biasa mengaku sebagai admin).
* **Baris 19-21 (`emailAndPassword: { enabled: true }`)**:
  * Mengaktifkan fitur pendaftaran dan login menggunakan alamat email serta kata sandi. Better-Auth otomatis mengamankan dan meng-hash (mengacak) password agar tidak terbaca telanjang di database.
* **Baris 22-27 (`socialProviders.google`)**:
  * Mengaktifkan login Google sekali klik dengan membaca `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` dari file `.env`.

---

## 💡 Diimpor Oleh File Mana Saja?
Objek `export const auth` ini diimpor oleh endpoint API auth [app/api/auth/[...all]/route.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/api/auth/%5B...all%5D/route.ts) untuk menangani permintaan HTTP masuk dari browser.

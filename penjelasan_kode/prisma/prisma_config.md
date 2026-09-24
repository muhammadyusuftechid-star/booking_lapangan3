# ⚙️ Penjelasan File: `prisma.config.ts`

* **File Asli**: [`prisma.config.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/prisma.config.ts)
* **Kategori**: Konfigurasi CLI Prisma ORM v7
* **Tingkat Akses**: Konfigurasi Backend

---

## 🎯 Peran Utama File Ini
File `prisma.config.ts` adalah konfigurasi modern untuk baris perintah CLI Prisma v7. File ini memberitahu alat Prisma di terminal di mana letak file skema database (`schema.prisma`), di mana riwayat migrasi disimpan, dan variabel lingkungan mana yang memuat URL koneksi database MySQL.

---

## 🔍 Bedah & Terjemahan Kode Baris per Baris

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";
 default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

* **Baris 1 (`import "dotenv/config";`)**:
  * Membaca file `.env` di komputer sehingga variabel seperti `DATABASE_URL` dapat terbaca oleh perintah CLI Prisma.
* **Baris 2 (`import { defineConfig } from "prisma/config";`)**:
  * Mengimpor fungsi pembuat konfigurasi resmi dari Prisma.
* **Baris 4-12 (`export default defineConfig({ ... })`)**:
  * `schema: "prisma/schema.prisma"`: Menunjuk lokasi file skema tabel database.
  * `migrations.path: "prisma/migrations"`: Menunjuk folder tempat Prisma mencatat riwayat perubahan struktur tabel SQL.
  * `datasource.url: process.env["DATABASE_URL"]`: Mengambil alamat koneksi MySQL dari file `.env`.

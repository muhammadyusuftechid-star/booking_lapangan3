# 🖼️ Penjelasan File: `app/layout.tsx`

* **File Asli**: [`app/layout.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/layout.tsx)
* **Kategori**: Kerangka Dasar Aplikasi (Root Layout)
* **Tingkat Akses**: **Server Component (Global Shell)**

---

## 🎯 Peran Utama File Ini
Di Next.js App Router, `app/layout.tsx` adalah kerangka terluar dari seluruh halaman web. Tag `<html>` dan `<body>` hanya didefinisikan satu kali di sini dan akan membungkus setiap halaman yang dibuka oleh pengguna (baik halaman login, user, maupun admin).

---

## 🔍 Bedah & Terjemahan Kode Baris per Baris

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Booking Lapangan - Sistem Reservasi Arena Olahraga",
  description: "Sistem reservasi dan booking lapangan olahraga cepat, mudah, dan terintegrasi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

* **Baris 1-3 (`import ...`)**:
  * Mengimpor tipe `Metadata` bawaan Next.js, font modern `Geist` dari Google Fonts, dan gaya tampilan global dari `./globals.css`.
* **Baris 5-13 (`const geistSans = ...`, `const geistMono = ...`)**:
  * Mengonfigurasi font resmi buatan Vercel agar diunduh secara otomatis dan dioptimalkan tanpa membuat web lemot.
* **Baris 15-18 (`export const metadata: Metadata = { ... }`)**:
  * Mengatur judul tab peramban (*browser tab title*) dan deskripsi SEO mesin pencari Google.
* **Baris 20-24 (`export default function RootLayout({ children })`)**:
  * Menerima parameter `children`. `children` adalah halaman isi apapun yang sedang dibuka user saat itu (misal: isi halaman login atau halaman dashboard).
* **Baris 26-31 (`<html lang="id"> ... </html>`)**:
  * Menetapkan bahasa dokumen ke bahasa Indonesia (`lang="id"`), memasang variabel font, dan merender tag `<body>` yang fleksibel (`flex flex-col`).

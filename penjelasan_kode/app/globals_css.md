# 🎨 Penjelasan File: `app/globals.css`

* **File Asli**: [`app/globals.css`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/globals.css)
* **Kategori**: Desain & Gaya Global (Global CSS & Tailwind v4)
* **Tingkat Akses**: **Frontend Styling**

---

## 🎯 Peran Utama File Ini
File `globals.css` mengatur fondasi tampilan visual seluruh aplikasi. Proyek ini menggunakan **Tailwind CSS v4** (versi terbaru Tailwind) yang sangat ramping dan menggunakan sintaks modern `@import "tailwindcss";` serta variabel tema inline.

---

## 🔍 Bedah & Terjemahan Kode

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

* **Baris 1 (`@import "tailwindcss";`)**:
  * Mengaktifkan seluruh engine utilitas Tailwind CSS v4 ke dalam proyek tanpa perlu konfigurasi file `tailwind.config.js` kuno.
* **Baris 3-6 (`:root { ... }`)**:
  * Menentukan warna dasar standar website: latar belakang putih (`#ffffff`) dan warna teks gelap keabu-abuan (`#171717`).
* **Baris 8-13 (`@theme inline { ... }`)**:
  * Fitur baru Tailwind v4 yang menyambungkan variabel CSS font Geist dari [app/layout.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/layout.tsx) ke kelas utilitas font bawaan Tailwind (`font-sans` dan `font-mono`).

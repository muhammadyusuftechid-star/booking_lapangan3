# 🔍 Penjelasan File: `app/user/lapangan/components/CariLapangan.tsx`

* **File Asli**: [`app/user/lapangan/components/CariLapangan.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/lapangan/components/CariLapangan.tsx)
* **Kategori**: Komponen Bilah Pencarian & Kategori Lapangan
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen input interaktif yang terdiri dari:
1. **Kotak Input Teks**: Dilengkapi ikon kaca pembesar untuk mencari lapangan berdasarkan nama atau lokasi.
2. **Pilihan Kategori (*Pill Buttons*)**: Kumpulan tombol pil ("Semua", "Futsal", "Badminton", "Soccer", "Tenis") yang bisa digeser secara horizontal di layar ponsel.

---

## 🔍 Bedah & Terjemahan Props Interface

```typescript
interface CariLapanganProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}
```

* **Teknik "Lifting State Up"**: Komponen ini adalah komponen murni (*controlled component*). Dia tidak menyimpan state sendiri, melainkan menerima nilai teks (`searchQuery`) dan kategori aktif (`selectedCategory`) dari halaman induknya, lalu memicu callback `onSearchChange` dan `onCategoryChange` setiap kali user mengetik atau mengklik kategori.

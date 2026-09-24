# 🏟️ Penjelasan File: `app/user/lapangan/page.tsx`

* **File Asli**: [`app/user/lapangan/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/lapangan/page.tsx)
* **Kategori**: Halaman Katalog & Pencarian Lapangan (Explore Arena View)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Halaman katalog tempat pengguna bisa melihat seluruh lapangan olahraga yang tersedia.
Fitur utamanya:
1. Memanggil Server Action `getLapangans()` dari database MySQL saat halaman pertama kali dibuka.
2. Menyediakan filter langsung tanpa reload (*instant live search*) berdasarkan ketikan teks nama/lokasi dan tombol kategori olahraga (Futsal, Badminton, dll.).
3. Menampilkan daftar kartu lapangan (`<KartuLapangan />`).

---

## 🔍 Bedah & Terjemahan Filter Pencarian Multikriteria

```typescript
const filteredFields = lapangans.filter((field) => {
  // 1. Cek kecocokan kategori (Futsal, Badminton, Tenis, atau Semua)
  const isCatMatch =
    selectedCategory === "Semua" ||
    field.name.toLowerCase().includes(selectedCategory.toLowerCase());

  // 2. Cek kecocokan kata kunci pencarian (Nama, Lokasi, atau Deskripsi)
  const isSearchMatch =
    field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (field.description &&
      field.description.toLowerCase().includes(searchQuery.toLowerCase()));

  // Hanya tampilkan jika cocok KEDUA-DUANYA
  return isCatMatch && isSearchMatch;
});
```

* **`toLowerCase()`**: Mengubah teks menjadi huruf kecil semua agar pencarian tidak sensitif terhadap huruf besar/kecil (misal mengetik "futsal" tetap akan menemukan "Futsal Premium").
* **Kondisi Kosong**: Jika hasil pencarian tidak ditemukan, halaman menampilkan pesan ramah: *"Tidak ada lapangan yang cocok dengan pencarian Anda."*

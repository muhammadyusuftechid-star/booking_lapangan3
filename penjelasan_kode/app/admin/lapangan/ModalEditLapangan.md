# ✏️ Penjelasan File: `app/admin/lapangan/components/ModalEditLapangan.tsx`

* **File Asli**: [`app/admin/lapangan/components/ModalEditLapangan.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/lapangan/components/ModalEditLapangan.tsx)
* **Kategori**: Komponen Dialog Interaktif Edit Lapangan
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen pop-up modal modern yang memungkinkan Administrator mengubah rincian fasilitas lapangan langsung dari tabel daftar lapangan:
1. **Tombol Pemicu**: Tombol biru muda dengan ikon pensil (`Pencil`) berlabel **Edit**.
2. **Formulir Terisi Otomatis (*Pre-filled Form*)**: Input otomatis terisi dengan data lapangan yang sedang dipilih (`defaultValue={lapangan.price}`, `defaultValue={lapangan.name}`, dsb).
3. **Eksekusi Update**: Mengirimkan data perubahan ke Server Action `updateLapangan(formData)` di backend.
4. **Indikator Loading**: Tombol simpan menampilkan animasi putar (`Loader2`) selama penyimpanan ke database MySQL berlangsung.

---

## 💡 Konsep Penting untuk Presentasi

1. **State Modal (`isOpen`)**:
   Modal dikontrol menggunakan React state: `const [isOpen, setIsOpen] = useState(false)`. Saat tombol edit ditekan, state berubah menjadi `true` dan modal muncul dengan efek animasi halus (*backdrop blur*). Saat tombol Batal atau 'X' ditekan, state kembali menjadi `false`.

2. **Kenapa Memakai `defaultValue` Bukan `value`?**
   Dalam form React/HTML biasa, `defaultValue` mengizinkan pengguna untuk langsung mengetik dan mengedit teks tanpa harus membuat state `onChange` untuk setiap field input secara berulang-ulang, sehingga kodingan menjadi sangat ringkas dan efisien.

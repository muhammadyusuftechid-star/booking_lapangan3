# 🎴 Penjelasan File: `app/user/lapangan/components/KartuLapangan.tsx`

* **File Asli**: [`app/user/lapangan/components/KartuLapangan.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/lapangan/components/KartuLapangan.tsx)
* **Kategori**: Kartu Informasi Lapangan (Field Card Item)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen kartu (*card*) yang menampilkan detail satu lapangan:
1. **Foto Lapangan**: Menampilkan gambar asli jika `picture_url` terisi, atau placeholder abu-abu jika belum ada foto.
2. **Nama & Lokasi**: Menampilkan nama arena dan pin lokasi lapangan.
3. **Tarif Sewa**: Menampilkan harga sewa berformat mata uang Rupiah per jam (misal: `Rp 150.000 /jam`).
4. **Tombol "Pilih & Pesan"**: Tombol biru yang membawa pengguna langsung ke halaman pemesanan dengan parameter ID lapangan: `/user/pesan?fieldId=...`.

---

## 🔍 Bedah & Terjemahan Link Parameter

```tsx
<Link
  href={`/user/pesan?fieldId=${field.id}`}
  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white ..."
>
  <CalendarPlus className="w-3.5 h-3.5" />
  <span>Pilih & Pesan</span>
</Link>
```
* **Query Parameter (`?fieldId=...`)**:
  Ketika tombol ini diklik, ID lapangan diselipkan ke dalam URL. Halaman form pemesanan [app/user/pesan/page.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/pesan/page.tsx) akan langsung membaca parameter ini dan otomatis memilih lapangan tersebut tanpa user harus memilih ulang.

# 🖨️ Penjelasan File: `app/admin/components/TombolCetak.tsx`

* **File Asli**: [`app/admin/components/TombolCetak.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/components/TombolCetak.tsx)
* **Kategori**: Komponen Interaktif Cetak Dokumen / Ekspor PDF
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen tombol yang memungkinkan Administrator mencetak rekapitulasi laporan transaksi ke kertas fisik atau menyimpannya langsung sebagai file **PDF**.

---

## 🔍 Bedah Kode

```tsx
"use client";

import { Printer } from "lucide-react";

export default function TombolCetak() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
      title="Cetak Laporan ke Kertas / Simpan PDF"
    >
      <Printer className="w-3.5 h-3.5 text-blue-600" />
      <span>Cetak Laporan</span>
    </button>
  );
}
```

---

## 💡 Konsep Penting untuk Presentasi

1. **Apa itu `window.print()`?**
   Ini adalah fungsi bawaan JavaScript (*Browser API*) untuk memunculkan dialog cetak sistem operasi (Print / Save as PDF) tanpa memerlukan library pihak ketiga yang berat.

2. **Bagaimana Tampilan Diatur Saat Dicetak?**
   Menggunakan utility CSS Tailwind khusus print:
   - `print:hidden`: Menyembunyikan sidebar navigasi, formulir filter, tombol aksi approval, dan tombol cetak itu sendiri saat dicetak.
   - `hidden print:block`: Menampilkan kop/header dokumen laporan resmi hanya ketika kertas atau PDF sedang digenerate.
   Hasil cetakannya otomatis rapi dan profesional seperti laporan keuangan resmi.

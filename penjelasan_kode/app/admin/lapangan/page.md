# 🏟️ Penjelasan File: `app/admin/lapangan/page.tsx`

* **File Asli**: [`app/admin/lapangan/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/lapangan/page.tsx)
* **Kategori**: Halaman Manajemen Fasilitas Arena & Visualisasi Jadwal (Admin Field & Schedule Management)
* **Tingkat Akses**: **Server Component (Direct Database Access)**

---

## 🎯 Peran Utama File Ini
Halaman komprehensif bagi Administrator untuk mengontrol fasilitas arena olahraga:
1. **Statistik Fasilitas**: Total lapangan terdaftar, total akumulasi harga sewa, dan rata-rata tarif sewa per jam.
2. **Visualisasi Slot Jadwal Lapangan Real-Time**:
   * Admin memilih salah satu lapangan dan memilih tanggal pada kalender.
   * Sistem otomatis memvisualisasikan slot jam sewa (`08:00` s.d `17:00` WIB):
     * Kotak **Hijau (Tersedia)**: Slot kosong dan siap dibooking.
     * Kotak **Merah (Terisi)**: Slot sudah dipesan dan menampilkan nama penyewa yang bersangkutan.
     * Mengklik slot jam akan memunculkan kartu rincian penggunaan slot tersebut.
3. **Formulir Pendaftaran Lapangan Baru**:
   * Input nama lapangan, tarif per jam, lokasi arena, tautan foto lapangan (link web atau path lokal seperti `/lapangan-1.jpg`), dan deskripsi fasilitas.
   * Terhubung langsung ke Server Action `createLapangan(formData)`.
4. **Tabel Data Lapangan (Full CRUD)**:
   * Menampilkan thumbnail gambar lapangan.
   * Tombol **Edit** (`<ModalEditLapangan />`): Membuka dialog modal untuk mengubah harga, nama, lokasi, deskripsi, atau foto tanpa menghapus data.
   * Tombol **Hapus** (`<form action={removeLapangan}>`): Menghapus lapangan secara aman beserta data transaksi yang terkait.

---

## 🔍 Bedah & Terjemahan Detail Kode Baris per Baris

### 1. Deklarasi Slot Waktu & Penangkapan URL Parameter
```typescript
const TIME_SLOTS = [
  { start: "08:00", end: "09:00" },
  { start: "09:00", end: "10:00" },
  { start: "10:00", end: "11:00" },
  { start: "11:00", end: "12:00" },
  { start: "13:00", end: "14:00" },
  { start: "14:00", end: "15:00" },
  { start: "15:00", end: "16:00" },
  { start: "16:00", end: "17:00" },
];

export default async function LapanganPage({ searchParams }) {
  const resolvedParams = await searchParams;
  // Menangkap ID lapangan yang sedang dicek jadwalnya (default ke lapangan pertama)
  const selectedLapanganId = resolvedParams?.checkLapanganId || (lapangans[0]?.id ?? "");
  // Menangkap tanggal yang dipilih (default ke hari ini YYYY-MM-DD)
  const selectedDate = resolvedParams?.date || new Date().toISOString().split("T")[0];
  const activeSlot = resolvedParams?.selectedSlot || "";
```
* **Terjemahan**:
  Next.js Server Component membaca filter tanggal dan ID lapangan langsung dari URL browser (contoh: `?checkLapanganId=lap-123&date=2026-09-24`).

---

### 2. Query Pengecekan Jadwal Terisi di Database MySQL
```typescript
const dayStart = new Date(`${selectedDate}T00:00:00.000Z`);
const dayEnd = new Date(`${selectedDate}T23:59:59.999Z`);

const existingBookings = await prisma.booking.findMany({
  where: {
    lapanganId: selectedLapanganId,
    status: { in: ["CONFIRMED", "PENDING"] },
    OR: [
      {
        startTime: { lte: dayEnd },
        endTime: { gte: dayStart },
      },
    ],
  },
  include: { customer: { select: { name: true } } },
});
```
* **Terjemahan**:
  * Mencari seluruh pesanan di database yang lapangannya sesuai dengan `selectedLapanganId`.
  * Status harus `CONFIRMED` atau `PENDING` (pesanan yang batal/cancelled diabaikan).
  * `startTime` dan `endTime` berada dalam rentang hari yang dipilih (`dayStart` s.d `dayEnd`).
  * `include: { customer: { select: { name: true } } }`: Mengambil nama pelanggan yang memesan untuk ditampilkan di kotak merah.

---

### 3. Logika Pencocokan Kotak Slot Jam (Hijau vs Merah)
```tsx
{TIME_SLOTS.map((slot, index) => {
  // Cek apakah slot jam ini beririsan dengan waktu booking di database
  const matched = bookedSlots.find((b) => b.startTime <= slot.start && b.endTime >= slot.end);
  const isBooked = !!matched;
  const isSelected = activeSlot === slot.start;

  return (
    <Link
      key={index}
      href={`/admin/lapangan?checkLapanganId=${selectedLapanganId}&date=${selectedDate}&selectedSlot=${slot.start}`}
      className={`p-3 rounded-xl border ${
        isBooked 
          ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
          : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
      }`}
    >
      <div className="flex justify-between items-center mb-1 font-bold">
        <span>{slot.start} - {slot.end}</span>
        <span className="text-[9px]">{isBooked ? "Terisi" : "Tersedia"}</span>
      </div>
      <p className="text-[10px] text-slate-600 truncate">
        {isBooked ? `Dipakai: ${matched.customerName}` : "Klik untuk lihat detail"}
      </p>
    </Link>
  );
})}
```
* **Terjemahan**:
  Fungsi `.find()` memeriksa apakah jam mulai booking lebih awal atau sama dengan slot, dan jam selesai lebih lambat atau sama dengan slot. Jika cocok (`isBooked = true`), kartu dirender merah bertuliskan nama pelanggan; jika tidak, hijau bertuliskan **Tersedia**.

---

### 4. Thumbnail Foto & Tombol Aksi di Tabel
```tsx
<td className="px-6 py-4">
  <div className="flex items-center gap-3">
    {/* Thumbnail Gambar Lapangan */}
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 overflow-hidden shadow-2xs">
      {item.picture_url ? (
        <img
          src={item.picture_url}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <Building2 className="h-5 w-5 text-slate-400" />
      )}
    </div>
    <div>
      <p className="font-bold text-slate-800 text-[11px]">{item.name}</p>
      <p className="text-[10px] text-slate-400 line-clamp-1">{item.description || "Tidak ada deskripsi"}</p>
    </div>
  </div>
</td>

{/* Kolom Aksi: Edit & Hapus */}
<td className="px-6 py-4 text-right">
  <div className="flex items-center justify-end gap-1.5">
    {/* 1. Tombol Modal Edit (Client Component) */}
    <ModalEditLapangan lapangan={item} />
    
    {/* 2. Tombol Hapus (Server Action Form) */}
    <form action={removeLapangan}>
      <input type="hidden" name="id" value={item.id} />
      <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-semibold text-red-600 hover:bg-red-100 transition cursor-pointer">
        <Trash2 className="h-3 w-3" /> Hapus
      </button>
    </form>
  </div>
</td>
```
* **Terjemahan**:
  * Tag `<img>` menampilkan foto lapangan secara responsif dengan `object-cover`. Jika `picture_url` bernilai `null`, ikon `<Building2 />` otomatis menjadi penggantinya.
  * Tombol **Edit** diisolasi di dalam Client Component `<ModalEditLapangan />` sehingga dialog pop-up dapat dibuka-tutup dengan lancar tanpa melanggar aturan Server Component.
  * Tombol **Hapus** menggunakan elemen form HTML standar yang langsung memanggil Server Action `removeLapangan`.

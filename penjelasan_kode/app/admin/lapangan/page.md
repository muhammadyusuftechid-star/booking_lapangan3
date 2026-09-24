# 🏟️ Penjelasan File: `app/admin/lapangan/page.tsx`

* **File Asli**: [`app/admin/lapangan/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/lapangan/page.tsx)
* **Kategori**: Halaman Pengelolaan Lapangan & Visualisasi Slot Jam (Admin Field Management)
* **Tingkat Akses**: **Server Component (Direct Database Access)**

---

## 🎯 Peran Utama File Ini
Halaman komprehensif bagi admin untuk mengelola arena olahraga:
1. **Statistik Fasilitas**: Total lapangan terdaftar, akumulasi tarif sewa, dan rata-rata tarif per jam.
2. **Visualisasi Slot Jadwal Lapangan**:
   * Admin bisa memilih lapangan dan memilih tanggal kalender.
   * Sistem menampilkan kotak slot jam bermain (`08:00` sampai `17:00` WIB):
     * Kotak **Hijau (Tersedia)**: Slot masih kosong dan bisa dibooking.
     * Kotak **Merah (Terisi)**: Slot sudah dibooking dan menampilkan nama pelanggan pemesannya.
3. **Form Pendaftaran Fasilitas Baru**: Menambah nama lapangan, tarif sewa per jam, lokasi, dan deskripsi langsung ke database MySQL.
4. **Tabel Kelola Lapangan**: Menampilkan daftar lapangan dengan tombol hapus sampah (*trash button*).

---

## 🔍 Bedah & Terjemahan Deteksi Slot Waktu

```typescript
// 1. Ambil booking yang berlangsung di tanggal yang dipilih admin
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

// 2. Cocokkan dengan setiap slot jam di tampilan
{TIME_SLOTS.map((slot, index) => {
  const matched = bookedSlots.find((b) => b.startTime <= slot.start && b.endTime >= slot.end);
  const isBooked = !!matched;

  return (
    <div className={`p-3 rounded-xl border ${isBooked ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
      <span>{slot.start} - {slot.end}</span>
      <span>{isBooked ? `Dipakai: ${matched.customerName}` : "Tersedia"}</span>
    </div>
  );
})}
```
* **Logika Deteksi Cerdas**:
  Sistem mengecek apakah jam booking pelanggan mencakup jam slot tersebut. Jika ada pesanan jam 08:00 sampai 10:00, maka slot 08:00-09:00 dan 09:00-10:00 otomatis keduanya berwarna merah dengan nama pemesan yang bersangkutan.

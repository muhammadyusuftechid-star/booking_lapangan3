# 📊 Penjelasan File: `app/admin/page.tsx`

* **File Asli**: [`app/admin/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/page.tsx)
* **Kategori**: Pusat Kendali & Laporan Transaksi Terpadu (Admin Dashboard & Unified Reports)
* **Tingkat Akses**: **Server Component (Direct Database Access)**

---

## 🎯 Peran Utama File Ini
Halaman beranda utama administrator yang telah disatukan dengan modul laporan keuangan.
File ini dieksekusi langsung di server Next.js setiap kali dibuka, mengambil data terkini langsung dari database MySQL:
1. **Filter Periode & Status**: Memfilter pesanan berdasarkan tanggal mulai (`start`), tanggal akhir (`end`), dan status (`PENDING`, `CONFIRMED`, `CANCELLED`).
2. **Kalkulasi Metrik Bisnis Dinamis**:
   - **Total Omzet Bersih**: Menghitung akumulasi uang pesanan yang berstatus `CONFIRMED` dan lunas.
   - **Total Transaksi**: Menghitung jumlah seluruh aktivitas pemesanan di periode terpilih.
   - **Perlu Tindakan**: Menghitung pesanan yang berstatus `PENDING` dan butuh verifikasi admin segera.
   - **Disetujui / Selesai**: Menghitung pesanan yang sukses dan disetujui.
   - **Dibatalkan**: Menghitung pesanan yang ditolak atau dibatalkan.
3. **Pintasan Cepat**: Tautan langsung ke modul **Pengelolaan Lapangan** dan **Data Pengguna**.
4. **Tabel Rekapitulasi Transaksi**: Tabel komprehensif seluruh pesanan lengkap dengan nama penyewa, jadwal bermain, nominal, status, dan tombol aksi langsung ([`<AksiBooking />`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/components/AksiBooking.tsx)).
5. **Ekspor & Cetak Dokumen**: Dilengkapi tombol cetak ([`<TombolCetak />`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/components/TombolCetak.tsx)) yang otomatis memformat tampilan menjadi laporan cetak kertas/PDF resmi.

---

## 🔍 Bedah & Terjemahan Query Database

```typescript
export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string; status?: string }> | { start?: string; end?: string; status?: string };
}) {
  // 1. Tangkap parameter filter dari URL (?start=YYYY-MM-DD&end=YYYY-MM-DD&status=...)
  const resolvedParams = await searchParams;
  const startDate = resolvedParams?.start || "";
  const endDate = resolvedParams?.end || "";
  const statusFilter = resolvedParams?.status || "ALL";

  // 2. Susun kondisi tanggal untuk Prisma
  const dateFilter: Record<string, unknown> = {};
  if (startDate && endDate) {
    dateFilter.createdAt = {
      gte: new Date(`${startDate}T00:00:00.000Z`), // gte = Greater Than or Equal
      lte: new Date(`${endDate}T23:59:59.999Z`),   // lte = Less Than or Equal
    };
  }

  // 3. Susun kondisi status untuk Prisma
  const whereCondition: Record<string, unknown> = { ...dateFilter };
  if (statusFilter && statusFilter !== "ALL") {
    whereCondition.status = statusFilter;
  }

  // 4. Eksekusi query secara paralel dengan Promise.all agar sangat cepat
  const [
    totalLapangan,
    totalPengguna,
    bookings,
    allPendingCount,
  ] = await Promise.all([
    prisma.lapangan.count(),
    prisma.user.count(),
    prisma.booking.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true, email: true } },
        lapangan: { select: { name: true, price: true } },
        payments: { select: { amount: true, status: true, paymentType: true } },
      },
    }),
    prisma.booking.count({ where: { status: "PENDING" } }),
  ]);
```

---

## 💡 Konsep Penting untuk Presentasi

1. **Mengapa Menggunakan `Promise.all`?**
   Daripada menjalankan query satu per satu secara berurutan (*sequential*), `Promise.all` menjalankan 4 query database sekaligus secara bersamaan (*parallel*), sehingga waktu loading halaman menjadi jauh lebih singkat (di bawah 100ms).

2. **Mengapa Dashboard dan Laporan Disatukan?**
   Karena keduanya membaca sumber data yang sama persis (`prisma.booking`). Dengan menyatukannya, admin dapat melihat ringkasan omzet, memfilter data per periode, memverifikasi pesanan transfer bank, dan langsung mencetak laporan PDF di satu layar tanpa perlu bolak-balik menu.

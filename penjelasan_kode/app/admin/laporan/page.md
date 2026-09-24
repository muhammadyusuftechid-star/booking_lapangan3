# 📑 Penjelasan File: `app/admin/laporan/page.tsx`

* **File Asli**: [`app/admin/laporan/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/laporan/page.tsx)
* **Kategori**: Halaman Laporan Keuangan & Rekapitulasi Transaksi (Financial Report View)
* **Tingkat Akses**: **Server Component (Direct Database Access)**

---

## 🎯 Peran Utama File Ini
Halaman laporan pembukuan dan rekap transaksi untuk pihak manajemen arena olahraga:
1. **Filter Periode Tanggal**: Form input tanggal mulai (*start date*) dan tanggal selesai (*end date*) untuk menyaring transaksi dalam kurun waktu tertentu.
2. **Ringkasan Finansial**:
   * Total Transaksi yang tercatat.
   * Jumlah Booking yang disetujui (`CONFIRMED`).
   * Jumlah Booking yang dibatalkan (`CANCELLED`).
   * **Total Pendapatan Bersih**: Akumulasi uang masuk yang sudah lunas.
3. **Tabel Lengkap Transaksi**: Rincian tanggal transaksi, nama & email pelanggan, lapangan yang disewa, status booking, dan nominal uang yang dibayarkan.

---

## 🔍 Bedah & Terjemahan Filter Tanggal & Perhitungan Omset

```typescript
export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }> | { start?: string; end?: string };
}) {
  const resolvedParams = await searchParams;
  const startDate = resolvedParams?.start || "";
  const endDate = resolvedParams?.end || "";

  // 1. Buat filter tanggal jika admin memilih rentang waktu
  const dateFilter: Record<string, unknown> = {};
  if (startDate && endDate) {
    dateFilter.createdAt = {
      gte: new Date(`${startDate}T00:00:00.000Z`), // gte = Greater Than or Equal (Sejak tanggal mulai)
      lte: new Date(`${endDate}T23:59:59.999Z`),   // lte = Less Than or Equal (Sampai akhir tanggal selesai)
    };
  }

  // 2. Tarik data dari database MySQL
  const bookings = await prisma.booking.findMany({
    where: dateFilter,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      lapangan: { select: { name: true, price: true } },
      payments: { select: { amount: true, status: true } },
    },
  });

  // 3. Hitung omset hanya dari booking yang sah disetujui (CONFIRMED)
  const totalPendapatan = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, booking) => {
      const paymentSum = booking.payments
        .filter((p) => !["failed", "cancelled", "expire"].includes(p.status.toLowerCase()))
        .reduce((pSum, pay) => pSum + Number(pay.amount), 0);
      return sum + paymentSum;
    }, 0);
```

* **Operator SQL Prisma**:
  * `gte` (*Greater Than or Equal* / $\ge$): Mengambil data mulai dari jam `00:00:00` pada tanggal awal.
  * `lte` (*Less Than or Equal* / $\le$): Mengambil data hingga jam `23:59:59` pada tanggal akhir.
* **Metode `reduce`**:
  Fungsi bawaan JavaScript untuk menjumlahkan seluruh angka di dalam array menjadi satu nilai total (dalam hal ini total uang Rupiah).

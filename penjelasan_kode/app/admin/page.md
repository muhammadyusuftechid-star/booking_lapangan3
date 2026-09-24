# 📊 Penjelasan File: `app/admin/page.tsx`

* **File Asli**: [`app/admin/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/page.tsx)
* **Kategori**: Halaman Beranda Utama Panel Administrator (Admin Dashboard View)
* **Tingkat Akses**: **Server Component (Direct Database Access)**

---

## 🎯 Peran Utama File Ini
Halaman dashboard utama untuk pemilik arena atau staf pengelola.
File ini langsung dieksekusi di server Next.js dan menarik data segar secara instan dari MySQL:
1. Menghitung total seluruh lapangan yang terdaftar.
2. Menghitung total seluruh transaksi booking.
3. Menghitung berapa banyak pesanan yang butuh persetujuan segera (`PENDING`).
4. Menghitung akumulasi uang pendapatan kotor yang masuk.
5. Menampilkan tabel 10 aktivitas pemesanan terbaru lengkap dengan tombol aksi persetujuan (`<AksiBooking />`).

---

## 🔍 Bedah & Terjemahan Query Database Langsung

```typescript
export default async function AdminDashboardPage() {
  // 1. Hitung jumlah baris tabel di MySQL
  const totalLapangan = await prisma.lapangan.count();
  const totalBooking = await prisma.booking.count();
  
  // 2. Hitung booking yang masih berstatus PENDING
  const pendingBooking = await prisma.booking.count({
    where: { status: "PENDING" }
  });

  // 3. Ambil seluruh pembayaran yang berhasil
  const payments = await prisma.payment.findMany({
    where: {
      status: { notIn: ["failed", "cancelled", "expire", "expired"] }
    }
  });
  
  // 4. Hitung total uang omset
  const pendapatan = payments.reduce((sum, pay) => sum + Number(pay.amount), 0);

  // 5. Ambil 10 data booking paling baru
  const recentBookings = await prisma.booking.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      lapangan: { select: { name: true } }
    }
  });
```

* **Keunggulan Server Component**:
  Kode ini berjalan langsung di server sehingga tidak perlu membuat `fetch()` atau API tambahan. Halaman terbuka dengan data yang sudah terisi lengkap dari database sejak awal.

---

### Kolom Tombol Aksi di Tabel Booking
```tsx
<td className="px-6 py-4 text-right">
  <AksiBooking bookingId={b.id} currentStatus={b.status} />
</td>
```
* Di baris tabel booking, komponen interaktif `<AksiBooking />` dipasang untuk memungkinkan admin langsung menyetujui pesanan tanpa harus berpindah halaman.

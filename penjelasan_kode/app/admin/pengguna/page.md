# 👥 Penjelasan File: `app/admin/pengguna/page.tsx`

* **File Asli**: [`app/admin/pengguna/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/pengguna/page.tsx)
* **Kategori**: Halaman Manajemen Data Pengguna (User Management Panel)
* **Tingkat Akses**: **Server Component (Direct Database Access)**

---

## 🎯 Peran Utama File Ini
Halaman khusus bagi Administrator untuk mengawasi seluruh akun pengguna yang terdaftar di dalam sistem:
1. **Statistik Pengguna**:
   - Menghitung total seluruh akun terdaftar.
   - Menghitung jumlah Administrator aktif.
   - Menghitung jumlah Member / Pelanggan biasa.
   - Menghitung jumlah akun yang masuk menggunakan Google OAuth.
2. **Pencarian Cepat**: Input pencarian berdasarkan nama atau alamat email.
3. **Rekap Aktivitas Reservasi**: Menghitung berapa kali pengguna tertentu telah melakukan pemesanan lapangan.
4. **Kontrol Hak Akses**: Tombol interaktif untuk mengubah role pengguna antara `USER` dan `ADMIN` secara instan tanpa perlu menyentuh terminal database.

---

## 🔍 Bedah & Terjemahan Query Database

```typescript
export default async function DataPenggunaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }> | { q?: string };
}) {
  const resolvedParams = await searchParams;
  const searchQuery = (resolvedParams?.q || "").trim().toLowerCase();

  // 1. Ambil semua akun pengguna dari tabel 'user' beserta data akun login (Google/Email)
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      accounts: {
        select: { providerId: true },
      },
    },
  });

  // 2. Hitung jumlah transaksi booking per email pelanggan
  const customers = await prisma.customer.findMany({
    select: {
      email: true,
      _count: {
        select: { bookings: true },
      },
    },
  });

  const bookingCountMap = new Map<string, number>();
  customers.forEach((c) => {
    bookingCountMap.set(c.email.toLowerCase(), c._count.bookings);
  });
```

---

## 💡 Konsep Penting untuk Presentasi

1. **Apa itu `_count` di Prisma?**
   `_count` adalah agregasi bawaan Prisma yang langsung meminta MySQL menghitung jumlah relasi tabel (dalam hal ini, berapa banyak baris `bookings` milik setiap `customer`) tanpa perlu menarik seluruh isi data transaksinya, sehingga hemat memori dan cepat.

2. **Bagaimana Pencarian Bekerja?**
   Pencarian menggunakan query parameter URL `?q=nama_atau_email`. Saat admin mengetik di form pencarian dan menekan Cari, halaman otomatis me-reload di sisi server dan menyaring baris tabel yang cocok.

# 📊 Penjelasan File: `app/user/page.tsx`

* **File Asli**: [`app/user/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/page.tsx)
* **Kategori**: Dashboard Beranda Pelanggan (User Dashboard View)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Halaman ini adalah beranda utama saat pelanggan masuk ke `/user`. Halaman ini menyajikan:
1. Kartu sapaan hangat menampilkan inisial, nama lengkap, dan email user yang sedang aktif.
2. Komponen statistik cepat: total booking, jumlah pesanan menunggu konfirmasi, jumlah pesanan disetujui, dan total arena lapangan yang aktif.
3. Spanduk ajakan cepat (*Call-to-Action*) untuk memesan lapangan.
4. Panduan langkah mudah cara reservasi lapangan olahraga.

---

## 🔍 Bedah & Terjemahan Pengambilan Data Paralel (`Promise.all`)

```typescript
useEffect(() => {
  async function loadData() {
    if (!session?.user?.email) return;
    try {
      // Mengambil data pesanan dan data lapangan secara serentak/paralel
      const [bookingsRes, fieldsRes] = await Promise.all([
        getUserBookings(session.user.email),
        getLapangans(),
      ]);

      if (bookingsRes.success && bookingsRes.data) {
        setUserBookings(bookingsRes.data as BookingWithRelations[]);
      }
      if (fieldsRes.success && fieldsRes.data) {
        setLapangans(fieldsRes.data as Lapangan[]);
      }
    } catch (err) {
      console.error("Gagal memuat dashboard:", err);
    }
  }

  loadData();
}, [session]);
```
* **Konsep Penting (`Promise.all`)**:
  Daripada menunggu `getUserBookings` selesai baru kemudian memanggil `getLapangans` (berurutan dan memakan waktu dua kali lipat), kita menjalankan keduanya secara bersamaan (*paralel*) sehingga dashboard terbuka jauh lebih cepat.

---

### Kalkulasi Statistik Otomatis
```typescript
const pendingCount = userBookings.filter((b) => b.status === "PENDING").length;
const confirmedCount = userBookings.filter((b) => b.status === "CONFIRMED").length;
```
* Menghitung secara otomatis berapa banyak pesanan milik user yang masih berstatus menunggu (`PENDING`) dan berapa yang sudah disetujui (`CONFIRMED`) untuk dikirimkan ke `<KartuStatistik />`.

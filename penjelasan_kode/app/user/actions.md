# ⚙️ Penjelasan File: `app/user/actions.ts`

* **File Asli**: [`app/user/actions.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/actions.ts)
* **Kategori**: Logika Bisnis & Server Actions Pelanggan
* **Tingkat Akses**: **Backend Only (`"use server"`)**

---

## 🎯 Peran Utama File Ini
File ini adalah "dapur" pemrosesan data untuk seluruh fitur pelanggan. Setiap fungsi di file ini berjalan di server dan memiliki akses langsung ke database MySQL melalui Prisma.
Fungsi-fungsi utamanya:
1. Mengambil seluruh daftar lapangan olahraga yang tersedia.
2. Mengambil riwayat transaksi pesanan milik pengguna tertentu berdasarkan alamat email.
3. Melakukan reservasi booking baru lengkap dengan **pengecekan jadwal bentrok** dan pencatatan pembayaran.
4. Mengecek status role akun (`USER` atau `ADMIN`).

---

## 🔍 Bedah & Terjemahan 4 Fungsi Utama

### 1. `getLapangans()` — Mengambil Seluruh Lapangan
```typescript
export async function getLapangans() {
  try {
    const data = await prisma.lapangan.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error: unknown) {
    return { success: false, error: "Gagal mengambil data lapangan" };
  }
}
```
* **Terjemahan**:
  * Mengambil semua baris data dari tabel `lapangan` di MySQL.
  * `orderBy: { createdAt: "desc" }`: Mengurutkan dari lapangan yang paling baru didaftarkan.
  * Hasilnya dikembalikan ke layar katalog [app/user/lapangan/page.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/lapangan/page.tsx).

---

### 2. `getUserBookings(userEmail)` — Mengambil Riwayat Pesanan User
```typescript
export async function getUserBookings(userEmail: string) {
  try {
    if (!userEmail) return { success: true, data: [] };

    const customer = await prisma.customer.findUnique({
      where: { email: userEmail },
      include: {
        bookings: {
          include: {
            lapangan: true,
            payments: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) return { success: true, data: [] };
    return { success: true, data: customer.bookings };
  } catch (error: unknown) {
    return { success: false, error: "Gagal mengambil riwayat booking" };
  }
}
```
* **Terjemahan**:
  * Mencari profil pelanggan di tabel `customer` berdasarkan email akun login.
  * `include: { bookings: { include: { lapangan: true, payments: true } } }`:
    Perintah sakti Prisma untuk melakukan *SQL JOIN*: sekali panggil, kita langsung mendapatkan data pesanan beserta nama lapangan dan rincian pembayarannya.

---

### 3. `createBookingAction(...)` — Membuat Reservasi & Deteksi Bentrok
Ini adalah fungsi paling krusial di seluruh aplikasi:
```typescript
export async function createBookingAction({
  userId, userEmail, userName, lapanganId, startTime, endTime, amount, paymentType
}) {
  // 1. Pastikan profil Customer ada di database (jika belum, otomatis dibuatkan)
  let customer = await prisma.customer.findFirst({ ... });
  if (!customer) {
    customer = await prisma.customer.create({ ... });
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  // 2. DETEKSI BENTROK JADWAL: Cek apakah jam tersebut sudah dipesan orang lain!
  const existingBooking = await prisma.booking.findFirst({
    where: {
      lapanganId: lapanganId,
      status: { in: ["PENDING", "CONFIRMED"] },
      OR: [
        { startTime: { lte: start }, endTime: { gt: start } },
        { startTime: { lt: end }, endTime: { gte: end } },
        { startTime: { gte: start }, endTime: { lte: end } },
      ],
    },
  });

  // Jika bentrok, tolak pemesanan dengan pesan ramah
  if (existingBooking) {
    return {
      success: false,
      error: "Jadwal pada jam ini sudah dipesan orang lain. Silakan pilih jam atau lapangan lain.",
    };
  }

  // 3. Jika jadwal aman, buatkan data Booking dan data Payment
  const newBooking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      lapanganId: lapanganId,
      startTime: start,
      endTime: end,
      status: paymentType === "QRIS" ? "CONFIRMED" : "PENDING",
      payments: {
        create: {
          amount: amount,
          status: paymentType === "QRIS" ? "SUCCESS" : "PENDING",
          paymentDate: new Date(),
          paymentType: paymentType,
        },
      },
    },
  });

  // 4. Perbarui cache tampilan server agar data langsung muncul di layar
  revalidatePath("/user");
  revalidatePath("/user/riwayat");
  revalidatePath("/admin");

  return { success: true, data: newBooking };
}
```

---

### 4. `getUserRoleAction(userEmail)` — Memeriksa Peran Pengguna
```typescript
export async function getUserRoleAction(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { role: true },
  });
  return { success: true, role: user?.role || "USER" };
}
```
* **Terjemahan**:
  * Mengambil nilai kolom `role` dari tabel `user`. Dipakai oleh sistem gerbang keamanan untuk memastikan siapa yang boleh masuk ke `/admin`.

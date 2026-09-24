# 📱 Penjelasan File: `app/user/components/BottomNav.tsx`

* **File Asli**: [`app/user/components/BottomNav.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/components/BottomNav.tsx)
* **Kategori**: Navigasi Bawah Layar Mobile (Bottom Navigation Bar)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Navigasi tab bar melayang (*floating navigation*) yang selalu menempel di bagian bawah layar HP pengguna.
Menyediakan 4 tombol navigasi utama:
1. **Dashboard** (`/user`) — Beranda & info statistik.
2. **Lapangan** (`/user/lapangan`) — Katalog arena & lapangan.
3. **Memesan** (`/user/pesan`) — Form sewa lapangan.
4. **Riwayat** (`/user/riwayat`) — Daftar pesanan pengguna.

---

## 🔍 Bedah & Terjemahan Deteksi Tab Aktif

```typescript
const pathname = usePathname(); // Membaca URL yang sedang aktif di browser

const navItems = [
  {
    name: "Dashboard",
    href: "/user",
    icon: LayoutDashboard,
    active: pathname === "/user",
  },
  {
    name: "Lapangan",
    href: "/user/lapangan",
    icon: Building2,
    active: pathname.startsWith("/user/lapangan"),
  },
  {
    name: "Memesan",
    href: "/user/pesan",
    icon: CalendarPlus,
    active: pathname.startsWith("/user/pesan"),
  },
  {
    name: "Riwayat",
    href: "/user/riwayat",
    icon: History,
    active: pathname.startsWith("/user/riwayat"),
  },
];
```

* **`usePathname()`**: Mendeteksi halaman apa yang sedang dibuka.
  * Jika sedang berada di `/user/lapangan`, maka tombol "Lapangan" otomatis diwarnai biru tebal (`text-blue-600 font-bold bg-blue-50/70`), sedangkan tombol lainnya berwarna abu-abu redup.
* **Efek Kaca (*Glassmorphism*)**:
  Kelas `bg-white/95 backdrop-blur-md` memberikan efek semi-transparan buram yang elegan saat pengguna menggulir (*scroll*) konten di baliknya.

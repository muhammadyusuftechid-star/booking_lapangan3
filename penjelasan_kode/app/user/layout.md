# 📱 Penjelasan File: `app/user/layout.tsx`

* **File Asli**: [`app/user/layout.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/layout.tsx)
* **Kategori**: Layout Induk Portal Pelanggan & Penjaga Akses (User Auth Guard)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
File ini membungkus seluruh halaman di dalam folder `app/user/` (seperti dashboard, daftar lapangan, halaman pesan, dan riwayat).
Tugas utamanya:
1. **Proteksi Hak Akses**:
   * Jika pengunjung belum login, ditolak dan dilempar ke `/login`.
   * Jika yang login adalah `ADMIN`, ditolak dari halaman pelanggan dan dialihkan ke `/admin`.
2. **Menyediakan Navigasi Konsisten**:
   * Menampilkan header atas portal user dengan info profil dan tombol logout (`<HeaderUser />`).
   * Menampilkan navigasi tab bar bawah yang melayang ramah smartphone (`<BottomNav />`).

---

## 🔍 Bedah & Terjemahan Logika Keamanan

```typescript
useEffect(() => {
  async function checkRoleAndAccess() {
    // 1. Cek apakah sesi sudah selesai diperiksa dan user tidak login
    if (!isSessionLoading && !session) {
      router.replace("/login");
      return;
    }

    if (session?.user?.email) {
      // 2. Cek role akun di database
      const res = await getUserRoleAction(session.user.email);
      const resolvedRole = res.success
        ? String(res.role).toUpperCase()
        : String((session.user as { role?: string })?.role || "USER").toUpperCase();

      // 3. Jika ADMIN yang mencoba masuk ke /user, alihkan ke panel /admin
      if (resolvedRole === "ADMIN") {
        router.replace("/admin");
        return;
      }

      // 4. Jika USER biasa yang sah, izinkan layar terbuka
      setIsVerifyingAccess(false);
    }
  }

  checkRoleAndAccess();
}, [session, isSessionLoading, router]);
```

---

## 🔍 Susunan Tampilan Kerangka
```tsx
return (
  <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
    {/* 1. Header Pengguna di Bagian Atas */}
    <HeaderUser userName={userDisplayName} userEmail={userEmail} />

    {/* 2. Isi Halaman (Dashboard / Pesan / Lapangan / Riwayat) */}
    <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-5 pb-24 sm:pb-24">
      {children}
    </main>

    {/* 3. Navigasi Tab Bar Mobile di Bagian Bawah */}
    <BottomNav />
  </div>
);
```
* `pb-24`: Menambahkan jarak bantalan bawah (*padding-bottom*) yang cukup agar konten halaman paling bawah tidak tertutup oleh navigasi melayang `BottomNav`.

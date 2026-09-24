# 🏰 Penjelasan File: `app/admin/layout.tsx`

* **File Asli**: [`app/admin/layout.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/layout.tsx)
* **Kategori**: Layout Induk Panel Admin & Penjaga Hak Akses Administrator
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
File ini membungkus seluruh halaman di dalam panel administrator (`/admin`, `/admin/lapangan`, `/admin/laporan`).
Tugas utamanya:
1. **Pagar Pengaman Ketat (Admin Role Guard)**:
   * Menolak pengunjung yang belum login dan melempar ke `/login`.
   * Menolak pengguna yang berstatus `USER` biasa dan otomatis mengalihkannya ke portal pelanggan `/user`.
   * Hanya akun yang benar-benar memiliki role `ADMIN` di database MySQL yang diizinkan mengakses panel ini.
2. **Sidebar Navigasi Desktop**:
   * Menampilkan menu samping tetap (*fixed sidebar*) selebar 270px berisi menu: **Dashboard**, **Pengelolaan Lapangan**, dan **Laporan**.
   * Menampilkan kartu identitas profil admin yang sedang login (nama & email).
   * Tombol keluar akun (*Log Out*).

---

## 🔍 Bedah & Terjemahan Logika Keamanan Admin

```typescript
useEffect(() => {
  async function checkAdminAccess() {
    // 1. Jika belum login, lempar ke halaman login
    if (!isSessionLoading && !session) {
      router.replace("/login");
      return;
    }

    if (session?.user?.email) {
      // 2. Ambil role akun asli langsung dari database MySQL
      const res = await getUserRoleAction(session.user.email);
      const resolvedRole = res.success
        ? String(res.role).toUpperCase()
        : String((session.user as { role?: string })?.role || "USER").toUpperCase();

      // 3. JIKA BUKAN ADMIN: Tolak dan kembalikan ke portal user!
      if (resolvedRole !== "ADMIN") {
        router.replace("/user");
        return;
      }

      // 4. Jika sah ADMIN, buka akses tampilan
      setIsVerifyingAccess(false);
    }
  }

  checkAdminAccess();
}, [session, isSessionLoading, router]);
```

* Selama verifikasi berlangsung, layar menampilkan animasi loading: *"Memverifikasi hak akses Administrator..."*.

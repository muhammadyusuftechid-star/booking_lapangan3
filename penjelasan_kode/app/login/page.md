# 🔑 Penjelasan File: `app/login/page.tsx`

* **File Asli**: [`app/login/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/login/page.tsx)
* **Kategori**: Halaman Autentikasi Utama (Sign In / Sign Up View)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Halaman ini adalah antarmuka visual tempat pengguna dapat:
1. Memilih masuk menggunakan akun Google dengan sekali klik (`<TombolGoogle />`).
2. Masuk atau mendaftar akun baru dengan email & kata sandi (`<FormEmail />`).
3. Mendeteksi jika pengguna sebetulnya **sudah login**: jika sudah login, halaman ini tidak akan menampilkan form, melainkan langsung melempar pengguna ke `/admin` atau `/user` sesuai rolenya.

---

## 🔍 Bedah & Terjemahan Bagian per Bagian

### 1. Pembungkus `Suspense` (Baris 107-119)
```typescript
export default function LoginPage() {
  return (
    <Suspense fallback={<Loader2 className="animate-spin text-blue-600" />}>
      <KontenLogin />
    </Suspense>
  );
}
```
* **Terjemahan**:
  * Next.js mewajibkan setiap komponen yang membaca parameter URL browser (`useSearchParams()`) dibungkus dengan `<Suspense>`.
  * Selama browser membaca URL, ditampilkan animasi loading spinner `Loader2` agar aplikasi tidak berkedip atau error.

---

### 2. Pengecekan Pengalihan Otomatis (`useEffect`, Baris 27-46)
```typescript
useEffect(() => {
  async function redirectIfLoggedIn() {
    if (session?.user?.email) {
      const roleRes = await getUserRoleAction(session.user.email);
      const role = roleRes.success
        ? roleRes.role
        : (session.user as { role?: string })?.role || "USER";

      if (String(role).toUpperCase() === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/user");
      }
    }
  }

  if (!isSessionLoading && session) {
    redirectIfLoggedIn();
  }
}, [session, isSessionLoading, router]);
```
* **Terjemahan Logika**:
  * *"Jika sesi selesai diperiksa (`!isSessionLoading`) dan ternyata pengguna sudah memiliki sesi login aktif (`session`), periksa apakah akunnya bertipe `ADMIN`. Jika ya, kirim langsung ke `/admin`, bila bukan kirim ke portal pelanggan `/user`."*
* Hal ini mencegah pengguna yang sudah login melihat form login lagi.

---

### 3. Struktur Tampilan (Baris 60-104)
* **Header**: Logo kalender dan tulisan *"Sistem Booking Lapangan"*.
* **Kotak Form Putih di Tengah**:
  * Kartu rapi (`rounded-xl p-6 shadow-xs`) memuat `<TombolGoogle />`.
  * Pembatas garis horizontal elegan dengan teks *"ATAU VIA EMAIL"*.
  * Memuat komponen `<FormEmail initialError={urlError} />`.
* **Footer**: Teks hak cipta hak milik sistem.

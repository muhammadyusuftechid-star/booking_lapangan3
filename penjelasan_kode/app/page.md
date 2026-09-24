# 🚪 Penjelasan File: `app/page.tsx`

* **File Asli**: [`app/page.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/page.tsx)
* **Kategori**: Halaman Beranda Utama / Pengarah Rute (*Root Route Redirector*)
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
File ini adalah pintu gerbang pertama saat seseorang membuka alamat web utama (`http://localhost:3000/`).
File ini tidak menampilkan konten isi, melainkan bertindak seperti **satpam penunjuk jalan cerdas**:
1. Memeriksa apakah pengunjung sudah login atau belum.
2. Jika **belum login**, otomatis dialihkan ke halaman **`/login`**.
3. Jika **sudah login**, sistem mengecek apakah dia adalah `ADMIN` atau `USER`.
   * Jika akunnya **ADMIN**, diarahkan ke **`/admin`**.
   * Jika akunnya **USER** biasa, diarahkan ke **`/user`**.

---

## 🔍 Bedah & Terjemahan Kode Baris per Baris

```typescript
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getUserRoleAction } from "@/app/user/actions";
import { Loader2 } from "lucide-react";
```
* **`"use client"`**: Menandakan kode ini berjalan di browser agar bisa membaca sesi login dan memicu perpindahan rute URL (`useRouter`).
* **`useSession`**: Mengambil status sesi login saat ini dari memori browser.
* **`getUserRoleAction`**: Memanggil fungsi backend untuk mencocokkan role terbaru pengguna langsung ke database MySQL.

---

### Logika Pemeriksaan Rute (`useEffect`)
```typescript
useEffect(() => {
  async function determineRoute() {
    // 1. Jika sesi masih dalam proses loading, jangan lakukan apa-apa dulu
    if (isPending) return;

    // 2. Jika tidak ada email user yang aktif (belum login), lempar ke /login
    if (!session?.user?.email) {
      router.replace("/login");
      return;
    }

    try {
      // 3. Ambil role user dari MySQL
      const roleRes = await getUserRoleAction(session.user.email);
      const role = roleRes.success
        ? roleRes.role
        : (session.user as { role?: string })?.role || "USER";

      // 4. Arahkan sesuai hak akses
      if (String(role).toUpperCase() === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/user");
      }
    } catch (err) {
      console.error("Gagal memeriksa role di root:", err);
      router.replace("/user");
    }
  }

  determineRoute();
}, [session, isPending, router]);
```
* **`router.replace("/...")`**: Berpindah halaman tanpa meninggalkan riwayat tombol *Back* di peramban, sehingga user tidak akan terjebak kembali ke halaman loading kosong.
* **Tampilan Sementara**: Selama proses pengecekan beberapa milidetik berlangsung, halaman menampilkan animasi spinner memutar (`<Loader2 className="animate-spin" />`) bertuliskan *"Memuat aplikasi..."*.

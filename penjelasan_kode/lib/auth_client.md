# 🖥️ Penjelasan File: `lib/auth-client.ts`

* **File Asli**: [`lib/auth-client.ts`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/lib/auth-client.ts)
* **Kategori**: Pustaka Autentikasi Sisi Klien (Better-Auth Client SDK untuk React)
* **Tingkat Akses**: **Frontend (Client-Side)**

---

## 🎯 Peran Utama File Ini
Jika [lib/auth.ts](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/lib/auth.ts) bekerja di server, maka `lib/auth-client.ts` bekerja langsung di **browser pengguna**. File ini menyediakan fungsi-fungsi React siap pakai untuk:
1. Mendaftar akun baru (`signUp`).
2. Masuk / login akun (`signIn`).
3. Keluar akun / logout (`signOut`).
4. Memeriksa siapa pengguna yang sedang aktif melihat layar saat ini (`useSession`).

---

## 🔍 Bedah & Terjemahan Kode Baris per Baris

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

* **Baris 1 (`import { createAuthClient } from "better-auth/react";`)**:
  * Mengimpor pembuat client khusus React dari pustaka Better-Auth.
* **Baris 3-5 (`export const authClient = createAuthClient({ ... })`)**:
  * Menginisialisasi client dengan alamat server aplikasi (`baseURL`). Nilainya diambil dari `NEXT_PUBLIC_BETTER_AUTH_URL` atau default `http://localhost:3000`.
* **Baris 7 (`export const { signIn, signUp, signOut, useSession } = authClient;`)**:
  * Mengekspor 4 fungsi andalan yang sangat sering dipanggil di berbagai halaman frontend:
    * **`signIn`**: Digunakan untuk memproses login email & password atau memicu popup Google login.
    * **`signUp`**: Digunakan untuk mendaftarkan akun baru (nama, email, password).
    * **`signOut`**: Digunakan untuk menghapus cookie sesi dan keluar dari sistem.
    * **`useSession()`**: Hook React untuk memantau status login di layar secara real-time. Mengembalikan `{ data: session, isPending }`.

---

## 💡 Diimpor Oleh File Mana Saja?
Fungsi-fungsi dari file ini diimpor oleh hampir seluruh tampilan:
* [app/login/components/FormEmail.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/login/components/FormEmail.tsx) (memakai `signIn` & `signUp`)
* [app/login/components/TombolGoogle.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/login/components/TombolGoogle.tsx) (memakai `signIn.social`)
* [app/user/layout.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/layout.tsx) & [app/admin/layout.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/admin/layout.tsx) (memakai `useSession` dan `signOut`)
* [app/page.tsx](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/page.tsx) (memakai `useSession` untuk pengalihan rute)

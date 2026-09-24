# 👤 Penjelasan File: `app/user/components/HeaderUser.tsx`

* **File Asli**: [`app/user/components/HeaderUser.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/user/components/HeaderUser.tsx)
* **Kategori**: Header Bar Portal Pelanggan
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Header bar yang menempel di bagian paling atas layar portal pelanggan. Menampilkan:
1. Logo aplikasi dan nama portal.
2. Nama dan alamat email pengguna yang sedang login.
3. Lingkaran avatar inisial nama pengguna (misal huruf "Y" untuk Yusuf).
4. Tombol **Keluar (Logout)** yang aman menggunakan Better-Auth.

---

## 🔍 Bedah & Terjemahan Kode

```typescript
const handleLogout = async () => {
  try {
    setLogoutLoading(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/login"); // Setelah cookie dihapus, lempar ke layar login
        },
      },
    });
  } catch (error) {
    console.error("Gagal logout:", error);
    router.replace("/login");
  } finally {
    setLogoutLoading(false);
  }
};
```
* **Avatar Inisial Otomatis**:
  `const initial = (userName || "M").charAt(0).toUpperCase();`
  Mengambil karakter huruf pertama dari nama pengguna dan mengubahnya menjadi huruf kapital untuk ditempatkan di dalam lingkaran biru avatar.

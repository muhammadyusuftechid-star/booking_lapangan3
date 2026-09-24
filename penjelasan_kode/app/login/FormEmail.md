# 📝 Penjelasan File: `app/login/components/FormEmail.tsx`

* **File Asli**: [`app/login/components/FormEmail.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/login/components/FormEmail.tsx)
* **Kategori**: Formulir Interaktif Masuk & Daftar Akun Email
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen ini adalah formulir dwifungsi (*2-in-1*):
1. **Mode Masuk (Sign In)**: Pengguna memasukkan email & kata sandi untuk masuk.
2. **Mode Daftar (Sign Up)**: Pengguna memasukkan nama lengkap, email, dan kata sandi untuk membuat akun baru.
Pengguna dapat berganti mode dengan menekan tombol tab *"Masuk"* atau *"Daftar Baru"* di bagian atas form.

---

## 🔍 Bedah & Terjemahan Bagian per Bagian

### 1. State / Variabel Memori Layar (Baris 26-33)
```typescript
const [isRegister, setIsRegister] = useState(false);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(initialError || null);
const [successMsg, setSuccessMsg] = useState<string | null>(null);
```
* **Terjemahan**:
  * `isRegister`: Menentukan mode aktif (jika `false` = mode Masuk, jika `true` = mode Daftar Baru).
  * `showPassword`: Mengontrol apakah karakter kata sandi disembunyikan (`••••`) atau ditampilkan teksnya (ikon mata).
  * `loading`: Menandakan proses sedang dikirim ke server (memunculkan animasi spinner dan menonaktifkan tombol agar tidak diklik dua kali).
  * `error` & `successMsg`: Menampung pesan peringatan merah atau notifikasi hijau sukses.

---

### 2. Validasi & Pengiriman Form (`handleSubmit`, Baris 35-120)
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Mencegah browser me-refresh halaman otomatis

  // Validasi input wajib terisi
  if (!email.trim() || !password.trim()) {
    setError("Silakan isi alamat email dan kata sandi.");
    return;
  }

  // Validasi panjang kata sandi
  if (password.length < 8) {
    setError("Kata sandi harus minimal 8 karakter.");
    return;
  }

  setLoading(true);

  if (isRegister) {
    // Mode DAFTAR BARU: Panggil fungsi signUp dari Better-Auth
    const res = await signUp.email({
      email: email.trim(),
      password: password,
      name: name.trim(),
    });
    // Jika sukses, akun langsung tersimpan di MySQL
  } else {
    // Mode MASUK: Panggil fungsi signIn dari Better-Auth
    const res = await signIn.email({
      email: email.trim(),
      password: password,
    });
    // Jika password benar, cek role user dan arahkan ke /admin atau /user
  }
};
```

---

### 3. Fitur Keamanan Pengalihan Berdasarkan Peran (Role)
Setelah pengguna berhasil login:
```typescript
const roleRes = await getUserRoleAction(email.trim());
if (roleRes.success && String(roleRes.role).toUpperCase() === "ADMIN") {
  router.replace("/admin");
} else {
  router.replace("/user");
}
```
* Sistem mengecek langsung ke tabel database apakah akun ini memiliki role `ADMIN`. Jika ya, otomatis dibukakan gerbang ke dashboard admin.

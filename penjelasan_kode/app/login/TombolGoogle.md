# 🔴 Penjelasan File: `app/login/components/TombolGoogle.tsx`

* **File Asli**: [`app/login/components/TombolGoogle.tsx`](file:///home/yusuf/projekan/Pelatihan%20Bpvp/booking_lapangan/app/login/components/TombolGoogle.tsx)
* **Kategori**: Tombol Autentikasi Google OAuth
* **Tingkat Akses**: **Frontend (Client Component - `"use client"`)**

---

## 🎯 Peran Utama File Ini
Komponen tombol mandiri dengan logo resmi Google berwarna-warni (*Super G Logo*) yang memicu login satu klik menggunakan akun Google pengguna. Pengguna tidak perlu mengetik email atau password, karena verifikasi dilakukan langsung oleh server Google secara aman.

---

## 🔍 Bedah & Terjemahan Kode Baris per Baris

```typescript
"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

interface TombolGoogleProps {
  onError?: (msg: string) => void;
}

export default function TombolGoogle({ onError }: TombolGoogleProps) {
  const [loading, setLoading] = useState(false);

  const handleLoginGoogle = async () => {
    try {
      setLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL: "/user",
      });
    } catch (err: unknown) {
      console.error("Gagal login Google:", err);
      const msg = err instanceof Error ? err.message : "Gagal mengarahkan ke akun Google.";
      if (onError) onError(msg);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLoginGoogle}
      disabled={loading}
      className="..."
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
      ) : (
        <>
          {/* Ikon SVG Google 4 Warna */}
          <svg className="w-4 h-4" viewBox="0 0 24 24"> ... </svg>
          <span>Lanjutkan dengan Google</span>
        </>
      )}
    </button>
  );
}
```

* **`signIn.social({ provider: "google", callbackURL: "/user" })`**:
  * Memerintahkan pustaka Better-Auth untuk membuka jendela login Google.
  * `callbackURL: "/user"`: Menentukan halaman tujuan setelah pengguna sukses memilih akun Google mereka (yaitu ke dashboard portal pelanggan `/user`).
* **`disabled={loading}`**:
  * Selama pengguna sedang dialihkan ke Google, tombol dikunci (*disabled*) dan diganti dengan animasi spinner `Loader2` agar user tahu bahwa sistem sedang bekerja.

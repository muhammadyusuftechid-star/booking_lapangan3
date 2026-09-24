"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { getUserRoleAction } from "@/app/user/actions";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

interface FormEmailProps {
  initialError?: string | null;
}

export default function FormEmail({ initialError }: FormEmailProps) {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setError("Silakan isi alamat email dan kata sandi.");
      return;
    }

    if (isRegister && !name.trim()) {
      setError("Silakan masukkan nama lengkap Anda.");
      return;
    }

    if (password.length < 8) {
      setError("Kata sandi harus minimal 8 karakter.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const res = await signUp.email({
          email: email.trim(),
          password,
          name: name.trim(),
          callbackURL: "/user",
        });

        if (res.error) {
          setError(
            res.error.message ||
            "Pendaftaran gagal. Periksa kembali format email dan kata sandi."
          );
        } else {
          setSuccessMsg("Akun berhasil dibuat! Mengalihkan ke dashboard...");
          router.replace("/user");
        }
      } else {
        const res = await signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/user",
        });

        if (res.error) {
          setError(
            res.error.message ||
            "Email atau kata sandi salah. Silakan coba lagi atau daftar akun baru."
          );
        } else {
          setSuccessMsg("Berhasil masuk! Mengalihkan...");
          const roleRes = await getUserRoleAction(email.trim());
          const role = roleRes.success
            ? roleRes.role
            : (res.data?.user as { role?: string })?.role || "USER";

          if (String(role).toUpperCase() === "ADMIN") {
            router.replace("/admin");
          } else {
            router.replace("/user");
          }
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan sistem saat proses otentikasi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Pesan Error & Sukses */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Input Nama (Khusus Daftar) */}
        {isRegister && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Uzumaki Naruto"
                disabled={loading}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800 disabled:opacity-50"
              />
            </div>
          </div>
        )}

        {/* Input Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Alamat Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              disabled={loading}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Input Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kata Sandi
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              disabled={loading}
              className="w-full text-xs pl-9 pr-9 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 mt-1"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>{isRegister ? "Daftar Akun Sekarang" : "Masuk ke Akun"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Switch Antara Masuk & Daftar */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
              setSuccessMsg(null);
            }}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            {isRegister ? "Masuk di sini" : "Daftar sekarang"}
          </button>
        </p>
      </div>
    </div>
  );
}

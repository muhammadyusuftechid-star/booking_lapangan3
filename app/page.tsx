"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import {
  CalendarDays,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError(null);

      const res = await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (res?.error) {
        setError(res.error.message || "Gagal menghubungkan ke layanan Google");
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan saat masuk dengan Google";
      setError(message);
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isRegister) {
        const res = await signUp.email({
          email,
          password,
          name,
          callbackURL: "/dashboard",
        });
        if (res.error) {
          setError(res.error.message || "Pendaftaran gagal. Silakan coba lagi.");
        } else {
          setSuccessMsg("Akun berhasil dibuat! Mengalihkan ke dashboard...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 800);
        }
      } else {
        const res = await signIn.email({
          email,
          password,
          callbackURL: "/dashboard",
        });
        if (res.error) {
          setError(res.error.message || "Email atau password tidak sesuai.");
        } else {
          setSuccessMsg("Berhasil masuk! Mengalihkan...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 800);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan sistem saat proses otentikasi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-xs text-slate-500">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      {/* Header Minimalis */}
      <header className="w-full bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900">
                Sistem Booking Lapangan
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Konten Autentikasi Tengah */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold text-slate-900">
              {isRegister ? "Pendaftaran Akun" : "Masuk ke Akun"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {isRegister
                ? "Isi formulir berikut untuk mendaftar akun baru"
                : "Masukkan email dan password untuk melanjutkan"}
            </p>
          </div>

          {/* Pesan Error & Sukses */}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Tombol Login Google (Direct Link) */}
          <a
            href="/api/auth/login-google"
            onClick={() => setGoogleLoading(true)}
            className="w-full h-9 flex items-center justify-center gap-2 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-colors cursor-pointer mb-4 no-underline"
          >
            {googleLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.9 7.4C.7 9.8 0 12 0 12s.7 2.2 1.9 4.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 15.9C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
            )}
            <span>{googleLoading ? "Menghubungkan ke Google..." : "Masuk dengan Google"}</span>
          </a>

          {/* Pembatas Minimalis */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] text-slate-400">atau</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form Login / Register */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required={isRegister}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama"
                    className="w-full h-9 bg-white border border-slate-300 rounded-md pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  className="w-full h-9 bg-white border border-slate-300 rounded-md pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full h-9 bg-white border border-slate-300 rounded-md pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-9 mt-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-md flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? "Daftar Sekarang" : "Masuk"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-blue-600 hover:underline font-medium ml-1 cursor-pointer"
              >
                {isRegister ? "Masuk di sini" : "Daftar di sini"}
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Minimalis */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>© 2026 Booking Lapangan. All rights reserved.</p>
      </footer>
    </div>
  );
}

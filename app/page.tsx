"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import {
  Trophy,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();

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
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err: any) {
      setError(err?.message || "Gagal masuk dengan akun Google");
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
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan sistem saat proses otentikasi.");
    } finally {
      setLoading(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm text-slate-500 font-medium">Memeriksa status sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Simple Minimalist Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">
            Arena<span className="text-emerald-600">Booking</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem Online</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
          {/* Header Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3 border border-emerald-100/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portal Reservasi Olahraga</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isRegister ? "Buat Akun Baru" : "Selamat Datang"}
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              {isRegister
                ? "Daftar untuk memesan lapangan secara instan"
                : "Masuk untuk mengakses dashboard & jadwal lapangan"}
            </p>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            type="button"
            className="w-full h-11 flex items-center justify-center gap-3 rounded-2xl bg-white hover:bg-slate-50/80 text-slate-700 font-medium text-sm border border-slate-200 transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-xs cursor-pointer mb-5"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>{googleLoading ? "Menghubungkan..." : "Lanjutkan dengan Google"}</span>
          </button>

          {/* Minimalist Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">atau email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Email Authentication Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required={isRegister}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap Anda"
                    className="w-full h-11 bg-slate-50/50 border border-slate-200 rounded-2xl pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-11 bg-slate-50/50 border border-slate-200 rounded-2xl pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full h-11 bg-slate-50/50 border border-slate-200 rounded-2xl pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 mt-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>{isRegister ? "Daftar Akun" : "Masuk ke Dashboard"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="text-emerald-700 hover:text-emerald-800 font-semibold underline-offset-4 hover:underline transition-colors ml-1 cursor-pointer"
              >
                {isRegister ? "Masuk di sini" : "Daftar sekarang"}
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/50">
        <p>© 2026 ArenaBooking. Hak cipta dilindungi.</p>
        <div className="flex items-center gap-4 text-slate-500 font-medium">
          <span>Futsal</span>
          <span>•</span>
          <span>Badminton</span>
          <span>•</span>
          <span>Mini Soccer</span>
          <span>•</span>
          <span>Tenis</span>
        </div>
      </footer>
    </div>
  );
}

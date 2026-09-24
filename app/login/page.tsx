"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getUserRoleAction } from "@/app/user/actions";
import { Loader2 } from "lucide-react";
import FormEmail from "./components/FormEmail";
import TombolGoogle from "./components/TombolGoogle";

function KontenLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending: isSessionLoading } = useSession();

  const [urlError, setUrlError] = useState<string | null>(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "google_failed") {
      return "Gagal masuk dengan Google. Periksa koneksi akun Anda.";
    }
    if (errorParam) {
      return `Login gagal: ${errorParam}`;
    }
    return null;
  });

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

  if (isSessionLoading || session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-xs text-slate-500">Memeriksa status akun...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      {/* Header Aplikasi */}
      <header className="w-full bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Logo Booking Lapangan"
            width={32}
            height={32}
            className="w-8 h-8 rounded-lg object-contain"
            priority
          />
          <span className="font-bold text-sm text-slate-900">
            Sistem Booking Lapangan
          </span>
        </div>
      </header>

      {/* Konten Form Tengah */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 mb-3 rounded-xl overflow-hidden border border-slate-100 shadow-xs flex items-center justify-center bg-slate-50">
              <Image
                src="/logo.png"
                alt="Logo Booking Lapangan"
                width={48}
                height={48}
                className="w-full h-full object-contain p-0.5"
                priority
              />
            </div>
            <h1 className="text-lg font-bold text-slate-900">Selamat Datang</h1>
            <p className="text-xs text-slate-500 mt-1">
              Silakan masuk atau daftar untuk memesan lapangan olahraga
            </p>
          </div>

          {/* Tombol Masuk via Google */}
          <TombolGoogle onError={(msg) => setUrlError(msg)} />

          {/* Pembatas Garis ATAU */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2.5 text-[10px] font-medium text-slate-400 uppercase tracking-wider absolute">
              atau via email
            </span>
          </div>

          {/* Form Email & Password */}
          <FormEmail initialError={urlError} />
        </div>
      </main>

      {/* Footer Minimalis */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>© 2026 Booking Lapangan. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      }
    >
      <KontenLogin />
    </Suspense>
  );
}

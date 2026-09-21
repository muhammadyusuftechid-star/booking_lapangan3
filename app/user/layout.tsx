"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, LogOut, Loader2 } from "lucide-react";
import { getUserRoleAction } from "@/app/actions/booking";
import BottomNav from "./BottomNav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(true);

  useEffect(() => {
    async function checkRoleAndAccess() {
      if (!isSessionLoading && !session) {
        router.replace("/");
        return;
      }

      if (session?.user?.email) {
        const res = await getUserRoleAction(session.user.email);
        const resolvedRole = res.success
          ? String(res.role).toUpperCase()
          : String((session.user as { role?: string })?.role || "USER").toUpperCase();

        // Jika akun adalah ADMIN, larang akses ke halaman user dan alihkan ke /admin
        if (resolvedRole === "ADMIN") {
          router.replace("/admin");
          return;
        }

        setIsVerifyingAccess(false);
      } else {
        setIsVerifyingAccess(false);
      }
    }

    checkRoleAndAccess();
  }, [session, isSessionLoading, router]);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/");
          },
        },
      });
    } catch (error) {
      console.error("Gagal logout:", error);
      router.replace("/");
    } finally {
      setLogoutLoading(false);
    }
  };

  if (isSessionLoading || isVerifyingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-xs text-slate-500">Memeriksa hak akses pengguna...</p>
        </div>
      </div>
    );
  }

  const userDisplayName = session?.user?.name || "Member";
  const userEmail = session?.user?.email || "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Header Atas */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 block leading-tight">
                Booking Lapangan
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block">
                Portal Pelanggan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 leading-none">
                {userDisplayName}
              </p>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">
                {userEmail}
              </p>
            </div>

            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              title="Keluar dari akun"
            >
              {logoutLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
              ) : (
                <LogOut className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Konten Halaman Aktif dengan ruang bawah untuk BottomNav */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6 pb-28">
        {children}
      </main>

      {/* Komponen Navigasi Bawah */}
      <BottomNav />
    </div>
  );
}


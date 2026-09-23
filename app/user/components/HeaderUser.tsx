"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { CalendarDays, LogOut, Loader2 } from "lucide-react";

interface HeaderUserProps {
  userName: string;
  userEmail: string;
}

export default function HeaderUser({ userName, userEmail }: HeaderUserProps) {
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/login");
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

  const initial = (userName || "M").charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
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

        {/* Profil & Tombol Logout */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-800 block leading-tight">
              {userName}
            </span>
            <span className="text-[10px] text-slate-500 block truncate max-w-[160px]">
              {userEmail}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            {initial}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-semibold text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
            title="Keluar dari akun"
          >
            {logoutLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

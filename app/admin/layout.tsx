"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { getUserRoleAction } from "@/app/user/actions";
import { 
  BarChart3, 
  Building2, 
  Users,
  LogOut,
  Loader2,
  ShieldCheck,
  User as UserIcon
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(true);

  useEffect(() => {
    async function checkAdminAccess() {
      if (!isSessionLoading && !session) {
        router.replace("/login");
        return;
      }

      if (session?.user?.email) {
        const res = await getUserRoleAction(session.user.email);
        const resolvedRole = res.success
          ? String(res.role).toUpperCase()
          : String((session.user as { role?: string })?.role || "USER").toUpperCase();

        if (resolvedRole !== "ADMIN") {
          router.replace("/user");
          return;
        }

        setIsVerifyingAccess(false);
      } else if (!isSessionLoading && !session) {
        router.replace("/login");
      }
    }

    checkAdminAccess();
  }, [session, isSessionLoading, router]);

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  if (isSessionLoading || isVerifyingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
          <p className="text-xs text-slate-500 font-medium">
            Memverifikasi hak akses Administrator...
          </p>
        </div>
      </div>
    );
  }

  const adminName = session?.user?.name || "Administrator";
  const adminEmail = session?.user?.email || "";

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-800 flex">
      {/* Sidebar Kiri Konsisten */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[270px] flex-col border-r border-slate-200 bg-white lg:flex shadow-xs">
        <div className="flex h-[76px] items-center border-b border-slate-100 px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 shadow-xs overflow-hidden bg-white">
              <Image
                src="/logo.png"
                alt="Logo Booking Lapangan"
                width={40}
                height={40}
                className="w-full h-full object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <p className="text-[14px] font-bold tracking-tight text-slate-900">Booking Lapangan</p>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">Administrator</p>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Menu Utama</p>
          
          <Link
            href="/admin"
            className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[12px] font-semibold transition ${
              pathname === "/admin" 
                ? "bg-blue-50 text-blue-700 shadow-xs" 
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <BarChart3 className={`h-[18px] w-[18px] ${pathname === "/admin" ? "text-blue-600" : "text-slate-400"}`} />
            <span>Dashboard & Laporan</span>
          </Link>

          <Link
            href="/admin/lapangan"
            className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[12px] font-semibold transition ${
              pathname?.includes("/admin/lapangan") 
                ? "bg-blue-50 text-blue-700 shadow-xs" 
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Building2 className={`h-[18px] w-[18px] ${pathname?.includes("/admin/lapangan") ? "text-blue-600" : "text-slate-400"}`} />
            <span>Pengelolaan Lapangan</span>
          </Link>

          <Link
            href="/admin/pengguna"
            className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[12px] font-semibold transition ${
              pathname?.includes("/admin/pengguna") 
                ? "bg-blue-50 text-blue-700 shadow-xs" 
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Users className={`h-[18px] w-[18px] ${pathname?.includes("/admin/pengguna") ? "text-blue-600" : "text-slate-400"}`} />
            <span>Data Pengguna</span>
          </Link>
        </nav>

        {/* Info Profil Admin Aktif */}
        <div className="border-t border-slate-100 p-4 space-y-3">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{adminName}</p>
              <p className="text-[10px] text-slate-400 truncate">{adminEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-600" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Area Konten Utama di Kanan */}
      <div className="flex-1 lg:pl-[270px]">
        {children}
      </div>
    </div>
  );
}
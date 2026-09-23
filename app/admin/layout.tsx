"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { 
  CalendarDays, 
  BarChart3, 
  Building2, 
  FileText, 
  LogOut 
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-800 flex">
      {/* Sidebar Kiri Konsisten */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[270px] flex-col border-r border-slate-200 bg-white lg:flex shadow-xs">
        <div className="flex h-[76px] items-center border-b border-slate-100 px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[14px] font-bold tracking-tight text-slate-900">Booking Lapangan</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">Administrator</p>
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
            <span>Dashboard</span>
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
            href="/admin/laporan"
            className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[12px] font-semibold transition ${
              pathname?.includes("/admin/laporan") 
                ? "bg-blue-50 text-blue-700 shadow-xs" 
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <FileText className={`h-[18px] w-[18px] ${pathname?.includes("/admin/laporan") ? "text-blue-600" : "text-slate-400"}`} />
            <span>Laporan</span>
          </Link>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Keluar</span>
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
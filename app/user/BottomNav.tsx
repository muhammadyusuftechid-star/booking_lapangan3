"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, CalendarPlus, History } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/user",
      icon: LayoutDashboard,
      active: pathname === "/user",
    },
    {
      name: "Lapangan",
      href: "/user/lapangan",
      icon: Building2,
      active: pathname.startsWith("/user/lapangan"),
    },
    {
      name: "Memesan",
      href: "/user/pesan",
      icon: CalendarPlus,
      active: pathname.startsWith("/user/pesan"),
    },
    {
      name: "Riwayat",
      href: "/user/riwayat",
      icon: History,
      active: pathname.startsWith("/user/riwayat"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-lg transition-all ${
                item.active
                  ? "text-blue-600 font-bold bg-blue-50/70"
                  : "text-slate-500 hover:text-slate-800 font-medium hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-5 h-5 ${item.active ? "text-blue-600 scale-105" : "text-slate-400"}`} />
              <span className="text-[10px] text-center leading-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";

interface RiwayatKosongProps {
  isFiltered: boolean;
}

export default function RiwayatKosong({ isFiltered }: RiwayatKosongProps) {
  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 space-y-2 shadow-xs">
      <Inbox className="w-8 h-8 mx-auto text-slate-300" />
      <p className="text-xs font-semibold text-slate-700">Tidak Ada Data Riwayat</p>
      <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
        {isFiltered
          ? "Tidak ada pesanan yang sesuai dengan filter atau kata kunci pencarian Anda."
          : "Anda belum pernah melakukan pemesanan jadwal lapangan."}
      </p>
      <Link
        href="/user/pesan"
        className="mt-2 inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        Mulai Pesan Lapangan
      </Link>
    </div>
  );
}

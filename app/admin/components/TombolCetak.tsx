"use client";

import { Printer } from "lucide-react";

export default function TombolCetak() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer print:hidden"
      title="Cetak atau Simpan sebagai PDF"
    >
      <Printer className="w-3.5 h-3.5 text-slate-500" />
      <span>Cetak Laporan</span>
    </button>
  );
}

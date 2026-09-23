"use client";

interface KartuStatistikProps {
  totalBooking: number;
  menunggu: number;
  disetujui: number;
  arenaTersedia: number;
}

export default function KartuStatistik({
  totalBooking,
  menunggu,
  disetujui,
  arenaTersedia,
}: KartuStatistikProps) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
      {/* 1. Total Booking */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <p className="text-[11px] text-slate-500 font-medium">Total Booking</p>
        <h3 className="text-xl font-bold text-slate-900 mt-0.5">{totalBooking}</h3>
        <span className="text-[10px] text-slate-400">Riwayat pesanan</span>
      </div>

      {/* 2. Menunggu Konfirmasi */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <p className="text-[11px] text-slate-500 font-medium">Menunggu</p>
        <h3 className="text-xl font-bold text-amber-600 mt-0.5">{menunggu}</h3>
        <span className="text-[10px] text-slate-400">Perlu konfirmasi</span>
      </div>

      {/* 3. Disetujui */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <p className="text-[11px] text-slate-500 font-medium">Disetujui</p>
        <h3 className="text-xl font-bold text-green-600 mt-0.5">{disetujui}</h3>
        <span className="text-[10px] text-slate-400">Siap untuk main</span>
      </div>

      {/* 4. Arena Tersedia */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <p className="text-[11px] text-slate-500 font-medium">Arena Tersedia</p>
        <h3 className="text-xl font-bold text-slate-900 mt-0.5">{arenaTersedia}</h3>
        <span className="text-[10px] text-slate-400">Lapangan aktif</span>
      </div>
    </section>
  );
}

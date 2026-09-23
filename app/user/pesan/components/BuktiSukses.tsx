"use client";

import Link from "next/link";
import { BookingWithRelations } from "@/types/booking";
import { CheckCircle2 } from "lucide-react";

interface BuktiSuksesProps {
  booking: BookingWithRelations;
  lapanganName?: string;
  startHour: string;
  endHour: string;
  durationHours: number;
  paymentType: string;
  totalAmount: number;
  onReset: () => void;
}

export default function BuktiSukses({
  booking,
  lapanganName,
  startHour,
  endHour,
  durationHours,
  paymentType,
  totalAmount,
  onReset,
}: BuktiSuksesProps) {
  return (
    <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center space-y-5">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900">Reservasi Berhasil Dibuat!</h2>
        <p className="text-xs text-slate-500 mt-1">
          Pesanan Anda telah dicatat dalam sistem dan siap digunakan.
        </p>
      </div>

      {/* Ringkasan Bukti Booking */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-left space-y-2.5 text-xs">
        <div className="flex justify-between border-b border-slate-200 pb-2">
          <span className="text-slate-500">ID Reservasi</span>
          <span className="font-mono font-medium text-slate-800">
            #{booking.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Lapangan</span>
          <span className="font-semibold text-slate-900">
            {booking.lapangan?.name || lapanganName || "Lapangan"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Tanggal</span>
          <span className="text-slate-800 font-medium">
            {new Date(booking.startTime).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Jam Bermain</span>
          <span className="text-slate-800 font-medium">
            {startHour} - {endHour} ({durationHours} Jam)
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Metode Bayar</span>
          <span className="font-medium text-slate-800">
            {paymentType === "QRIS" ? "QRIS (Lunas)" : "Transfer Bank (Pending)"}
          </span>
        </div>

        <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
          <span className="font-semibold text-slate-700">Total Biaya</span>
          <span className="font-bold text-blue-600">
            Rp {totalAmount.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Navigasi Setelah Sukses */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onReset}
          className="w-full py-2.5 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Pesan Lagi
        </button>
        <Link
          href="/user"
          className="w-full py-2.5 px-3 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors text-center flex items-center justify-center"
        >
          Lihat Dashboard
        </Link>
      </div>
    </div>
  );
}

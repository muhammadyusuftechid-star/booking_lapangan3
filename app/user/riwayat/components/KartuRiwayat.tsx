"use client";

import { BookingWithRelations } from "@/types/booking";
import {
  Building2,
  CalendarDays,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface KartuRiwayatProps {
  item: BookingWithRelations;
}

export default function KartuRiwayat({ item }: KartuRiwayatProps) {
  const start = new Date(item.startTime);
  const end = new Date(item.endTime);

  const dateFormatted = start.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const timeFormatted = `${String(start.getHours()).padStart(2, "0")}:${String(
    start.getMinutes()
  ).padStart(2, "0")} - ${String(end.getHours()).padStart(2, "0")}:${String(
    end.getMinutes()
  ).padStart(2, "0")} WIB`;

  const payment = item.payments?.[0];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-slate-300 transition-colors space-y-3">
      {/* Baris Atas: Info Lapangan & Badge Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">
              {item.lapangan?.name || "Lapangan"}
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {item.lapangan?.location || "Area Olahraga"}
            </p>
          </div>
        </div>

        {item.status === "CONFIRMED" ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Disetujui
          </span>
        ) : item.status === "PENDING" ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Menunggu
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" />
            Dibatalkan
          </span>
        )}
      </div>

      {/* Baris Detail: Tanggal, Jam, dan Pembayaran */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg text-[11px]">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 block">Jadwal Main:</span>
          <p className="font-semibold text-slate-700 flex items-center gap-1">
            <CalendarDays className="w-3 h-3 text-slate-400" />
            <span>{dateFormatted}</span>
          </p>
          <p className="text-[10px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{timeFormatted}</span>
          </p>
        </div>

        <div className="space-y-0.5 text-right">
          <span className="text-[10px] text-slate-400 block">Total Biaya:</span>
          <p className="font-bold text-blue-600 text-xs">
            Rp {(payment?.amount || item.lapangan?.price || 0).toLocaleString("id-ID")}
          </p>
          <p className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
            <CreditCard className="w-3 h-3 text-slate-400" />
            <span>
              {payment?.paymentType || "QRIS"} ({payment?.status || item.status})
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

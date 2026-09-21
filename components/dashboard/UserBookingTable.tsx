import { BookingWithRelations } from "@/types/booking";
import { CheckCircle2, Clock3, Inbox } from "lucide-react";

interface UserBookingTableProps {
  bookings: BookingWithRelations[];
}

export default function UserBookingTable({ bookings }: UserBookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-10 text-center text-slate-400 space-y-2">
        <Inbox className="w-8 h-8 mx-auto text-slate-300" />
        <p className="text-xs font-medium text-slate-600">Belum ada riwayat reservasi.</p>
        <p className="text-[11px] text-slate-400">
          Pilih salah satu arena di atas untuk mulai memesan jadwal main Anda!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider border-b border-slate-100 font-semibold">
            <tr>
              <th className="px-5 py-3.5">ID Reservasi</th>
              <th className="px-5 py-3.5">Arena Olahraga</th>
              <th className="px-5 py-3.5">Waktu Main</th>
              <th className="px-5 py-3.5">Total Bayar</th>
              <th className="px-5 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {bookings.map((item) => {
              const start = new Date(item.startTime);
              const end = new Date(item.endTime);
              const dateFormatted = start.toLocaleDateString("id-ID", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const timeFormatted = `${String(start.getHours()).padStart(2, "0")}:00 - ${String(
                end.getHours()
              ).padStart(2, "0")}:00`;
              const payment = item.payments?.[0];

              return (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                    #{item.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-slate-900">{item.lapangan?.name || "Lapangan"}</p>
                    <span className="text-[11px] text-slate-400">{item.lapangan?.location}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-slate-800 block">{dateFormatted}</span>
                    <span className="text-[11px] text-slate-500">{timeFormatted}</span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    Rp {(payment?.amount || item.lapangan?.price || 0).toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-3.5">
                    {item.status === "CONFIRMED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Dikonfirmasi
                      </span>
                    ) : item.status === "CANCELLED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                        Dibatalkan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                        <Clock3 className="w-3.5 h-3.5 text-amber-600" />
                        Menunggu Konfirmasi
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { BookingWithRelations } from "@/types/booking";
import { CheckCircle2, XCircle, Clock, Inbox } from "lucide-react";

interface AdminBookingTableProps {
  bookings: BookingWithRelations[];
  filterStatus: string;
  onFilterChange: (status: string) => void;
  onUpdateStatus: (bookingId: string, newStatus: "CONFIRMED" | "CANCELLED") => Promise<void>;
  actionLoadingId: string | null;
}

export default function AdminBookingTable({
  bookings,
  filterStatus,
  onFilterChange,
  onUpdateStatus,
  actionLoadingId,
}: AdminBookingTableProps) {
  const filtered = bookings.filter((b) => {
    if (filterStatus === "SEMUA") return true;
    return b.status === filterStatus;
  });

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Daftar Reservasi Pelanggan
          </h2>
          <p className="text-xs text-slate-500">
            Validasi pembayaran dan jadwalkan pemakaian lapangan
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          {["SEMUA", "PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === status
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-400 space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-medium text-slate-600">Tidak ada data reservasi.</p>
            <p className="text-[11px] text-slate-400">
              Pesanan dari member akan muncul di tabel ini secara realtime.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider border-b border-slate-100 font-semibold">
                <tr>
                  <th className="px-5 py-3.5">ID & Pemesan</th>
                  <th className="px-5 py-3.5">Arena & Waktu Main</th>
                  <th className="px-5 py-3.5">Metode Bayar</th>
                  <th className="px-5 py-3.5">Total Tagihan</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-center">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filtered.map((b) => {
                  const start = new Date(b.startTime);
                  const end = new Date(b.endTime);
                  const dateFormatted = start.toLocaleDateString("id-ID", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  });
                  const timeFormatted = `${String(start.getHours()).padStart(2, "0")}:00 - ${String(
                    end.getHours()
                  ).padStart(2, "0")}:00`;
                  const payment = b.payments?.[0];

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono font-bold text-slate-900 block">
                          #{b.id.slice(0, 8).toUpperCase()}
                        </span>
                        <p className="font-semibold text-slate-900">{b.customer?.name || "Member"}</p>
                        <span className="text-[10px] text-slate-400">{b.customer?.email}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-800">{b.lapangan?.name}</p>
                        <span className="text-[11px] text-slate-500 block">
                          {dateFormatted} • {timeFormatted}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-600">
                        {payment?.paymentType || "QRIS"}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        Rp {(payment?.amount || b.lapangan?.price || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-3.5">
                        {b.status === "CONFIRMED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Dikonfirmasi
                          </span>
                        )}
                        {b.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Menunggu Konfirmasi
                          </span>
                        )}
                        {b.status === "CANCELLED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Dibatalkan
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {b.status === "PENDING" ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              disabled={actionLoadingId === b.id}
                              onClick={() => onUpdateStatus(b.id, "CONFIRMED")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                            >
                              {actionLoadingId === b.id ? "..." : "Terima"}
                            </button>
                            <button
                              disabled={actionLoadingId === b.id}
                              onClick={() => onUpdateStatus(b.id, "CANCELLED")}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Selesai
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

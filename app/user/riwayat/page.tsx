"use client";

/**
 * =======================================================================
 * HALAMAN RIWAYAT PESANAN (app/user/riwayat/page.tsx)
 * =======================================================================
 * File ini sudah siap pakai dan terhubung dengan database MySQL.
 * Teman Anda dapat langsung memodifikasi, mempercantik, atau menempelkan
 * (copy-paste) kode custom-nya di dalam file ini.
 * =======================================================================
 */

import { useEffect, useState, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { getUserBookings } from "@/app/actions/booking";
import { BookingWithRelations } from "@/types/booking";
import {
  History,
  CalendarDays,
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Inbox,
  ArrowLeft,
  Search,
  Filter,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

export default function RiwayatPesananPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchUserHistory() {
      if (!session?.user?.email) return;
      try {
        setIsLoading(true);
        const res = await getUserBookings(session.user.email);
        if (res.success && res.data) {
          setBookings(res.data as BookingWithRelations[]);
        }
      } catch (err) {
        console.error("Gagal memuat riwayat pesanan:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isSessionLoading && session?.user?.email) {
      fetchUserHistory();
    }
  }, [session, isSessionLoading]);

  // Filter berdasarkan status dan pencarian nama lapangan
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = filterStatus === "ALL" || b.status === filterStatus;
      const matchQuery =
        searchQuery === "" ||
        (b.lapangan?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.lapangan?.location || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [bookings, filterStatus, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Header Halaman */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/user"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            title="Kembali ke Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-1.5 leading-tight">
              <History className="w-4 h-4 text-blue-600" />
              <span>Riwayat Pemesanan</span>
            </h1>
            <p className="text-[11px] text-slate-500">
              Daftar seluruh jadwal sewa lapangan yang pernah Anda pesan
            </p>
          </div>
        </div>

        <Link
          href="/user/pesan"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Pesan Baru</span>
        </Link>
      </div>

      {/* Filter & Bar Pencarian */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama arena atau lokasi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {[
            { id: "ALL", label: `Semua (${bookings.length})` },
            { id: "PENDING", label: `Menunggu (${bookings.filter((b) => b.status === "PENDING").length})` },
            { id: "CONFIRMED", label: `Disetujui (${bookings.filter((b) => b.status === "CONFIRMED").length})` },
            { id: "CANCELLED", label: `Dibatalkan (${bookings.filter((b) => b.status === "CANCELLED").length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Konten Daftar Riwayat */}
      {isLoading ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-400 shadow-xs">
          Memuat riwayat pemesanan Anda...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 space-y-2 shadow-xs">
          <Inbox className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs font-semibold text-slate-700">Tidak Ada Data Riwayat</p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            {searchQuery || filterStatus !== "ALL"
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
      ) : (
        <div className="space-y-2.5">
          {filteredBookings.map((item) => {
            const start = new Date(item.startTime);
            const end = new Date(item.endTime);
            const dateFormatted = start.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const timeFormatted = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")} - ${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")} WIB`;
            const payment = item.payments?.[0];

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-slate-300 transition-colors space-y-3"
              >
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
                      <span>{payment?.paymentType || "QRIS"} ({payment?.status || item.status})</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

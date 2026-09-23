"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "@/lib/auth-client";
import { getUserBookings } from "@/app/user/actions";
import { BookingWithRelations } from "@/types/booking";
import { History, CalendarDays, ArrowLeft } from "lucide-react";
import Link from "next/link";

import FilterStatus from "./components/FilterStatus";
import KartuRiwayat from "./components/KartuRiwayat";
import RiwayatKosong from "./components/RiwayatKosong";

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

  // Filter berdasarkan status dan pencarian nama/lokasi lapangan
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
      <FilterStatus
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        totalCount={bookings.length}
        pendingCount={bookings.filter((b) => b.status === "PENDING").length}
        confirmedCount={bookings.filter((b) => b.status === "CONFIRMED").length}
        cancelledCount={bookings.filter((b) => b.status === "CANCELLED").length}
      />

      {/* Konten Daftar Riwayat */}
      {isLoading ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-400 shadow-xs">
          Memuat riwayat pemesanan Anda...
        </div>
      ) : filteredBookings.length === 0 ? (
        <RiwayatKosong isFiltered={Boolean(searchQuery || filterStatus !== "ALL")} />
      ) : (
        <div className="space-y-2.5">
          {filteredBookings.map((item) => (
            <KartuRiwayat key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

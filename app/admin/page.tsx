import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { 
  Building2, 
  CalendarDays, 
  CircleDollarSign, 
  TrendingUp, 
  Users,
  Filter,
  CheckCircle2,
  Clock,
  Search,
  FileText,
  XCircle,
  CreditCard
} from "lucide-react";

import AksiBooking from "./components/AksiBooking";
import TombolCetak from "./components/TombolCetak";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatTimeRange = (start: Date, end: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())} WIB`;
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string; status?: string }> | { start?: string; end?: string; status?: string };
}) {
  const resolvedParams = await searchParams;
  const startDate = resolvedParams?.start || "";
  const endDate = resolvedParams?.end || "";
  const statusFilter = resolvedParams?.status || "ALL";

  const dateFilter: Record<string, unknown> = {};
  if (startDate && endDate) {
    dateFilter.createdAt = {
      gte: new Date(`${startDate}T00:00:00.000Z`),
      lte: new Date(`${endDate}T23:59:59.999Z`),
    };
  }

  const whereCondition: Record<string, unknown> = { ...dateFilter };
  if (statusFilter && statusFilter !== "ALL") {
    whereCondition.status = statusFilter;
  }

  const [
    totalLapangan,
    totalPengguna,
    bookings,
    allPendingCount,
  ] = await Promise.all([
    prisma.lapangan.count(),
    prisma.user.count(),
    prisma.booking.findMany({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true, email: true } },
        lapangan: { select: { name: true, price: true } },
        payments: { select: { amount: true, status: true, paymentType: true } },
      },
    }),
    prisma.booking.count({ where: { status: "PENDING" } }),
  ]);

  const totalBooking = bookings.length;
  const confirmedBooking = bookings.filter((b) => b.status === "CONFIRMED").length;
  const pendingInPeriod = bookings.filter((b) => b.status === "PENDING").length;
  const cancelledBooking = bookings.filter((b) => b.status === "CANCELLED").length;

  const totalPendapatan = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, booking) => {
      const paymentSum = booking.payments
        .filter((p) => !["failed", "cancelled", "expire", "expired"].includes(p.status.toLowerCase()))
        .reduce((pSum, pay) => pSum + Number(pay.amount), 0);
      return sum + paymentSum;
    }, 0);

  const isFiltered = !!(startDate || endDate || (statusFilter && statusFilter !== "ALL"));

  return (
    <div className="flex-1 min-h-screen flex flex-col">
      {/* Header Topbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 sm:px-8 backdrop-blur hidden lg:flex h-[76px] items-center justify-between print:hidden">
        <div>
          <p className="text-[11px] font-medium text-slate-400">Admin / Dashboard & Laporan</p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
            Pusat Kendali & Laporan Transaksi
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <TombolCetak />
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-semibold text-slate-600">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Sistem Siap
          </span>
        </div>
      </header>

      {/* Tampilan Header Khusus Cetak */}
      <div className="hidden print:block p-6 border-b border-slate-300">
        <h1 className="text-xl font-bold text-slate-900">Laporan Resmi Transaksi Booking Lapangan</h1>
        <p className="text-xs text-slate-500 mt-1">
          {startDate && endDate 
            ? `Periode Transaksi: ${startDate} s.d ${endDate}` 
            : `Rekap Seluruh Waktu (Dicetak pada: ${new Date().toLocaleDateString("id-ID")})`}
        </p>
      </div>

      <main className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto space-y-6 flex-1 w-full">
        {/* Filter Periode & Status */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-xs p-5 print:hidden">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Filter Periode & Status Laporan</h3>
            </div>
            {allPendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{allPendingCount} Perlu Dikonfirmasi</span>
              </span>
            )}
          </div>

          <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Tanggal Mulai</label>
              <input 
                type="date" 
                name="start" 
                defaultValue={startDate}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50" 
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Tanggal Akhir</label>
              <input 
                type="date" 
                name="end" 
                defaultValue={endDate}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50" 
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Status Pesanan</label>
              <select
                name="status"
                defaultValue={statusFilter}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50"
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING">Menunggu (Pending)</option>
                <option value="CONFIRMED">Disetujui (Confirmed)</option>
                <option value="CANCELLED">Dibatalkan (Cancelled)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button 
                type="submit" 
                className="flex-1 h-10 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl text-xs font-semibold transition shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Search className="h-4 w-4" /> Terapkan Filter
              </button>
              {isFiltered && (
                <a 
                  href="/admin" 
                  className="h-10 px-3.5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition"
                  title="Reset Filter"
                >
                  Reset
                </a>
              )}
            </div>
          </form>
        </section>

        {/* Kartu Metrik Ringkasan Bisnis */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* 1. Total Pendapatan Bersih */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Total Omzet Bersih</p>
                <p className="mt-2 text-xl font-black text-blue-700">{formatRupiah(totalPendapatan)}</p>
                <span className="text-[9px] text-blue-500 mt-0.5 block">
                  {isFiltered ? "Berdasarkan filter periode" : "Akumulasi pesanan lunas"}
                </span>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                <CircleDollarSign className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* 2. Total Booking */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Transaksi</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{totalBooking}</p>
                <span className="text-[9px] text-slate-400 mt-0.5 block">Aktivitas pemesanan</span>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* 3. Menunggu Konfirmasi */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Perlu Tindakan</p>
                <p className="mt-2 text-2xl font-bold text-amber-600">{pendingInPeriod}</p>
                <span className="text-[9px] text-amber-600 mt-0.5 block">Menunggu verifikasi</span>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* 4. Selesai / Disetujui */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Disetujui / Selesai</p>
                <p className="mt-2 text-2xl font-bold text-emerald-600">{confirmedBooking}</p>
                <span className="text-[9px] text-emerald-600 mt-0.5 block">Booking berhasil</span>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* 5. Dibatalkan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Dibatalkan</p>
                <p className="mt-2 text-2xl font-bold text-red-600">{cancelledBooking}</p>
                <span className="text-[9px] text-red-500 mt-0.5 block">Ditolak / Batal</span>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <XCircle className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        {/* Shortcut Navigasi Cepat ke Lapangan & Pengguna */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
          <Link
            href="/admin/lapangan"
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-xs transition group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Kelola Fasilitas Lapangan ({totalLapangan})
                </p>
                <p className="text-[10px] text-slate-400">Atur harga, foto, lokasi, dan jadwal lapangan</p>
              </div>
            </div>
            <span className="text-xs text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
              Buka &rarr;
            </span>
          </Link>

          <Link
            href="/admin/pengguna"
            className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 shadow-xs transition group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Manajemen Data Pengguna ({totalPengguna})
                </p>
                <p className="text-[10px] text-slate-400">Kelola akun member dan ubah hak akses Admin</p>
              </div>
            </div>
            <span className="text-xs text-purple-600 font-semibold group-hover:translate-x-1 transition-transform">
              Buka &rarr;
            </span>
          </Link>
        </section>

        {/* Tabel Rekap Transaksi & Aksi Langsung */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Rekap Transaksi & Aksi Pemesanan ({bookings.length})
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Setujui pembayaran transfer atau tinjau pesanan yang masuk secara langsung
                </p>
              </div>
            </div>
            <div className="print:hidden">
              <TombolCetak />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">#</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Waktu Order</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Pelanggan</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Arena & Jadwal</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Metode Bayar</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Status</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400 text-right">Nominal</th>
                  <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400 text-right print:hidden">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      Tidak ada data pemesanan yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b, index) => {
                    const pay = b.payments?.[0];
                    const nominal = b.payments && b.payments.length > 0
                      ? b.payments.reduce((sum, p) => sum + Number(p.amount), 0)
                      : b.lapangan?.price || 0;

                    return (
                      <tr key={b.id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-4 text-slate-400 font-medium">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          <p className="font-semibold text-slate-800 text-[11px]">
                            {new Date(b.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Pukul {new Date(b.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900 text-[11px] leading-snug">
                            {b.customer?.name || "Pelanggan"}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {b.customer?.email}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800 text-[11px]">
                            {b.lapangan?.name}
                          </p>
                          <p className="text-[10px] text-blue-600 font-medium">
                            {formatTimeRange(new Date(b.startTime), new Date(b.endTime))}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            <CreditCard className="w-3 h-3 text-slate-400" />
                            {pay?.paymentType || "QRIS"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            b.status === "CONFIRMED"
                              ? "bg-emerald-100 text-emerald-700"
                              : b.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {b.status === "CONFIRMED" ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : b.status === "CANCELLED" ? (
                              <XCircle className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            <span>{b.status}</span>
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right font-bold text-slate-900 text-[11px]">
                          {formatRupiah(nominal)}
                        </td>

                        <td className="px-5 py-4 text-right print:hidden">
                          <AksiBooking bookingId={b.id} currentStatus={b.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
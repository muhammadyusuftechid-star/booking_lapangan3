import { prisma } from "@/lib/prisma";
import { 
  CalendarDays, 
  CircleDollarSign, 
  Filter, 
  TrendingUp,
  FileText,
  Search,
  CheckCircle2
} from "lucide-react";

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

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: { start?: string; end?: string };
}) {
  const startDate = searchParams?.start || "";
  const endDate = searchParams?.end || "";

  const dateFilter: any = {};
  if (startDate && endDate) {
    dateFilter.createdAt = {
      gte: new Date(`${startDate}T00:00:00.000Z`),
      lte: new Date(`${endDate}T23:59:59.999Z`),
    };
  }

  const bookings = await prisma.booking.findMany({
    where: dateFilter,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      lapangan: { select: { name: true, price: true } },
      payment: { select: { amount: true, status: true } },
    },
  });

  const totalBooking = bookings.length;
  const confirmedBooking = bookings.filter((b) => b.status === "CONFIRMED").length;
  const cancelledBooking = bookings.filter((b) => b.status === "CANCELLED").length;

  const totalPendapatan = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, booking) => {
      const paymentSum = booking.payment
        .filter((p) => !["failed", "cancelled", "expire"].includes(p.status.toLowerCase()))
        .reduce((pSum, pay) => pSum + Number(pay.amount), 0);
      return sum + paymentSum;
    }, 0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Topbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-8 backdrop-blur hidden lg:flex h-[76px] items-center justify-between">
        <div>
          <p className="text-[11px] font-medium text-slate-400">Admin / Laporan</p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Laporan & Rekap Transaksi</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-600">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Database MySQL
          </span>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto space-y-6 flex-1 w-full">
        
        {/* Filter Periode */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden p-5">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Filter Berdasarkan Periode</h3>
          </div>
          
          <form method="GET" className="flex flex-col sm:flex-row items-end gap-4">
            <div className="w-full sm:w-auto flex-1">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Tanggal Mulai</label>
              <input 
                type="date" 
                name="start" 
                defaultValue={startDate}
                required
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50" 
              />
            </div>
            <div className="w-full sm:w-auto flex-1">
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Tanggal Akhir</label>
              <input 
                type="date" 
                name="end" 
                defaultValue={endDate}
                required
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50" 
              />
            </div>
            <div className="w-full sm:w-auto flex flex-row gap-2">
              <button type="submit" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[11px] font-semibold transition shadow-md shadow-blue-600/20 cursor-pointer">
                <Search className="h-4 w-4" /> Tampilkan
              </button>
              {(startDate || endDate) && (
                <a href="/admin/laporan" className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-[11px] font-semibold transition">
                  Reset
                </a>
              )}
            </div>
          </form>
        </section>

        {/* Ringkasan Statistik */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <p className="text-[11px] font-medium text-slate-500 mb-2">Total Pemesanan</p>
            <p className="text-2xl font-bold text-slate-900">{totalBooking}</p>
          </div>
          
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <p className="text-[11px] font-medium text-slate-500 mb-2">Pemesanan Selesai</p>
            <p className="text-2xl font-bold text-emerald-600">{confirmedBooking}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <p className="text-[11px] font-medium text-slate-500 mb-2">Pemesanan Dibatalkan</p>
            <p className="text-2xl font-bold text-red-600">{cancelledBooking}</p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs">
            <p className="text-[11px] font-semibold text-blue-600 mb-2">Total Pendapatan Bersih</p>
            <p className="text-xl font-bold text-blue-700">{formatRupiah(totalPendapatan)}</p>
          </div>
        </section>

        {/* Tabel Rekap Data */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 p-5 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Rekap Data Pemesanan</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Tanggal & Waktu</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Pelanggan</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Lapangan</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Status</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      Tidak ada data pemesanan pada periode ini.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {formatDate(new Date(b.createdAt))}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-[11px]">{b.customer?.name || "Tanpa Nama"}</p>
                        <p className="text-[10px] text-slate-400">{b.customer?.email}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {b.lapangan?.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                          b.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800">
                        {b.payment.length > 0
                          ? formatRupiah(b.payment.reduce((sum, p) => sum + Number(p.amount), 0))
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { 
  Building2, 
  CalendarDays, 
  CircleDollarSign, 
  TrendingUp,
  ArrowRight
} from "lucide-react";

import AksiBooking from "./components/AksiBooking";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default async function AdminDashboardPage() {
  const totalLapangan = await prisma.lapangan.count();
  const totalBooking = await prisma.booking.count();
  
  const pendingBooking = await prisma.booking.count({
    where: { status: "PENDING" }
  });

  const payments = await prisma.payment.findMany({
    where: {
      status: { notIn: ["failed", "cancelled", "expire", "expired"] }
    }
  });
  
  const pendapatan = payments.reduce((sum, pay) => sum + Number(pay.amount), 0);

  const recentBookings = await prisma.booking.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      lapangan: { select: { name: true } }
    }
  });

  return (
    <div className="flex-1">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-8 backdrop-blur hidden lg:flex h-[76px] items-center justify-between">
        <div>
          <p className="text-[11px] font-medium text-slate-400">Admin / Dashboard</p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Ringkasan Sistem</h1>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Lapangan</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{totalLapangan}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Booking</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{totalBooking}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Menunggu Konfirmasi</p>
                <p className="mt-2 text-2xl font-bold text-amber-600">{pendingBooking}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Pendapatan</p>
                <p className="mt-2 text-xl font-bold text-emerald-600">{formatRupiah(pendapatan)}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CircleDollarSign className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-5 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Booking Terbaru</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">5 aktivitas pemesanan terakhir</p>
            </div>
            <Link href="/admin/laporan" className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 hover:underline">
              Lihat Semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-slate-500">Pelanggan</th>
                  <th className="px-6 py-3 font-semibold text-slate-500">Lapangan</th>
                  <th className="px-6 py-3 font-semibold text-slate-500">Status</th>
                  <th className="px-6 py-3 font-semibold text-slate-500 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400">Belum ada booking.</td>
                  </tr>
                ) : (
                  recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{b.customer?.name || "Tanpa Nama"}</p>
                        <p className="text-[10px] text-slate-500">{b.customer?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{b.lapangan.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' :
                          b.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <AksiBooking bookingId={b.id} currentStatus={b.status} />
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
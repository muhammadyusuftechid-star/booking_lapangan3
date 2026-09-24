import { prisma } from "@/lib/prisma";
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  Search, 
  CheckCircle2, 
  Mail,
  Calendar,
  Layers
} from "lucide-react";
import TombolRole from "./components/TombolRole";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(date);
};

export default async function DataPenggunaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }> | { q?: string };
}) {
  const resolvedParams = await searchParams;
  const searchQuery = (resolvedParams?.q || "").trim().toLowerCase();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      accounts: {
        select: { providerId: true },
      },
    },
  });

  // Ambil rekap total pemesanan per email
  const customers = await prisma.customer.findMany({
    select: {
      email: true,
      _count: {
        select: { bookings: true },
      },
    },
  });

  const bookingCountMap = new Map<string, number>();
  customers.forEach((c) => {
    bookingCountMap.set(c.email.toLowerCase(), c._count.bookings);
  });

  // Filter pencarian
  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    return (
      u.name.toLowerCase().includes(searchQuery) ||
      u.email.toLowerCase().includes(searchQuery)
    );
  });

  const totalPengguna = users.length;
  const totalAdmin = users.filter((u) => u.role === "ADMIN").length;
  const totalUserBiasa = users.filter((u) => u.role === "USER").length;
  const totalGoogleUser = users.filter((u) =>
    u.accounts.some((a) => a.providerId === "google")
  ).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Topbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-8 backdrop-blur hidden lg:flex h-[76px] items-center justify-between">
        <div>
          <p className="text-[11px] font-medium text-slate-400">Admin / Pengguna</p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
            Manajemen Data Pengguna
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-600">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Total {totalPengguna} Akun
          </span>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto space-y-6 flex-1 w-full">
        {/* Kartu Statistik Pengguna */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Pengguna</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{totalPengguna}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Administrator</p>
                <p className="mt-2 text-2xl font-bold text-indigo-600">{totalAdmin}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Member Pelanggan</p>
                <p className="mt-2 text-2xl font-bold text-emerald-600">{totalUserBiasa}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500">Login via Google</p>
                <p className="mt-2 text-2xl font-bold text-amber-600">{totalGoogleUser}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Mail className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        {/* Pencarian & Filter */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-xs p-5">
          <form method="GET" className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Cari berdasarkan nama atau alamat email pengguna..."
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="flex-1 sm:flex-none h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                Cari Pengguna
              </button>
              {searchQuery && (
                <a
                  href="/admin/pengguna"
                  className="h-10 px-4 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition"
                >
                  Reset
                </a>
              )}
            </div>
          </form>
        </section>

        {/* Tabel Data Pengguna */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 p-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-900">
                Daftar Seluruh Pengguna Terdaftar ({filteredUsers.length})
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">#</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Pengguna</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Email</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Metode Masuk</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Hak Akses (Role)</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Terdaftar Sejak</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Total Booking</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      Tidak ditemukan pengguna yang sesuai dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => {
                    const isGoogle = user.accounts.some((a) => a.providerId === "google");
                    const bookingCount = bookingCountMap.get(user.email.toLowerCase()) || 0;
                    const initial = (user.name || "U").charAt(0).toUpperCase();

                    return (
                      <tr key={user.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 text-slate-400 font-medium">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt={user.name}
                                  className="w-full h-full rounded-xl object-cover"
                                />
                              ) : (
                                initial
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-[11px] leading-snug">
                                {user.name}
                              </p>
                              {user.emailVerified && (
                                <span className="text-[9px] text-emerald-600 font-medium flex items-center gap-0.5">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Terverifikasi
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold ${
                            isGoogle
                              ? "bg-red-50 text-red-700 border border-red-100"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {isGoogle ? "Google Account" : "Email & Password"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              user.role === "ADMIN"
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {user.role === "ADMIN" ? (
                              <>
                                <ShieldCheck className="w-3 h-3" />
                                <span>ADMIN</span>
                              </>
                            ) : (
                              <span>USER</span>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {formatDate(new Date(user.createdAt))}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {bookingCount} Pesanan
                        </td>
                        <td className="px-6 py-4 text-right">
                          <TombolRole
                            userId={user.id}
                            currentRole={user.role as "USER" | "ADMIN"}
                            userEmail={user.email}
                          />
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

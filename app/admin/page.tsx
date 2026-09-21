"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  getAllBookingsForAdmin,
  updateBookingStatusAction,
  getLapangans,
  createLapanganAction,
  deleteLapanganAction,
  setUserRoleAction,
  getUserRoleAction,
} from "@/app/actions/booking";
import {
  ShieldAlert,
  Building2,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  LogOut,
  Loader2,
  Plus,
  Trash2,
  Banknote,
  RefreshCw,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();

  const [bookings, setBookings] = useState<any[]>([]);
  const [lapangans, setLapangans] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Tambah Lapangan
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldLocation, setNewFieldLocation] = useState("");
  const [newFieldPrice, setNewFieldPrice] = useState<number>(100000);
  const [newFieldDesc, setNewFieldDesc] = useState("");
  const [newFieldPic, setNewFieldPic] = useState("");
  const [isSubmittingField, setIsSubmittingField] = useState(false);

  const [userRole, setUserRole] = useState<string>("USER");
  const [roleChecked, setRoleChecked] = useState(false);

  const loadAdminData = useCallback(async () => {
    try {
      setLoadingData(true);
      const [bookingsRes, lapangansRes] = await Promise.all([
        getAllBookingsForAdmin(),
        getLapangans(),
      ]);

      if (bookingsRes.success && bookingsRes.data) {
        setBookings(bookingsRes.data);
      }
      if (lapangansRes.success && lapangansRes.data) {
        setLapangans(lapangansRes.data);
      }
    } catch (err) {
      console.error("Gagal memuat data admin:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    async function verifyAdminRole() {
      if (!isSessionLoading && !session) {
        router.replace("/");
        return;
      }

      if (session?.user?.email) {
        // Cek role langsung ke MySQL database
        const res = await getUserRoleAction(session.user.email);
        const resolvedRole = res.success
          ? String(res.role).toUpperCase()
          : String((session.user as { role?: string })?.role || "USER").toUpperCase();
        setUserRole(resolvedRole);
        setRoleChecked(true);

        if (resolvedRole === "ADMIN") {
          loadAdminData();
        }
      } else {
        setRoleChecked(true);
      }
    }

    verifyAdminRole();
  }, [isSessionLoading, session, router, loadAdminData]);

  const handleUpdateStatus = async (bookingId: string, status: "CONFIRMED" | "CANCELLED") => {
    try {
      setActionLoading(bookingId);
      const res = await updateBookingStatusAction(bookingId, status);
      if (res.success) {
        setMessage({
          type: "success",
          text: `Status reservasi berhasil diubah menjadi ${status}`,
        });
        await loadAdminData();
      } else {
        setMessage({ type: "error", text: res.error || "Gagal mengubah status" });
      }
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan sistem." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteLapangan = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus lapangan "${name}"? Semua data booking terkait juga akan dihapus.`)) {
      return;
    }

    try {
      setActionLoading(id);
      const res = await deleteLapanganAction(id);
      if (res.success) {
        setMessage({ type: "success", text: `Lapangan "${name}" berhasil dihapus.` });
        await loadAdminData();
      } else {
        setMessage({ type: "error", text: res.error || "Gagal menghapus lapangan" });
      }
    } catch {
      setMessage({ type: "error", text: "Gagal memproses penghapusan." });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateLapangan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldName.trim() || !newFieldLocation.trim()) {
      alert("Nama dan lokasi lapangan wajib diisi.");
      return;
    }

    try {
      setIsSubmittingField(true);
      const res = await createLapanganAction({
        name: newFieldName.trim(),
        location: newFieldLocation.trim(),
        price: Number(newFieldPrice),
        description: newFieldDesc.trim(),
        picture_url: newFieldPic.trim(),
      });

      if (res.success) {
        setMessage({ type: "success", text: `Lapangan baru "${newFieldName}" berhasil ditambahkan!` });
        setShowAddModal(false);
        setNewFieldName("");
        setNewFieldLocation("");
        setNewFieldPrice(100000);
        setNewFieldDesc("");
        setNewFieldPic("");
        await loadAdminData();
      } else {
        alert(res.error || "Gagal menambah lapangan.");
      }
    } catch {
      alert("Terjadi kesalahan sistem saat menambah lapangan.");
    } finally {
      setIsSubmittingField(false);
    }
  };

  const handlePromoteToAdmin = async () => {
    if (!session?.user?.email) return;
    try {
      setActionLoading("promote");
      const res = await setUserRoleAction(session.user.email, "ADMIN");
      if (res.success) {
        alert("Akun Anda berhasil dijadikan ADMIN! Halaman akan dimuat ulang.");
        window.location.reload();
      } else {
        alert(res.error || "Gagal mengubah role");
      }
    } catch {
      alert("Terjadi kesalahan sistem");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  if (isSessionLoading || !roleChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
          <p className="text-xs text-slate-400">Memeriksa hak akses administrator...</p>
        </div>
      </div>
    );
  }

  // Jika akun bukan ADMIN
  if (session && userRole !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-base font-bold text-slate-900">Akses Terbatas: Hanya untuk Admin</h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Akun Anda (<span className="font-semibold text-slate-700">{session.user.email}</span>) saat ini terdaftar dengan role{" "}
              <span className="font-bold text-blue-600 uppercase">USER</span>. Halaman ini hanya dapat diakses oleh akun Administrator.
            </p>
          </div>

          {/* Tombol Testing Helper */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left space-y-2">
            <span className="text-[11px] font-bold text-slate-700 block">Butuh Akses untuk Pengujian?</span>
            <p className="text-[10px] text-slate-500">
              Klik tombol di bawah untuk mengubah role akun Anda menjadi <strong className="text-slate-800">ADMIN</strong> secara instan di database.
            </p>
            <button
              type="button"
              onClick={handlePromoteToAdmin}
              disabled={actionLoading === "promote"}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              {actionLoading === "promote" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>Jadikan Akun Saya ADMIN (Mode Tes)</span>
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <Link
              href="/user"
              className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <span>Ke Halaman Member</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Hitung ringkasan
  const totalRevenue = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + (b.payments?.[0]?.amount || b.lapangan?.price || 0), 0);
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Navbar Admin */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Panel Administrator</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{session?.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-lg border border-red-900/40 hover:bg-red-950/40 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        {/* Notifikasi Banner */}
        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center justify-between border ${
              message.type === "success"
                ? "bg-emerald-950/50 border-emerald-800 text-emerald-300"
                : "bg-red-950/50 border-red-800 text-red-300"
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* 4 Kartu Statistik */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-800/80 border border-slate-700/70 p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Total Lapangan</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">{lapangans.length}</h3>
            <span className="text-[10px] text-slate-400">Arena terdaftar</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/70 p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Menunggu Verifikasi</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{pendingBookings}</h3>
            <span className="text-[10px] text-slate-400">Perlu tindakan</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/70 p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Reservasi Disetujui</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{confirmedBookings}</h3>
            <span className="text-[10px] text-slate-400">Telah dikonfirmasi</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/70 p-4 rounded-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Total Estimasi Kas</span>
              <Banknote className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </h3>
            <span className="text-[10px] text-slate-400">Dari booking terkonfirmasi</span>
          </div>
        </section>

        {/* Bagian 1: Manajemen Reservasi Pelanggan */}
        <section className="bg-slate-800/60 border border-slate-700/70 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-400" />
              <h2 className="font-bold text-sm text-white">Daftar Reservasi Lapangan</h2>
              <span className="text-xs text-slate-400">({bookings.length})</span>
            </div>
            <button
              onClick={loadAdminData}
              disabled={loadingData}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin text-blue-400" : ""}`} />
              <span>Segarkan</span>
            </button>
          </div>

          {loadingData ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400 mx-auto mb-2" />
              Memuat data reservasi...
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              Belum ada data reservasi yang dibuat pelanggan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/60 text-slate-400 text-[11px] uppercase border-b border-slate-700/70">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Pelanggan</th>
                    <th className="py-3 px-4">Arena</th>
                    <th className="py-3 px-4">Jadwal Main</th>
                    <th className="py-3 px-4">Metode Bayar</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {bookings.map((b) => {
                    const start = new Date(b.startTime);
                    const end = new Date(b.endTime);
                    const payment = b.payments?.[0];

                    return (
                      <tr key={b.id} className="hover:bg-slate-700/20 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          #{b.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">
                            {b.customer?.name || "Pelanggan"}
                          </div>
                          <div className="text-[10px] text-slate-400">{b.customer?.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-200">{b.lapangan?.name}</span>
                          <span className="block text-[10px] text-slate-400">
                            {b.lapangan?.location}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            {start.toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-[10px] text-blue-400 font-semibold">
                            {String(start.getHours()).padStart(2, "0")}:00 -{" "}
                            {String(end.getHours()).padStart(2, "0")}:00 WIB
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-200">
                            {payment?.paymentType || "QRIS"}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            Rp {(payment?.amount || b.lapangan?.price || 0).toLocaleString("id-ID")}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {b.status === "CONFIRMED" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              Disetujui
                            </span>
                          ) : b.status === "CANCELLED" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                              <XCircle className="w-3 h-3" />
                              Dibatalkan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.status !== "CONFIRMED" && (
                              <button
                                type="button"
                                disabled={actionLoading === b.id}
                                onClick={() => handleUpdateStatus(b.id, "CONFIRMED")}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Setujui
                              </button>
                            )}
                            {b.status !== "CANCELLED" && (
                              <button
                                type="button"
                                disabled={actionLoading === b.id}
                                onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                                className="px-2.5 py-1 rounded bg-red-900/60 hover:bg-red-800 text-red-200 font-medium text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                              >
                                Batalkan
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Bagian 2: Manajemen Data Lapangan */}
        <section className="bg-slate-800/60 border border-slate-700/70 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <h2 className="font-bold text-sm text-white">Master Data Lapangan</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Lapangan</span>
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lapangans.map((f) => (
              <div
                key={f.id}
                className="bg-slate-900 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-xs text-white">{f.name}</h3>
                    <button
                      type="button"
                      disabled={actionLoading === f.id}
                      onClick={() => handleDeleteLapangan(f.id, f.name)}
                      className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      title="Hapus lapangan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{f.location}</p>
                  {f.description && (
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">
                      {f.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">Tarif / Jam</span>
                  <span className="font-bold text-emerald-400">
                    Rp {f.price.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal Tambah Lapangan Sederhana */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Tambah Lapangan Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLapangan} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Nama Lapangan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Arena Futsal Bintang 1"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Lokasi / Alamat</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gedung A, Lantai 1"
                  value={newFieldLocation}
                  onChange={(e) => setNewFieldLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Tarif Sewa (Rp / Jam)</label>
                <input
                  type="number"
                  required
                  min={10000}
                  step={5000}
                  value={newFieldPrice}
                  onChange={(e) => setNewFieldPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Fasilitas lapangan, rumput sintetis, penerangan..."
                  value={newFieldDesc}
                  onChange={(e) => setNewFieldDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">URL Foto (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newFieldPic}
                  onChange={(e) => setNewFieldPic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingField}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingField ? "Menyimpan..." : "Simpan Lapangan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

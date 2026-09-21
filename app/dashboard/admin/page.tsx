"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import LogoutButton from "@/components/LogoutButton";
import AdminBookingTable from "@/components/dashboard/AdminBookingTable";
import AdminFieldTable from "@/components/dashboard/AdminFieldTable";
import AddFieldModal from "@/components/dashboard/AddFieldModal";
import {
  getAllBookingsAdmin,
  updateBookingStatusAction,
  getLapangans,
  createLapanganAction,
  deleteLapanganAction,
  deleteAllLapangansAction,
} from "@/app/actions/booking";
import { Lapangan, BookingWithRelations } from "@/types/booking";
import {
  ShieldCheck,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();

  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [fields, setFields] = useState<Lapangan[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("SEMUA");
  const [activeTab, setActiveTab] = useState<"bookings" | "fields">("bookings");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingField, setIsSubmittingField] = useState(false);

  const fetchAdminData = async () => {
    try {
      setIsLoadingData(true);
      const [bookingsRes, fieldsRes] = await Promise.all([
        getAllBookingsAdmin(),
        getLapangans(),
      ]);

      if (bookingsRes.success && bookingsRes.data) {
        setBookings(bookingsRes.data as BookingWithRelations[]);
      }
      if (fieldsRes.success && fieldsRes.data) {
        setFields(fieldsRes.data as Lapangan[]);
      }
    } catch (error) {
      console.error("Gagal mengambil data admin:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.replace("/");
    } else if (session) {
      fetchAdminData();
    }
  }, [isSessionLoading, session, router]);

  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: "CONFIRMED" | "CANCELLED"
  ) => {
    try {
      setActionLoadingId(bookingId);
      const res = await updateBookingStatusAction(bookingId, newStatus);
      if (res.success) {
        setToastMsg(
          newStatus === "CONFIRMED"
            ? "Reservasi berhasil diterima!"
            : "Reservasi telah dibatalkan."
        );
        setTimeout(() => setToastMsg(null), 3000);
        await fetchAdminData();
      }
    } catch (err) {
      console.error("Gagal update status:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateField = async (formData: {
    name: string;
    location: string;
    price: number;
    description: string;
    picture_url: string;
  }) => {
    try {
      setIsSubmittingField(true);
      const res = await createLapanganAction(formData);

      if (res.success) {
        setIsAddModalOpen(false);
        setToastMsg("Lapangan baru berhasil ditambahkan!");
        setTimeout(() => setToastMsg(null), 3000);
        await fetchAdminData();
      }
    } catch (err) {
      console.error("Gagal menambah lapangan:", err);
    } finally {
      setIsSubmittingField(false);
    }
  };

  const handleDeleteField = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus lapangan "${name}"?`)) return;

    try {
      setActionLoadingId(id);
      const res = await deleteLapanganAction(id);
      if (res.success) {
        setToastMsg(`Lapangan "${name}" berhasil dihapus!`);
        setTimeout(() => setToastMsg(null), 3000);
        await fetchAdminData();
      }
    } catch (err) {
      console.error("Gagal menghapus lapangan:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResetAllData = async () => {
    if (
      !confirm(
        "Peringatan: Tindakan ini akan mengosongkan seluruh daftar lapangan dan riwayat reservasi. Lanjutkan?"
      )
    ) {
      return;
    }

    try {
      setIsLoadingData(true);
      await deleteAllLapangansAction();
      setToastMsg("Semua data berhasil di-reset!");
      setTimeout(() => setToastMsg(null), 3000);
      await fetchAdminData();
    } catch (err) {
      console.error("Gagal reset data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-xs font-semibold text-slate-500">
            Memuat Panel Pengelola...
          </p>
        </div>
      </div>
    );
  }

  const totalRevenue = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce(
      (acc, curr) =>
        acc + (curr.payments?.[0]?.amount || curr.lapangan?.price || 0),
      0
    );

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-xs font-medium">{toastMsg}</p>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">
                Arena<span className="text-emerald-600">Admin</span>
              </span>
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-emerald-300 font-bold tracking-wider uppercase">
                Panel Manajemen Operasional
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Portal Member</span>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Title */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
              Pusat Kendali Operasional
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              Dashboard Pengelola Arena
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola ketersediaan arena olahraga, pantau pendapatan, dan validasi reservasi masuk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Tambah Lapangan Baru</span>
            </button>
            <button
              onClick={handleResetAllData}
              className="px-3.5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-all cursor-pointer"
            >
              Kosongkan Data
            </button>
          </div>
        </section>

        {/* Admin KPI Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs text-slate-400 font-medium">
              Total Pendapatan Diterima
            </p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Rp {totalRevenue.toLocaleString("id-ID")}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              Dari reservasi terkonfirmasi
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs text-slate-400 font-medium">
              Perlu Konfirmasi
            </p>
            <h3 className="text-xl font-bold text-amber-600 mt-1">
              {pendingCount} Reservasi
            </h3>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Menunggu respon admin
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs text-slate-400 font-medium">Total Arena Aktif</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {fields.length} Unit Lapangan
            </h3>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Siap disewa member
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs text-slate-400 font-medium">
              Total Transaksi Masuk
            </p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {bookings.length} Pesanan
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              Riwayat keseluruhan
            </span>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "bookings"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Manajemen Reservasi ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("fields")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "fields"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Kelola Master Lapangan ({fields.length})
          </button>
        </div>

        {/* Tab 1: Bookings Management */}
        {activeTab === "bookings" && (
          <AdminBookingTable
            bookings={bookings}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            onUpdateStatus={handleUpdateStatus}
            actionLoadingId={actionLoadingId}
          />
        )}

        {/* Tab 2: Fields Management */}
        {activeTab === "fields" && (
          <AdminFieldTable
            fields={fields}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onDeleteField={handleDeleteField}
            actionLoadingId={actionLoadingId}
          />
        )}
      </main>

      {/* Modal Tambah Lapangan Component */}
      <AddFieldModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateField}
        isSubmitting={isSubmittingField}
      />
    </div>
  );
}

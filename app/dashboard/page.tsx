"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import Link from "next/link";
import {
  getLapangans,
  getUserBookings,
  createBookingAction,
} from "@/app/actions/booking";
import { Lapangan, BookingWithRelations } from "@/types/booking";
import {
  CalendarDays,
  MapPin,
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  X,
  QrCode,
  Building2,
  AlertCircle,
  Inbox,
  LogOut,
} from "lucide-react";

// ==========================================
// 1. KOMPONEN TOMBOL LOGOUT (DALAM 1 FILE)
// ==========================================
function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/");
          },
        },
      });
    } catch (error) {
      console.error("Gagal logout:", error);
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
      title="Keluar dari akun"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
      ) : (
        <LogOut className="w-3.5 h-3.5 text-slate-600" />
      )}
      <span>{loading ? "..." : "Keluar"}</span>
    </button>
  );
}

// ==========================================
// 2. KOMPONEN MODAL BOOKING (DALAM 1 FILE)
// ==========================================
interface BookingModalProps {
  field: Lapangan;
  onClose: () => void;
  onSubmit: (data: {
    bookingDate: string;
    selectedSlots: string[];
    paymentMethod: string;
    totalAmount: number;
  }) => Promise<void>;
  isSubmitting: boolean;
  errorMessage: string | null;
}

const TIME_SLOTS = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00",
  "22:00 - 23:00",
];

function BookingModal({
  field,
  onClose,
  onSubmit,
  isSubmitting,
  errorMessage,
}: BookingModalProps) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const todayLabel = `Hari Ini (${today.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })})`;

  const tomorrowLabel = `Besok (${tomorrow.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })})`;

  const [bookingDate, setBookingDate] = useState<string>(todayStr);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("QRIS");

  const toggleSlot = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleFormSubmit = async () => {
    if (selectedSlots.length === 0) return;
    await onSubmit({
      bookingDate,
      selectedSlots,
      paymentMethod,
      totalAmount: field.price * selectedSlots.length,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
      <div className="w-full max-w-lg bg-white rounded-lg border border-slate-200 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{field.name}</h2>
            <p className="text-xs text-slate-500">{field.location}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Pilih Tanggal */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            1. Pilih Tanggal Main
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBookingDate(todayStr)}
              className={`py-1.5 px-3 rounded-md text-xs font-medium border text-center transition-colors cursor-pointer ${bookingDate === todayStr
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
            >
              {todayLabel}
            </button>
            <button
              type="button"
              onClick={() => setBookingDate(tomorrowStr)}
              className={`py-1.5 px-3 rounded-md text-xs font-medium border text-center transition-colors cursor-pointer ${bookingDate === tomorrowStr
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
            >
              {tomorrowLabel}
            </button>
          </div>
        </div>

        {/* 2. Pilih Jam Main */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-semibold text-slate-700">
              2. Pilih Jam Main
            </label>
            <span className="text-[11px] text-slate-500">
              {selectedSlots.length} jam dipilih
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  className={`py-1.5 px-2 rounded-md text-xs border text-center transition-colors cursor-pointer ${isSelected
                      ? "bg-blue-600 border-blue-600 text-white font-medium"
                      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Metode Pembayaran */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            3. Metode Pembayaran
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("QRIS")}
              className={`p-2.5 rounded-md border text-left flex items-center gap-2 cursor-pointer ${paymentMethod === "QRIS"
                  ? "border-blue-600 bg-blue-50/50 text-blue-900"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
            >
              <QrCode className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium">QRIS</p>
                <span className="text-[10px] text-slate-500">Bayar instan barcode</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("TRANSFER")}
              className={`p-2.5 rounded-md border text-left flex items-center gap-2 cursor-pointer ${paymentMethod === "TRANSFER"
                  ? "border-blue-600 bg-blue-50/50 text-blue-900"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
            >
              <Building2 className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium">Transfer Bank</p>
                <span className="text-[10px] text-slate-500">BCA / Mandiri</span>
              </div>
            </button>
          </div>
        </div>

        {/* Rincian Tarif */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600">
            <span>
              Tarif ({selectedSlots.length} Jam x Rp {field.price.toLocaleString("id-ID")})
            </span>
            <span>Rp {(field.price * selectedSlots.length).toLocaleString("id-ID")}</span>
          </div>
          <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900">
            <span>Total Tagihan</span>
            <span className="text-blue-600">
              Rp {(field.price * selectedSlots.length).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-md border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleFormSubmit}
            disabled={selectedSlots.length === 0 || isSubmitting}
            className="flex-1 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Konfirmasi Booking</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. HALAMAN UTAMA DASHBOARD
// ==========================================
export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();

  const [lapangans, setLapangans] = useState<Lapangan[]>([]);
  const [userBookings, setUserBookings] = useState<BookingWithRelations[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Modal State
  const [selectedField, setSelectedField] = useState<Lapangan | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    if (!session?.user?.email) return;
    try {
      setIsLoadingData(true);
      const [fieldsRes, bookingsRes] = await Promise.all([
        getLapangans(),
        getUserBookings(session.user.email),
      ]);

      if (fieldsRes.success && fieldsRes.data) {
        setLapangans(fieldsRes.data as Lapangan[]);
      }
      if (bookingsRes.success && bookingsRes.data) {
        setUserBookings(bookingsRes.data as BookingWithRelations[]);
      }
    } catch (err) {
      console.error("Gagal memuat data:", err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (!isSessionLoading && !session) {
      router.replace("/");
    } else if (session?.user?.email) {
      fetchData();
    }
  }, [isSessionLoading, session, router]);

  const handleBookingSubmit = async ({
    bookingDate,
    selectedSlots,
    paymentMethod,
    totalAmount,
  }: {
    bookingDate: string;
    selectedSlots: string[];
    paymentMethod: string;
    totalAmount: number;
  }) => {
    if (!selectedField || !session?.user?.email) return;

    try {
      setIsSubmittingBooking(true);
      setErrorMessage(null);

      const startTimeStr = `${bookingDate}T${selectedSlots[0].split(" - ")[0]}:00`;
      const endTimeStr = `${bookingDate}T${selectedSlots[selectedSlots.length - 1].split(" - ")[1]
        }:00`;

      const result = await createBookingAction({
        userId: session.user.id,
        userEmail: session.user.email,
        userName: session.user.name || "Member",
        lapanganId: selectedField.id,
        startTime: startTimeStr,
        endTime: endTimeStr,
        amount: totalAmount,
        paymentType: paymentMethod,
      });

      if (result.success) {
        setSelectedField(null);
        setToastMessage("Pemesanan berhasil disimpan! Tunggu konfirmasi admin.");
        setTimeout(() => setToastMessage(null), 3500);
        await fetchData();
      } else {
        setErrorMessage(result.error || "Gagal membuat pesanan");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kendala saat memproses pesanan");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-xs text-slate-500">Memeriksa sesi akun...</p>
        </div>
      </div>
    );
  }

  const filteredFields = lapangans.filter((field) => {
    const isCatMatch =
      selectedCategory === "Semua" ||
      field.name.toLowerCase().includes(selectedCategory.toLowerCase());
    const isSearchMatch =
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (field.description &&
        field.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return isCatMatch && isSearchMatch;
  });

  const userDisplayName = session?.user?.name || "Member";
  const userEmail = session?.user?.email || "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Notifikasi Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white px-3.5 py-2.5 rounded-md shadow-md text-xs">
          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar Atas Minimalis */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900">
                Booking Lapangan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 leading-none">
                {userDisplayName}
              </p>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">
                {userEmail}
              </p>
            </div>

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Container Utama */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Banner Sapaan Minimalis */}
        <section className="bg-white border border-slate-200 rounded-lg p-5">
          <h1 className="text-base sm:text-lg font-bold text-slate-900">
            Halo, {userDisplayName}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Selamat datang di sistem pemesanan lapangan olahraga. Silakan pilih lapangan yang tersedia dan tentukan jadwal main Anda.
          </p>
        </section>

        {/* Ringkasan Status Sederhana */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Riwayat Booking</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {userBookings.length} Pesanan
            </h3>
            <span className="text-[10px] text-slate-400">Total pesanan Anda</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Menunggu Konfirmasi</p>
            <h3 className="text-lg font-bold text-amber-600 mt-0.5">
              {userBookings.filter((b) => b.status === "PENDING").length} Booking
            </h3>
            <span className="text-[10px] text-slate-400">Sedang diperiksa admin</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Lapangan Tersedia</p>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              {lapangans.length} Lapangan
            </h3>
            <span className="text-[10px] text-slate-400">Dapat disewa sekarang</span>
          </div>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Booking Disetujui</p>
            <h3 className="text-lg font-bold text-green-600 mt-0.5">
              {userBookings.filter((b) => b.status === "CONFIRMED").length} Jadwal
            </h3>
            <span className="text-[10px] text-slate-400">Siap untuk main</span>
          </div>
        </section>

        {/* Bagian Katalog Lapangan */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Katalog Lapangan Olahraga
              </h2>
              <p className="text-xs text-slate-500">
                Pilih lapangan dan klik tombol untuk memesan jadwal
              </p>
            </div>

            {/* Filter Kategori & Pencarian */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                {["Semua", "Futsal", "Badminton", "Soccer", "Tenis"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${selectedCategory === cat
                        ? "bg-slate-800 border-slate-800 text-white"
                        : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama lapangan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 pr-3 text-xs bg-white border border-slate-300 rounded-md placeholder-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Grid Lapangan */}
          {isLoadingData ? (
            <div className="p-8 text-center bg-white rounded-lg border border-slate-200">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600 mx-auto mb-1.5" />
              <p className="text-xs text-slate-500">Memuat data lapangan...</p>
            </div>
          ) : filteredFields.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-400">
              <p className="text-xs">Tidak ada lapangan yang sesuai kriteria pencarian.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredFields.map((field) => (
                <div
                  key={field.id}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col justify-between"
                >
                  <div className="h-36 bg-slate-100 relative">
                    {field.picture_url ? (
                      <img
                        src={field.picture_url}
                        alt={field.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-50 border-b border-slate-100">
                        <CalendarDays className="w-5 h-5 text-slate-300" />
                        <span className="text-[11px] text-slate-400">Foto belum tersedia</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-xs leading-snug">
                        {field.name}
                      </h3>
                      <p className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span>{field.location}</span>
                      </p>
                      {field.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {field.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Tarif</span>
                        <span className="text-xs font-bold text-slate-900">
                          Rp {field.price.toLocaleString("id-ID")}
                          <span className="text-[10px] font-normal text-slate-500">/jam</span>
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedField(field);
                          setErrorMessage(null);
                        }}
                        className="px-2.5 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors"
                      >
                        Pilih Jadwal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bagian Riwayat Pemesanan Member */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Riwayat Pemesanan Anda
            </h2>
            <span className="text-xs text-slate-500">
              {userBookings.length} data ditemukan
            </span>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {userBookings.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-1">
                <Inbox className="w-6 h-6 mx-auto text-slate-300" />
                <p className="text-xs font-medium text-slate-600">
                  Belum ada riwayat pemesanan.
                </p>
                <p className="text-[11px] text-slate-400">
                  Silakan pilih lapangan di atas untuk mulai membuat reservasi.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="px-4 py-2.5">No. Booking</th>
                      <th className="px-4 py-2.5">Lapangan</th>
                      <th className="px-4 py-2.5">Waktu Sewa</th>
                      <th className="px-4 py-2.5">Total Bayar</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {userBookings.map((item) => {
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
                        <tr key={item.id} className="hover:bg-slate-50/60">
                          <td className="px-4 py-2.5 font-mono text-slate-800">
                            #{item.id.slice(0, 8).toUpperCase()}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="font-semibold text-slate-900 block">
                              {item.lapangan?.name || "Lapangan"}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {item.lapangan?.location}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="block text-slate-800">{dateFormatted}</span>
                            <span className="text-[11px] text-slate-500">{timeFormatted}</span>
                          </td>
                          <td className="px-4 py-2.5 font-medium text-slate-900">
                            Rp {(payment?.amount || item.lapangan?.price || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-2.5">
                            {item.status === "CONFIRMED" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-green-50 text-green-700 border border-green-200">
                                <CheckCircle2 className="w-3 h-3 text-green-600" />
                                Dikonfirmasi
                              </span>
                            ) : item.status === "CANCELLED" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                                Dibatalkan
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" />
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
            )}
          </div>
        </section>
      </main>

      {/* Modal Booking (Jika Lapangan Dipilih) */}
      {selectedField && (
        <BookingModal
          field={selectedField}
          onClose={() => setSelectedField(null)}
          onSubmit={handleBookingSubmit}
          isSubmitting={isSubmittingBooking}
          errorMessage={errorMessage}
        />
      )}

      {/* Footer Minimalis */}
      <footer className="w-full bg-white border-t border-slate-200 py-3 mt-8 text-center text-xs text-slate-500">
        <p>© 2026 Booking Lapangan. All rights reserved.</p>
      </footer>
    </div>
  );
}

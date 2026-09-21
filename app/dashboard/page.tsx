"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import FieldCard from "@/components/dashboard/FieldCard";
import BookingModal from "@/components/dashboard/BookingModal";
import UserBookingTable from "@/components/dashboard/UserBookingTable";
import {
  getLapangans,
  getUserBookings,
  createBookingAction,
} from "@/app/actions/booking";
import { Lapangan, BookingWithRelations } from "@/types/booking";
import {
  Trophy,
  MapPin,
  ShieldCheck,
  Search,
  Phone,
  Loader2,
  CheckCircle2,
} from "lucide-react";

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
      const endTimeStr = `${bookingDate}T${
        selectedSlots[selectedSlots.length - 1].split(" - ")[1]
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
        setToastMessage("Reservasi Anda berhasil dibuat!");
        setTimeout(() => setToastMessage(null), 4000);
        await fetchData();
      } else {
        setErrorMessage(result.error || "Gagal membuat reservasi");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kendala saat memproses reservasi");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-xs font-semibold text-slate-500">Memeriksa status akun...</p>
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
  const userImage = session?.user?.image;

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-xs font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">
                Arena<span className="text-emerald-600">Booking</span>
              </span>
              <span className="hidden md:inline-block ml-2 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                Akun Member Aktif
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Panel Pengelola</span>
            </Link>

            <div className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userDisplayName}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  {userDisplayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-slate-900 leading-tight truncate max-w-[130px]">
                  {userDisplayName}
                </p>
                <p className="text-slate-400 truncate max-w-[130px] text-[10px]">
                  {userEmail}
                </p>
              </div>

              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Venue Information Banner */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Buka Setiap Hari: 07.00 - 23.00 WIB</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Jl. Pemuda Sport Center No. 12, Jakarta
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Pemesanan Lapangan Olahraga
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Pilih arena olahraga favorit, tentukan jam main, dan dapatkan konfirmasi jadwal secara instan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>Bantuan CS</span>
            </a>
          </div>
        </section>

        {/* Real Summary Metrics */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs text-slate-400 font-medium">Jadwal Main Anda</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {userBookings.length} Reservasi
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              Aktif terdaftar
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs text-slate-400 font-medium">Menunggu Konfirmasi</p>
            <h3 className="text-xl font-bold text-amber-600 mt-1">
              {userBookings.filter((b) => b.status === "PENDING").length} Booking
            </h3>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Sedang diproses admin
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs text-slate-400 font-medium">Pilihan Lapangan</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {lapangans.length} Arena
            </h3>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Standar Pro & Terawat
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs text-slate-400 font-medium">Metode Pembayaran</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              QRIS / Transfer
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              Konfirmasi Instan
            </span>
          </div>
        </section>

        {/* Lapangan Catalog */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {["Semua", "Futsal", "Badminton", "Soccer", "Tenis"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama arena..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 text-xs bg-white border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-300 transition-all"
              />
            </div>
          </div>

          {/* Cards Grid */}
          {isLoadingData ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Memuat ketersediaan lapangan...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredFields.map((field) => (
                <FieldCard
                  key={field.id}
                  field={field}
                  onSelect={(selected) => {
                    setSelectedField(selected);
                    setErrorMessage(null);
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* User Booking History Table Component */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Jadwal & Riwayat Pemesanan Anda
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {userBookings.length} Transaksi Terdaftar
            </span>
          </div>

          <UserBookingTable bookings={userBookings} />
        </section>
      </main>

      {/* Modular Interactive Booking Modal Component */}
      {selectedField && (
        <BookingModal
          field={selectedField}
          onClose={() => setSelectedField(null)}
          onSubmit={handleBookingSubmit}
          isSubmitting={isSubmittingBooking}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
}

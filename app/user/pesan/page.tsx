"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getLapangans, createBookingAction } from "@/app/actions/booking";
import { Lapangan, BookingWithRelations } from "@/types/booking";
import {
  CalendarDays,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

const TIME_SLOTS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

function BookingForm() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const preselectedFieldId = searchParams.get("fieldId") || "";

  const [lapangans, setLapangans] = useState<Lapangan[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>(preselectedFieldId);
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [startHour, setStartHour] = useState<string>("08:00");
  const [durationHours, setDurationHours] = useState<number>(1);
  const [paymentType, setPaymentType] = useState<"QRIS" | "TRANSFER_BANK">("QRIS");

  const [isLoadingFields, setIsLoadingFields] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<BookingWithRelations | null>(null);

  // Ambil list lapangan
  useEffect(() => {
    async function loadFields() {
      try {
        setIsLoadingFields(true);
        const res = await getLapangans();
        if (res.success && res.data) {
          setLapangans(res.data as Lapangan[]);
          // Jika ada preselectedFieldId dari query param
          if (preselectedFieldId) {
            setSelectedFieldId(preselectedFieldId);
          } else if (res.data.length > 0) {
            setSelectedFieldId((res.data[0] as Lapangan).id);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil lapangan:", err);
      } finally {
        setIsLoadingFields(false);
      }
    }

    loadFields();
  }, [preselectedFieldId]);

  const selectedLapangan = lapangans.find((f) => f.id === selectedFieldId);

  // Hitung jam selesai
  const calculateEndTime = (start: string, duration: number) => {
    const [h, m] = start.split(":").map(Number);
    const endH = h + duration;
    return `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const endHour = calculateEndTime(startHour, durationHours);
  const totalAmount = selectedLapangan ? selectedLapangan.price * durationHours : 0;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!session?.user) {
      setErrorMessage("Silakan login terlebih dahulu untuk melakukan reservasi.");
      return;
    }

    if (!selectedFieldId) {
      setErrorMessage("Silakan pilih lapangan terlebih dahulu.");
      return;
    }

    if (!bookingDate) {
      setErrorMessage("Silakan tentukan tanggal sewa.");
      return;
    }

    try {
      setIsSubmitting(true);

      const startDateTime = new Date(`${bookingDate}T${startHour}:00`);
      const endDateTime = new Date(`${bookingDate}T${endHour}:00`);

      const res = await createBookingAction({
        userId: session.user.id,
        userEmail: session.user.email,
        userName: session.user.name || "Member",
        lapanganId: selectedFieldId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        amount: totalAmount,
        paymentType: paymentType,
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || "Gagal membuat pesanan. Silakan coba jam lain.");
        return;
      }

      setBookingSuccess(res.data as BookingWithRelations);
    } catch (err: unknown) {
      console.error("Booking error:", err);
      setErrorMessage("Terjadi kesalahan sistem. Silakan coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tampilan Sukses Booking
  if (bookingSuccess) {
    return (
      <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center space-y-5">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">Reservasi Berhasil Dibuat!</h2>
          <p className="text-xs text-slate-500 mt-1">
            Pesanan Anda telah dicatat dalam sistem dan siap digunakan.
          </p>
        </div>

        {/* Ringkasan Bukti Booking */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-left space-y-2.5 text-xs">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">ID Reservasi</span>
            <span className="font-mono font-medium text-slate-800">
              #{bookingSuccess.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Lapangan</span>
            <span className="font-semibold text-slate-900">
              {bookingSuccess.lapangan?.name || selectedLapangan?.name}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Tanggal</span>
            <span className="text-slate-800 font-medium">
              {new Date(bookingSuccess.startTime).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Jam Bermain</span>
            <span className="text-slate-800 font-medium">
              {startHour} - {endHour} ({durationHours} Jam)
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Metode Bayar</span>
            <span className="font-medium text-slate-800">
              {paymentType === "QRIS" ? "QRIS (Lunas)" : "Transfer Bank (Pending)"}
            </span>
          </div>

          <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
            <span className="font-semibold text-slate-700">Total Biaya</span>
            <span className="font-bold text-blue-600">
              Rp {totalAmount.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Navigasi Setelah Sukses */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              setBookingSuccess(null);
              setErrorMessage(null);
            }}
            className="w-full py-2.5 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Pesan Lagi
          </button>
          <Link
            href="/user"
            className="w-full py-2.5 px-3 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 transition-colors text-center flex items-center justify-center"
          >
            Lihat Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Form */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <h1 className="text-base font-bold text-slate-900">Form Pemesanan Lapangan</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tentukan arena, tanggal, dan slot jam bermain Anda secara instan
        </p>
      </section>

      {/* Alert Error */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-3 rounded-xl text-xs flex items-start gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoadingFields ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-xs">Memuat data lapangan...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmitBooking} className="space-y-4">
          {/* Langkah 1: Pilih Lapangan */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>1. Pilih Lapangan</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lapangans.map((field) => {
                const isSelected = field.id === selectedFieldId;
                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setSelectedFieldId(field.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{field.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{field.location}</p>
                      <p className="text-xs font-semibold text-blue-600 mt-1">
                        Rp {field.price.toLocaleString("id-ID")}
                        <span className="text-[10px] text-slate-400 font-normal">/jam</span>
                      </p>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Langkah 2: Jadwal & Jam */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span>2. Tanggal & Jam Sewa</span>
            </label>

            {/* Input Tanggal */}
            <div>
              <span className="text-xs font-medium text-slate-700 block mb-1">
                Tanggal Bermain
              </span>
              <input
                type="date"
                value={bookingDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setBookingDate(e.target.value)}
                required
                className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
              />
            </div>

            {/* Jam Mulai & Durasi */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs font-medium text-slate-700 block mb-1">
                  Jam Mulai
                </span>
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot} WIB
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-700 block mb-1">
                  Durasi Sewa
                </span>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
                >
                  <option value={1}>1 Jam</option>
                  <option value={2}>2 Jam</option>
                  <option value={3}>3 Jam</option>
                  <option value={4}>4 Jam</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-500">Estimasi Jam Selesai:</span>
              <span className="font-bold text-slate-800 font-mono">
                {endHour} WIB
              </span>
            </div>
          </div>

          {/* Langkah 3: Metode Pembayaran */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>3. Metode Pembayaran</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentType("QRIS")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  paymentType === "QRIS"
                    ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">QRIS</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-medium mt-1">
                  Otomatis Lunas
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType("TRANSFER_BANK")}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  paymentType === "TRANSFER_BANK"
                    ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Transfer Bank</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Verifikasi Manual</span>
              </button>
            </div>
          </div>

          {/* Ringkasan & Tombol Pesan */}
          <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Total Pembayaran:</span>
              <span className="text-base font-bold text-white">
                Rp {totalAmount.toLocaleString("id-ID")}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !selectedLapangan}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Memproses Reservasi...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Konfirmasi & Pesan Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function MemesanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
        </div>
      }
    >
      <BookingForm />
    </Suspense>
  );
}


"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getLapangans, createBookingAction } from "@/app/user/actions";
import { Lapangan, BookingWithRelations } from "@/types/booking";
import { AlertCircle, Loader2 } from "lucide-react";

import PilihLapangan from "./components/PilihLapangan";
import PilihJadwal from "./components/PilihJadwal";
import MetodeBayar from "./components/MetodeBayar";
import BuktiSukses from "./components/BuktiSukses";

function FormPemesanan() {
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

  // Ambil list lapangan dari MySQL
  useEffect(() => {
    async function loadFields() {
      try {
        setIsLoadingFields(true);
        const res = await getLapangans();
        if (res.success && res.data) {
          setLapangans(res.data as Lapangan[]);
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

  // Handler Submit Pemesanan
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

  // Jika Berhasil, tampilkan Kuitansi Bukti Sukses
  if (bookingSuccess) {
    return (
      <BuktiSukses
        booking={bookingSuccess}
        lapanganName={selectedLapangan?.name}
        startHour={startHour}
        endHour={endHour}
        durationHours={durationHours}
        paymentType={paymentType}
        totalAmount={totalAmount}
        onReset={() => {
          setBookingSuccess(null);
          setErrorMessage(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Halaman */}
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
          <PilihLapangan
            lapangans={lapangans}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
          />

          {/* Langkah 2: Tanggal & Jam Sewa */}
          <PilihJadwal
            bookingDate={bookingDate}
            startHour={startHour}
            durationHours={durationHours}
            endHour={endHour}
            onDateChange={setBookingDate}
            onStartHourChange={setStartHour}
            onDurationChange={setDurationHours}
          />

          {/* Langkah 3: Metode Bayar & Submit */}
          <MetodeBayar
            paymentType={paymentType}
            onPaymentTypeChange={setPaymentType}
            totalAmount={totalAmount}
            isSubmitting={isSubmitting}
            disabled={!selectedLapangan}
          />
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
      <FormPemesanan />
    </Suspense>
  );
}

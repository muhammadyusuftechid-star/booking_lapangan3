"use client";

import { useState } from "react";
import { Lapangan } from "@/types/booking";
import { X, QrCode, Building2, Loader2, AlertCircle } from "lucide-react";

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

export default function BookingModal({
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

  const toggleSlotSelection = (time: string) => {
    if (selectedSlots.includes(time)) {
      setSelectedSlots(selectedSlots.filter((t) => t !== time));
    } else {
      setSelectedSlots([...selectedSlots, time]);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{field.name}</h2>
            <p className="text-xs text-slate-500">{field.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Date Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            1. Pilih Tanggal Main
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBookingDate(todayStr)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                bookingDate === todayStr
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {todayLabel}
            </button>
            <button
              type="button"
              onClick={() => setBookingDate(tomorrowStr)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                bookingDate === tomorrowStr
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tomorrowLabel}
            </button>
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            2. Pilih Jam Main ({selectedSlots.length} Jam Dipilih)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot, index) => {
              const isSelected = selectedSlots.includes(slot);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleSlotSelection(slot)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 border-emerald-600 text-white font-bold shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            3. Metode Pembayaran
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod("QRIS")}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                paymentMethod === "QRIS"
                  ? "border-slate-900 bg-slate-50 font-bold"
                  : "border-slate-200 bg-white"
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <div className="text-xs">
                <p className="font-semibold text-slate-900">QRIS Instan</p>
                <span className="text-[10px] text-slate-500 font-normal">Konfirmasi Otomatis</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("TRANSFER")}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                paymentMethod === "TRANSFER"
                  ? "border-slate-900 bg-slate-50 font-bold"
                  : "border-slate-200 bg-white"
              }`}
            >
              <Building2 className="w-4 h-4 text-slate-700" />
              <div className="text-xs">
                <p className="font-semibold text-slate-900">Transfer Bank</p>
                <span className="text-[10px] text-slate-500 font-normal">BCA / Mandiri</span>
              </div>
            </button>
          </div>
        </div>

        {/* Price Calculation */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>
              Tarif ({selectedSlots.length} Jam x Rp {field.price.toLocaleString("id-ID")})
            </span>
            <span className="font-semibold text-slate-800">
              Rp {(field.price * selectedSlots.length).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
            <span>Total Pembayaran</span>
            <span className="text-emerald-700">
              Rp {(field.price * selectedSlots.length).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleFormSubmit}
            disabled={selectedSlots.length === 0 || isSubmitting}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Reservasi...</span>
              </>
            ) : (
              <span>Konfirmasi Reservasi</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

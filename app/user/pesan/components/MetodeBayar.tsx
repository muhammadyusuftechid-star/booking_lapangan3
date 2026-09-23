"use client";

import { CreditCard, QrCode, ShieldCheck, Loader2 } from "lucide-react";

interface MetodeBayarProps {
  paymentType: "QRIS" | "TRANSFER_BANK";
  onPaymentTypeChange: (type: "QRIS" | "TRANSFER_BANK") => void;
  totalAmount: number;
  isSubmitting: boolean;
  disabled: boolean;
}

export default function MetodeBayar({
  paymentType,
  onPaymentTypeChange,
  totalAmount,
  isSubmitting,
  disabled,
}: MetodeBayarProps) {
  return (
    <div className="space-y-4">
      {/* 3. Pilihan Metode Bayar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span>3. Metode Pembayaran</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onPaymentTypeChange("QRIS")}
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
            onClick={() => onPaymentTypeChange("TRANSFER_BANK")}
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

      {/* Ringkasan Total & Tombol Submit */}
      <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span>Total Pembayaran:</span>
          <span className="text-base font-bold text-white">
            Rp {totalAmount.toLocaleString("id-ID")}
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || disabled}
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
    </div>
  );
}

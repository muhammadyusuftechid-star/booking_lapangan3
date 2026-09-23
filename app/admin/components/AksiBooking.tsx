"use client";

import { useState } from "react";
import { updateBookingStatusAction } from "@/app/admin/actions";
import { Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AksiBookingProps {
  bookingId: string;
  currentStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | string;
}

export default function AksiBooking({ bookingId, currentStatus }: AksiBookingProps) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<"CONFIRMED" | "CANCELLED" | null>(null);

  const handleUpdate = async (newStatus: "CONFIRMED" | "CANCELLED") => {
    try {
      setLoadingAction(newStatus);
      const res = await updateBookingStatusAction(bookingId, newStatus);
      if (!res.success) {
        alert(res.error || "Gagal mengubah status pesanan");
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Terjadi kesalahan sistem saat memperbarui pesanan");
    } finally {
      setLoadingAction(null);
    }
  };

  if (currentStatus !== "PENDING") {
    return (
      <span className="text-[11px] text-slate-400 font-medium italic">
        Selesai
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleUpdate("CONFIRMED")}
        disabled={loadingAction !== null}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition cursor-pointer disabled:opacity-50 shadow-xs"
        title="Setujui Booking"
      >
        {loadingAction === "CONFIRMED" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Check className="w-3.5 h-3.5" />
        )}
        <span>Setujui</span>
      </button>

      <button
        onClick={() => handleUpdate("CANCELLED")}
        disabled={loadingAction !== null}
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-semibold transition cursor-pointer disabled:opacity-50"
        title="Tolak Booking"
      >
        {loadingAction === "CANCELLED" ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <X className="w-3.5 h-3.5" />
        )}
        <span>Tolak</span>
      </button>
    </div>
  );
}

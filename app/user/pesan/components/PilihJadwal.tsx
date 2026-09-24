"use client";

import { CalendarDays, AlertCircle, Clock, Loader2 } from "lucide-react";

export const TIME_SLOTS = [
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

export interface BookedSlotItem {
  start: string;
  end: string;
  status?: string;
}

interface PilihJadwalProps {
  bookingDate: string;
  startHour: string;
  durationHours: number;
  endHour: string;
  bookedSlots?: BookedSlotItem[];
  isLoadingSlots?: boolean;
  onDateChange: (date: string) => void;
  onStartHourChange: (hour: string) => void;
  onDurationChange: (dur: number) => void;
}

export default function PilihJadwal({
  bookingDate,
  startHour,
  durationHours,
  endHour,
  bookedSlots = [],
  isLoadingSlots = false,
  onDateChange,
  onStartHourChange,
  onDurationChange,
}: PilihJadwalProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  // Fungsi pengecekan bentrok jadwal
  const isSlotBooked = (slotStart: string, duration = 1) => {
    if (!bookedSlots || bookedSlots.length === 0) return false;
    const [h, m] = slotStart.split(":").map(Number);
    const slotEndH = h + duration;
    const slotEnd = `${String(slotEndH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    return bookedSlots.some((b) => {
      return slotStart < b.end && slotEnd > b.start;
    });
  };

  const isCurrentSelectionBooked = isSlotBooked(startHour, durationHours);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          <span>2. Tanggal & Jam Sewa</span>
        </label>
        {isLoadingSlots && (
          <span className="flex items-center gap-1 text-[11px] text-blue-600">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Memeriksa ketersediaan...</span>
          </span>
        )}
      </div>

      {/* Input Tanggal */}
      <div>
        <span className="text-xs font-medium text-slate-700 block mb-1">
          Tanggal Bermain
        </span>
        <input
          type="date"
          value={bookingDate}
          min={todayStr}
          onChange={(e) => onDateChange(e.target.value)}
          required
          className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
        />
      </div>

      {/* Info Jam yang Sudah Terisi Hari Ini */}
      {bookedSlots && bookedSlots.length > 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Jadwal yang sudah terisi di tanggal ini:</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {bookedSlots.map((b, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-amber-100/90 border border-amber-300 text-amber-800 rounded-md text-[10px] font-medium"
              >
                {b.start} - {b.end} WIB (Penuh)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Jam Mulai & Durasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="text-xs font-medium text-slate-700 block mb-1">
            Jam Mulai
          </span>
          <select
            value={startHour}
            onChange={(e) => onStartHourChange(e.target.value)}
            className={`w-full text-xs px-3 py-2.5 rounded-lg border outline-none bg-white text-slate-800 ${
              isCurrentSelectionBooked
                ? "border-red-400 focus:ring-2 focus:ring-red-400"
                : "border-slate-300 focus:ring-2 focus:ring-blue-600"
            }`}
          >
            {TIME_SLOTS.map((slot) => {
              const booked = isSlotBooked(slot, durationHours);
              return (
                <option
                  key={slot}
                  value={slot}
                  disabled={booked}
                  className={booked ? "text-slate-400 bg-slate-100" : "text-slate-800"}
                >
                  {slot} WIB {booked ? "— (Penuh / Sudah Dipesan)" : "— (Tersedia)"}
                </option>
              );
            })}
          </select>
          {isCurrentSelectionBooked && (
            <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Jam {startHour} WIB sudah terisi. Silakan pilih jam lain.</span>
            </p>
          )}
        </div>

        <div>
          <span className="text-xs font-medium text-slate-700 block mb-1">
            Durasi Sewa
          </span>
          <select
            value={durationHours}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
          >
            <option value={1}>1 Jam</option>
            <option value={2}>2 Jam</option>
            <option value={3}>3 Jam</option>
            <option value={4}>4 Jam</option>
          </select>
        </div>
      </div>

      {/* Estimasi Jam Selesai */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
        <span className="text-slate-500">Estimasi Jam Selesai:</span>
        <span className="font-bold text-slate-800 font-mono">{endHour} WIB</span>
      </div>
    </div>
  );
}

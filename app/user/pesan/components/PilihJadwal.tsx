"use client";

import { CalendarDays } from "lucide-react";

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

interface PilihJadwalProps {
  bookingDate: string;
  startHour: string;
  durationHours: number;
  endHour: string;
  onDateChange: (date: string) => void;
  onStartHourChange: (hour: string) => void;
  onDurationChange: (dur: number) => void;
}

export default function PilihJadwal({
  bookingDate,
  startHour,
  durationHours,
  endHour,
  onDateChange,
  onStartHourChange,
  onDurationChange,
}: PilihJadwalProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  return (
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
          min={todayStr}
          onChange={(e) => onDateChange(e.target.value)}
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
            onChange={(e) => onStartHourChange(e.target.value)}
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

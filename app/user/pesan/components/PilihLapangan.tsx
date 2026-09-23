"use client";

import { Lapangan } from "@/types/booking";
import { Building2 } from "lucide-react";

interface PilihLapanganProps {
  lapangans: Lapangan[];
  selectedFieldId: string;
  onSelectField: (id: string) => void;
}

export default function PilihLapangan({
  lapangans,
  selectedFieldId,
  onSelectField,
}: PilihLapanganProps) {
  return (
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
              onClick={() => onSelectField(field.id)}
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
  );
}

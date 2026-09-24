"use client";

import { useState } from "react";
import Link from "next/link";
import { Lapangan } from "@/types/booking";
import { MapPin, CalendarDays, CalendarPlus, ImageOff } from "lucide-react";

interface KartuLapanganProps {
  field: Lapangan;
}

export default function KartuLapangan({ field }: KartuLapanganProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 transition-colors shadow-xs">
      {/* Gambar Lapangan */}
      <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
        {field.picture_url && !imgError ? (
          <img
            src={field.picture_url}
            alt={field.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-50 border-b border-slate-100">
            {field.picture_url && imgError ? (
              <>
                <ImageOff className="w-6 h-6 text-slate-300" />
                <span className="text-[11px] text-slate-400">Link gambar tidak dapat dimuat</span>
              </>
            ) : (
              <>
                <CalendarDays className="w-6 h-6 text-slate-300" />
                <span className="text-[11px] text-slate-400">Foto belum tersedia</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 text-sm leading-snug">
            {field.name}
          </h3>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{field.location}</span>
          </p>
          {field.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
              {field.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Tarif Sewa</span>
            <span className="text-sm font-bold text-slate-900">
              Rp {field.price.toLocaleString("id-ID")}
              <span className="text-[10px] font-normal text-slate-500">/jam</span>
            </span>
          </div>

          <Link
            href={`/user/pesan?fieldId=${field.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors shadow-xs"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Pilih & Pesan</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

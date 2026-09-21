import { Lapangan } from "@/types/booking";
import { MapPin, ChevronRight } from "lucide-react";

interface FieldCardProps {
  field: Lapangan;
  onSelect: (field: Lapangan) => void;
}

export default function FieldCard({ field, onSelect }: FieldCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-slate-300 transition-all">
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={field.picture_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"}
          alt={field.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2.5 right-2.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
            Siap Pakai
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 text-sm leading-snug">
            {field.name}
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{field.location}</span>
          </p>
          {field.description && (
            <p className="text-[11px] text-slate-500 line-clamp-2">
              {field.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
              Tarif Sewa
            </span>
            <span className="text-sm font-bold text-slate-900">
              Rp {field.price.toLocaleString("id-ID")}
              <span className="text-xs font-normal text-slate-400">/jam</span>
            </span>
          </div>

          <button
            onClick={() => onSelect(field)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1 transition-all cursor-pointer active:scale-95"
          >
            <span>Pilih Jadwal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

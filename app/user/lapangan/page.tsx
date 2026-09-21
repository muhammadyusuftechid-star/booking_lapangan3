"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLapangans } from "@/app/actions/booking";
import { Lapangan } from "@/types/booking";
import {
  Building2,
  MapPin,
  Search,
  Loader2,
  CalendarDays,
  CalendarPlus,
} from "lucide-react";

export default function ListLapanganPage() {
  const [lapangans, setLapangans] = useState<Lapangan[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFields() {
      try {
        setIsLoading(true);
        const res = await getLapangans();
        if (res.success && res.data) {
          setLapangans(res.data as Lapangan[]);
        }
      } catch (err) {
        console.error("Gagal memuat lapangan:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFields();
  }, []);

  const filteredFields = lapangans.filter((field) => {
    const isCatMatch =
      selectedCategory === "Semua" ||
      field.name.toLowerCase().includes(selectedCategory.toLowerCase());
    const isSearchMatch =
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (field.description &&
        field.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return isCatMatch && isSearchMatch;
  });

  return (
    <div className="space-y-4">
      {/* Header List Lapangan */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <h1 className="text-base font-bold text-slate-900">
          List Lapangan Olahraga
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Temukan arena olahraga terbaik dan pilih jadwal bermain Anda
        </p>

        {/* Filter Kategori & Pencarian */}
        <div className="mt-4 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama lapangan atau lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {["Semua", "Futsal", "Badminton", "Soccer", "Tenis"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Lapangan */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
          <p className="text-xs">Memuat data lapangan...</p>
        </div>
      ) : filteredFields.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border border-slate-200 text-center text-slate-400 space-y-2 shadow-xs">
          <Building2 className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-xs font-semibold text-slate-700">
            Lapangan Tidak Ditemukan
          </p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
            Tidak ada arena yang cocok dengan kriteria filter atau pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {filteredFields.map((field) => (
            <div
              key={field.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 transition-colors shadow-xs"
            >
              {/* Gambar Lapangan */}
              <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                {field.picture_url ? (
                  <img
                    src={field.picture_url}
                    alt={field.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-50 border-b border-slate-100">
                    <CalendarDays className="w-6 h-6 text-slate-300" />
                    <span className="text-[11px] text-slate-400">Foto belum tersedia</span>
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
          ))}
        </div>
      )}
    </div>
  );
}


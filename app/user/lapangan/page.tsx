"use client";

import { useEffect, useState } from "react";
import { getLapangans } from "@/app/user/actions";
import { Lapangan } from "@/types/booking";
import { Building2, Loader2 } from "lucide-react";

import CariLapangan from "./components/CariLapangan";
import KartuLapangan from "./components/KartuLapangan";

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
      {/* Header & Filter Pencarian */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <h1 className="text-base font-bold text-slate-900">
          List Lapangan Olahraga
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Temukan arena olahraga terbaik dan pilih jadwal bermain Anda
        </p>

        <CariLapangan
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
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
            <KartuLapangan key={field.id} field={field} />
          ))}
        </div>
      )}
    </div>
  );
}

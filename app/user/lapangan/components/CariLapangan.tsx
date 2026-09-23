"use client";

import { Search } from "lucide-react";

interface CariLapanganProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const KATEGORI_LIST = ["Semua", "Futsal", "Badminton", "Soccer", "Tenis"];

export default function CariLapangan({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: CariLapanganProps) {
  return (
    <div className="mt-4 space-y-2.5">
      {/* Input Pencarian */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari nama lapangan atau lokasi..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white transition-colors text-slate-800"
        />
      </div>

      {/* Tombol Kategori */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {KATEGORI_LIST.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
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
  );
}

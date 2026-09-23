"use client";

import { Search, Filter } from "lucide-react";

type StatusType = "ALL" | "PENDING" | "CONFIRMED" | "CANCELLED";

interface FilterStatusProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterStatus: StatusType;
  onFilterChange: (status: StatusType) => void;
  totalCount: number;
  pendingCount: number;
  confirmedCount: number;
  cancelledCount: number;
}

export default function FilterStatus({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  totalCount,
  pendingCount,
  confirmedCount,
  cancelledCount,
}: FilterStatusProps) {
  const tabs = [
    { id: "ALL" as StatusType, label: `Semua (${totalCount})` },
    { id: "PENDING" as StatusType, label: `Menunggu (${pendingCount})` },
    { id: "CONFIRMED" as StatusType, label: `Disetujui (${confirmedCount})` },
    { id: "CANCELLED" as StatusType, label: `Dibatalkan (${cancelledCount})` },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5">
      {/* Input Pencarian */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari berdasarkan nama arena atau lokasi..."
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
        />
      </div>

      {/* Tab Filter Status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === tab.id
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { 
  Building2, 
  MapPin, 
  Plus, 
  Trash2,
  Layers3,
  CheckCircle2,
  Clock
} from "lucide-react";
import { createLapangan, removeLapangan } from "./actions";
import Link from "next/link";

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

const TIME_SLOTS = [
  { start: "08:00", end: "09:00" },
  { start: "09:00", end: "10:00" },
  { start: "10:00", end: "11:00" },
  { start: "11:00", end: "12:00" },
  { start: "13:00", end: "14:00" },
  { start: "14:00", end: "15:00" },
  { start: "15:00", end: "16:00" },
  { start: "16:00", end: "17:00" },
];

export default async function LapanganPage({
  searchParams,
}: {
  searchParams: { checkLapanganId?: string; date?: string; selectedSlot?: string };
}) {
  const lapangans = await prisma.lapangan.findMany({
    orderBy: { createdAt: "desc" },
  });

  const selectedLapanganId = searchParams?.checkLapanganId || (lapangans[0]?.id ?? "");
  const selectedDate = searchParams?.date || new Date().toISOString().split("T")[0];
  const activeSlot = searchParams?.selectedSlot || "";

  let bookedSlots: { startTime: string; endTime: string; customerName?: string }[] = [];
  if (selectedLapanganId) {
    try {
      const existingBookings = await prisma.booking.findMany({
        where: {
          lapanganId: selectedLapanganId,
          date: new Date(selectedDate),
          status: "CONFIRMED",
        },
        include: { customer: { select: { name: true } } },
      });

      bookedSlots = existingBookings.map((b) => ({
        startTime: b.startTime,
        endTime: b.endTime,
        customerName: b.customer?.name || "Pelanggan",
      }));
    } catch (e) {
      bookedSlots = [];
    }
  }

  const totalLapangan = lapangans.length;
  const totalHarga = lapangans.reduce((sum, item) => sum + Number(item.price), 0);
  const rataRataHarga = totalLapangan > 0 ? totalHarga / totalLapangan : 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Topbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-8 backdrop-blur hidden lg:flex h-[76px] items-center justify-between">
        <div>
          <p className="text-[11px] font-medium text-slate-400">Admin / Kelola Lapangan</p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900">Manajemen Fasilitas Arena</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-600">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> MySQL Connected
          </span>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto space-y-6 flex-1 w-full">
        
        {/* Statistik Ringkas */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <p className="text-[11px] font-medium text-slate-500">Total Lapangan Terdaftar</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalLapangan}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <p className="text-[11px] font-medium text-slate-500">Akumulasi Tarif / Jam</p>
            <p className="mt-2 text-xl font-bold text-blue-600">{formatRupiah(totalHarga)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <p className="text-[11px] font-medium text-slate-500">Rata-rata Tarif</p>
            <p className="mt-2 text-xl font-bold text-emerald-600">{formatRupiah(rataRataHarga)}</p>
          </div>
        </section>

        {/* Fitur Cek Slot Ketersediaan Lapangan Real-Time & Interaktif */}
        <section className="rounded-2xl border border-blue-200 bg-blue-50/30 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Cek & Pilih Slot Jam Lapangan (Klik Slot untuk Informasi Detail)</h3>
          </div>

          <form method="GET" className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Pilih Lapangan</label>
              <select 
                name="checkLapanganId" 
                defaultValue={selectedLapanganId}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-white"
              >
                {lapangans.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Tanggal Cek</label>
              <input 
                type="date" 
                name="date" 
                defaultValue={selectedDate}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-white"
              />
            </div>

            <div>
              <button type="submit" className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm">
                Tampilkan Slot Jam
              </button>
            </div>
          </form>

          {selectedLapanganId && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {TIME_SLOTS.map((slot, index) => {
                  const matched = bookedSlots.find((b) => b.startTime === slot.start);
                  const isBooked = !!matched;
                  const isSelected = activeSlot === slot.start;

                  return (
                    <Link
                      key={index}
                      href={`/admin/lapangan?checkLapanganId=${selectedLapanganId}&date=${selectedDate}&selectedSlot=${slot.start}`}
                      className={`p-3 rounded-xl border text-xs flex flex-col justify-between text-left transition cursor-pointer ${
                        isSelected ? 'ring-2 ring-blue-600 shadow-md' : ''
                      } ${
                        isBooked 
                          ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1 font-bold">
                        <span>{slot.start} - {slot.end}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${isBooked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {isBooked ? "Terisi" : "Tersedia"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 truncate">
                        {isBooked ? `Dipakai: ${matched.customerName}` : "Klik untuk lihat detail"}
                      </p>
                    </Link>
                  );
                })}
              </div>

              {activeSlot && (
                <div className="p-4 rounded-xl bg-white border border-blue-200 text-xs flex items-center justify-between shadow-xs">
                  <div>
                    <p className="font-bold text-slate-800">Detail Slot Terpilih: Pukul {activeSlot}</p>
                    <p className="text-slate-500 mt-0.5">
                      {bookedSlots.find(b => b.startTime === activeSlot) 
                        ? `Status: Sedang dipakai oleh ${bookedSlots.find(b => b.startTime === activeSlot)?.customerName}` 
                        : "Status: Kosong dan tersedia untuk dibooking."}
                    </p>
                  </div>
                  <Link href={`/admin/lapangan?checkLapanganId=${selectedLapanganId}&date=${selectedDate}`} className="text-[11px] font-semibold text-blue-600 hover:underline">
                    Tutup Detail
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Form Tambah Lapangan */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/50 p-5">
            <h3 className="text-sm font-bold text-slate-900">Registrasi Fasilitas Baru</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Tambah data lapangan secara permanen ke database MySQL.</p>
          </div>
          <form action={createLapangan} className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Nama Lapangan</label>
                <input type="text" name="name" required placeholder="Cth: Futsal Premium A" className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Tarif / Jam (Rp)</label>
                <input type="number" name="price" required min="1" placeholder="Cth: 150000" className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Lokasi</label>
                <input type="text" name="location" required placeholder="Cth: Indoor Arena" className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50" />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700">Deskripsi</label>
                <input type="text" name="description" placeholder="Cth: Lapangan sintetis" className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50" />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-[11px] font-semibold transition shadow-md shadow-blue-600/20 cursor-pointer">
                <Plus className="h-4 w-4" /> Simpan ke Database
              </button>
            </div>
          </form>
        </section>

        {/* Tabel Data Lapangan */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="border-b border-slate-100 p-5 flex items-center gap-2">
            <Layers3 className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900">Daftar Lapangan Tersimpan ({lapangans.length})</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">#</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Lapangan</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Lokasi</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400">Tarif / Jam</th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-[10px] text-slate-400 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lapangans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400">Belum ada data lapangan terdaftar.</td>
                  </tr>
                ) : (
                  lapangans.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-slate-400 font-medium">{String(index + 1).padStart(2, "0")}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-[11px]">{item.name}</p>
                            <p className="text-[10px] text-slate-400">{item.description || "Tidak ada deskripsi"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" /> {item.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          {formatRupiah(Number(item.price))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <form action={removeLapangan}>
                          <input type="hidden" name="id" value={item.id} />
                          <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-semibold text-red-600 hover:bg-red-100 transition cursor-pointer">
                            <Trash2 className="h-3 w-3" /> Hapus
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
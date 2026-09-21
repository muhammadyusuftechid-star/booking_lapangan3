import { Lapangan } from "@/types/booking";
import { Plus, Trash2, Inbox } from "lucide-react";

interface AdminFieldTableProps {
  fields: Lapangan[];
  onOpenAddModal: () => void;
  onDeleteField: (id: string, name: string) => Promise<void>;
  actionLoadingId: string | null;
}

export default function AdminFieldTable({
  fields,
  onOpenAddModal,
  onDeleteField,
  actionLoadingId,
}: AdminFieldTableProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Data Master Lapangan Olahraga
          </h2>
          <p className="text-xs text-slate-500">
            Daftar seluruh arena yang aktif dan dapat disewa oleh pelanggan
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tambah Lapangan</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {fields.length === 0 ? (
          <div className="p-10 text-center text-slate-400 space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-medium text-slate-600">Belum ada data lapangan.</p>
            <p className="text-[11px] text-slate-400">
              Klik &quot;Tambah Lapangan&quot; di atas untuk menambahkan lapangan pertama Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider border-b border-slate-100 font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Nama Lapangan</th>
                  <th className="px-5 py-3.5">Lokasi</th>
                  <th className="px-5 py-3.5">Tarif / Jam</th>
                  <th className="px-5 py-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {fields.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{f.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{f.location}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      Rp {f.price.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        disabled={actionLoadingId === f.id}
                        onClick={() => onDeleteField(f.id, f.name)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Hapus Lapangan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

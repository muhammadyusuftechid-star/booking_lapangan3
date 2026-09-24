"use client";

import { useState } from "react";
import { Pencil, X, Check, Loader2 } from "lucide-react";
import { updateLapangan } from "../actions";

interface LapanganItem {
  id: string;
  name: string;
  description: string | null;
  location: string;
  price: number;
  picture_url: string | null;
}

export default function ModalEditLapangan({ lapangan }: { lapangan: LapanganItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Form action akan otomatis ditangani oleh action form, lalu modal kita tutup
    const formData = new FormData(e.currentTarget);
    try {
      await updateLapangan(formData);
      setIsOpen(false);
    } catch (err) {
      console.error("Gagal update lapangan:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-semibold text-blue-600 hover:bg-blue-100 transition cursor-pointer"
        title="Edit Data Lapangan"
      >
        <Pencil className="h-3 w-3" /> Edit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Edit Fasilitas Lapangan
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Perbarui tarif, lokasi, foto, atau informasi arena
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Edit */}
            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              <input type="hidden" name="id" value={lapangan.id} />

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                  Nama Lapangan *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={lapangan.name}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                    Tarif / Jam (Rp) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="1"
                    defaultValue={lapangan.price}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                    Lokasi *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    defaultValue={lapangan.location}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                  URL / Link Foto Lapangan
                  <span className="text-[10px] text-slate-400 font-normal ml-1">(Bisa link web atau /lapangan-1.jpg)</span>
                </label>
                <input
                  type="text"
                  name="picture_url"
                  defaultValue={lapangan.picture_url || ""}
                  placeholder="Cth: /lapangan-1.jpg atau https://..."
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-700">
                  Deskripsi Lapangan
                </label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={lapangan.description || ""}
                  placeholder="Tuliskan fasilitas pendukung (misal: rumput sintetis, penerangan lampu LED)"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-blue-500 outline-none bg-slate-50/50 resize-none"
                />
              </div>

              {/* Tombol Footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

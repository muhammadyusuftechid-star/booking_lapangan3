"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    location: string;
    price: number;
    description: string;
    picture_url: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export default function AddFieldModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AddFieldModalProps) {
  const [fieldName, setFieldName] = useState("");
  const [fieldLocation, setFieldLocation] = useState("");
  const [fieldPrice, setFieldPrice] = useState("");
  const [fieldDescription, setFieldDescription] = useState("");
  const [fieldPictureUrl, setFieldPictureUrl] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName || !fieldPrice) return;

    await onSubmit({
      name: fieldName,
      location: fieldLocation || "Sport Center Utama",
      price: Number(fieldPrice),
      description: fieldDescription,
      picture_url: fieldPictureUrl,
    });

    setFieldName("");
    setFieldLocation("");
    setFieldPrice("");
    setFieldDescription("");
    setFieldPictureUrl("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Tambah Lapangan Baru</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Lapangan *</label>
            <input
              type="text"
              required
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Contoh: Lapangan Futsal Vinyl A"
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Lokasi / Hall *</label>
            <input
              type="text"
              required
              value={fieldLocation}
              onChange={(e) => setFieldLocation(e.target.value)}
              placeholder="Contoh: Gedung Indoor Lantai 1"
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tarif Sewa per Jam (Rp) *</label>
            <input
              type="number"
              required
              value={fieldPrice}
              onChange={(e) => setFieldPrice(e.target.value)}
              placeholder="Contoh: 150000"
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Deskripsi / Fasilitas</label>
            <input
              type="text"
              value={fieldDescription}
              onChange={(e) => setFieldDescription(e.target.value)}
              placeholder="Contoh: Vinyl Standar PBSI • Ruang Ganti • AC"
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">URL Foto Lapangan (Opsional)</label>
            <input
              type="url"
              value={fieldPictureUrl}
              onChange={(e) => setFieldPictureUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Lapangan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { getUserBookings, getLapangans } from "@/app/user/actions";
import { BookingWithRelations, Lapangan } from "@/types/booking";
import {
  Clock,
  ShieldCheck,
  CalendarDays,
  Info,
  CheckCircle2,
} from "lucide-react";
import KartuStatistik from "./components/KartuStatistik";

export default function UserDashboardPage() {
  const { data: session } = useSession();
  const [userBookings, setUserBookings] = useState<BookingWithRelations[]>([]);
  const [lapangans, setLapangans] = useState<Lapangan[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!session?.user?.email) return;
      try {
        const [bookingsRes, fieldsRes] = await Promise.all([
          getUserBookings(session.user.email),
          getLapangans(),
        ]);
        if (bookingsRes.success && bookingsRes.data) {
          setUserBookings(bookingsRes.data as BookingWithRelations[]);
        }
        if (fieldsRes.success && fieldsRes.data) {
          setLapangans(fieldsRes.data as Lapangan[]);
        }
      } catch (err) {
        console.error("Gagal memuat dashboard:", err);
      }
    }

    loadData();
  }, [session]);

  const userDisplayName = session?.user?.name || "Member";
  const userEmail = session?.user?.email || "";
  const pendingCount = userBookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = userBookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <div className="space-y-5">
      {/* 1. Sapaan Pengguna */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
            {userDisplayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Halo, {userDisplayName}!
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{userEmail}</p>
            <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium mt-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Akun Terverifikasi</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Kartu Statistik Metrik */}
      <KartuStatistik
        totalBooking={userBookings.length}
        menunggu={pendingCount}
        disetujui={confirmedCount}
        arenaTersedia={lapangans.length}
      />

      {/* 3. Informasi & Tata Tertib Arena */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900">
              Informasi & Tata Tertib Arena
            </h2>
            <p className="text-[10px] text-slate-500">
              Petunjuk reservasi dan aturan penggunaan lapangan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Jam Operasional</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Buka setiap hari mulai pukul <strong>08:00 - 22:00 WIB</strong>. Slot waktu dihitung per jam penuh.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <CalendarDays className="w-3.5 h-3.5 text-green-600" />
              <span>Ketentuan Reservasi</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Harap hadir di lokasi maksimal <strong>10 menit</strong> sebelum jadwal dimulai. Pembayaran didukung via QRIS instan.
            </p>
          </div>
        </div>

        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-900 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Gunakan Menu Navigasi di Bawah:</span>
            <span className="text-blue-700">
              Untuk melihat katalog lapangan silakan buka tab <strong>Lapangan</strong>, untuk membuat pesanan buka tab <strong>Memesan</strong>, dan untuk memeriksa status seluruh pesanan Anda buka tab <strong>Riwayat</strong>.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

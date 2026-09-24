"use client";

import { useState } from "react";
import { toggleUserRoleAction } from "../actions";
import { ShieldCheck, UserCheck, Loader2 } from "lucide-react";

interface TombolRoleProps {
  userId: string;
  currentRole: "USER" | "ADMIN";
  userEmail: string;
}

export default function TombolRole({ userId, currentRole, userEmail }: TombolRoleProps) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const nextRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const confirmMsg =
      nextRole === "ADMIN"
        ? `Jadikan "${userEmail}" sebagai ADMINISTRATOR? Akun ini akan memiliki akses ke dashboard admin.`
        : `Turunkan status "${userEmail}" menjadi USER biasa?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      setLoading(true);
      const res = await toggleUserRoleAction(userId, nextRole);
      if (!res.success) {
        alert(res.error || "Gagal mengubah role pengguna.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition cursor-pointer disabled:opacity-50 ${
        currentRole === "ADMIN"
          ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
          : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
      }`}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : currentRole === "ADMIN" ? (
        <>
          <UserCheck className="w-3 h-3 text-amber-600" />
          <span>Ubah ke User</span>
        </>
      ) : (
        <>
          <ShieldCheck className="w-3 h-3 text-blue-600" />
          <span>Jadikan Admin</span>
        </>
      )}
    </button>
  );
}

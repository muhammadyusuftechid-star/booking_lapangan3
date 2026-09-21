"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { LogOut, Loader2 } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  showText?: boolean;
}

export default function LogoutButton({
  className = "",
  showText = true,
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/");
          },
        },
      });
    } catch (error) {
      console.error("Gagal logout:", error);
      // Fallback redirect
      router.replace("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100/80 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${className}`}
      title="Keluar dari akun"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
      ) : (
        <LogOut className="w-4 h-4 text-rose-600" />
      )}
      {showText && <span>{loading ? "Keluar..." : "Keluar"}</span>}
    </button>
  );
}

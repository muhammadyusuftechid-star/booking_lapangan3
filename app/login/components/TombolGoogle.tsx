"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

interface TombolGoogleProps {
  onError?: (msg: string) => void;
}

export default function TombolGoogle({ onError }: TombolGoogleProps) {
  const [loading, setLoading] = useState(false);

  const handleLoginGoogle = async () => {
    try {
      setLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL: "/user",
      });
    } catch (err: unknown) {
      console.error("Gagal login Google:", err);
      const msg = err instanceof Error ? err.message : "Gagal mengarahkan ke akun Google.";
      if (onError) onError(msg);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLoginGoogle}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
      ) : (
        <>
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.25 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.21 0 10.05 0 12s.46 3.79 1.26 5.39l4.01-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
            />
          </svg>
          <span>Lanjutkan dengan Google</span>
        </>
      )}
    </button>
  );
}

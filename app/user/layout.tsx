"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getUserRoleAction } from "@/app/user/actions";
import HeaderUser from "./components/HeaderUser";
import BottomNav from "./components/BottomNav";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const [isVerifyingAccess, setIsVerifyingAccess] = useState(true);

  useEffect(() => {
    async function checkRoleAndAccess() {
      if (!isSessionLoading && !session) {
        router.replace("/login");
        return;
      }

      if (session?.user?.email) {
        const res = await getUserRoleAction(session.user.email);
        const resolvedRole = res.success
          ? String(res.role).toUpperCase()
          : String((session.user as { role?: string })?.role || "USER").toUpperCase();

        // Jika akun adalah ADMIN, larang akses ke halaman user dan alihkan ke /admin
        if (resolvedRole === "ADMIN") {
          router.replace("/admin");
          return;
        }

        setIsVerifyingAccess(false);
      } else if (!isSessionLoading && !session) {
        router.replace("/login");
      }
    }

    checkRoleAndAccess();
  }, [session, isSessionLoading, router]);

  if (isSessionLoading || isVerifyingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="text-xs text-slate-500 font-medium">
            Memeriksa hak akses pengguna...
          </p>
        </div>
      </div>
    );
  }

  const userDisplayName = session?.user?.name || "Member";
  const userEmail = session?.user?.email || "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* 1. Header Pengguna */}
      <HeaderUser userName={userDisplayName} userEmail={userEmail} />

      {/* 2. Konten Halaman */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-5 pb-24 sm:pb-24">
        {children}
      </main>

      {/* 3. Navigasi Bawah Mobile */}
      <BottomNav />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getUserRoleAction } from "@/app/user/actions";
import { Loader2 } from "lucide-react";

export default function RootHomePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    async function determineRoute() {
      if (isPending) return;

      if (!session?.user?.email) {
        router.replace("/login");
        return;
      }

      try {
        const roleRes = await getUserRoleAction(session.user.email);
        const role = roleRes.success
          ? roleRes.role
          : (session.user as { role?: string })?.role || "USER";

        if (String(role).toUpperCase() === "ADMIN") {
          router.replace("/admin");
        } else {
          router.replace("/user");
        }
      } catch (err) {
        console.error("Gagal memeriksa role di root:", err);
        router.replace("/user");
      }
    }

    determineRoute();
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
        <p className="text-xs text-slate-500 font-medium">Memuat aplikasi...</p>
      </div>
    </div>
  );
}

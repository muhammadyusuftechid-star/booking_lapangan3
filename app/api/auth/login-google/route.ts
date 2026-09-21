import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authResponse = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: "/user",
      },
      headers: request.headers,
      asResponse: true,
    });

    const data = await authResponse.json();
    const setCookie = authResponse.headers.get("set-cookie");

    if (data?.url) {
      const redirectResponse = NextResponse.redirect(data.url, { status: 302 });
      if (setCookie) {
        redirectResponse.headers.set("set-cookie", setCookie);
      }
      return redirectResponse;
    }

    return NextResponse.redirect(new URL("/?error=google_url_missing", request.url));
  } catch (error) {
    console.error("Gagal redirect Google OAuth:", error);
    return NextResponse.redirect(new URL("/?error=google_failed", request.url));
  }
}

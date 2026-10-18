import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Whitelist email admin resmi (fallback aman jika environment variable belum disetel)
const FALLBACK_ADMIN_EMAILS = [
  "akhyarmualif422006@gmail.com",
  "admin@modulku.id",
];

function getAdminEmails(): string[] {
  const envRaw = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  const fromEnv = envRaw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : FALLBACK_ADMIN_EMAILS;
}

function parseJwtPayload(token: string): { email?: string; exp?: number; role?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Proteksi server-side ketat lapis pertama (Defense-in-Depth) untuk seluruh rute /admin
  if (pathname.startsWith("/admin")) {
    const adminEmails = getAdminEmails();

    // 1. Periksa token Supabase dari Cookie
    const sbToken =
      req.cookies.get("sb_access_token")?.value ||
      req.cookies.get("sb-access-token")?.value;

    // Dukungan mode demo lokal saat pengembangan
    if (process.env.NODE_ENV !== "production" && sbToken === "guru_demo_token_aktif") {
      return NextResponse.next();
    }

    let userEmail: string | null = null;

    if (sbToken) {
      const payload = parseJwtPayload(sbToken);
      if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
        userEmail = payload.email || null;
      }
    }

    // 2. Jika tidak ada di Supabase cookie, periksa sesi NextAuth (Google OAuth)
    if (!userEmail) {
      try {
        // Coba periksa cookie sesi NextAuth pada HTTPS (Vercel Production)
        let nextAuthToken = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
          secureCookie: true,
        });
        // Jika null, coba fallback cookie sesi pada HTTP (Localhost)
        if (!nextAuthToken) {
          nextAuthToken = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
            secureCookie: false,
          });
        }
        if (nextAuthToken?.email) {
          userEmail = nextAuthToken.email;
        }
      } catch {
        // ignore decoding error
      }
    }

    // 3. Evaluasi Otoritas Server-Side Sebelum Mengirimkan HTML/JS
    if (!userEmail) {
      // Pengunjung tidak terotentikasi -> cegat sebelum render halaman admin
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isAuthorized = adminEmails.some(
      (adminEmail) => adminEmail.toLowerCase() === userEmail!.toLowerCase()
    );

    if (!isAuthorized) {
      // Pengguna masuk dengan akun guru biasa, bukan akun admin resmi
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Pengguna terverifikasi sebagai admin resmi
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

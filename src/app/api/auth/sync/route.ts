import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { syncGoogleUserToSupabase } from "@/lib/supabase/sync-user";

export async function POST(req: NextRequest) {
  try {
    let nextAuthToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: true,
    });

    if (!nextAuthToken) {
      nextAuthToken = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: false,
      });
    }

    if (!nextAuthToken?.email) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const result = await syncGoogleUserToSupabase({
      email: nextAuthToken.email,
      name: (nextAuthToken.name as string) || null,
      image: (nextAuthToken.picture as string) || null,
    });

    return NextResponse.json({
      success: true,
      synced: Boolean(result),
      user: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

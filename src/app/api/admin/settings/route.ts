import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdminAuth } from "@/lib/admin-auth";

// GET: Ambil pengaturan sistem (saluran pembayaran & whitelist admin)
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from("system_settings")
      .select("*");

    if (error) {
      return NextResponse.json({
        success: true,
        settings: {},
        warning: `Database table pending: ${error.message}`,
      });
    }

    const settingsMap: Record<string, unknown> = {};
    (data || []).forEach((row) => {
      settingsMap[row.key] = row.value;
    });

    return NextResponse.json({ success: true, settings: settingsMap });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT: Perbarui pengaturan sistem
export async function PUT(req: NextRequest) {
  const auth = await verifyAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error || "Akses ditolak" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { key, value } = body;

    if (!key || !value) {
      return NextResponse.json({ error: "key dan value wajib disertakan" }, { status: 400 });
    }

    const { error: dbError } = await supabaseAdmin
      .from("system_settings")
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
        updated_by: auth.email,
      });

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Catat ke audit log
    try {
      await supabaseAdmin.from("admin_audit_logs").insert({
        admin_email: auth.email,
        action: "UPDATE_SYSTEM_SETTINGS",
        target_type: "settings",
        target_id: key,
        details: { key, value },
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: `Pengaturan ${key} berhasil diperbarui di Supabase Cloud`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

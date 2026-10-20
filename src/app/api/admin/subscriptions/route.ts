import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdminAuth } from "@/lib/admin-auth";
import { SubscriptionTier } from "@/types";

// GET: Ambil daftar tiket persetujuan langganan
export async function GET(req: NextRequest) {
  const auth = await verifyAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error || "Akses ditolak" }, { status: 403 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("subscription_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // Jika tabel belum dieksekusi di Supabase, kembalikan status kosong yang aman
      return NextResponse.json({
        success: true,
        orders: [],
        warning: `Database table pending: ${error.message}`,
      });
    }

    return NextResponse.json({ success: true, orders: data || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH: Setujui (Approve) atau Tolak (Reject) pesanan langganan
export async function PATCH(req: NextRequest) {
  const auth = await verifyAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error || "Akses ditolak" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { orderId, status, adminNotes, targetTier, userId } = body;

    if (!orderId || !status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "orderId dan status ('approved' | 'rejected') wajib disertakan" },
        { status: 400 }
      );
    }

    // 1. Update status order di tabel subscription_orders jika tabel ada
    const updatePayload: Record<string, unknown> = {
      status,
      admin_notes: adminNotes || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: auth.email,
    };

    const { error: dbError } = await supabaseAdmin
      .from("subscription_orders")
      .update(updatePayload)
      .eq("id", orderId);

    // 2. Jika disetujui (Approved), otomatis tingkatkan paket akun guru di Supabase Auth
    if (status === "approved" && userId && targetTier) {
      const validTier: SubscriptionTier = ["pro", "school"].includes(targetTier)
        ? targetTier
        : "pro";

      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (userData?.user) {
        const existingMeta = userData.user.user_metadata || {};
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: {
            ...existingMeta,
            tier: validTier,
            tier_updated_at: new Date().toISOString(),
            tier_updated_by: auth.email,
            activated_order_id: orderId,
          },
        });
      }
    }

    // 3. Catat ke tabel admin_audit_logs secara non-blocking
    try {
      await supabaseAdmin.from("admin_audit_logs").insert({
        admin_email: auth.email,
        action: status === "approved" ? "APPROVE_SUBSCRIPTION" : "REJECT_SUBSCRIPTION",
        target_type: "subscription",
        target_id: orderId,
        details: { status, adminNotes, targetTier, userId },
      });
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: `Pesanan ${orderId} berhasil diubah statusnya menjadi ${status.toUpperCase()}`,
      dbWarning: dbError ? dbError.message : undefined,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

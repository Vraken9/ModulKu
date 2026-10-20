import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdminAuth } from "@/lib/admin-auth";
import { SubscriptionTier } from "@/types";

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  nip: string;
  schoolName: string;
  tier: SubscriptionTier;
  usedStorage: string;
  joinedAt: string;
  lastActive: string;
  provider?: string;
}

function formatDate(isoString?: string): string {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}

function formatRelativeTime(isoString?: string): string {
  if (!isoString) return "Belum pernah aktif";
  try {
    const d = new Date(isoString);
    const diffMs = Date.now() - d.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Baru saja";
    if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 30) return `${diffDays} hari yang lalu`;
    return formatDate(isoString);
  } catch {
    return "-";
  }
}

// GET: Ambil seluruh pengguna nyata dari Supabase Auth
export async function GET(req: NextRequest) {
  const auth = await verifyAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error || "Akses ditolak" }, { status: 403 });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const users: AdminUserItem[] = (data.users || []).map((u) => {
      const meta = u.user_metadata || {};
      const tier: SubscriptionTier = (meta.tier as SubscriptionTier) || "free";
      const storageLimit = tier === "free" ? "50 MB" : tier === "pro" ? "2 GB" : "25 GB";
      const displayName =
        meta.full_name ||
        meta.teacher_name ||
        (u.email ? u.email.split("@")[0] : "Pendidik ModulKu");

      return {
        id: u.id,
        name: displayName,
        email: u.email || "-",
        nip: meta.teacher_nip || meta.nip || "-",
        schoolName: meta.school_name || "-",
        tier,
        usedStorage: `0 MB / ${storageLimit}`,
        joinedAt: formatDate(u.created_at),
        lastActive: formatRelativeTime(u.last_sign_in_at),
        provider: u.app_metadata?.provider || (u.identities?.[0]?.provider ?? "email"),
      };
    });

    return NextResponse.json({ success: true, count: users.length, users });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH: Perbarui paket / tier pengguna di Supabase Auth secara instan
export async function PATCH(req: NextRequest) {
  const auth = await verifyAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error || "Akses ditolak" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { userId, tier } = body;

    if (!userId || !tier) {
      return NextResponse.json({ error: "userId dan tier wajib disertakan" }, { status: 400 });
    }

    if (!["free", "pro", "school"].includes(tier)) {
      return NextResponse.json({ error: "Tier tidak valid" }, { status: 400 });
    }

    // Ambil data user yang ada
    const { data: userData, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (getUserError || !userData.user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    // Update user_metadata di Supabase Auth
    const existingMeta = userData.user.user_metadata || {};
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...existingMeta,
        tier: tier as SubscriptionTier,
        tier_updated_at: new Date().toISOString(),
        tier_updated_by: auth.email,
      },
    });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Paket pengguna berhasil diubah menjadi ${tier.toUpperCase()}`,
      userId,
      tier,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

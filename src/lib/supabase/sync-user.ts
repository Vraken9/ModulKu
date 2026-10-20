import { supabaseAdmin } from "@/lib/supabase/admin";

export interface SyncUserData {
  id?: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface SyncResult {
  id: string;
  email: string;
  fullName: string;
  tier: string;
  isNewUser: boolean;
}

/**
 * Sinkronisasi otomatis pengguna Google OAuth ke Supabase Auth.
 * Menjamin setiap kali pengguna masuk dengan Google, datanya tercatat
 * di Supabase auth.users dan langsung terlihat di dasbor admin.
 */
export async function syncGoogleUserToSupabase(userData: SyncUserData): Promise<SyncResult | null> {
  if (!userData.email) return null;

  const email = userData.email.toLowerCase().trim();
  const fullName = userData.name?.trim() || email.split("@")[0];
  const avatarUrl = userData.image || "";

  try {
    // 1. Cari apakah pengguna sudah ada di Supabase Auth
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (listError) {
      console.error("Gagal mengambil daftar pengguna Supabase:", listError.message);
    }

    const existingUser = listData?.users?.find(
      (u) => u.email?.toLowerCase() === email
    );

    if (existingUser) {
      // Pengguna sudah terdaftar: perbarui metadata nama, avatar, dan waktu login terakhir
      const existingMeta = existingUser.user_metadata || {};
      const currentTier = (existingMeta.tier as string) || "free";

      const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          user_metadata: {
            ...existingMeta,
            full_name: existingMeta.full_name || fullName,
            avatar_url: avatarUrl || existingMeta.avatar_url,
            provider: "google",
            last_sign_in_google: new Date().toISOString(),
          },
        }
      );

      if (updateError) {
        console.warn("Peringatan saat memperbarui metadata pengguna:", updateError.message);
      }

      return {
        id: existingUser.id,
        email,
        fullName: existingMeta.full_name || fullName,
        tier: currentTier,
        isNewUser: false,
      };
    }

    // 2. Pengguna belum ada di Supabase: Daftarkan akun baru ke Supabase Auth
    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true, // Otomatis konfirmasi email karena diverifikasi oleh Google
      user_metadata: {
        full_name: fullName,
        name: fullName,
        avatar_url: avatarUrl,
        picture: avatarUrl,
        provider: "google",
        tier: "free",
        created_via: "google_oauth_sync",
        registered_at: new Date().toISOString(),
      },
    });

    if (createError) {
      console.error("Gagal mendaftarkan pengguna Google ke Supabase Auth:", createError.message);
      return null;
    }

    if (createData.user) {
      return {
        id: createData.user.id,
        email,
        fullName,
        tier: "free",
        isNewUser: true,
      };
    }

    return null;
  } catch (err) {
    console.error("Kesalahan tak terduga saat sinkronisasi pengguna Google ke Supabase:", err);
    return null;
  }
}

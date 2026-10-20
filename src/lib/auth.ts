import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { syncGoogleUserToSupabase } from "@/lib/supabase/sync-user";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  callbacks: {
    async signIn({ user, profile }) {
      if (user?.email) {
        try {
          // Sinkronisasi akun Google pengguna ke Supabase Auth
          const syncResult = await syncGoogleUserToSupabase({
            email: user.email,
            name: user.name || (profile as { name?: string })?.name,
            image: user.image || (profile as { picture?: string })?.picture,
          });

          if (syncResult?.id) {
            user.id = syncResult.id;
            (user as unknown as Record<string, unknown>).tier = syncResult.tier;
          }
        } catch (err) {
          console.error("Gagal sinkronisasi pengguna Google ke Supabase:", err);
          // Jangan batalkan proses masuk jika sinkronisasi database mengalami kendala jaringan sementara
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sub = user.id;
        const u = user as unknown as { tier?: string };
        if (u.tier) {
          token.tier = u.tier;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; tier?: string }).id =
          (token.id as string) || token.sub;
        if (token.tier) {
          (session.user as { id?: string; tier?: string }).tier =
            token.tier as string;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


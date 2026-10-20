"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  AlertCircle,
  KeyRound,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ModulKuLogo } from "@/components/ui/ModulKuLogo";
import { supabase } from "@/lib/supabase/client";
import { setActiveUserId } from "@/lib/document-vault";
import {
  getTeacherProfile,
  saveTeacherProfile,
  getSchoolProfile,
  saveSchoolProfile,
  clearCurrentSessionProfile,
} from "@/lib/user-profile";
import { isEmailAdmin } from "@/lib/subscription";
import { PrivacyPolicyModal } from "@/components/legal/PrivacyPolicyModal";

export default function LoginPage() {
  const router = useRouter();
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect") || "/dashboard";

      if (params.get("demo") === "guru") {
        setActiveUserId("demo_guru");
        localStorage.setItem("guru_auth_token", "guru_demo_token_aktif");
        if (typeof document !== "undefined") {
          document.cookie = "sb_access_token=guru_demo_token_aktif; path=/; max-age=2592000; SameSite=Lax";
        }
        saveTeacherProfile({
          teacher_name: "Dra. Siti Rahmawati, M.Pd.",
          teacher_nip: "198205142008012015",
          headmaster_name: "Drs. H. Mulyono, M.Pd.",
          headmaster_nip: "196811201994031004",
          user_id: "demo_guru",
        }, "demo_guru");
        saveSchoolProfile({
          school_name: "SMA Negeri 1 Purwantoro",
          npsn: "20311234",
          user_id: "demo_guru",
        }, "demo_guru");
        localStorage.setItem("modulku_vault_tier", "pro");
        router.replace(redirectUrl);
        return;
      }

      // Jika terotentikasi secara valid via Google OAuth (NextAuth)
      if (nextAuthStatus === "authenticated" && nextAuthSession?.user) {
        const uid = (nextAuthSession.user as { id?: string }).id || nextAuthSession.user.email || "google_user";
        setActiveUserId(uid);
        const fallbackName = nextAuthSession.user.name || (nextAuthSession.user.email ? nextAuthSession.user.email.split("@")[0] : undefined);
        getTeacherProfile(uid, fallbackName);
        getSchoolProfile(uid);

        // Pencegahan Loop: Hanya alihkan ke /admin jika akun memiliki otoritas admin
        if (redirectUrl.startsWith("/admin")) {
          const userEmail = nextAuthSession.user.email || "";
          if (!isEmailAdmin(userEmail)) {
            router.replace("/dashboard");
            return;
          }
        }

        router.replace(redirectUrl);
        return;
      }

      // Jika pengguna sudah login di Supabase atau mode demo lokal, langsung alihkan ke redirect target
      const checkExistingSession = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const localToken = localStorage.getItem("guru_auth_token");
          if (session?.user) {
            if (session.access_token && typeof document !== "undefined") {
              document.cookie = `sb_access_token=${session.access_token}; path=/; max-age=2592000; SameSite=Lax`;
            }
            setActiveUserId(session.user.id);
            const fallbackName = session.user.user_metadata?.full_name || (session.user.email ? session.user.email.split("@")[0] : undefined);
            getTeacherProfile(session.user.id, fallbackName);
            getSchoolProfile(session.user.id);

            // Pencegahan Loop: Hanya alihkan ke /admin jika akun memiliki otoritas admin
            if (redirectUrl.startsWith("/admin")) {
              const userEmail = session.user.email || "";
              if (!isEmailAdmin(userEmail)) {
                router.replace("/dashboard");
                return;
              }
            }

            router.replace(redirectUrl);
            return;
          } else if (localToken === "guru_demo_token_aktif") {
            router.replace(redirectUrl);
            return;
          } else if (localToken) {
            // Bersihkan token lokal palsu atau yang tersisa dari kegagalan autentikasi
            localStorage.removeItem("guru_auth_token");
          }
        } catch {
          // ignore
        }
      };
      checkExistingSession();

      if (params.get("confirmed") === "true") {
        setAuthSuccess("Alamat email Anda berhasil diverifikasi! Silakan masuk menggunakan email dan kata sandi.");
      }

      // Deteksi pesan eror dari hash Supabase (seperti otp_expired)
      if (typeof window !== "undefined" && window.location.hash) {
        try {
          const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
          const errCode = hashParams.get("error_code");
          if (errCode === "otp_expired") {
            setAuthError(
              "Tautan konfirmasi email telah kadaluarsa atau telah terpakai. Jika pendaftaran Anda sebelumnya telah tercatat, silakan langsung masuk menggunakan alamat email dan kata sandi Anda."
            );
          } else if (hashParams.get("error_description")) {
            setAuthError(decodeURIComponent(hashParams.get("error_description") || "Tautan tidak valid."));
          }
        } catch {
          // ignore
        }
      }

      const err = params.get("error");
      if (err) {
        if (err === "OAuthSignin" || err === "OAuthCallback" || err === "Configuration") {
          setAuthError(
            "Konfigurasi Google Client ID atau Secret di berkas .env.local belum terisi atau belum valid. Pastikan kredensial dari Google Cloud Console telah disimpan, lalu restart server."
          );
        } else {
          setAuthError("Gagal menghubungkan ke akun Google. Silakan coba kembali.");
        }
      }
    }
  }, [router, nextAuthSession, nextAuthStatus]);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearCurrentSessionProfile();
    setLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    // Validasi Dasar
    if (!email || !password) {
      setAuthError("Alamat email dan kata sandi wajib diisi.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setAuthError("Kata sandi harus terdiri dari minimal 6 karakter.");
      setLoading(false);
      return;
    }

    if (authMode === "signup") {
      if (!fullName.trim()) {
        setAuthError("Nama lengkap pendidik wajib diisi.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setAuthError("Konfirmasi kata sandi tidak cocok dengan kata sandi yang dimasukkan.");
        setLoading(false);
        return;
      }
      if (!agreePrivacy) {
        setAuthError("Anda wajib menyetujui Kebijakan Privasi & Perlindungan Data Kedinasan sesuai UU PDP No. 27/2022 untuk mendaftar.");
        setLoading(false);
        return;
      }

      try {
        const redirectOrigin =
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_APP_URL || "https://modul-ku.vercel.app";

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            emailRedirectTo: `${redirectOrigin}/login?confirmed=true`,
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          setAuthError(error.message || "Gagal mendaftarkan akun. Silakan coba kembali.");
          setLoading(false);
          return;
        }

        if (data.session && data.user) {
          if (data.session.access_token && typeof document !== "undefined") {
            document.cookie = `sb_access_token=${data.session.access_token}; path=/; max-age=2592000; SameSite=Lax`;
          }
          setActiveUserId(data.user.id);
          localStorage.setItem("guru_auth_token", data.session.access_token);
          saveTeacherProfile({
            teacher_name: fullName.trim(),
            teacher_nip: "-",
            user_id: data.user.id,
          }, data.user.id);
          getSchoolProfile(data.user.id);
          setAuthSuccess("Pendaftaran berhasil! Mengalihkan ke pengaturan profil sekolah...");
          setTimeout(() => {
            router.push("/profil-sekolah?onboarding=true");
          }, 800);
        } else {
          setAuthSuccess(
            "Pendaftaran akun pendidik berhasil! Silakan masuk dengan email dan kata sandi yang telah Anda daftarkan."
          );
          setAuthMode("signin");
          setPassword("");
          setConfirmPassword("");
          setLoading(false);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Terjadi kesalahan saat pendaftaran.";
        setAuthError(message);
        setLoading(false);
      }
      return;
    }

    // Mode Sign In (Masuk)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setAuthError("Alamat email atau kata sandi yang Anda masukkan tidak sesuai.");
        } else if (error.message.includes("Email not confirmed")) {
          setAuthError("Alamat email belum dikonfirmasi. Silakan periksa kotak masuk atau spam email Anda, atau hubungi admin.");
        } else {
          setAuthError(error.message || "Gagal masuk ke akun pendidik.");
        }
        setLoading(false);
        return;
      }

      if (data.session && data.user) {
        if (data.session.access_token && typeof document !== "undefined") {
          document.cookie = `sb_access_token=${data.session.access_token}; path=/; max-age=2592000; SameSite=Lax`;
        }
        setActiveUserId(data.user.id);
        localStorage.setItem("guru_auth_token", data.session.access_token);

        const teacherDisplayName =
          data.user.user_metadata?.full_name ||
          (data.user.email ? data.user.email.split("@")[0] : "Pendidik ModulKu");

        // Inisialisasi atau load profil terisolasi untuk akun ini
        const profile = getTeacherProfile(data.user.id, teacherDisplayName);
        if (
          data.user.user_metadata?.full_name &&
          profile.teacher_name !== data.user.user_metadata.full_name
        ) {
          saveTeacherProfile(
            { teacher_name: data.user.user_metadata.full_name },
            data.user.id
          );
        }
        // Inisialisasi profil sekolah terisolasi untuk akun ini
        getSchoolProfile(data.user.id);

        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get("redirect") || "/dashboard";
        setAuthSuccess("Kredensial terverifikasi. Mengalihkan ke ruang kerja...");
        setTimeout(() => {
          router.push(redirectUrl);
        }, 500);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat otentikasi.";
      setAuthError(message);
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    clearCurrentSessionProfile();
    setGoogleLoading(true);
    setAuthError(null);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setAuthError("Gagal menghubungkan ke layanan Google OAuth. Silakan masuk menggunakan Email & Kata Sandi.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Top Navbar Minimalis */}
      <header className="h-16 px-6 sm:px-10 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2.5">
          <ModulKuLogo size="md" showSubtitle subtitleText="Portal Guru" />
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
          {/* Kolom Kiri: Formulir Masuk / Daftar */}
          <div className="lg:col-span-7">
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="space-y-1.5 pb-5 border-b border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 w-fit">
                  <span>Autentikasi Terisolasi Per-Pendidik</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {authMode === "signin" ? "Masuk ke Ruang Kerja Guru" : "Daftar Akun Baru Pendidik"}
                </CardTitle>
                <CardDescription className="text-xs text-slate-600 leading-relaxed">
                  {authMode === "signin"
                    ? "Kelola modul ajar, bank dokumen pribadi, dan perangkat evaluasi pembelajaran secara terisolasi dan terlindungi."
                    : "Buat akun resmi untuk menyimpan perangkat ajar terstandar BKPDM secara mandiri di cloud database."}
                </CardDescription>

                {/* Tab Switcher: Masuk vs Daftar */}
                <div className="pt-2">
                  <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signin");
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        authMode === "signin"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Masuk (Sign In)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signup");
                        setAuthError(null);
                        setAuthSuccess(null);
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        authMode === "signup"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Daftar Akun Baru (Sign Up)
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-5">
                {/* Notifikasi Kendala / Error */}
                {authError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-900 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold">Pemberitahuan Autentikasi</p>
                      <p className="text-[11px] text-red-800 leading-relaxed">{authError}</p>
                    </div>
                  </div>
                )}

                {/* Notifikasi Sukses */}
                {authSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold">Operasi Berhasil</p>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">{authSuccess}</p>
                    </div>
                  </div>
                )}

                {/* Tombol OAuth: Masuk dengan Google */}
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  variant="outline"
                  className="w-full border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs h-11 rounded-xl gap-2.5 shadow-2xs transition-all cursor-pointer bg-white"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>
                    {googleLoading ? "Menghubungkan ke Google..." : "Lanjutkan dengan Akun Google / Belajar.id"}
                  </span>
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2.5 text-slate-500 text-[10px] font-bold font-mono">
                      Atau dengan Kredensial Surel Resmi
                    </span>
                  </div>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {/* Nama Lengkap jika mode pendaftaran */}
                  {authMode === "signup" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="fullname" className="text-xs font-bold text-slate-700">
                        Nama Lengkap Pendidik & Gelar
                      </Label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <Input
                          id="fullname"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Arfian Cahya, S.Pd."
                          className="pl-9 text-xs h-10 border-slate-300 focus-visible:ring-slate-900"
                          required={authMode === "signup"}
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                      Alamat Email Aktif / Akun Belajar.id
                    </Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama.guru@guru.sma.belajar.id"
                        className="pl-9 text-xs h-10 border-slate-300 focus-visible:ring-slate-900"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                        Kata Sandi
                      </Label>
                      {authMode === "signin" && (
                        <span className="text-[11px] text-slate-600 hover:text-slate-900 hover:underline cursor-pointer">
                          Lupa kata sandi?
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimal 6 karakter"
                        className="pl-9 text-xs h-10 border-slate-300 focus-visible:ring-slate-900"
                        required
                      />
                    </div>
                  </div>

                  {/* Konfirmasi Kata Sandi jika mode pendaftaran */}
                  {authMode === "signup" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">
                        Konfirmasi Kata Sandi
                      </Label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ketik ulang kata sandi Anda"
                          className="pl-9 text-xs h-10 border-slate-300 focus-visible:ring-slate-900"
                          required={authMode === "signup"}
                        />
                      </div>
                    </div>
                  )}

                  {/* Persetujuan Privasi Sesuai UU PDP No. 27/2022 */}
                  {authMode === "signup" && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreePrivacy}
                          onChange={(e) => setAgreePrivacy(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 accent-slate-900 text-slate-900 focus:ring-slate-900 w-4 h-4"
                          required
                        />
                        <span className="text-[11px] text-slate-600 leading-snug">
                          Saya menyetujui{" "}
                          <button
                            type="button"
                            onClick={() => setIsPrivacyModalOpen(true)}
                            className="font-bold text-slate-900 underline hover:text-slate-700 inline"
                          >
                            Kebijakan Privasi & Perlindungan Data Kedinasan
                          </button>{" "}
                          sesuai regulasi UU Pelindungan Data Pribadi No. 27 Tahun 2022.
                        </span>
                      </label>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-11 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    {loading
                      ? authMode === "signin"
                        ? "Memverifikasi Kredensial..."
                        : "Mendaftarkan Akun..."
                      : authMode === "signin"
                      ? "Masuk ke Dasbor Guru"
                      : "Buat Akun Pendidik Resmi"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Panduan Nilai Manfaat bagi Guru */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-white p-7 rounded-2xl shadow-sm space-y-4 border border-slate-800">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
                <span>Standar Regulasi BKPDM Kemendikdasmen</span>
              </div>

              <h2 className="text-xl font-black tracking-tight leading-snug">
                Kembalikan Waktu Berharga Anda untuk Siswa
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                Platform dirancang secara khusus untuk membebaskan pendidik di Indonesia dari rutinitas pengetikan klerikal berulang yang memicu kelelahan kognitif.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-2.5 text-slate-200">
                  <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-slate-300" />
                  </div>
                  <span>Isolasi dokumen dan bank arsip terenkripsi per akun pengguna</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200">
                  <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-slate-300" />
                  </div>
                  <span>Otomasi Modul Ajar dengan 3 pilar diferensiasi nyata</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200">
                  <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-slate-300" />
                  </div>
                  <span>Paket Soal AKM/HOTS lengkap dengan Matriks Kisi-Kisi</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200">
                  <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-slate-300" />
                  </div>
                  <span>Ekspor Word (.docx) resmi dengan margin 4-3-3-3 cm</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-200">
                  <div className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 text-slate-300" />
                  </div>
                  <span>Kepatuhan UU PDP No. 27/2022 atas data NIP & NPSN sekolah</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-[11px] text-slate-600 text-center">
              Perlindungan data terjamin sesuai prinsip keamanan informasi pendidikan nasional.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500 font-mono">
        ModulKu - Platform Otomasi Administrasi & Evaluasi Kurikulum Merdeka
      </footer>

      {/* Modal Kebijakan Privasi */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}

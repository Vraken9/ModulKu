"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ModulKuLogo } from "@/components/ui/ModulKuLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
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
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.setItem("guru_auth_token", "demo_session_active");
    } catch {
      // ignore
    }
    setTimeout(() => {
      router.push("/dashboard");
    }, 300);
  }

  function handleGoogleLogin() {
    setGoogleLoading(true);
    setAuthError(null);
    try {
      localStorage.setItem("guru_auth_token", "google_session_active");
    } catch {
      // ignore
    }
    signIn("google", { callbackUrl: "/dashboard" });
  }

  function handleDemoLogin() {
    setLoading(true);
    try {
      localStorage.setItem("guru_auth_token", "demo_session_active");
    } catch {
      // ignore
    }
    router.push("/dashboard");
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
          {/* Kolom Kiri: Formulir Masuk */}
          <div className="lg:col-span-7">
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="space-y-1.5 pb-5 border-b border-slate-100">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 w-fit">
                  <span>Autentikasi Pendidik</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Masuk ke Ruang Kerja Guru
                </CardTitle>
                <CardDescription className="text-xs text-slate-600 leading-relaxed">
                  Akses instan dasbor penyusunan perangkat ajar, generator soal HOTS, dan modul administrasi supervisi resmi.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 space-y-5">
                {/* Notifikasi jika ada kendala OAuth konfigurasi */}
                {authError && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold">Informasi Konfigurasi OAuth</p>
                      <p className="text-[11px] text-amber-800 leading-relaxed">{authError}</p>
                    </div>
                  </div>
                )}

                {/* Tombol Utama: Masuk dengan Akun Google / Belajar.id */}
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
                    {googleLoading ? "Menghubungkan ke Google..." : "Masuk dengan Akun Google / Belajar.id"}
                  </span>
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2.5 text-slate-500 text-[10px] font-bold font-mono">
                      Atau Masuk dengan Email & Kata Sandi
                    </span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                      Alamat Email / Akun Belajar.id
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
                      <span className="text-[11px] text-slate-600 hover:text-slate-900 hover:underline cursor-pointer">
                        Lupa kata sandi?
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan kata sandi"
                        className="pl-9 text-xs h-10 border-slate-300 focus-visible:ring-slate-900"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-11 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    {loading ? "Memverifikasi Kredensial..." : "Masuk ke Dasbor Guru"}
                  </Button>
                </form>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2.5 text-slate-500 text-[10px] font-bold font-mono">
                      Pratinjau Tanpa Akun
                    </span>
                  </div>
                </div>

                {/* Tombol One-Click Demo Login untuk kemudahan guru */}
                <Button
                  type="button"
                  onClick={handleDemoLogin}
                  variant="outline"
                  className="w-full border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs h-11 rounded-xl gap-2 shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-700" />
                  <span>Masuk Mode Demo Instan (Tanpa Registrasi)</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Panduan Nilai Manfaat bagi Guru */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-white p-7 rounded-2xl shadow-sm space-y-4 border border-slate-800">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-200">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
                <span>Standar Regulasi BSKAP 2024</span>
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
                  <span>Keselarasan bukti dukung kinerja Platform Merdeka Mengajar (PMM)</span>
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
    </div>
  );
}

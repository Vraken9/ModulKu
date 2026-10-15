"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Sparkles,
  School,
  FileCheck2,
  FileText,
  FileSpreadsheet,
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
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-mono font-bold text-slate-700 uppercase w-fit">
                  <span>AUTENTIKASI_PENDIDIK</span>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Masuk ke Ruang Kerja Guru
                </CardTitle>
                <CardDescription className="text-xs text-slate-600 leading-relaxed">
                  Akses instan dasbor penyusunan perangkat ajar, generator soal HOTS, dan modul administrasi supervisi resmi.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 space-y-5">
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
                      Atau Akses Cepat Langsung
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

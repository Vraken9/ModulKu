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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simpan token otentikasi lokal
    try {
      localStorage.setItem("guru_auth_token", "demo_session_active");
    } catch {
      // ignore
    }
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
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
      {/* Top Navbar */}
      <header className="h-16 px-6 sm:px-10 border-b border-slate-200 bg-white flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            M
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">
            ModulKu
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Utama</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
          {/* Kolom Kiri: Formulir Masuk */}
          <div className="lg:col-span-7">
            <Card className="border-slate-200 shadow-md">
              <CardHeader className="space-y-1 pb-4 border-b border-slate-100">
                <CardTitle className="text-xl font-bold text-slate-900">
                  Masuk ke Akun Guru
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Akses instan dasbor penyusunan perangkat ajar, generator soal HOTS, dan modul administrasi kedinasan.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 space-y-5">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                      Alamat Email / Akun Belajar.id
                    </Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama.guru@guru.sma.belajar.id"
                        className="pl-9 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                        Kata Sandi
                      </Label>
                      <span className="text-[11px] text-blue-700 hover:underline cursor-pointer">
                        Lupa kata sandi?
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-9 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs h-10 shadow-sm"
                  >
                    {loading ? "Memverifikasi Kredensial..." : "Masuk ke Dasbor"}
                  </Button>
                </form>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-600 text-[10px] font-bold">
                      Atau Akses Cepat Guru
                    </span>
                  </div>
                </div>

                {/* Tombol One-Click Demo Login untuk kemudahan guru */}
                <Button
                  type="button"
                  onClick={handleDemoLogin}
                  variant="outline"
                  className="w-full border-blue-200 hover:bg-blue-50/70 text-blue-900 font-bold text-xs h-10 gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blue-700" />
                  <span>Masuk Mode Demo Langsung (Tanpa Registrasi)</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Panduan Nilai Manfaat bagi Guru */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-md space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 text-[11px] font-semibold text-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Standar Regulasi BSKAP 2024</span>
              </div>

              <h2 className="text-xl font-extrabold tracking-tight leading-snug">
                Kembalikan Waktu Berharga Anda untuk Siswa
              </h2>

              <p className="text-xs text-blue-100/90 leading-relaxed">
                Platform dirancang secara khusus untuk membebaskan pendidik di Indonesia dari rutinitas pengetikan klerikal berulang yang memicu stres.
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-start gap-2 text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Otomasi Modul Ajar dengan 3 pilar diferensiasi nyata</span>
                </div>
                <div className="flex items-start gap-2 text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Paket Soal AKM/HOTS lengkap dengan Matriks Kisi-Kisi</span>
                </div>
                <div className="flex items-start gap-2 text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Ekspor Word (.docx) resmi dengan margin 4-3-3-3 cm</span>
                </div>
                <div className="flex items-start gap-2 text-blue-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Keselarasan bukti dukung kinerja Platform Merdeka Mengajar (PMM)</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 text-center">
              Perlindungan data terjamin sesuai prinsip keamanan informasi pendidikan nasional.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-600 font-mono">
        ModulKu - Platform Otomasi Administrasi & Evaluasi Kurikulum Merdeka
      </footer>
    </div>
  );
}

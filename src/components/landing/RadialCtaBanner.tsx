"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Download, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RadialCtaBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
      {/* Radial Gradient Aura & Background Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-blue-600/30 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/30 text-[11px] font-mono text-blue-300 font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>// AKSES RESMI PENDIDIK INDONESIA</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
          Punya Materi untuk Diajarkan? Susun Perangkatnya Sekarang.
        </h2>

        <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Hilangkan lembur klerikal malam hari. Hasilkan paket asesmen HOTS, modul ajar supervisi, dan matriks kisi-kisi standar BSKAP 2024 dalam hitungan detik.
        </p>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm h-12 px-8 shadow-lg shadow-blue-600/25 gap-2 border border-blue-400/30">
              <span>Mulai Buat Perangkat Ajar Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-slate-200 border-slate-700 hover:bg-slate-900 hover:text-white font-bold text-sm h-12 px-6">
              Masuk ke Dashboard Guru
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Regulasi BSKAP No. 032/2024</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Ekspor Word .DOCX & Slide .PPTX Asli</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Akses Gratis untuk Seluruh Guru</span>
          </div>
        </div>
      </div>
    </div>
  );
}

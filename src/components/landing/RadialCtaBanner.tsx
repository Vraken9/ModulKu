"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Download, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RadialCtaBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
      {/* Radial Gradient Aura & Background Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-slate-700/20 via-slate-800/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-300 font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-slate-300" />
          <span>// AKSES RESMI PENDIDIK INDONESIA</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
          Punya Materi untuk Diajarkan? Susun Bersama ModulKu Sekarang.
        </h2>

        <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Hilangkan lembur klerikal malam hari. Hasilkan paket asesmen HOTS, modul ajar supervisi, dan matriks kisi-kisi standar BSKAP 2024 dalam hitungan detik.
        </p>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm h-12 px-8 shadow-lg gap-2 border border-slate-200">
              <span>Mulai Buat Perangkat Ajar</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-slate-900
             bg-white border-slate-700 hover:text-black font-bold text-sm h-12 px-6">
              Masuk ke Dashboard Guru
            </Button>
          </Link>
        </div>

        {/* Trust Badges Monochromatic */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium font-mono">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-slate-300" />
            <span>100% REGULASI BSKAP NO. 032/2024</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-slate-300" />
            <span>EKSPOR WORD .DOCX & SLIDE .PPTX ASLI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-slate-300" />
            <span>AKSES GRATIS UNTUK SELURUH GURU</span>
          </div>
        </div>
      </div>
    </div>
  );
}

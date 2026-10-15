"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Download, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RadialCtaBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 text-white p-8 sm:p-14 lg:p-20 shadow-2xl">
      {/* Radial Gradient Aura & Background Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-slate-700/25 via-slate-800/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl lg:max-w-5xl mx-auto text-center space-y-7">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-300 font-semibold tracking-normal">
          <Sparkles className="w-4 h-4 text-slate-300" />
          <span>Akses Resmi Pendidik Indonesia</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
          Punya Materi untuk Diajarkan? Susun Bersama{" "}
          <span className="relative inline-block px-3 sm:px-4 py-1 sm:py-1.5 mx-1.5 rounded-xl bg-blue-50 text-slate-900 shadow-md">
            ModulKu
          </span>{" "}
          Sekarang.
        </h2>

        <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Hilangkan lembur klerikal malam hari. Hasilkan paket asesmen HOTS, modul ajar supervisi, dan matriks kisi-kisi standar BKPDM Kemendikdasmen dalam hitungan detik.
        </p>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm sm:text-base h-13 sm:h-14 px-9 rounded-2xl shadow-xl gap-2.5 border border-slate-200">
              <span>Mulai Buat Perangkat Ajar</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-white bg-slate-900/60 border-slate-700 hover:bg-slate-800 hover:text-white font-bold text-sm sm:text-base h-13 sm:h-14 px-7 rounded-2xl">
              Masuk ke Dashboard Guru
            </Button>
          </Link>
        </div>

        {/* Trust Badges Monochromatic */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2.5 gap-x-8 text-xs sm:text-sm text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-300" />
            <span>100% Regulasi BKPDM Kemendikdasmen</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-300" />
            <span>Ekspor Word .DOCX & Slide .PPTX Asli</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-300" />
            <span>Akses Terbuka untuk Seluruh Guru</span>
          </div>
        </div>
      </div>
    </div>
  );
}

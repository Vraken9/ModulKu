"use client";

import React, { useState } from "react";
import { BookOpen, Sparkles, CheckCircle2, FunctionSquare, Layers, FileSpreadsheet, Check, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function BentoPedagogical() {
  const [activeDiferensiasi, setActiveDiferensiasi] = useState<"konten" | "proses" | "produk">("konten");

  return (
    <div className="space-y-12">
      {/* Header Pengantar */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-mono font-bold text-blue-700 tracking-wide uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>// KEMAMPUAN PEDAGOGIS MENDALAM</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Bukan Sekadar Generator Teks AI Biasa
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Setiap butir soal, skenario ajar, dan instrumen asesmen dikonstruksi secara ilmiah mengacu langsung pada Taksonomi Bloom Terkoreksi dan Keputusan Kepala BSKAP No. 032/H/KR/2024.
        </p>
      </div>

      {/* Feature Bento Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: 3 Pilar Pembelajaran Berdiferensiasi (Span 2 Kolom) */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <span className="font-extrabold text-base text-slate-900">
                  3 Pilar Pembelajaran Berdiferensiasi
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-800 border-blue-200 font-bold">
                STANDAR BSKAP 2024
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Modul ajar merinci secara eksplisit strategi pembelajaran yang disesuaikan dengan kesiapan belajar, minat, dan profil belajar murid.
            </p>

            {/* Interactive Tab Switcher */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => setActiveDiferensiasi("konten")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDiferensiasi === "konten"
                    ? "bg-blue-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                1. Diferensiasi Konten
              </button>
              <button
                onClick={() => setActiveDiferensiasi("proses")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDiferensiasi === "proses"
                    ? "bg-blue-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                2. Diferensiasi Proses
              </button>
              <button
                onClick={() => setActiveDiferensiasi("produk")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeDiferensiasi === "produk"
                    ? "bg-blue-700 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                3. Diferensiasi Produk
              </button>
            </div>

            {/* Dynamic Content Detail */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
              {activeDiferensiasi === "konten" && (
                <div>
                  <span className="font-bold text-blue-800 block mb-1">Diferensiasi Materi & Sumber Belajar:</span>
                  Menyediakan teks naratif bagi pembaca visual, infografis ringkas untuk pemahaman awal, serta materi tantangan lanjutan berbasis riset bagi siswa yang telah mencapai kemahiran tinggi.
                </div>
              )}
              {activeDiferensiasi === "proses" && (
                <div>
                  <span className="font-bold text-blue-800 block mb-1">Diferensiasi Pendampingan & Aktivitas:</span>
                  Mengelompokkan siswa secara fleksibel (scaffolding bagi yang membutuhkan bimbingan intensif, bimbingan berkala bagi yang berkembang, dan tugas mandiri eksploratif).
                </div>
              )}
              {activeDiferensiasi === "produk" && (
                <div>
                  <span className="font-bold text-blue-800 block mb-1">Diferensiasi Unjuk Kerja & Asesmen:</span>
                  Memberikan keleluasaan hasil belajar berupa laporan tulisan terstruktur, presentasi lisan, poster visual, atau simulasi rekayasa sesuai kekuatan murid.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: KaTeX & Simbol Sains (Span 1 Kolom) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <FunctionSquare className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-mono text-purple-700 font-bold">
                [KATEX_ENGINE]
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Dukungan Formula KaTeX & Simbol Sains
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tidak ada teks rusak atau formula acak. Persamaan matematika, reaksi kimia, dan besaran fisika dirender presisi.
              </p>
            </div>

            {/* Visual Formula Mockup */}
            <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl font-mono text-xs text-purple-950 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-purple-700 font-bold border-b border-purple-200/50 pb-1">
                <span>Contoh Formula Fisika & Kimia:</span>
                <span>Rendered</span>
              </div>
              <div className="text-center py-1 font-semibold text-sm">
                E = m · c² &nbsp;|&nbsp; 2H₂ + O₂ → 2H₂O
              </div>
              <div className="text-center text-[11px] text-purple-800">
                f(x) = ∫ (3x² + 2x) dx = x³ + x² + C
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Pemetaan Taksonomi Bloom (Span 1 Kolom) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                [BLOOM_C1-C6]
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Taksonomi Kognitif Bloom Terpadu
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Distribusi level kognitif terpetakan jelas pada kisi-kisi dan butir soal dari tingkat dasar hingga tingkat tinggi.
              </p>
            </div>

            {/* Cognitive Bars */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700">LOTS (C1-C2 Mengingat & Memahami)</span>
                <span className="font-bold text-slate-500">25%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full w-1/4" />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-blue-700">MOTS (C3-C4 Menerapkan & Menganalisis)</span>
                <span className="font-bold text-blue-700">45%</span>
              </div>
              <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-[45%]" />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-700">HOTS (C5-C6 Mengevaluasi & Mencipta)</span>
                <span className="font-bold text-emerald-700">30%</span>
              </div>
              <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full w-[30%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Stimulus Variatif AKM (Span 2 Kolom) */}
        <div className="md:col-span-2 bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-4.5 h-4.5" />
                </div>
                <span className="font-extrabold text-base text-slate-900">
                  Stimulus Variatif Sesuai Standar Asesmen Nasional (AKM)
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono bg-indigo-50 text-indigo-800 border-indigo-200 font-bold">
                LITERASI & NUMERASI
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Soal tidak berupa pertanyaan hafalan kering. Soal diperkaya dengan stimulus teks saintifik, kutipan artikel terkini, data tabel, grafik komparatif, dan permasalahan dunia nyata.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs block">Konteks Saintifik</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Fenomena alam, transisi energi hijau, dan teknologi digital.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs block">Konteks Sosial Budaya</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Kearifan lokal Nusantara, interaksi sosial, dan literasi finansial.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs block">Konteks Personal</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Kesehatan, nutrisi seimbang, dan kebiasaan hidup berkelanjutan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

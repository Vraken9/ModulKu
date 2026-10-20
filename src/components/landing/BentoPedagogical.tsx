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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
          <BookOpen className="w-3.5 h-3.5 text-slate-700" />
          <span>Pendekatan Pedagogis & Pembelajaran Mendalam</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Bukan Sekadar Generator Teks AI Biasa
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Setiap butir soal, skenario pembelajaran, dan instrumen asesmen dikonstruksi secara ilmiah mengacu langsung pada Taksonomi Bloom Terkoreksi, rubrik asesmen autentik, serta paradigma Pembelajaran Mendalam (Deep Learning: Mindful, Meaningful, Joyful).
        </p>
      </div>

      {/* Feature Bento Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: 3 Pilar Pembelajaran Berdiferensiasi (Span 2 Kolom) */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <Layers className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="font-extrabold text-base text-slate-900">
                  3 Pilar Pembelajaran Berdiferensiasi & Deep Learning
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-medium bg-slate-100 text-slate-700 border-slate-200">
                Standar BKPDM 2026
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Modul ajar merinci secara eksplisit strategi pembelajaran yang disesuaikan dengan kesiapan belajar, minat, dan profil belajar murid di kelas.
            </p>

            {/* Interactive Tab Switcher Monokromatik */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveDiferensiasi("konten")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeDiferensiasi === "konten"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                1. Diferensiasi Konten
              </button>
              <button
                type="button"
                onClick={() => setActiveDiferensiasi("proses")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeDiferensiasi === "proses"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                2. Diferensiasi Proses
              </button>
              <button
                type="button"
                onClick={() => setActiveDiferensiasi("produk")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeDiferensiasi === "produk"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                3. Diferensiasi Produk
              </button>
            </div>

            {/* Dynamic Content Detail */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
              {activeDiferensiasi === "konten" && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Diferensiasi Materi & Sumber Belajar:</span>
                  Menyediakan teks naratif bagi pembaca visual, infografis ringkas untuk pemahaman awal, serta materi tantangan lanjutan berbasis riset bagi siswa yang telah mencapai kemahiran tinggi.
                </div>
              )}
              {activeDiferensiasi === "proses" && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Diferensiasi Pendampingan & Aktivitas:</span>
                  Mengelompokkan siswa secara fleksibel (scaffolding bagi yang membutuhkan bimbingan intensif, bimbingan berkala bagi yang berkembang, dan tugas mandiri eksploratif).
                </div>
              )}
              {activeDiferensiasi === "produk" && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Diferensiasi Unjuk Kerja & Asesmen:</span>
                  Memberikan keleluasaan hasil belajar berupa laporan tulisan terstruktur, presentasi lisan, poster visual, atau simulasi rekayasa sesuai kekuatan murid.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: KaTeX & Simbol Sains (Span 1 Kolom) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <FunctionSquare className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Formula KaTeX Presisi
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Dukungan Formula KaTeX & Sains
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bebas formula rusak atau teks acak. Persamaan matematika, reaksi kimia, dan besaran fisika dirender presisi.
              </p>
            </div>

            {/* Visual Formula Mockup */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold border-b border-slate-200/80 pb-1.5">
                <span>CONTOH PERSAMAAN SAINS:</span>
                <span className="text-slate-800 font-semibold">Rendered</span>
              </div>
              <div className="text-center py-1 font-semibold text-sm text-slate-900">
                E = m · c² &nbsp;|&nbsp; 2H₂ + O₂ → 2H₂O
              </div>
              <div className="text-center text-[11px] text-slate-700">
                f(x) = ∫ (3x² + 2x) dx = x³ + x² + C
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Pemetaan Taksonomi Bloom (Span 1 Kolom) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
                Taksonomi Bloom C1-C6
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Taksonomi Kognitif Terpadu
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Distribusi level kognitif terpetakan jelas pada kisi-kisi dan butir soal dari tingkat dasar hingga tingkat tinggi.
              </p>
            </div>

            {/* Cognitive Bars Monokromatik */}
            <div className="space-y-2.5 pt-1 text-xs">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-slate-600">LOTS (C1-C2 Mengingat)</span>
                  <span className="font-mono font-bold text-slate-500">25%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full w-1/4" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-slate-800">MOTS (C3-C4 Menganalisis)</span>
                  <span className="font-mono font-bold text-slate-800">45%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-700 rounded-full w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-slate-950">HOTS (C5-C6 Mencipta)</span>
                  <span className="font-mono font-black text-slate-950">30%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-950 rounded-full w-[30%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Stimulus Variatif AKM (Span 2 Kolom) */}
        <div className="md:col-span-2 bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="font-extrabold text-base text-slate-900">
                  Stimulus Variatif Sesuai Standar Asesmen Nasional (AKM)
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono bg-white text-slate-800 border-slate-300 font-bold">
                LITERASI & NUMERASI
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Soal tidak berupa pertanyaan hafalan kering. Soal diperkaya dengan stimulus teks saintifik, kutipan artikel terkini, data tabel, grafik komparatif, dan permasalahan dunia nyata.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs block">Konteks Saintifik</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Fenomena alam, transisi energi hijau, dan teknologi digital.
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-xs block">Konteks Sosial Budaya</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Kearifan lokal Nusantara, interaksi sosial, dan literasi finansial.
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1">
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

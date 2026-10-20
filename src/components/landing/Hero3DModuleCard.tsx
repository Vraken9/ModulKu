"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FileText,
  CheckCircle2,
  Layers,
  Sparkles,
  BookOpen,
  Check,
  RotateCcw,
  Maximize2,
  SlidersHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Hero3DModuleCard() {
  const [activeTab, setActiveTab] = useState<"workspace" | "structure">("workspace");

  return (
    <div className="relative w-full max-w-[620px] mx-auto select-none py-2 sm:py-4 px-2 sm:px-0">
      {/* Container Showcase Modern */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-slate-300">
        {/* Top Control Bar with Tab Switcher */}
        <div className="p-3 sm:p-4 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
            <span className="text-xs font-bold text-slate-700 ml-1.5 hidden sm:inline">
              ModulKu Digital Workspace
            </span>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("workspace")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === "workspace"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Ruang Kerja
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("structure")}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === "structure"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Struktur Modul
            </button>
          </div>
        </div>

        {/* Tab 1: Foto Ruang Kerja Digital Guru (Visual Sesuai Tema) */}
        {activeTab === "workspace" && (
          <div className="relative overflow-hidden group">
            {/* Visual Gambar Ruang Kerja Guru */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
              <Image
                src="/images/hero-showcase.jpg"
                alt="Ruang Kerja Penyusunan Modul Ajar Guru ModulKu"
                width={800}
                height={600}
                priority
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Badge 1 (Top Left): Deep Learning Focus */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-md text-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/90 px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-lg flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Pendekatan Pedagogis
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                  Deep Learning Mindful & Joyful
                </span>
              </div>
            </div>

            {/* Floating Badge 2 (Top Right): Format Standar Siap Cetak */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur-md text-slate-900 rounded-xl sm:rounded-2xl border border-slate-200/90 px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-lg flex items-center gap-2 transition-transform duration-300 hover:scale-105">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-800">
                Format .DOCX Margin 4-3-3-3
              </span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-slate-900/90 backdrop-blur-md text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/20">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-white truncate">
                    Otomasi Administrasi Pendidik
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-300 truncate">
                    Modul Ajar, ATP, Asesmen HOTS & Kisi-Kisi Ujian
                  </p>
                </div>
              </div>
              <div className="shrink-0 pl-2">
                <span className="text-[10px] sm:text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/15 text-white border border-white/20 font-bold whitespace-nowrap">
                  Siap Edit & Cetak
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Struktur Rinci Modul Ajar (Tanpa Klaim Palsu) */}
        {activeTab === "structure" && (
          <div className="p-5 sm:p-7 space-y-4 bg-white">
            {/* Kop Surat Header Monokromatik Sederhana */}
            <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                  M
                </div>
                <div>
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 block">
                    Modul Ajar Pembelajaran Mendalam
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    KURIKULUM MERDEKA - FASE E (SMA/SMK)
                  </span>
                </div>
              </div>
              <div className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                Kelas X IPA
              </div>
            </div>

            {/* Parameter Pembelajaran */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Topik: Energi Terbarukan & Efisiensi Berkelanjutan</span>
                <span className="font-mono text-slate-900 font-bold">24 JP Efektif</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Pembelajaran dirancang berbasis proyek kolaboratif untuk menumbuhkan nalar kritis dan pemahaman konsep sains kontekstual.
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-semibold text-slate-700">
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                  Mindful Learning
                </span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                  Meaningful Connection
                </span>
                <span className="px-2 py-0.5 rounded bg-white border border-slate-200">
                  Joyful Assessment
                </span>
              </div>
            </div>

            {/* Contoh Stimulus Asesmen AKM / HOTS */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-800 block">
                Contoh Stimulus Soal Penalaran Kontekstual
              </span>
              <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                &ldquo;Sebuah instalasi turbin angin mikro menghasilkan daya puncak pada kecepatan angin tertentu. Analisislah korelasi massa jenis udara terhadap daya keluaran mekanik...&rdquo;
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <span className="font-medium">Tingkat Berpikir: C4 (Menganalisis)</span>
                <span className="font-mono font-bold text-slate-900">Format Opsi Ganda & Rubrik</span>
              </div>
            </div>

            {/* Output Dokumen */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold pt-1">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[11px]">
                .DOCX 4-3-3-3
              </div>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-[11px]">
                Kop Dua Logo
              </div>
              <div className="p-2 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[11px]">
                Slide PPTX 16:9
              </div>
            </div>
          </div>
        )}

        {/* Footer Bar Sederhana */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            Pratinjau tampilan perangkat ajar dan instrumen asesmen pada ModulKu
          </p>
        </div>
      </div>
    </div>
  );
}

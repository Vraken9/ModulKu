"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  FileSpreadsheet,
  FileDown,
  ArrowRight,
  Check,
  Cpu,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WorkflowStep {
  step: string;
  code: string;
  title: string;
  description: string;
  points: string[];
  mockupSnippet: {
    badge: string;
    label: string;
    data: string[];
    footer: string;
  };
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: "01",
    code: "Tahap Konfigurasi",
    title: "Tentukan Jenjang & Karakteristik Kelas",
    description: "Pilih fase capaian (A sampai F), mata pelajaran, dan proporsi tingkat kesukaran tanpa perlu menyusun prompt AI yang rumit.",
    points: [
      "Pilihan Fase A (SD) hingga Fase F (SMA/SMK)",
      "Pengaturan proporsi tingkat kesukaran: Mudah, Sedang, Sulit",
      "Pemetaan taksonomi Bloom (C1 mengingat hingga C6 mencipta)",
    ],
    mockupSnippet: {
      badge: "Fase E (Kelas X)",
      label: "Parameter Pembelajaran",
      data: ["Mata Pelajaran: IPA (Fisika)", "Elemen: Pemahaman Sains", "Target: 25 Butir Soal HOTS"],
      footer: "Parameter Tervalidasi 100%",
    },
  },
  {
    step: "02",
    code: "Pemetaan Kisi-Kisi",
    title: "Sistem Memetakan Kisi-Kisi & Naskah",
    description: "Mesin menyusun naskah lengkap dengan stimulus kontekstual AKM, opsi jawaban proporsional, serta tabel kisi-kisi otomatis.",
    points: [
      "Stimulus kontekstual: teks saintifik, studi kasus, grafik",
      "Tabel matriks memetakan CP, TP, dan Indikator Soal",
      "Kunci jawaban disertai pembahasan analitis untuk feedback",
    ],
    mockupSnippet: {
      badge: "Standar BKPDM 2026",
      label: "Konstruksi Instrumen",
      data: ["Stimulus: Efisiensi Panel Surya", "Taksonomi: C4 Menganalisis", "Rubrik Penskoran: Analitik"],
      footer: "Kisi-Kisi Terkonstruksi",
    },
  },
  {
    step: "03",
    code: "Ekspor Kedinasan",
    title: "Tinjau, Edit, & Ekspor Berkas Siap Cetak",
    description: "Periksa naskah di layar, lakukan penyuntingan jika diperlukan, lalu unduh dokumen lengkap dengan margin standar dan Kop Surat.",
    points: [
      "Ekspor dokumen Word (.DOCX) asli margin 4-3-3-3 cm",
      "Otomatis memuat Kop Surat dua logo dan lembar tanda tangan",
      "Dapat langsung dicetak di kertas A4/F4 tanpa penyesuaian ulang",
    ],
    mockupSnippet: {
      badge: "Format Word Native",
      label: "Berkas Siap Distribusi",
      data: ["Margin: 4 cm - 3 cm - 3 cm - 3 cm", "Kop Dinas: Otomatis 2 Logo", "Status: Siap Cetak & Arsip"],
      footer: "Siap Distribusi & Supervisi",
    },
  },
];

export function WorkflowSteps() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="space-y-12">
      {/* Header Pengantar */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800">
          <Cpu className="w-4 h-4 text-slate-700" />
          <span>Alur Kerja Terpandu 3 Tahap</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Tiga Langkah Sederhana Menuju Dokumen Siap Pakai
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Hilangkan kerumitan prompt AI klerikal. Cukup ikuti tiga tahapan intuitif yang diselaraskan langsung dengan kebutuhan administrasi pendidikan Anda.
        </p>
      </div>

      {/* 3 Horizontal Connected Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
        {WORKFLOW_STEPS.map((item, idx) => {
          const isHovered = hoveredStep === idx;
          return (
            <div
              key={item.step}
              onMouseEnter={() => setHoveredStep(idx)}
              onMouseLeave={() => setHoveredStep(null)}
              className={`rounded-3xl border bg-white p-7 sm:p-8 lg:p-9 flex flex-col justify-between transition-all duration-200 shadow-xs relative ${
                isHovered
                  ? "border-slate-400 shadow-md -translate-y-1"
                  : "border-slate-200"
              }`}
            >
              <div className="space-y-5">
                {/* Step Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-black text-base shadow-xs">
                    {item.step}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/70">
                    {item.code}
                  </span>
                </div>

                {/* Title & Summary */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Interactive Mini UI Snippet */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">
                      {item.mockupSnippet.label}
                    </span>
                    <Badge variant="outline" className="text-xs font-medium bg-white text-slate-700 border-slate-200">
                      {item.mockupSnippet.badge}
                    </Badge>
                  </div>
                  <div className="space-y-1.5 pt-0.5 text-xs text-slate-700 font-medium">
                    {item.mockupSnippet.data.map((d, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2">
                        <span className="text-slate-400">•</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                    <span>{item.mockupSnippet.footer}</span>
                    <span className="text-emerald-700 font-bold">OK</span>
                  </div>
                </div>

                {/* Bullet Points */}
                <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-600">
                  {item.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Action Footer */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-400 font-medium text-xs">
                  Tahapan {item.step} dari 03
                </span>
                <Link
                  href="/login"
                  className="font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1.5 group/btn"
                >
                  <span>Coba Langkah Ini</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

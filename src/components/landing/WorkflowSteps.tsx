"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, FileText, SlidersHorizontal, Cpu, Download, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    code: "KONFIGURASI_PARAMETER",
    title: "Tentukan Jenjang & Karakteristik Kelas",
    description: "Pilih fase capaian (A sampai F), mata pelajaran, dan proporsi tingkat kesukaran tanpa perlu menyusun prompt AI yang rumit.",
    points: [
      "Pilihan Fase A (SD) hingga Fase F (SMA/SMK)",
      "Pengaturan proporsi tingkat kesukaran: Mudah, Sedang, Sulit",
      "Pemetaan taksonomi Bloom (C1 mengingat hingga C6 mencipta)",
    ],
    mockupSnippet: {
      badge: "FASE E // KELAS X",
      label: "Parameter Pembelajaran",
      data: ["Mata Pelajaran: IPA (Fisika)", "Elemen: Pemahaman Sains", "Target: 25 Butir Soal HOTS"],
      footer: "Parameter Tervalidasi 100%",
    },
  },
  {
    step: "02",
    code: "GENERASI_PEDAGOGIS",
    title: "Sistem Memetakan Kisi-Kisi & Naskah",
    description: "Mesin menyusun naskah lengkap dengan stimulus kontekstual AKM, opsi jawaban proporsional, serta tabel kisi-kisi otomatis.",
    points: [
      "Stimulus kontekstual: teks saintifik, studi kasus, grafik",
      "Tabel matriks memetakan CP, TP, dan Indikator Soal",
      "Kunci jawaban disertai pembahasan analitis untuk feedback",
    ],
    mockupSnippet: {
      badge: "STANDAR BSKAP 032",
      label: "Konstruksi Instrumen",
      data: ["Stimulus: Efisiensi Panel Surya", "Taksonomi: C4 Menganalisis", "Rubrik Penskoran: Analitik"],
      footer: "Kisi-Kisi Terkonstruksi",
    },
  },
  {
    step: "03",
    code: "EKSPOR_KEDINASAN",
    title: "Tinjau, Edit, & Ekspor Berkas Resmi",
    description: "Periksa naskah di layar, lakukan penyuntingan jika diperlukan, lalu unduh dokumen resmi dengan margin kedinasan dan Kop Surat.",
    points: [
      "Ekspor dokumen Word (.DOCX) asli margin 4-3-3-3 cm",
      "Otomatis memuat Kop Surat dua logo dan lembar tanda tangan",
      "Dapat langsung dicetak di kertas A4/F4 tanpa penyesuaian ulang",
    ],
    mockupSnippet: {
      badge: "WORD .DOCX NATIVE",
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
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
          <Cpu className="w-3.5 h-3.5 text-slate-700" />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {WORKFLOW_STEPS.map((item, idx) => {
          const isHovered = hoveredStep === idx;
          return (
            <div
              key={item.step}
              onMouseEnter={() => setHoveredStep(idx)}
              onMouseLeave={() => setHoveredStep(null)}
              className={`rounded-2xl border bg-white p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 shadow-xs relative ${
                isHovered
                  ? "border-slate-400 shadow-md -translate-y-1"
                  : "border-slate-200"
              }`}
            >
              <div className="space-y-4">
                {/* Step Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-black text-sm">
                    {item.step}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    //{item.code}
                  </span>
                </div>

                {/* Title & Summary */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Interactive Mini UI Snippet */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                      {item.mockupSnippet.label}
                    </span>
                    <Badge variant="outline" className="text-[9px] font-mono bg-white text-slate-800 border-slate-300">
                      {item.mockupSnippet.badge}
                    </Badge>
                  </div>
                  <div className="space-y-1 pt-0.5 text-[11px] text-slate-700 font-medium">
                    {item.mockupSnippet.data.map((d, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-1.5">
                        <span className="text-slate-400">•</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] font-mono text-slate-600">
                    <span className="font-bold text-slate-900">{item.mockupSnippet.footer}</span>
                    <span>OK</span>
                  </div>
                </div>

                {/* Verification Points */}
                <div className="space-y-2 pt-1">
                  {item.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                        <Check className="w-2.5 h-2.5 text-slate-800 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-500">
                  TAHAPAN {item.step} DARI 03
                </span>
                <Link
                  href="/login"
                  className="font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1 transition-colors"
                >
                  <span>Coba Langkah Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

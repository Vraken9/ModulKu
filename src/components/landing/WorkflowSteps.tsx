"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, SlidersHorizontal, Cpu, Download, FileText, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StepData {
  id: string;
  stepNumber: string;
  badge: string;
  title: string;
  summary: string;
  details: string[];
  mockup: {
    headerTitle: string;
    tag: string;
    contentTitle: string;
    contentLines: string[];
    actionLabel: string;
  };
}

const STEPS: StepData[] = [
  {
    id: "step-1",
    stepNumber: "01",
    badge: "INPUT PARAMETER",
    title: "Tentukan Jenjang & Karakteristik Kelas",
    summary: "Pilih tingkat pendidikan, fase capaian (A sampai F), mata pelajaran, serta topik materi spesifik tanpa perlu menyusun prompt AI yang rumit.",
    details: [
      "Pilihan Fase A (SD Kelas 1-2) hingga Fase F (SMA/SMK Kelas 11-12)",
      "Pengaturan proporsi tingkat kesukaran: Mudah, Sedang, Sulit",
      "Pemilihan taksonomi Bloom (C1 mengingat hingga C6 mencipta)",
    ],
    mockup: {
      headerTitle: "Konfigurasi Pembelajaran",
      tag: "Fase E // Kelas X",
      contentTitle: "Parameter Asesmen Sumatif Fisika",
      contentLines: [
        "Mata Pelajaran: Ilmu Pengetahuan Alam (Fisika)",
        "Elemen CP: Pemahaman Sains & Keterampilan Proses",
        "Komposisi: 30% LOTS, 40% MOTS, 30% HOTS",
      ],
      actionLabel: "Parameter Tervalidasi 100%",
    },
  },
  {
    id: "step-2",
    stepNumber: "02",
    badge: "GENERASI CERDAS",
    title: "Sistem Memetakan Kisi-Kisi & Naskah Soal",
    summary: "Mesin pedagogis memproses parameter Anda ke dalam naskah asesmen lengkap dengan stimulus kontekstual AKM, opsi jawaban proporsional, dan rubrik.",
    details: [
      "Stimulus kontekstual: teks saintifik, tabel numerasi, studi kasus",
      "Matriks kisi-kisi otomatis memetakan CP, TP, dan Indikator Soal",
      "Kunci jawaban disertai pembahasan analitis untuk feedback siswa",
    ],
    mockup: {
      headerTitle: "Matriks Asesmen & Kisi-Kisi",
      tag: "Standar BSKAP 032/2024",
      contentTitle: "Butir Soal & Rubrik Terkonstruksi",
      contentLines: [
        "Stimulus: Analisis efisiensi panel surya pada rumah hemat energi",
        "Kunci Jawaban: B. Sudut datang sinar matahari terhadap sel fotovoltaik",
        "Tabel Kisi-Kisi: Terpetakan otomatis pada TP 10.3 dan C4 (Menganalisis)",
      ],
      actionLabel: "Struktur Dokumen Lengkap",
    },
  },
  {
    id: "step-3",
    stepNumber: "03",
    badge: "EKSPOR KEDINASAN",
    title: "Tinjau, Sunting Langsung, & Unduh Berkas",
    summary: "Periksa naskah di layar, lakukan penyuntingan jika diperlukan, lalu unduh dokumen resmi dengan margin kedinasan dan Kop Surat sekolah Anda.",
    details: [
      "Ekspor berkas asli Microsoft Word (.DOCX) margin 4-3-3-3 cm",
      "Otomatis memuat Kop Surat dua logo dan lembar tanda tangan dinas",
      "Dapat langsung dicetak di kertas A4/F4 tanpa penyesuaian ulang",
    ],
    mockup: {
      headerTitle: "Siap Cetak & Distribusi",
      tag: "Format .DOCX Native",
      contentTitle: "Dokumen Resmi Terverifikasi",
      contentLines: [
        "Kop Surat: Disdikbud Kota / Provinsi Terintegrasi",
        "Margin: Kiri 4 cm, Atas 3 cm, Kanan 3 cm, Bawah 3 cm",
        "Status: Siap diarsipkan untuk supervisi dan dibagikan ke siswa",
      ],
      actionLabel: "Unduh Berkas Sekarang",
    },
  },
];

export function WorkflowSteps() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const current = STEPS[activeStep];

  return (
    <div className="space-y-12">
      {/* Header Pengantar */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-mono font-bold text-blue-700 tracking-wide uppercase">
          <Cpu className="w-3.5 h-3.5" />
          <span>// ALUR KERJA TERPANDU BSKAP</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Tiga Tahap Menuju Dokumen Kedinasan Siap Pakai
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Hilangkan kerumitan prompt AI. Cukup tentukan kebutuhan pembelajaran Anda lewat formulir terpandu, dan biarkan sistem merancang seluruh instrumen kedinasan.
        </p>
      </div>

      {/* 3 Step Selector Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`text-left p-5 rounded-2xl border transition-all relative ${
                isActive
                  ? "bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10"
                  : "bg-slate-50/70 hover:bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-mono font-extrabold px-2.5 py-1 rounded-md ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  TAHAP {step.stepNumber}
                </span>
                <span className="text-[10px] font-mono text-slate-600 font-semibold uppercase">
                  {step.badge}
                </span>
              </div>
              <h3
                className={`font-bold text-sm tracking-tight mb-1.5 ${
                  isActive ? "text-slate-900" : "text-slate-700"
                }`}
              >
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {step.summary}
              </p>

              {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-blue-600 rotate-45 hidden md:block" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Step Preview Stage */}
      <div className="bg-slate-50/90 rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Kolom Kiri: Rincian Tahap */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-wider block">
                [ TAHAPAN {current.stepNumber} DARI 03 ]
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {current.summary}
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {current.details.map((detail, dIdx) => (
                <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>{detail}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/login">
                <Button className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs h-10 px-5 shadow-xs gap-2">
                  <span>Coba Tahap Ini Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <div className="text-[11px] text-slate-600 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Terverifikasi Kurikulum Merdeka</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Interactive Visual Mockup Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 space-y-4">
              {/* Header Box */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-slate-800 ml-2 font-mono">
                    {current.mockup.headerTitle}
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-800 border-blue-200 font-mono font-bold">
                  {current.mockup.tag}
                </Badge>
              </div>

              {/* Title Content */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                  Preview Keluaran:
                </span>
                <h4 className="font-bold text-sm text-slate-900">
                  {current.mockup.contentTitle}
                </h4>
              </div>

              {/* Data Rows */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
                {current.mockup.contentLines.map((line, lIdx) => (
                  <div key={lIdx} className="flex items-start gap-2">
                    <span className="text-blue-700 font-bold">•</span>
                    <span className="leading-relaxed">{line}</span>
                  </div>
                ))}
              </div>

              {/* Footer Indicator */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                  <CheckCircle2 className="w-4 h-4" />
                  {current.mockup.actionLabel}
                </span>
                <span className="text-[10px] font-mono text-slate-600">
                  REF: BSKAP-032-2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { InteractiveTicker } from "@/components/landing/InteractiveTicker";
import { BauhausCanvasBanner } from "@/components/landing/BauhausCanvasBanner";
import { WorkflowSteps } from "@/components/landing/WorkflowSteps";
import { BentoEfficiency } from "@/components/landing/BentoEfficiency";
import { BentoPedagogical } from "@/components/landing/BentoPedagogical";
import { ModernFaq } from "@/components/landing/ModernFaq";
import { RadialCtaBanner } from "@/components/landing/RadialCtaBanner";
import { ModernFooter } from "@/components/landing/ModernFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 0. Custom Smooth Cursor Interaktif */}
      <SmoothCursor />

      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-base shadow-xs">
              G
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-base tracking-tight text-slate-900 block">
                GuruHub AI
              </span>
              <span className="text-[10px] text-slate-600 block uppercase font-medium tracking-wider">
                Kurikulum Merdeka BSKAP
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold text-slate-600">
            <a href="#fitur" className="hover:text-blue-700 transition-colors">
              Fitur Pedagogis
            </a>
            <a href="#ticker-interaktif" className="hover:text-blue-700 transition-colors">
              Eksplorasi Modul
            </a>
            <a href="#cara-kerja" className="hover:text-blue-700 transition-colors">
              Cara Kerja
            </a>
            <a href="#efisiensi" className="hover:text-blue-700 transition-colors">
              Efisiensi Guru
            </a>
            <a href="#kanvas-seni" className="hover:text-blue-700 transition-colors">
              Standar Regulasi
            </a>
            <a href="#faq" className="hover:text-blue-700 transition-colors">
              Tanya Jawab (FAQ)
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-700 hover:text-slate-900">
                Masuk
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs h-9 px-4 shadow-xs">
                Coba Gratis Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/60 via-white to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-xs font-bold text-blue-900 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                <span>Teknologi Guru Cerdas - Kurikulum Merdeka BSKAP 2024</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Buat soal berkualitas dalam{" "}
                <span className="text-blue-700 underline decoration-blue-300 decoration-wavy decoration-2">
                  hitungan detik
                </span>{" "}
                bersama Guru AI
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Rancang paket asesmen, kuis, latihan HOTS/AKM, modul ajar berdiferensiasi 3 pilar, ATP, dan format kedinasan lengkap dengan Matriks Kisi-Kisi dan rubrik penskoran standar resmi.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm h-11 px-7 shadow-md gap-2">
                    <span>Coba Generator Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="#cara-kerja" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-slate-700 font-bold text-sm h-11 px-6">
                    Lihat Cara Kerja
                  </Button>
                </a>
              </div>

              {/* Trust Checkmarks */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Tanpa ribet klerikal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Regulasi BSKAP 2024</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Ekspor Word & PowerPoint</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-5 space-y-4 relative z-10">
                {/* Simulated Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-bold text-slate-400 ml-2 font-mono">Generator Soal & Kisi-Kisi</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-800 border-blue-200 font-bold">
                    Otomatis 100%
                  </Badge>
                </div>

                {/* Simulated Content */}
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-600">
                      <span>Mata Pelajaran: Fisika (Kelas X)</span>
                      <span className="font-bold text-blue-700">Level: HOTS (C4-C6)</span>
                    </div>
                    <p className="font-semibold text-slate-900 text-xs">
                      Stimulus: Analisis grafik kecepatan terhadap waktu pada kendaraan listrik perkotaan.
                    </p>
                  </div>

                  {/* Options sample */}
                  <div className="space-y-1.5">
                    <div className="p-2 rounded border border-slate-200 bg-white flex items-center justify-between text-[11px]">
                      <span>A. Percepatan tetap pada fase pertama</span>
                      <span className="text-slate-600 text-[10px]">Opsi</span>
                    </div>
                    <div className="p-2 rounded border border-emerald-500 bg-emerald-50/70 flex items-center justify-between text-[11px] font-semibold text-emerald-950">
                      <span>B. Energi kinetik sebanding dengan kuadrat kelajuan</span>
                      <span className="text-emerald-700 text-[10px] font-bold">Kunci Jawaban</span>
                    </div>
                  </div>

                  {/* Document Outputs */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-center font-bold">
                    <div className="p-2 bg-blue-50 rounded text-blue-900 border border-blue-200">
                      Naskah Soal
                    </div>
                    <div className="p-2 bg-emerald-50 rounded text-emerald-900 border border-emerald-200">
                      Matriks Kisi-Kisi
                    </div>
                    <div className="p-2 bg-indigo-50 rounded text-indigo-900 border border-indigo-200">
                      DOCX 4-3-3-3 cm
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Blur Backdrops */}
              <div className="absolute -top-6 -right-6 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Jenjang Bar */}
      <section className="py-7 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 font-mono">
            // DISEDIAKAN UNTUK SELURUH SATUAN PENDIDIKAN NASIONAL
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
            {["SD / MI", "SMP / MTs", "SMA / MA", "SMK / MAK", "SLB / Inklusi"].map((lvl) => (
              <span
                key={lvl}
                className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs"
              >
                {lvl}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3.5. Running Text Interaktif dengan Blind Gradient & Dynamic Detail Switcher */}
      <section id="ticker-interaktif" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveTicker />
        </div>
      </section>

      {/* 4. Section: Alur Kerja Terpandu BSKAP (Workflow Steps ala 21st.dev) */}
      <section id="cara-kerja" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WorkflowSteps />
        </div>
      </section>

      {/* 5. Section: Efisiensi Waktu Guru (Bento Efficiency ala 21st.dev) */}
      <section id="efisiensi" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BentoEfficiency />
        </div>
      </section>

      {/* 6. Section: Kemampuan Pedagogis Mendalam (Bento Pedagogical ala 21st.dev) */}
      <section id="fitur" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BentoPedagogical />
        </div>
      </section>

      {/* 7. Section: Spanduk Kanvas Geometris Presisi (Bauhaus Dynamic Canvas Banner) */}
      <section id="kanvas-seni" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono text-blue-700 font-bold uppercase tracking-wider">
              [arsitektur_dokumen_resmi]
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Standar Regulasi BSKAP Terpetakan Rapi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Visualisasi kanvas interaktif mencerminkan modularitas dan keselarasan setiap butir instrumen administrasi pendidikan.
            </p>
          </div>
          <BauhausCanvasBanner />
        </div>
      </section>

      {/* 8. Section FAQ Accordion (Modern FAQ ala 21st.dev) */}
      <section id="faq" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ModernFaq />
        </div>
      </section>

      {/* 9. Bottom CTA Banner (Radial Mesh Glow Banner ala 21st.dev) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RadialCtaBanner />
        </div>
      </section>

      {/* 10. Modern Bento Footer ala 21st.dev */}
      <ModernFooter />
    </div>
  );
}

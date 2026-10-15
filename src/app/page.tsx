"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Check,
  ShieldCheck,
  FileText,
  Cpu,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParallaxScroll, ParallaxLayer } from "@/components/ui/parallax-scroll";
import { Hero3DModuleCard } from "@/components/landing/Hero3DModuleCard";
import { CurriculumSubjectsTicker } from "@/components/landing/CurriculumSubjectsTicker";
import { InteractiveTicker } from "@/components/landing/InteractiveTicker";
import { BauhausCanvasBanner } from "@/components/landing/BauhausCanvasBanner";
import { WorkflowSteps } from "@/components/landing/WorkflowSteps";
import { BentoEfficiency } from "@/components/landing/BentoEfficiency";
import { BentoPedagogical } from "@/components/landing/BentoPedagogical";
import { ModernFaq } from "@/components/landing/ModernFaq";
import { RadialCtaBanner } from "@/components/landing/RadialCtaBanner";
import { ModernFooter } from "@/components/landing/ModernFooter";
import { ModulKuLogo } from "@/components/ui/ModulKuLogo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-slate-200 selection:text-slate-900">
      {/* 1. Sticky Frosted Glass Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <ModulKuLogo size="md" showSubtitle subtitleText="Kurikulum Merdeka BSKAP" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold text-slate-600">
            <a href="#fitur" className="hover:text-slate-900 transition-colors">
              Fitur Pedagogis
            </a>
            <a href="#ticker-interaktif" className="hover:text-slate-900 transition-colors">
              Eksplorasi Modul
            </a>
            <a href="#cara-kerja" className="hover:text-slate-900 transition-colors">
              Alur Kerja
            </a>
            <a href="#efisiensi" className="hover:text-slate-900 transition-colors">
              Efisiensi Guru
            </a>
            <a href="#kanvas-seni" className="hover:text-slate-900 transition-colors">
              Standar Regulasi
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              Tanya Jawab (FAQ)
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-700 hover:text-slate-900">
                Masuk
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 px-4 rounded-xl shadow-2xs">
                Coba Gratis Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section dengan Parallax Scroll & Elemen 3D Interaktif */}
      <ParallaxScroll
        className="border-b border-slate-200/80"
        layers={[
          { layer: "hero-pattern", yPercent: 18 },
          { layer: "hero-3d", yPercent: -10 },
          { layer: "hero-accent", yPercent: -25 },
        ]}
      >
        <section className="relative overflow-hidden pt-14 pb-20 lg:pt-20 lg:pb-28 bg-white">
          {/* Parallax Layer 1: Background Architectural Dot Pattern */}
          <ParallaxLayer
            layer="hero-pattern"
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-35"
          />

          {/* Parallax Layer 2: Ambient Geometric Crosses */}
          <ParallaxLayer
            layer="hero-accent"
            className="pointer-events-none absolute inset-0 z-0 flex justify-between px-8 pt-10"
          >
            <div className="text-xs text-slate-300 font-medium select-none">
              Modul Administrasi Terpadu
            </div>
            <div className="text-xs text-slate-300 font-medium select-none">
              Standar Regulasi BSKAP 032
            </div>
          </ParallaxLayer>

          {/* Main Hero Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Kolom Kiri: Copywriting & Actions */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                {/* Monochromatic Clean Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                  <span>Platform Resmi Kurikulum Merdeka 2024</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  Rancang perangkat ajar & evaluasi dalam{" "}
                  <span className="underline decoration-slate-400 decoration-wavy decoration-2">
                    hitungan detik
                  </span>{" "}
                  secara presisi
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  ModulKu mengotomasi penyusunan paket asesmen HOTS/AKM, modul ajar berdiferensiasi 3 pilar, ATP, serta naskah dinas siap cetak lengkap dengan Matriks Kisi-Kisi dan rubrik penskoran standar nasional.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm h-11 px-7 rounded-xl shadow-sm gap-2">
                      <span>Mulai Susun Modul Sekarang</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </Button>
                  </Link>
                  <a href="#cara-kerja" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-slate-800 border-slate-300 hover:bg-slate-100 font-bold text-sm h-11 px-6 rounded-xl">
                      Lihat Alur Kerja
                    </Button>
                  </a>
                </div>

                {/* Trust Checkmarks Monochromatic (Neutral SVG Icons) */}
                <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs font-semibold text-slate-600 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                    <span>BEBAS KERJA KLERIKAL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                    <span>STANDAR BSKAP 032/2024</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                    <span>DOCX MARGIN 4-3-3-3 CM</span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Elemen 3D Interaktif dengan Parallax Layer */}
              <ParallaxLayer layer="hero-3d" className="lg:col-span-6 w-full">
                <Hero3DModuleCard />
              </ParallaxLayer>
            </div>
          </div>
        </section>
      </ParallaxScroll>

      {/* 3. Jenjang Satuan Pendidikan & 3 Tumpuk Running Text Pelajaran SD hingga SMA/SMK */}
      <CurriculumSubjectsTicker />

      {/* 3.5. Running Text Interaktif Sleek dengan Compact Studio Drawer */}
      <section id="ticker-interaktif" className="py-16 sm:py-20 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveTicker />
        </div>
      </section>

      {/* 4. Section: Alur Kerja Terpandu BSKAP (3-Step Connected Cards) */}
      <section id="cara-kerja" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WorkflowSteps />
        </div>
      </section>

      {/* 5. Section: Efisiensi Waktu Guru (Bento Efficiency) */}
      <section id="efisiensi" className="py-16 sm:py-20 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BentoEfficiency />
        </div>
      </section>

      {/* 6. Section: Kemampuan Pedagogis Mendalam (Bento Pedagogical) */}
      <section id="fitur" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BentoPedagogical />
        </div>
      </section>

      {/* 7. Section: Spanduk Kanvas Geometris Presisi (Bauhaus Dynamic Canvas Banner) */}
      <section id="kanvas-seni" className="py-16 sm:py-20 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-mono text-slate-800 font-bold uppercase tracking-wider">
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

      {/* 8. Section FAQ Accordion (Modern 2-Column FAQ) */}
      <section id="faq" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ModernFaq />
        </div>
      </section>

      {/* 9. Bottom CTA Banner (Radial Mesh Glow Banner) */}
      <section className="py-16 sm:py-24 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RadialCtaBanner />
        </div>
      </section>

      {/* 10. Modern Bento Footer */}
      <ModernFooter />
    </div>
  );
}

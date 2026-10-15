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
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <ModulKuLogo size="lg" showSubtitle subtitleText="Standar BKPDM Kemendikdasmen" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
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
          <div className="flex items-center space-x-3.5">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-4 h-10">
                Masuk
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm h-10 px-5 rounded-xl shadow-xs">
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
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 bg-white">
          {/* Parallax Layer 1: Background Architectural Dot Pattern */}
          <ParallaxLayer
            layer="hero-pattern"
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-35"
          />

          {/* Parallax Layer 2: Ambient Geometric Crosses */}
          <ParallaxLayer
            layer="hero-accent"
            className="pointer-events-none absolute inset-0 z-0 flex justify-between px-8 sm:px-16 pt-10"
          >
            <div className="text-xs text-slate-300 font-medium select-none">
              Modul Administrasi Terpadu
            </div>
            <div className="text-xs text-slate-300 font-medium select-none">
              Standar Regulasi BKPDM
            </div>
          </ParallaxLayer>

          {/* Main Hero Container */}
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Kolom Kiri: Copywriting & Actions */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                {/* Monochromatic Clean Badge */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-slate-700" />
                  <span>Platform Resmi Standar BKPDM Kemendikdasmen</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12]">
                  Rancang perangkat ajar & evaluasi dalam{" "}
                  <span className="underline decoration-slate-400 decoration-wavy decoration-2">
                    hitungan detik
                  </span>{" "}
                  secara presisi
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  ModulKu mengotomasi penyusunan paket asesmen HOTS/AKM, modul ajar Deep Learning (Mindful, Meaningful, Joyful), ATP, serta naskah dinas siap cetak lengkap dengan Matriks Kisi-Kisi dan rubrik penskoran standar nasional.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-7 rounded-xl shadow-md gap-3">
                      <span>Mulai Susun Modul Sekarang</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </Button>
                  </Link>
                  <a href="#cara-kerja" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-slate-800 border-slate-300 hover:bg-slate-100 font-bold text-sm sm:text-base h-11 sm:h-12 px-6 rounded-xl">
                      Lihat Alur Kerja
                    </Button>
                  </a>
                </div>

                {/* Trust Checkmarks Monochromatic (Neutral SVG Icons) */}
                <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-2.5 gap-x-6 sm:gap-x-8 text-xs sm:text-sm font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-900 stroke-[2.5]" />
                    <span>Bebas Kerja Klerikal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-900 stroke-[2.5]" />
                    <span>Standar BKPDM 2026</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-900 stroke-[2.5]" />
                    <span>DOCX Margin 4-3-3-3 cm</span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Elemen 3D Interaktif dengan Parallax Layer */}
              <ParallaxLayer layer="hero-3d" className="lg:col-span-6 w-full flex justify-center lg:justify-end">
                <Hero3DModuleCard />
              </ParallaxLayer>
            </div>
          </div>
        </section>
      </ParallaxScroll>

      {/* 3. Jenjang Satuan Pendidikan & 3 Tumpuk Running Text Pelajaran SD hingga SMA/SMK */}
      <CurriculumSubjectsTicker />

      {/* 3.5. Running Text Interaktif Sleek dengan Compact Studio Drawer */}
      <section id="ticker-interaktif" className="py-12 sm:py-16 lg:py-20 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <InteractiveTicker />
        </div>
      </section>

      {/* 4. Section: Alur Kerja Terpandu BKPDM (3-Step Connected Cards) */}
      <section id="cara-kerja" className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <WorkflowSteps />
        </div>
      </section>

      {/* 5. Section: Efisiensi Waktu Guru (Bento Efficiency) */}
      <section id="efisiensi" className="py-12 sm:py-16 lg:py-20 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <BentoEfficiency />
        </div>
      </section>

      {/* 6. Section: Kemampuan Pedagogis Mendalam (Bento Pedagogical) */}
      <section id="fitur" className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <BentoPedagogical />
        </div>
      </section>

      {/* 7. Section: Spanduk Kanvas Geometris Presisi (Bauhaus Dynamic Canvas Banner) */}
      <section id="kanvas-seni" className="py-12 sm:py-16 lg:py-20 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700">
              Arsitektur Dokumen Resmi
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Standar Regulasi BKPDM Terpetakan Rapi
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Visualisasi kanvas interaktif mencerminkan modularitas dan keselarasan setiap butir instrumen administrasi pendidikan.
            </p>
          </div>
          <BauhausCanvasBanner />
        </div>
      </section>

      {/* 8. Section FAQ Accordion (Modern 2-Column FAQ) */}
      <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <ModernFaq />
        </div>
      </section>

      {/* 9. Bottom CTA Banner (Radial Mesh Glow Banner) */}
      <section className="py-12 sm:py-20 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <RadialCtaBanner />
        </div>
      </section>

      {/* 10. Modern Bento Footer */}
      <ModernFooter />
    </div>
  );
}

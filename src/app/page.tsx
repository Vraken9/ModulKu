"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Check,
  ShieldCheck,
  FileText,
  Cpu,
  Layers,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParallaxScroll, ParallaxLayer } from "@/components/ui/parallax-scroll";
import { Hero3DModuleCard } from "@/components/landing/Hero3DModuleCard";
import { CurriculumSubjectsTicker } from "@/components/landing/CurriculumSubjectsTicker";
import { InteractiveTicker } from "@/components/landing/InteractiveTicker";
import { WorkflowSteps } from "@/components/landing/WorkflowSteps";
import { BentoPedagogical } from "@/components/landing/BentoPedagogical";
import { PricingSection } from "@/components/landing/PricingSection";
import { ModernFaq } from "@/components/landing/ModernFaq";
import { RadialCtaBanner } from "@/components/landing/RadialCtaBanner";
import { ModernFooter } from "@/components/landing/ModernFooter";
import { ModulKuLogo } from "@/components/ui/ModulKuLogo";
import { supabase } from "@/lib/supabase/client";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const localToken = localStorage.getItem("guru_auth_token");
        if (session || localToken) {
          setIsLoggedIn(true);
        }
      } catch {
        // ignore
      }
    }
    checkSession();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-slate-200 selection:text-slate-900">
      {/* 1. Sticky Frosted Glass Header / Navbar - Ramping, Modern & Anti-Stacking */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo Ramping */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <ModulKuLogo size="md" />
          </Link>

          {/* Desktop Nav Links - Single Line, Whitespace-Nowrap, Anti-Bertumpuk */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-semibold text-slate-600">
            <a
              href="#fitur"
              className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Fitur Pedagogis
            </a>
            <a
              href="#ticker-interaktif"
              className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Eksplorasi Modul
            </a>
            <a
              href="#cara-kerja"
              className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Alur Kerja
            </a>
            <a
              href="#harga"
              className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Paket & Harga
            </a>
            <a
              href="#faq"
              className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 shrink-0">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm h-8 sm:h-9 px-3.5 sm:px-4 rounded-xl shadow-xs whitespace-nowrap gap-2"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Kembali ke Dashboard</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 sm:px-3.5 h-8 sm:h-9"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="sm"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm h-8 sm:h-9 px-3.5 sm:px-4 rounded-xl shadow-xs whitespace-nowrap"
                  >
                    Coba Gratis
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button (< lg) */}
          <div className="flex items-center gap-2 lg:hidden">
            {isLoggedIn ? (
              <Link href="/dashboard" className="sm:hidden">
                <Button
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-8 px-2.5 rounded-lg shadow-xs gap-1.5"
                >
                  <LayoutDashboard className="w-3 h-3" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link href="/login" className="sm:hidden">
                <Button
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-8 px-3 rounded-lg shadow-xs"
                >
                  Masuk
                </Button>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-md px-4 py-3 space-y-2 shadow-lg">
            <nav className="flex flex-col space-y-1 text-sm font-semibold text-slate-700">
              <a
                href="#fitur"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Fitur Pedagogis
              </a>
              <a
                href="#ticker-interaktif"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Eksplorasi Modul
              </a>
              <a
                href="#cara-kerja"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Alur Kerja
              </a>
              <a
                href="#harga"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors font-bold text-slate-900"
              >
                Paket & Harga
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Tanya Jawab (FAQ)
              </a>
            </nav>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {isLoggedIn ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-9 gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Kembali ke Ruang Kerja Dashboard</span>
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-slate-800 font-bold text-xs h-9">
                      Masuk ke Akun
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-9">
                      Coba Gratis Sekarang
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section dengan Parallax Scroll & Elemen 3D Interaktif */}
      <ParallaxScroll
        className="border-b border-slate-200/80"
        layers={[
          { layer: "hero-pattern", yPercent: 18 },
          { layer: "hero-3d", yPercent: -10 },
        ]}
      >
        <section className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-22 bg-white">
          {/* Parallax Layer 1: Background Architectural Dot Pattern */}
          <ParallaxLayer
            layer="hero-pattern"
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-35"
          />

          {/* Main Hero Container */}
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Kolom Kiri: Copywriting & Actions */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                {/* Standard Curriculum Emerald Badge */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-emerald-200 text-xs sm:text-sm font-semibold text-[#065F46] shadow-2xs">
                  <Sparkles className="w-4 h-4 text-[#059669]" />
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
                  <Link href={isLoggedIn ? "/dashboard" : "/login"} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm sm:text-base h-11 sm:h-12 px-6 sm:px-7 rounded-xl shadow-md gap-3">
                      <span>{isLoggedIn ? "Buka Ruang Kerja Dashboard" : "Mulai Susun Modul Sekarang"}</span>
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

      {/* 5. Section: Kemampuan Pedagogis Mendalam (Bento Pedagogical) */}
      <section id="fitur" className="py-12 sm:py-16 lg:py-20 bg-slate-50/50 border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <BentoPedagogical />
        </div>
      </section>

      {/* 6. Section: Paket Berlangganan Guru & Satuan Pendidikan (3-Tier Pricing) */}
      <section id="harga" className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <PricingSection isLoggedIn={isLoggedIn} />
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
          <RadialCtaBanner isLoggedIn={isLoggedIn} />
        </div>
      </section>

      {/* 10. Modern Bento Footer */}
      <ModernFooter />
    </div>
  );
}

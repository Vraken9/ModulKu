"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, ShieldCheck, CheckCircle2, ChevronRight, FileText, Lock, Globe } from "lucide-react";
import { ModulKuLogo } from "@/components/ui/ModulKuLogo";

export function ModernFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-50 text-slate-600 text-xs border-t border-slate-200">
      {/* 1. Live System Status Bar ala 21st.dev */}
      <div className="border-b border-slate-200/80 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-700" />
            </span>
            <span className="font-semibold text-slate-800">
              Sistem BKPDM Engine:
            </span>
            <span className="text-slate-900 font-bold">
              Beroperasi Normal (99.9% Uptime)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span className="hidden md:inline">
              Standar Regulasi: Permendikdasmen No. 13/2025
            </span>
            <span className="text-slate-800 font-semibold text-xs px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
              Sistem Aktif BKPDM
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Kolom 1: Brand & Profil (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <ModulKuLogo size="md" showSubtitle subtitleText="Standar BKPDM Kemendikdasmen" />
            </Link>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Platform otomasi administrasi, instrumen evaluasi, dan modul pembelajaran Kurikulum Merdeka yang dirancang untuk efisiensi waktu pendidik Indonesia dengan standar kedinasan resmi.
            </p>

            <div className="pt-1 space-y-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-800" />
                <span>Security by Design & Privasi Data Guru Terjaga</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-800" />
                <span>Enkripsi Database Berstandar Industri</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Fitur Modul (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block font-mono">
              // MODUL PERANGKAT AJAR
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/soal-generator" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Naskah Soal & Kisi-Kisi AKM</span>
                </Link>
              </li>
              <li>
                <Link href="/modul-ajar" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Modul Ajar 3 Pilar Diferensiasi</span>
                </Link>
              </li>
              <li>
                <Link href="/perangkat-tahunan" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Alur Tujuan Pembelajaran (ATP)</span>
                </Link>
              </li>
              <li>
                <Link href="/presentasi" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Media Presentasi Kelas (PPTX)</span>
                </Link>
              </li>
              <li>
                <Link href="/profil-sekolah" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Master Kop Surat & Profil Sekolah</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Regulasi & Pedoman (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="font-bold text-slate-900 text-xs block">
              Landasan Regulasi Resmi
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-800 mt-0.5 shrink-0" />
                <span>Keputusan Kepala BKPDM No. 020/2026</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-800 mt-0.5 shrink-0" />
                <span>Permendikdasmen No. 13 Tahun 2025</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-800 mt-0.5 shrink-0" />
                <span>Pendekatan Deep Learning (Mindful, Meaningful, Joyful)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-800 mt-0.5 shrink-0" />
                <span>Panduan Pembelajaran & Asesmen (PPA)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-800 mt-0.5 shrink-0" />
                <span>Format Standar Kedinasan 4-3-3-3 cm</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Spesifikasi Luaran (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-bold text-slate-900 text-xs block">
              Spesifikasi Berkas
            </span>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block text-[11px]">Microsoft Word</span>
                <span className="text-[10px] text-slate-500 block">.DOCX Asli Editable</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block text-[11px]">Microsoft PowerPoint</span>
                <span className="text-[10px] text-slate-500 block">.PPTX Native 16:9</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block text-[11px]">Rumus KaTeX</span>
                <span className="text-[10px] text-slate-500 block">Matematika, Fisika, Kimia</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>Hak Cipta 2026 ModulKu. Seluruh hak cipta dilindungi undang-undang.</span>
            <Link href="/login" className="hover:text-slate-900 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">
              Ketentuan Layanan
            </Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">
              Panduan Guru
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-mono text-[10px]">
              v3.0-BKPDM
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all text-xs"
            >
              <span>Ke Atas</span>
              <ArrowUp className="w-3.5 h-3.5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

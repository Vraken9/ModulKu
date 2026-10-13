"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, ShieldCheck, CheckCircle2, ChevronRight, FileText, Lock, Globe } from "lucide-react";

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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-slate-800">
              Sistem BSKAP 2024 Engine:
            </span>
            <span className="text-emerald-700 font-bold">
              Beroperasi Normal (99.9% Uptime)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span className="hidden md:inline">
              Standar Regulasi: Permendikbudristek No. 12/2024
            </span>
            <span className="font-mono text-blue-700 font-bold">
              [BSKAP_032_ACTIVE]
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

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Platform otomasi administrasi, instrumen evaluasi, dan modul pembelajaran Kurikulum Merdeka yang dirancang untuk efisiensi waktu pendidik Indonesia dengan standar kedinasan resmi.
            </p>

            <div className="pt-1 space-y-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Security by Design & Privasi Data Guru Terjaga</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
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
                <Link href="/soal-generator" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Naskah Soal & Kisi-Kisi AKM</span>
                </Link>
              </li>
              <li>
                <Link href="/modul-ajar" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Modul Ajar 3 Pilar Diferensiasi</span>
                </Link>
              </li>
              <li>
                <Link href="/perangkat-tahunan" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Alur Tujuan Pembelajaran (ATP)</span>
                </Link>
              </li>
              <li>
                <Link href="/presentasi" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Media Presentasi Kelas (PPTX)</span>
                </Link>
              </li>
              <li>
                <Link href="/profil-sekolah" className="hover:text-blue-700 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Master Kop Surat & Profil Sekolah</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Regulasi & Pedoman (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block font-mono">
              // LANDASAN REGULASI
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 mt-0.5 shrink-0" />
                <span>Keputusan BSKAP No. 032/H/KR/2024</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 mt-0.5 shrink-0" />
                <span>Permendikbudristek No. 12 Tahun 2024</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 mt-0.5 shrink-0" />
                <span>Perdirjen GTK No. 7607 (Kinerja PMM)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 mt-0.5 shrink-0" />
                <span>Panduan Pembelajaran & Asesmen (PPA)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 mt-0.5 shrink-0" />
                <span>Format Standar Kedinasan 4-3-3-3 cm</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Spesifikasi Luaran (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block font-mono">
              // SPESIFIKASI BERKAS
            </span>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block text-[11px]">Microsoft Word</span>
                <span className="text-[10px] text-slate-600 block">.DOCX Asli Editable</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block text-[11px]">Microsoft PowerPoint</span>
                <span className="text-[10px] text-slate-600 block">.PPTX Native 16:9</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block text-[11px]">Rumus KaTeX</span>
                <span className="text-[10px] text-slate-600 block">Matematika, Fisika, Kimia</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>Hak Cipta 2026 GuruHub AI. Seluruh hak cipta dilindungi.</span>
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
            <span className="text-slate-600 font-mono">
              v2.4-BSKAP
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold transition-all text-xs"
            >
              <span>Ke Atas</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

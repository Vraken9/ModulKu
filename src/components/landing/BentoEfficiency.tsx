"use client";

import React from "react";
import Link from "next/link";
import { Clock, ShieldCheck, Sliders, Award, FileCheck2, ArrowUpRight, CheckCircle2, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BentoEfficiency() {
  return (
    <div className="space-y-12">
      {/* Header Pengantar */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-mono font-bold text-blue-700 tracking-wide uppercase">
          <Zap className="w-3.5 h-3.5" />
          <span>// EFISIENSI KINERJA GURU</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Kembalikan Waktu Berharga Anda untuk Siswa
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Beban klerikal menyita lebih dari 40% jam kerja pendidik di Indonesia. ModulKu mengotomasi penyusunan administrasi agar energi Anda tercurah pada interaksi bermakna di kelas.
        </p>
      </div>

      {/* Bento Grid Layout (Apple-style / 21st.dev Bento Showcase) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Metrik Efisiensi Waktu (Span 2 Kolom) */}
        <div className="md:col-span-2 bg-gradient-to-br from-white to-slate-50/70 rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono bg-white text-slate-800 border-slate-300 font-bold">
                EFISIENSI WAKTU 85%
              </Badge>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Penyusunan Naskah & Kisi-Kisi Dalam Hitungan Detik
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Menyusun 25 butir soal HOTS beserta kisi-kisi dan rubrik yang biasanya membutuhkan waktu 4 hingga 6 jam kerja kini selesai dalam waktu kurang dari satu menit.
              </p>
            </div>
          </div>

          {/* Komparasi Visual */}
          <div className="mt-6 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                CARA KONVENSIONAL (MANUAL)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-700">~4 Jam</span>
                <span className="text-xs text-slate-500">per paket asesmen</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Mengetik kisi-kisi satu per satu, menghitung bobot nilai manual, dan mengatur format margin Word secara berulang.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-1.5 border border-slate-800">
              <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider block">
                BERSAMA MODULKU
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">45 Detik</span>
                <span className="text-xs text-slate-300 font-semibold">siap cetak .DOCX</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Terstruktur otomatis sesuai taksonomi Bloom, stimulus kontekstual AKM, dan format kedinasan resmi.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Standar Dokumen Kedinasan (Span 1 Kolom) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-mono text-slate-700 font-bold">
                [KEDINASAN_READY]
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Standar Format Dinas & Kop Surat 2 Logo
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Format berkas langsung menerapkan margin 4-3-3-3 cm, Kop Surat resmi (Pemerintah Daerah & Sekolah), dan lembar pengesahan kepala sekolah serta pengawas.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
              <span>Margin 4-3-3-3 cm Resmi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
              <span>Kop Surat Otomatis Seluruh Berkas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
              <span>Lembar Pengesahan Siap Ditandatangani</span>
            </div>
          </div>
        </div>

        {/* Card 3: In-line Editor Guru (Span 1 Kolom) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Sliders className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-mono text-slate-700 font-bold">
                [KENDALI_GURU]
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Pendidik Memegang Kendali Penuh
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI bertindak sebagai asisten draf Anda. Setiap stimulus, butir soal, dan rencana kegiatan pembelajaran dapat disunting langsung di layar (in-line edit).
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
              <span>In-line Text & Soal Editor</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
              <span>Penyesuaian Kunci & Pembahasan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate-800 shrink-0" />
              <span>Validasi Bobot Nilai Otomatis</span>
            </div>
          </div>
        </div>

        {/* Card 4: Bukti Dukung PMM (Span 2 Kolom) */}
        <div className="md:col-span-2 bg-gradient-to-br from-white to-slate-50/80 rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5 text-white" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono bg-white text-slate-900 border-slate-300 font-bold">
                BUKTI DUKUNG PMM // PERDIRJEN GTK 7607
              </Badge>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Diselaraskan untuk Pengelolaan Kinerja Guru di Platform Merdeka Mengajar (PMM)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Modul Ajar, instrumen asesmen diagnostik & sumatif, serta LKPD yang dihasilkan dapat langsung diunggah sebagai bukti dukung RHK pada PMM tanpa penolakan format oleh kepala sekolah atau pengawas dinas.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 font-medium">
              <span className="px-3 py-1 bg-white rounded-lg border border-slate-200">
                8 Indikator Observasi Kelas
              </span>
              <span className="px-3 py-1 bg-white rounded-lg border border-slate-200">
                Rubrik Penilaian Holistik
              </span>
              <span className="px-3 py-1 bg-white rounded-lg border border-slate-200">
                LKPD Berdiferensiasi
              </span>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-slate-700"
            >
              <span>Mulai Rancang Sekarang</span>
              <ArrowUpRight className="w-4 h-4 text-slate-900" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

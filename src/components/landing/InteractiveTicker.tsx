"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  FileCheck2,
  CalendarDays,
  Presentation,
  School,
  Award,
  ArrowRight,
  Check,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TickerFeature {
  id: string;
  badge: string;
  title: string;
  shortDesc: string;
  tagline: string;
  fullDesc: string;
  points: string[];
  docOutput: string;
  formatType: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FEATURES: TickerFeature[] = [
  {
    id: "modul-ajar",
    badge: "STANDAR BKPDM NO. 020/2026",
    title: "Modul Ajar Deep Learning & Diferensiasi",
    shortDesc: "Prinsip Mindful, Meaningful, & Joyful Terpetakan Nyata",
    tagline: "Format Resmi Supervisi & Ringkas Harian",
    fullDesc:
      "Menyusun struktur modul ajar lengkap dengan 3 pilar diferensiasi (konten, proses, produk), asesmen diagnostik, formatif, dan sumatif, pemetaan 6 Dimensi Profil Pancasila, serta lampiran LKPD dan Lembar Pengesahan Pengawas Sekolah.",
    points: [
      "Pemetaan diferensiasi belajar siswa terakomodasi nyata",
      "Format resmi supervisi lengkap (LKPD, Glosarium, Refleksi)",
      "Ekspor dokumen Word (.docx) dengan margin kedinasan 4-3-3-3 cm",
    ],
    docOutput: "Modul Ajar Resmi (.DOCX & PDF Siap Cetak)",
    formatType: "Microsoft Word Native",
    link: "/modul-ajar",
    icon: FileText,
  },
  {
    id: "soal-generator",
    badge: "TAKSONOMI BLOOM C1-C6",
    title: "Generator Soal HOTS & Matriks Kisi-Kisi",
    shortDesc: "Formula Sains KaTeX & Rubrik Penskoran Holistik",
    tagline: "Bank Soal Terukur dengan Kontrol Kognitif",
    fullDesc:
      "Otomasi penyusunan soal pilihan ganda kompleks, menjodohkan, dan uraian analitis berbasis stimulus faktual, matriks kisi-kisi penulisan soal, kartu soal berstandar dinas, serta rubrik KKTP.",
    points: [
      "Kontrol proporsi tingkat kognitif LOTS, MOTS, dan HOTS",
      "Dukungan formula matematika dan kimia terformat rapi",
      "Matriks kisi-kisi dan kartu soal siap cetak atau ekspor DOCX",
    ],
    docOutput: "Naskah Soal, Matriks Kisi-Kisi, & Rubrik",
    formatType: "Format Cetak Kedinasan A4",
    link: "/soal-generator",
    icon: FileCheck2,
  },
  {
    id: "perangkat-tahunan",
    badge: "ALOKASI PEKAN EFEKTIF",
    title: "ATP, Prota, & Promes Terintegrasi",
    shortDesc: "Dekonstruksi Capaian Pembelajaran BKPDM",
    tagline: "Distribusi Jam Pembelajaran Kalender Akademik",
    fullDesc:
      "Menghitung rincian pekan efektif semester, membagi jam pelajaran per materi pokok, menyusun Alur Tujuan Pembelajaran (ATP) runtut, dan menghasilkan matriks Program Semester (Promes) mingguan.",
    points: [
      "Kalkulator minggu efektif otomatis menyesuaikan kalender daerah",
      "Matriks Program Semester (Promes) siap cetak format dinas",
      "Distribusi JP terukur menghindari materi tertinggal di akhir semester",
    ],
    docOutput: "Dokumen Administrasi Perangkat Tahunan Lengkap",
    formatType: "Tabel Matriks Kalender Akademik",
    link: "/perangkat-tahunan",
    icon: CalendarDays,
  },
  {
    id: "presentasi-pptx",
    badge: "POWERPOINT ASLI",
    title: "Slide Tayang .PPTX & LKPD Interaktif",
    shortDesc: "Alur Pedagogis Interaktif Kurikulum Merdeka",
    tagline: "Bahan Ajar Presentasi Native Dapat Diedit Bebas",
    fullDesc:
      "Membuat materi presentasi ruang kelas dalam format file Microsoft PowerPoint (.pptx) asli widescreen 16:9 dengan susunan apersepsi pemantik, eksplorasi konsep, diskusi interaktif, serta lembar kerja siswa.",
    points: [
      "Berkas .pptx asli widescreen 16:9 yang dapat diedit langsung",
      "Disertai Lembar Kerja Peserta Didik (LKPD) siap pakai",
      "Palet warna presentasi profesional dan ramah visual siswa",
    ],
    docOutput: "Slide Presentasi (.PPTX) & Lembar LKPD",
    formatType: "PowerPoint Native 16:9",
    link: "/presentasi",
    icon: Presentation,
  },
  {
    id: "profil-sekolah",
    badge: "MASTER KOP KEDINASAN",
    title: "Kop Surat & Lembar Pengesahan",
    shortDesc: "Konfigurasi Identitas Satuan Pendidikan Otomatis",
    tagline: "Otomasi Identitas Resmi Dokumen Tanpa Ketik Ulang",
    fullDesc:
      "Isi data nama sekolah, NPSN, alamat dinas, NIP Kepala Sekolah, dan Pengawas Pembina satu kali. Seluruh naskah soal, modul ajar, dan perangkat otomatis memuat kop surat kedinasan yang valid.",
    points: [
      "Penyimpanan profil lokal aman langsung di peramban guru",
      "Kop surat bergaris ganda resmi dinas pendidikan",
      "Tanda tangan digital dan lembar verifikasi pengawas",
    ],
    docOutput: "Kop Surat Resmi & Lembar Pengesahan Supervisi",
    formatType: "Integrasi Kop Otomatis Dua Logo",
    link: "/profil-sekolah",
    icon: School,
  },
  {
    id: "bukti-pmm",
    badge: "PENGELOLAAN KINERJA GURU",
    title: "Penyelarasan Bukti Dukung PMM",
    shortDesc: "8 Indikator Observasi Kelas Perdirjen GTK No. 7607",
    tagline: "Siap Unggah untuk Observasi Kinerja Kepala Sekolah",
    fullDesc:
      "Setiap modul dan instrumen asesmen yang dihasilkan telah disesuaikan dengan fokus perilaku RHK observasi kelas Platform Merdeka Mengajar (PMM), memudahkan guru saat dinilai oleh pimpinan sekolah.",
    points: [
      "Selaras dengan Perdirjen GTK No. 7607/B.B1/HK.03/2023",
      "Menyediakan fokus perilaku keteraturan suasana kelas dan instruksi",
      "Dokumentasi rapi memudahkan pelaporan kinerja tahunan",
    ],
    docOutput: "Bukti Dukung Siap Unggah Pengelolaan Kinerja PMM",
    formatType: "Format Standar Bukti PMM",
    link: "/dashboard",
    icon: Award,
  },
];

export function InteractiveTicker() {
  const [selectedId, setSelectedId] = useState<string>("modul-ajar");
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectedFeature =
    FEATURES.find((f) => f.id === selectedId) || FEATURES[0];
  const IconComponent = selectedFeature.icon;

  // Auto-rotasi setiap 6 detik jika tidak sedang di-pause oleh user
  useEffect(() => {
    if (isPaused) return;

    const interval = 60; // ms
    const duration = 6000; // ms
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const currentIndex = FEATURES.findIndex((f) => f.id === selectedId);
          const nextIndex = (currentIndex + 1) % FEATURES.length;
          setSelectedId(FEATURES[nextIndex].id);
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, selectedId]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setProgress(0);
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. Header Pengantar Proporsional */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800">
            <Cpu className="w-4 h-4 text-slate-800" />
            <span>Fitur Administrasi Modul</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Eksplorasi Modul Perangkat & Instrumen Resmi
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Pilih modul kerja di bawah untuk meninjau rincian luaran, spesifikasi berkas kedinasan, dan format supervisi yang dihasilkan.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2.5 text-xs sm:text-sm text-slate-600 font-mono self-start sm:self-end">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-800 animate-pulse" />
          <span>Status: 6 Modul Aktif Terverifikasi</span>
        </div>
      </div>

      {/* 2. Container Running Text Marquee dengan Sudut Melengkung Halus & Hiasan Elegan */}
      <div
        className="relative w-full overflow-hidden border border-slate-200/90 bg-white py-4 sm:py-5 rounded-2xl shadow-xs"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade Mask Kiri */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-16 sm:w-32 z-20 bg-gradient-to-r from-white via-white/85 to-transparent rounded-l-2xl" />

        {/* Fade Mask Kanan */}
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-16 sm:w-32 z-20 bg-gradient-to-l from-white via-white/85 to-transparent rounded-r-2xl" />

        {/* Ticker Track Mengalir Horizontal */}
        <div className="flex overflow-hidden group select-none">
          <div className="flex shrink-0 items-center gap-3.5 animate-marquee group-hover:[animation-play-state:paused]">
            {FEATURES.map((item) => {
              const isSelected = item.id === selectedId;
              const ItemIcon = item.icon;

              return (
                <div key={`track-1-${item.id}`} className="flex items-center gap-3.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    onMouseEnter={() => handleSelect(item.id)}
                    className={`inline-flex items-center gap-3 px-4.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm md:text-[15px] font-semibold transition-all shrink-0 border cursor-pointer font-sans rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <ItemIcon
                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                        isSelected ? "text-white" : "text-slate-800"
                      }`}
                    />
                    <span>{item.title}</span>
                    <span
                      className={`text-[10px] sm:text-xs uppercase font-mono px-2.5 py-0.5 rounded-full border ${
                        isSelected
                          ? "bg-slate-800 text-slate-100 border-slate-700 font-bold"
                          : "bg-slate-100 text-slate-700 border-slate-200 font-medium"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </button>

                  {/* Elemen Hiasan Pemisah Berkilau Halus */}
                  <span className="text-slate-300 font-mono text-sm select-none">
                    ✦
                  </span>
                </div>
              );
            })}
          </div>

          {/* Duplikasi track untuk continuous looping tanpa jeda */}
          <div className="flex shrink-0 items-center gap-3.5 animate-marquee group-hover:[animation-play-state:paused] ml-3.5">
            {FEATURES.map((item) => {
              const isSelected = item.id === selectedId;
              const ItemIcon = item.icon;

              return (
                <div key={`track-2-${item.id}`} className="flex items-center gap-3.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    onMouseEnter={() => handleSelect(item.id)}
                    className={`inline-flex items-center gap-3 px-4.5 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm md:text-[15px] font-semibold transition-all shrink-0 border cursor-pointer font-sans rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md hover:-translate-y-0.5 ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <ItemIcon
                      className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                        isSelected ? "text-white" : "text-slate-800"
                      }`}
                    />
                    <span>{item.title}</span>
                    <span
                      className={`text-[10px] sm:text-xs uppercase font-mono px-2.5 py-0.5 rounded-full border ${
                        isSelected
                          ? "bg-slate-800 text-slate-100 border-slate-700 font-bold"
                          : "bg-slate-100 text-slate-700 border-slate-200 font-medium"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </button>

                  {/* Elemen Hiasan Pemisah Berkilau Halus */}
                  <span className="text-slate-300 font-mono text-sm select-none">
                    ✦
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Panel Pratinjau Studio Kompak (Sudut Halus Rounded-2xl & Terformat Bersih) */}
      <div className="relative border border-slate-200/90 bg-white p-6 sm:p-10 lg:p-12 rounded-3xl shadow-xs overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFeature.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Kolom Kiri: Rincian Narasi & Poin Keunggulan (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge
                  variant="outline"
                  className="bg-slate-100 text-slate-800 border-slate-300 font-mono font-bold text-xs px-2.5 py-1"
                >
                  {selectedFeature.badge}
                </Badge>
                <span className="text-xs sm:text-sm text-slate-500 font-mono">
                  {selectedFeature.tagline}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <span>{selectedFeature.title}</span>
                </h3>
                <p className="text-sm sm:text-base font-semibold text-slate-700">
                  {selectedFeature.shortDesc}
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {selectedFeature.fullDesc}
              </p>

              {/* Poin-poin Kunci dengan Ikon Monokromatik Netral */}
              <div className="space-y-2.5 pt-1">
                {selectedFeature.points.map((pt, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 text-xs sm:text-sm text-slate-700"
                  >
                    <div className="w-4.5 h-4.5 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                      <Check className="w-3 h-3 text-slate-800 stroke-[3]" />
                    </div>
                    <span className="font-medium">{pt}</span>
                  </div>
                ))}
              </div>

              {/* Tombol Aksi Langsung ke Fitur Terkait */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link href={selectedFeature.link}>
                  <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm h-11 sm:h-12 px-6 rounded-xl gap-2 shadow-xs cursor-pointer">
                    <span>Buka Modul Ini</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Button>
                </Link>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  Luaran Resmi:{" "}
                  <span className="font-bold text-slate-900">
                    {selectedFeature.docOutput}
                  </span>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Card Showcase Visual & Spesifikasi Luaran (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-slate-50/90 rounded-2xl p-6 sm:p-7 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  SPESIFIKASI BERKAS RESMI
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700">
                  Standar Resmi BKPDM
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600">Format Dokumen</span>
                  <span className="font-bold text-slate-900">{selectedFeature.formatType}</span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600">Standar Margin</span>
                  <span className="font-bold text-slate-900 font-mono">4 cm - 3 cm - 3 cm - 3 cm</span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600">Kop & Tanda Tangan</span>
                  <span className="font-bold text-slate-900">Otomatis Terintegrasi</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-700" />
                  <span>Siap Supervisi Pengawas</span>
                </div>
                <span>v3.0-BKPDM</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

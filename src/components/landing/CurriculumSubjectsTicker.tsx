"use client";

import React, { useState } from "react";
import { BookOpen, GraduationCap, School, Sparkles, Layers, ChevronRight } from "lucide-react";

interface SubjectItem {
  id: string;
  level: "SD/MI" | "SMP/MTs" | "SMA/MA" | "SMK/MAK";
  phase: string;
  name: string;
  detail: string;
}

// 1. Pelajaran SD / MI (Fase A - C: Fondasi Literasi, Numerasi & Karakter)
const SD_SUBJECTS: SubjectItem[] = [
  { id: "sd-1", level: "SD/MI", phase: "FASE A-C", name: "Bahasa Indonesia", detail: "Literasi Membaca & Menulis Terbimbing" },
  { id: "sd-2", level: "SD/MI", phase: "FASE A-C", name: "Matematika Konseptual", detail: "Bilangan, Aljabar Dasar & Pengukuran" },
  { id: "sd-3", level: "SD/MI", phase: "FASE B-C", name: "IPAS Terpadu", detail: "Sains Eksploratif & Pemahaman Sosial" },
  { id: "sd-4", level: "SD/MI", phase: "FASE A-C", name: "Pendidikan Pancasila", detail: "Karakter Nilai Moral Kebangsaan" },
  { id: "sd-5", level: "SD/MI", phase: "FASE A-C", name: "Pendidikan Agama & Budi Pekerti", detail: "Penanaman Akhlak Mulia" },
  { id: "sd-6", level: "SD/MI", phase: "FASE A-C", name: "PJOK", detail: "Aktivitas Pola Gerak Dasar & Kebugaran" },
  { id: "sd-7", level: "SD/MI", phase: "FASE A-C", name: "Seni Rupa & Prakarya", detail: "Eksplorasi Warna, Bentuk & Tekstur" },
  { id: "sd-8", level: "SD/MI", phase: "FASE A-C", name: "Seni Musik & Tari Tradisi", detail: "Apresiasi Irama & Gerak Budaya" },
  { id: "sd-9", level: "SD/MI", phase: "FASE A-C", name: "Bahasa Inggris Dasar", detail: "Pengenalan Kosakata Kontekstual" },
  { id: "sd-10", level: "SD/MI", phase: "FASE C", name: "Koding & AI Dasar", detail: "Logika Komputasional Pemula" },
];

// 2. Pelajaran SMP / MTs (Fase D: Eksplorasi Sains, Analisis & Penalaran Kritis)
const SMP_SUBJECTS: SubjectItem[] = [
  { id: "smp-1", level: "SMP/MTs", phase: "FASE D", name: "IPA Terpadu", detail: "Fisika Mekanika, Biologi Sel & Kimia Sederhana" },
  { id: "smp-2", level: "SMP/MTs", phase: "FASE D", name: "Matematika Penalaran", detail: "Persamaan Aljabar, Teorema & Statistika Data" },
  { id: "smp-3", level: "SMP/MTs", phase: "FASE D", name: "Bahasa Indonesia Kritis", detail: "Teks Laporan Observasi & Esai Argumentatif" },
  { id: "smp-4", level: "SMP/MTs", phase: "FASE D", name: "Bahasa Inggris Komunikatif", detail: "Teks Interaksional, Prosedur & Naratif" },
  { id: "smp-5", level: "SMP/MTs", phase: "FASE D", name: "IPS Terpadu", detail: "Interaksi Keruangan & Dinamika Ekonomi" },
  { id: "smp-6", level: "SMP/MTs", phase: "FASE D", name: "Informatika Algoritma", detail: "Struktur Data, Jaringan & Pemrograman Visual" },
  { id: "smp-7", level: "SMP/MTs", phase: "FASE D", name: "Pendidikan Pancasila", detail: "Harmoni Keberagaman & Konstitusi UUD 1945" },
  { id: "smp-8", level: "SMP/MTs", phase: "FASE D", name: "Pendidikan Agama & Toleransi", detail: "Moderasi Beragama & Fikih Ibadah" },
  { id: "smp-9", level: "SMP/MTs", phase: "FASE D", name: "Seni Budaya & Teater", detail: "Karya Seni Kreatif & Kolaborasi Pentas" },
  { id: "smp-10", level: "SMP/MTs", phase: "FASE D", name: "PJOK Lanjutan", detail: "Olahraga Prestasi & Pola Hidup Sehat" },
];

// 3. Pelajaran SMA / MA / SMK (Fase E & F: Spesialisasi Akademik, Sains Lanjut & Vokasi)
const SMA_SUBJECTS: SubjectItem[] = [
  { id: "sma-1", level: "SMA/MA", phase: "FASE E-F", name: "Fisika Lanjut", detail: "Mekanika Fluida, Gelombang & Termodinamika" },
  { id: "sma-2", level: "SMA/MA", phase: "FASE E-F", name: "Kimia Terapan", detail: "Stoikiometri, Larutan Asam-Basa & Redoks" },
  { id: "sma-3", level: "SMA/MA", phase: "FASE E-F", name: "Biologi Molekuler", detail: "Genetika, Metabolisme Sel & Ekologi Modern" },
  { id: "sma-4", level: "SMA/MA", phase: "FASE E-F", name: "Matematika Tingkat Lanjut", detail: "Kalkulus Diferensial, Integral & Matriks" },
  { id: "sma-5", level: "SMA/MA", phase: "FASE E-F", name: "Sosiologi Analitis", detail: "Riset Sosial, Diferensiasi & Perubahan Global" },
  { id: "sma-6", level: "SMA/MA", phase: "FASE E-F", name: "Ekonomi Makro & Akuntansi", detail: "Kebijakan Fiskal-Moneter & Jurnal Finansial" },
  { id: "sma-7", level: "SMA/MA", phase: "FASE E-F", name: "Geografi Kebencanaan", detail: "Sistem Informasi Geografis (SIG) & Lingkungan" },
  { id: "sma-8", level: "SMA/MA", phase: "FASE E-F", name: "Sejarah Nasional & Dunia", detail: "Historiografi Kritis & Peradaban Nusantara" },
  { id: "sma-9", level: "SMA/MA", phase: "FASE E-F", name: "Bahasa Indonesia Akademik", detail: "Penulisan Karya Tulis Ilmiah & Bedah Puisi" },
  { id: "sma-10", level: "SMK/MAK", phase: "FASE F", name: "Rekayasa Perangkat Lunak (RPL)", detail: "Frontend Modern, Database & Arsitektur API" },
  { id: "sma-11", level: "SMK/MAK", phase: "FASE F", name: "Desain Komunikasi Visual (DKV)", detail: "Tipografi, Ilustrasi Digital & Motion Graphic" },
  { id: "sma-12", level: "SMK/MAK", phase: "FASE F", name: "Manajemen Tata Kelola Kantor", detail: "Otomasi Perkantoran & Administrasi Digital" },
];

const JENJANG_LIST = [
  { code: "01", name: "SD / MI", fase: "Fase A - C", desc: "Kelas 1 - 6" },
  { code: "02", name: "SMP / MTs", fase: "Fase D", desc: "Kelas 7 - 9" },
  { code: "03", name: "SMA / MA", fase: "Fase E - F", desc: "Kelas 10 - 12" },
  { code: "04", name: "SMK / MAK", fase: "Fase E - F", desc: "Vokasi Industri" },
  { code: "05", name: "SLB / Inklusi", fase: "Fase Khusus", desc: "Semua Jenjang" },
];

export function CurriculumSubjectsTicker() {
  const [activeJenjang, setActiveJenjang] = useState<string>("SD / MI");
  const [activeSubject, setActiveSubject] = useState<SubjectItem | null>(null);

  return (
    <section className="relative w-full border-b border-slate-300/80 bg-slate-50/70 py-10 sm:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Header & Jenjang Bar dengan Sudut Lancip dan Teks Lebih Besar */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-300 text-[11px] sm:text-xs font-mono font-bold text-slate-800 uppercase tracking-widest">
            <span className="w-2 h-2 bg-slate-900 inline-block animate-pulse" />
            <span>[DISEDIAKAN_UNTUK_SELURUH_SATUAN_PENDIDIKAN_NASIONAL]</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
            Cakupan Kurikulum Merdeka Lintas Jenjang & Mata Pelajaran
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-sans">
            Pilih jenjang satuan pendidikan atau sorot salah satu mata pelajaran di bawah untuk melihat rincian capaian pembelajaran resmi BSKAP 032/2024.
          </p>

          {/* Kotak Jenjang Sudut Lancip (Sharp Corners) & Tulisan Lebih Besar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-2">
            {JENJANG_LIST.map((lvl) => {
              const isActive = activeJenjang === lvl.name;
              return (
                <button
                  key={lvl.code}
                  type="button"
                  onClick={() => setActiveJenjang(lvl.name)}
                  className={`group relative flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 border-2 transition-all cursor-pointer font-mono ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-800 border-slate-300 hover:border-slate-900 hover:bg-slate-100"
                  }`}
                  style={{ borderRadius: "0px" }}
                >
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 border ${
                      isActive
                        ? "bg-slate-800 text-slate-200 border-slate-700"
                        : "bg-slate-100 text-slate-600 border-slate-300 group-hover:bg-slate-200"
                    }`}
                  >
                    // {lvl.code}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold tracking-wide font-sans">
                    {lvl.name}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider hidden sm:inline ${
                      isActive ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    ({lvl.fase})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Container 3 Tumpuk Running Text Marquee ala Hexaa.sh */}
        <div
          className="relative w-full border-2 border-slate-300 bg-white py-4 sm:py-6 shadow-xs overflow-hidden space-y-3.5"
          style={{ borderRadius: "0px" }}
        >
          {/* Gradient Fade Masks (Kiri & Kanan) untuk Transisi Mulus Hexaa */}
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-16 sm:w-32 z-20 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-16 sm:w-32 z-20 bg-gradient-to-l from-white via-white/80 to-transparent" />

          {/* Tumpukan 1: SD / MI (Arah Kiri, Durasi 38s) */}
          <div className="relative flex items-center">
            {/* Tag Level Statis di Pojok Kiri (Desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 absolute left-3 z-30 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-mono font-bold tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span>SD/MI [FASE A-C]</span>
            </div>

            <div className="flex overflow-hidden group select-none w-full">
              <div
                className="flex shrink-0 items-center gap-3 animate-marquee group-hover:[animation-play-state:paused]"
                style={{ "--marquee-duration": "38s" } as React.CSSProperties}
              >
                {SD_SUBJECTS.map((sub) => (
                  <MarqueeSubjectButton
                    key={`sd-track-1-${sub.id}`}
                    item={sub}
                    isSelected={activeSubject?.id === sub.id}
                    onSelect={() => setActiveSubject(sub)}
                  />
                ))}
              </div>
              <div
                className="flex shrink-0 items-center gap-3 animate-marquee group-hover:[animation-play-state:paused] ml-3"
                style={{ "--marquee-duration": "38s" } as React.CSSProperties}
              >
                {SD_SUBJECTS.map((sub) => (
                  <MarqueeSubjectButton
                    key={`sd-track-2-${sub.id}`}
                    item={sub}
                    isSelected={activeSubject?.id === sub.id}
                    onSelect={() => setActiveSubject(sub)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tumpukan 2: SMP / MTs (Arah Kanan / Reverse, Durasi 34s) */}
          <div className="relative flex items-center border-t border-b border-slate-200/80 py-2">
            {/* Tag Level Statis di Pojok Kiri (Desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 absolute left-3 z-30 px-2.5 py-1 bg-slate-800 text-white text-[10px] font-mono font-bold tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
              <span>SMP/MTs [FASE D]</span>
            </div>

            <div className="flex overflow-hidden group select-none w-full">
              <div
                className="flex shrink-0 items-center gap-3 animate-marquee-reverse group-hover:[animation-play-state:paused]"
                style={{ "--marquee-duration": "34s" } as React.CSSProperties}
              >
                {SMP_SUBJECTS.map((sub) => (
                  <MarqueeSubjectButton
                    key={`smp-track-1-${sub.id}`}
                    item={sub}
                    isSelected={activeSubject?.id === sub.id}
                    onSelect={() => setActiveSubject(sub)}
                  />
                ))}
              </div>
              <div
                className="flex shrink-0 items-center gap-3 animate-marquee-reverse group-hover:[animation-play-state:paused] ml-3"
                style={{ "--marquee-duration": "34s" } as React.CSSProperties}
              >
                {SMP_SUBJECTS.map((sub) => (
                  <MarqueeSubjectButton
                    key={`smp-track-2-${sub.id}`}
                    item={sub}
                    isSelected={activeSubject?.id === sub.id}
                    onSelect={() => setActiveSubject(sub)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tumpukan 3: SMA / MA / SMK (Arah Kiri, Durasi 42s) */}
          <div className="relative flex items-center">
            {/* Tag Level Statis di Pojok Kiri (Desktop) */}
            <div className="hidden lg:flex items-center gap-1.5 absolute left-3 z-30 px-2.5 py-1 bg-slate-900 text-white text-[10px] font-mono font-bold tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
              <span>SMA/MA/SMK [FASE E-F]</span>
            </div>

            <div className="flex overflow-hidden group select-none w-full">
              <div
                className="flex shrink-0 items-center gap-3 animate-marquee group-hover:[animation-play-state:paused]"
                style={{ "--marquee-duration": "42s" } as React.CSSProperties}
              >
                {SMA_SUBJECTS.map((sub) => (
                  <MarqueeSubjectButton
                    key={`sma-track-1-${sub.id}`}
                    item={sub}
                    isSelected={activeSubject?.id === sub.id}
                    onSelect={() => setActiveSubject(sub)}
                  />
                ))}
              </div>
              <div
                className="flex shrink-0 items-center gap-3 animate-marquee group-hover:[animation-play-state:paused] ml-3"
                style={{ "--marquee-duration": "42s" } as React.CSSProperties}
              >
                {SMA_SUBJECTS.map((sub) => (
                  <MarqueeSubjectButton
                    key={`sma-track-2-${sub.id}`}
                    item={sub}
                    isSelected={activeSubject?.id === sub.id}
                    onSelect={() => setActiveSubject(sub)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Panel Mini Info Pelajaran Terpilih (Responsive Drawer ala Hexaa Studio) */}
        {activeSubject && (
          <div
            className="border-2 border-slate-900 bg-slate-900 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ borderRadius: "0px" }}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <span className="px-2 py-0.5 bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                  {activeSubject.level}
                </span>
                <span>//</span>
                <span className="font-semibold text-slate-300">{activeSubject.phase}</span>
                <span>//</span>
                <span className="text-slate-400">REGULASI RESMI BSKAP 2024</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white tracking-tight font-sans">
                {activeSubject.name}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                {activeSubject.detail} — Siap digenerasikan instan ke dalam format Modul Ajar, Kisi-Kisi HOTS, dan Perangkat Tahunan.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setActiveSubject(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                style={{ borderRadius: "0px" }}
              >
                [Tutup Info]
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Subkomponen Tombol Item Marquee ala Hexaa.sh
function MarqueeSubjectButton({
  item,
  isSelected,
  onSelect,
}: {
  item: SubjectItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={onSelect}
        className={`group inline-flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 border-2 transition-all cursor-pointer font-mono shrink-0 ${
          isSelected
            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
            : "bg-white text-slate-800 border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
        }`}
        style={{ borderRadius: "0px" }}
      >
        <span
          className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 border ${
            isSelected
              ? "bg-slate-800 text-slate-100 border-slate-700"
              : "bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-slate-800 group-hover:text-white group-hover:border-slate-700"
          }`}
        >
          {item.phase}
        </span>
        <span className="text-xs sm:text-sm font-bold tracking-tight font-sans">
          {item.name}
        </span>
      </button>

      {/* Pembatas Geometris Bintang / Asterisk Khas Hexaa.sh */}
      <span className="text-slate-400 font-mono text-xs select-none">
        ✦
      </span>
    </div>
  );
}

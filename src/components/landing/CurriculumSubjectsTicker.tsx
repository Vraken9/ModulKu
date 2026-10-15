"use client";

import React, { useState } from "react";

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

  return (
    <section className="relative w-full border-b border-slate-200/80 bg-slate-50/60 py-8 sm:py-11 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        
        {/* 1. Header & Jenjang Bar yang Bersih, Alami, dan Mudah Dibaca */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-xs font-semibold text-slate-700 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900 inline-block animate-pulse" />
            <span>Disediakan untuk Seluruh Satuan Pendidikan Nasional</span>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Cakupan Kurikulum Merdeka Lintas Jenjang & Mata Pelajaran
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto font-sans leading-relaxed">
            Daftar capaian pembelajaran komprehensif mulai dari fondasi SD/MI hingga peminatan lanjut SMA dan vokasi SMK sesuai regulasi resmi BSKAP 032/2024.
          </p>

          {/* Tombol Jenjang Lembut Berlekuk Halus (Rounded Full) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1">
            {JENJANG_LIST.map((lvl) => {
              const isActive = activeJenjang === lvl.name;
              return (
                <button
                  key={lvl.code}
                  type="button"
                  onClick={() => setActiveJenjang(lvl.name)}
                  className={`group relative flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border transition-all cursor-pointer font-sans text-[11px] sm:text-xs ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded-full border ${
                      isActive
                        ? "bg-slate-800 text-slate-200 border-slate-700"
                        : "bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-slate-200"
                    }`}
                  >
                    {lvl.code}
                  </span>
                  <span className="font-semibold tracking-tight">
                    {lvl.name}
                  </span>
                  <span
                    className={`text-[10px] hidden sm:inline ${
                      isActive ? "text-slate-300" : "text-slate-400"
                    }`}
                  >
                    ({lvl.fase})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Container 3 Tumpuk Running Text dengan Garis Rapat, Line Tengah Menonjol & Berbayang */}
        <div className="relative w-full border border-slate-200/80 bg-white py-3 sm:py-4 rounded-2xl shadow-xs overflow-hidden space-y-0.5 sm:space-y-1">
          {/* Gradient Fade Masks (Kiri & Kanan) untuk Transisi Mulus */}
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-14 sm:w-28 z-30 bg-gradient-to-r from-white via-white/85 to-transparent rounded-l-2xl" />
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-14 sm:w-28 z-30 bg-gradient-to-l from-white via-white/85 to-transparent rounded-r-2xl" />

          {/* Tumpukan 1: SD / MI (Arah Kiri, Durasi 40s) */}
          <div className="relative flex items-center py-0.5">
            <div className="flex overflow-hidden group select-none w-full">
              <div
                className="flex shrink-0 items-center gap-3 animate-marquee group-hover:[animation-play-state:paused]"
                style={{ "--marquee-duration": "40s" } as React.CSSProperties}
              >
                {SD_SUBJECTS.map((sub) => (
                  <FloatingSubjectChip key={`sd-track-1-${sub.id}`} item={sub} />
                ))}
              </div>
              <div
                className="flex shrink-0 items-center gap-3 animate-marquee group-hover:[animation-play-state:paused] ml-3"
                style={{ "--marquee-duration": "40s" } as React.CSSProperties}
              >
                {SD_SUBJECTS.map((sub) => (
                  <FloatingSubjectChip key={`sd-track-2-${sub.id}`} item={sub} />
                ))}
              </div>
            </div>
          </div>

          {/* Tumpukan 2: SMP / MTs (Arah Kanan / Reverse, Durasi 36s) - Line Tengah Lebih Menonjol dengan Bayangan */}
          <div className="relative z-10 flex items-center bg-slate-50/70 border-y border-slate-200/60 py-1.5 sm:py-2 shadow-[0_4px_14px_-3px_rgba(0,0,0,0.06)]">
            <div className="flex overflow-hidden group select-none w-full">
              <div
                className="flex shrink-0 items-center gap-3 animate-marquee-reverse group-hover:[animation-play-state:paused]"
                style={{ "--marquee-duration": "36s" } as React.CSSProperties}
              >
                {SMP_SUBJECTS.map((sub) => (
                  <FloatingSubjectChip key={`smp-track-1-${sub.id}`} item={sub} isFeatured />
                ))}
              </div>
              <div
                className="flex shrink-0 items-center gap-3 animate-marquee-reverse group-hover:[animation-play-state:paused] ml-3"
                style={{ "--marquee-duration": "36s" } as React.CSSProperties}
              >
                {SMP_SUBJECTS.map((sub) => (
                  <FloatingSubjectChip key={`smp-track-2-${sub.id}`} item={sub} isFeatured />
                ))}
              </div>
            </div>
          </div>

          {/* Tumpukan 3: SMA / MA / SMK (Arah Kiri, Durasi 44s) */}
          <div className="relative flex items-center py-0.5">
            <div className="flex overflow-hidden group select-none w-full">
              <div
                className="flex shrink-0 items-center gap-3 animate-marquee group-hover:[animation-play-state:paused]"
                style={{ "--marquee-duration": "44s" } as React.CSSProperties}
              >
                {SMA_SUBJECTS.map((sub) => (
                  <FloatingSubjectChip key={`sma-track-1-${sub.id}`} item={sub} />
                ))}
              </div>
              <div
                className="flex shrink-0 items-center gap-3 animate-marquee group-hover:[animation-play-state:paused] ml-3"
                style={{ "--marquee-duration": "44s" } as React.CSSProperties}
              >
                {SMA_SUBJECTS.map((sub) => (
                  <FloatingSubjectChip key={`sma-track-2-${sub.id}`} item={sub} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Subkomponen Chip Mata Pelajaran Melayang Berlekuk Halus (Rounded-xl) & Hiasan Elegan
function FloatingSubjectChip({
  item,
  isFeatured = false,
}: {
  item: SubjectItem;
  isFeatured?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <div
        className={`group inline-flex items-center gap-2.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-xl border transition-all duration-200 shrink-0 cursor-default ${
          isFeatured
            ? "bg-white border-slate-300/80 shadow-[0_3px_10px_-2px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md hover:-translate-y-0.5"
            : "bg-white border-slate-200/80 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-0.5"
        }`}
      >
        <span
          className={`text-[10px] sm:text-[11px] font-mono font-medium px-2 py-0.5 rounded-md border ${
            isFeatured
              ? "bg-slate-100 text-slate-800 border-slate-300/80"
              : "bg-slate-50 text-slate-600 border-slate-200/70"
          }`}
        >
          {item.phase}
        </span>
        <span className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight font-sans whitespace-nowrap">
          {item.name}
        </span>
      </div>

      {/* Elemen Hiasan Pemisah Berkilau Lembut */}
      <span className="text-slate-300 font-mono text-xs select-none">
        ✦
      </span>
    </div>
  );
}

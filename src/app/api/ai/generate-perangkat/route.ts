import { NextRequest, NextResponse } from "next/server";
import { perangkatTahunanInputSchema } from "@/lib/validations/perangkat-tahunan";
import { getOfficialCP } from "@/lib/data/capaian-pembelajaran";
import {
  PerangkatTahunanBundle,
  AnnualCalendarData,
  AlurTujuanPembelajaran,
  ProgramTahunan,
  ProgramSemester,
  LearningObjectiveTP,
  PromesMatrixRow,
} from "@/types";

export const runtime = "nodejs";

function generateFallbackPerangkat(input: {
  subject: string;
  phase: "A" | "B" | "C" | "D" | "E" | "F";
  grade: string;
  academic_year: string;
  jp_per_week: number;
  sem1_calendar_weeks: number;
  sem1_ineffective_weeks: number;
  sem2_calendar_weeks: number;
  sem2_ineffective_weeks: number;
  learning_scope?: string;
}): PerangkatTahunanBundle {
  const sem1EffectiveWeeks = Math.max(
    1,
    input.sem1_calendar_weeks - input.sem1_ineffective_weeks
  );
  const sem1TotalJp = sem1EffectiveWeeks * input.jp_per_week;

  const sem2EffectiveWeeks = Math.max(
    1,
    input.sem2_calendar_weeks - input.sem2_ineffective_weeks
  );
  const sem2TotalJp = sem2EffectiveWeeks * input.jp_per_week;

  const standardCP = getOfficialCP(input.phase, input.subject);
  const element = standardCP ? standardCP.element : "Pemahaman Konsep & Keterampilan Proses";
  const cpText = standardCP
    ? standardCP.description
    : `Peserta didik mampu memahami, menganalisis, dan mengevaluasi konsep esensial materi ${input.subject} Fase ${input.phase} melalui penalaran logis dan penyelidikan ilmiah.`;

  // Kalender dan Rincian Pekan Efektif (RPE)
  const calendar: AnnualCalendarData = {
    academic_year: input.academic_year,
    jp_per_week: input.jp_per_week,
    semester_1: {
      total_calendar_weeks: input.sem1_calendar_weeks,
      ineffective_weeks: input.sem1_ineffective_weeks,
      effective_weeks: sem1EffectiveWeeks,
      effective_hours: sem1TotalJp,
      non_effective_details: [
        { activity: "Masa Pengenalan Lingkungan Sekolah (MPLS)", count_weeks: 1 },
        { activity: "Asesmen Diagnostik Awal & Orientasi Belajar", count_weeks: 1 },
        { activity: "Jeda Asesmen Tengah Semester / STS", count_weeks: 1 },
        { activity: "Pengolahan Nilai & Pembagian Rapor Semester 1", count_weeks: 1 },
        {
          activity: "Libur Akhir Semester Ganjil",
          count_weeks: Math.max(1, input.sem1_ineffective_weeks - 4),
        },
      ],
    },
    semester_2: {
      total_calendar_weeks: input.sem2_calendar_weeks,
      ineffective_weeks: input.sem2_ineffective_weeks,
      effective_weeks: sem2EffectiveWeeks,
      effective_hours: sem2TotalJp,
      non_effective_details: [
        { activity: "Libur Awal Ramadhan & Pondok Karakter", count_weeks: 1 },
        { activity: "Libur Hari Raya Idul Fitri", count_weeks: 2 },
        { activity: "Asesmen Sumatif Akhir Jenjang / STS Genap", count_weeks: 1 },
        { activity: "Pengolahan Nilai & Rapat Pleno Kenaikan Kelas", count_weeks: 1 },
        {
          activity: "Libur Kenaikan Kelas / Akhir Tahun",
          count_weeks: Math.max(1, input.sem2_ineffective_weeks - 5),
        },
      ],
    },
    total_annual_jp: sem1TotalJp + sem2TotalJp,
  };

  // Materi default berdasarkan mapel atau fallback
  const materialsSem1 = [
    `Konsep Dasar dan Prinsip Fundamental ${input.subject}`,
    `Analisis Struktur dan Dinamika Materi ${input.subject}`,
    `Penyelidikan Ilmiah dan Eksperimen Aplikasi ${input.subject}`,
    `Evaluasi dan Pemecahan Masalah Kontekstual ${input.subject}`,
  ];

  const materialsSem2 = [
    `Pengembangan Lanjutan dan Sistem Terpadu ${input.subject}`,
    `Penerapan Teknologi dan Inovasi Terbarukan dalam ${input.subject}`,
    `Analisis Kritis Fenomena Kontemporer ${input.subject}`,
    `Proyek Kolaboratif Terapan dan Publikasi Ilmiah`,
  ];

  // Hitung pembagian JP per materi agar tepat totalnya
  function distributeJp(totalJp: number, count: number): number[] {
    const base = Math.floor(totalJp / count);
    let remainder = totalJp % count;
    return Array.from({ length: count }, () => {
      const val = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      return val;
    });
  }

  const jpAllocSem1 = distributeJp(sem1TotalJp, materialsSem1.length);
  const jpAllocSem2 = distributeJp(sem2TotalJp, materialsSem2.length);

  const tpItems: LearningObjectiveTP[] = [];

  // Semester 1 TPs
  materialsSem1.forEach((mat, idx) => {
    tpItems.push({
      id: `tp-1-${idx + 1}`,
      code: `TP 1.${idx + 1}`,
      element,
      statement: `Peserta didik mampu mengidentifikasi, menganalisis, dan menjelaskan ${mat} secara kritis dan mandiri melalui kajian literatur dan diskusi kelompok.`,
      competency: idx % 2 === 0 ? "Menganalisis" : "Mengevaluasi",
      material_scope: mat,
      allocated_jp: jpAllocSem1[idx],
      semester: 1,
      evaluation_technique: idx % 2 === 0 ? "Tes Tertulis & LKPD" : "Observasi Kinerja & Produk",
      pancasila_dimensions: ["Bernalar Kritis", "Gotong Royong", "Mandiri"],
    });
  });

  // Semester 2 TPs
  materialsSem2.forEach((mat, idx) => {
    tpItems.push({
      id: `tp-2-${idx + 1}`,
      code: `TP 2.${idx + 1}`,
      element,
      statement: `Peserta didik mampu merancang, mempraktikkan, dan mempublikasikan hasil investigasi ${mat} dengan mengintegrasikan nilai integritas dan kolaborasi.`,
      competency: idx % 2 === 0 ? "Merancang" : "Mengkreasi",
      material_scope: mat,
      allocated_jp: jpAllocSem2[idx],
      semester: 2,
      evaluation_technique: idx % 2 === 0 ? "Penilaian Proyek & Portofolio" : "Tes Tertulis & Presentasi",
      pancasila_dimensions: ["Kreatif", "Bernalar Kritis", "Gotong Royong"],
    });
  });

  // Dokumen Alur Tujuan Pembelajaran (ATP)
  const atp: AlurTujuanPembelajaran = {
    id: `atp-${Date.now()}`,
    subject: input.subject,
    phase: input.phase,
    grade: input.grade,
    academic_year: input.academic_year,
    rationale:
      "Alur Tujuan Pembelajaran ini disusun secara sistematis dan spiral dari ranah pemahaman konseptual hingga kreasi proyek kontekstual, mendukung pencapaian Profil Pelajar Pancasila dan 8 Dimensi Karakter sesuai regulasi BKPDM Kemendikdasmen No. 020/2026 dan Permendikdasmen No. 13/2025.",
    elements: [
      {
        name: element,
        cp_description: cpText,
      },
    ],
    tp_items: tpItems,
    total_jp: sem1TotalJp + sem2TotalJp,
  };

  // Dokumen Program Tahunan (PROTA)
  const prota: ProgramTahunan = {
    id: `prota-${Date.now()}`,
    subject: input.subject,
    grade: input.grade,
    academic_year: input.academic_year,
    semester_1_items: tpItems
      .filter((t) => t.semester === 1)
      .map((t, i) => ({
        no: i + 1,
        tp_code: t.code,
        material: t.material_scope,
        allocated_jp: t.allocated_jp,
      })),
    semester_1_total_jp: sem1TotalJp,
    semester_2_items: tpItems
      .filter((t) => t.semester === 2)
      .map((t, i) => ({
        no: i + 1,
        tp_code: t.code,
        material: t.material_scope,
        allocated_jp: t.allocated_jp,
      })),
    semester_2_total_jp: sem2TotalJp,
    total_yearly_jp: sem1TotalJp + sem2TotalJp,
  };

  // Helper untuk membuat matriks mingguan PROMES
  function buildPromes(
    semesterNum: 1 | 2,
    monthsList: string[],
    weeksDist: number[],
    items: LearningObjectiveTP[],
    jpPerW: number
  ): ProgramSemester {
    const matrixRows: PromesMatrixRow[] = [];
    let currentMonthIdx = 0;
    let currentWeekIdx = 1;

    // Lewati minggu pertama untuk agenda awal (MPLS di sem 1 atau Libur di sem 2)
    if (semesterNum === 1) {
      currentWeekIdx = 2; // Minggu 1 adalah MPLS
    }

    items.forEach((item, itemIdx) => {
      const weeklyAllocations: Record<string, number | string> = {};
      let remainingJp = item.allocated_jp;

      while (remainingJp > 0 && currentMonthIdx < monthsList.length) {
        // Cek jika minggu khusus: Minggu ke-8 atau 9 adalah STS
        const isStsWeek =
          (semesterNum === 1 && currentMonthIdx === 2 && currentWeekIdx === 3) ||
          (semesterNum === 2 && currentMonthIdx === 2 && currentWeekIdx === 2);

        if (isStsWeek) {
          weeklyAllocations[`m${currentMonthIdx}_w${currentWeekIdx}`] = "STS";
          currentWeekIdx++;
          if (currentWeekIdx > weeksDist[currentMonthIdx]) {
            currentWeekIdx = 1;
            currentMonthIdx++;
          }
          continue;
        }

        const assignJp = Math.min(remainingJp, jpPerW);
        weeklyAllocations[`m${currentMonthIdx}_w${currentWeekIdx}`] = assignJp;
        remainingJp -= assignJp;

        currentWeekIdx++;
        if (currentWeekIdx > weeksDist[currentMonthIdx]) {
          currentWeekIdx = 1;
          currentMonthIdx++;
        }
      }

      matrixRows.push({
        no: itemIdx + 1,
        tp_code: item.code,
        material: item.material_scope,
        allocated_jp: item.allocated_jp,
        weekly_allocations: weeklyAllocations,
      });
    });

    return {
      id: `promes-${semesterNum}-${Date.now()}`,
      semester: semesterNum,
      academic_year: input.academic_year,
      subject: input.subject,
      grade: input.grade,
      months: monthsList,
      weeks_distribution: weeksDist,
      matrix_rows: matrixRows,
      agenda_legends: [
        { code: "KBM", label: "Kegiatan Belajar Mengajar", color: "bg-blue-100 text-blue-800" },
        { code: "MPLS", label: "Pengenalan Lingkungan Sekolah", color: "bg-amber-100 text-amber-800" },
        { code: "STS", label: "Sumatif Tengah Semester", color: "bg-purple-100 text-purple-800" },
        { code: "SAS", label: "Sumatif Akhir Semester", color: "bg-red-100 text-red-800" },
        { code: "RAPOR", label: "Pembagian Rapor", color: "bg-emerald-100 text-emerald-800" },
        { code: "LIBUR", label: "Libur Semester", color: "bg-zinc-200 text-zinc-800" },
      ],
    };
  }

  const promes1 = buildPromes(
    1,
    ["Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    [4, 5, 4, 4, 5, 4],
    tpItems.filter((t) => t.semester === 1),
    input.jp_per_week
  );

  const promes2 = buildPromes(
    2,
    ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
    [4, 4, 5, 4, 5, 4],
    tpItems.filter((t) => t.semester === 2),
    input.jp_per_week
  );

  return {
    calendar,
    atp,
    prota,
    promes_1: promes1,
    promes_2: promes2,
  };
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parseResult = perangkatTahunanInputSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validasi parameter gagal",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const bundle = generateFallbackPerangkat(data);

    return NextResponse.json({
      success: true,
      data: bundle,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return NextResponse.json(
      {
        error: "Gagal memproses pembuatan perangkat tahunan",
        details: errorMsg,
      },
      { status: 500 }
    );
  }
}

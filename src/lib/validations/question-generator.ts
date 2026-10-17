import { z } from "zod";

const safeText = z
  .string()
  .trim()
  .max(1000, "Maksimal 1000 karakter")
  .refine((val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val), {
    message: "Karakter tidak aman terdeteksi",
  });

export const questionGeneratorSchema = z
  .object({
    subject: safeText.min(2, "Mata pelajaran wajib diisi"),
    education_level: z.enum(["SD", "SMP", "SMA", "SMK"]),
    grade: z.string().min(1, "Kelas wajib dipilih"),
    phase: z.enum(["A", "B", "C", "D", "E", "F"]),
    semester: z.enum(["Ganjil", "Genap"]),
    academic_year: z.string().min(4, "Tahun ajaran wajib diisi"),
    curriculum: z.literal("Kurikulum Merdeka"),
    source_type: z.enum(["text", "pdf"]),

    pdf_filename: z
      .string()
      .trim()
      .max(120, "Nama berkas maksimal 120 karakter")
      .optional()
      .or(z.literal("")),
    pdf_snippet: z
      .string()
      .trim()
      .max(3000, "Intisari berkas rujukan maksimal 3000 karakter")
      .refine((val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val), {
        message: "Karakter tidak aman terdeteksi dalam ringkasan dokumen",
      })
      .optional()
      .or(z.literal("")),
    chapter_or_material: safeText.min(3, "Bab atau materi wajib diisi"),
    learning_objectives: safeText.min(5, "Tujuan atau capaian pembelajaran wajib diisi"),

    question_type: z.enum([
      "Pilihan Ganda",
      "Pilihan Ganda Kompleks",
      "Menjodohkan",
      "Isian Singkat",
      "Uraian",
      "Campuran",
    ]),
    options_count: z.number().int().min(3).max(5).default(4),
    total_questions: z.number().int().min(1).max(50).default(25),
    stimulus_type: z.enum(["langsung", "kutipan", "teks_utuh", "variatif"]).default("variatif"),

    difficulty_distribution: z.object({
      mudah: z.number().min(0).max(100),
      sedang: z.number().min(0).max(100),
      sulit: z.number().min(0).max(100),
    }),

    cognitive_distribution: z.object({
      lots: z.number().min(0).max(100),
      mots: z.number().min(0).max(100),
      hots: z.number().min(0).max(100),
    }),

    bloom_mode: z.enum(["otomatis", "manual"]).default("otomatis"),
    bloom_distribution: z.object({
      c1: z.number().min(0).max(100),
      c2: z.number().min(0).max(100),
      c3: z.number().min(0).max(100),
      c4: z.number().min(0).max(100),
      c5: z.number().min(0).max(100),
      c6: z.number().min(0).max(100),
    }),
  })
  .refine(
    (data) => {
      const diffSum =
        data.difficulty_distribution.mudah +
        data.difficulty_distribution.sedang +
        data.difficulty_distribution.sulit;
      return diffSum === 100;
    },
    {
      message: "Total persentase tingkat kesulitan (Mudah + Sedang + Sulit) harus berjumlah 100%",
      path: ["difficulty_distribution"],
    }
  )
  .refine(
    (data) => {
      const cogSum =
        data.cognitive_distribution.lots +
        data.cognitive_distribution.mots +
        data.cognitive_distribution.hots;
      return cogSum === 100;
    },
    {
      message: "Total persentase komposisi kognitif (LOTS + MOTS + HOTS) harus berjumlah 100%",
      path: ["cognitive_distribution"],
    }
  )
  .refine(
    (data) => {
      const b = data.bloom_distribution;
      const bloomSum = b.c1 + b.c2 + b.c3 + b.c4 + b.c5 + b.c6;
      return bloomSum === 100;
    },
    {
      message: "Total persentase Taksonomi Bloom (C1 s/d C6) harus berjumlah 100%",
      path: ["bloom_distribution"],
    }
  );

export type QuestionGeneratorFormValues = z.infer<typeof questionGeneratorSchema>;

import { z } from "zod";

const safeText = z
  .string()
  .trim()
  .max(1000, "Maksimal 1000 karakter")
  .refine((val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val), {
    message: "Karakter tidak aman terdeteksi",
  });

export const teachingModuleSchema = z.object({
  subject: safeText.min(2, "Mata pelajaran wajib diisi"),
  education_level: z.enum(["SD", "SMP", "SMA", "SMK"]),
  grade: z.string().min(1, "Kelas wajib dipilih"),
  phase: z.enum(["A", "B", "C", "D", "E", "F"]),
  semester: z.enum(["Ganjil", "Genap"]),
  academic_year: z.string().min(4, "Tahun ajaran wajib diisi"),
  duration_jp: z.number().int().min(1).max(20).default(2),
  total_meetings: z.number().int().min(1).max(10).default(1),

  learning_model: z.enum([
    "Problem-Based Learning (PBL)",
    "Project-Based Learning (PjBL)",
    "Discovery Learning",
    "Inkuiri Terbimbing",
    "Cooperative Learning",
    "Direct Instruction",
    "Pembelajaran Berbasis Riset / Kasus",
  ]),

  target_students: z.string().default("Peserta Didik Reguler (Tipikal)"),

  pancasila_dimensions: z
    .array(z.string())
    .min(1, "Pilih minimal 1 dimensi karakter/profil lulusan"),

  chapter_or_material: safeText.min(3, "Bab atau materi pokok wajib diisi"),
  initial_competency: safeText.min(5, "Kompetensi awal prasyarat wajib diisi"),
  learning_objectives: safeText.min(5, "Tujuan pembelajaran wajib diisi"),

  facilities_and_infrastructure: safeText.optional().or(z.literal("")),

  format_mode: z
    .enum(["ringkas", "lengkap_bskap", "lengkap_bkpdm"])
    .default("lengkap_bkpdm"),

  deep_learning_emphasis: z
    .enum(["seimbang", "mindful", "meaningful", "joyful"])
    .default("seimbang"),
});

export type TeachingModuleFormValues = z.infer<typeof teachingModuleSchema>;

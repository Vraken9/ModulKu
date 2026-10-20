import {
  StoredDocument,
  SubscriptionTier,
  TierStorageConfig,
  StorageUsageSummary,
  TeachingModule,
  QuestionPackage,
  PerangkatTahunanBundle,
  MediaAjarBundle,
} from "@/types";

export const TIER_CONFIGS: Record<SubscriptionTier, TierStorageConfig> = {
  free: {
    tier: "free",
    label: "Guru Mandiri (Gratis)",
    maxBytes: 50 * 1024 * 1024, // 50 MB
    formattedLimit: "50 MB",
  },
  pro: {
    tier: "pro",
    label: "Guru Profesional",
    maxBytes: 2 * 1024 * 1024 * 1024, // 2 GB
    formattedLimit: "2 GB",
  },
  school: {
    tier: "school",
    label: "Sekolah & MGMP",
    maxBytes: 25 * 1024 * 1024 * 1024, // 25 GB
    formattedLimit: "25 GB",
  },
};

export const DEFAULT_VAULT_STORAGE_KEY = "modulku_document_vault_items";
export const DEFAULT_TIER_STORAGE_KEY = "modulku_user_subscription_tier";

export function getActiveUserId(): string {
  if (typeof window === "undefined") return "guest";
  try {
    const saved = localStorage.getItem("modulku_active_user_id");
    if (saved && saved.trim()) return saved.trim();
  } catch {
    // Abaikan di server
  }
  return "guest";
}

export function setActiveUserId(userId: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (userId && userId.trim()) {
      localStorage.setItem("modulku_active_user_id", userId.trim());
    } else {
      localStorage.removeItem("modulku_active_user_id");
    }
    window.dispatchEvent(new CustomEvent("modulku-vault-changed"));
  } catch {
    // Abaikan
  }
}

export function getVaultStorageKey(userId?: string): string {
  const uid = userId || getActiveUserId();
  if (!uid || uid === "guest") return DEFAULT_VAULT_STORAGE_KEY;
  return `modulku_vault_${uid}`;
}

export function getTierStorageKey(userId?: string): string {
  const uid = userId || getActiveUserId();
  if (!uid || uid === "guest") return DEFAULT_TIER_STORAGE_KEY;
  return `modulku_tier_${uid}`;
}

// 1. DATA SEED MODUL AJAR (STANDAR BKPDM & DEEP LEARNING)
const SEED_MODUL_AJAR_CONTENT: TeachingModule = {
  id: "mod-seed-fisika-1",
  user_id: "seed-user-1",
  title: "Modul Ajar Fisika: Energi Terbarukan & Efisiensi Termal",
  subject: "Fisika",
  grade: "Kelas X",
  phase: "E",
  semester: "Ganjil",
  academic_year: "2025/2026",
  created_at: "2026-10-12T08:00:00.000Z",
  updated_at: "2026-10-12T08:00:00.000Z",
  duration_jp: 6,
  total_meetings: 2,
  learning_model: "Project Based Learning (PjBL)",
  target_students: "Reguler / Tipikal (36 Peserta Didik)",
  initial_competency:
    "Peserta didik telah memahami konsep dasar usaha dan energi serta hukum kekekalan energi mekanik dari Fase D (SMP).",
  pancasila_dimensions: [
    "Keimanan dan Ketakwaan kepada Tuhan YME serta Akhlak Mulia",
    "Penalaran Kritis",
    "Gotong Royong dan Kolaborasi",
    "Kreativitas",
  ],
  learning_objectives: [
    "Menganalisis keterbatasan sumber energi fosil dan urgensi pemanfaatan sumber energi baru terbarukan dalam kehidupan sehari-hari.",
    "Merancang purwarupa teknologi konversi energi surya ramah lingkungan untuk mengatasi kebutuhan listrik skala rumah tangga.",
    "Mengevaluasi efisiensi konversi daya dan menyajikan laporan hasil penyelidikan secara saintifik dan kolaboratif.",
  ],
  meaningful_understanding:
    "Pemanfaatan energi baru terbarukan secara efisien merupakan fondasi utama keberlanjutan bumi dan mitigasi perubahan iklim global.",
  trigger_questions: [
    "Mengapa ketergantungan kita pada bahan bakar minyak dan batu bara berisiko besar bagi stabilitas bumi di masa depan?",
    "Bagaimana sebuah panel surya tipis dapat mengubah pancaran sinar foton menjadi energi listrik yang menghidupkan rumah kita?",
  ],
  learning_activities: {
    meetings: [
      {
        meeting_number: 1,
        duration_minutes: 90,
        introduction: [
          "Guru membuka pembelajaran dengan salam kedisiplinan dan doa bersama (Mindful).",
          "Apersepsi: Guru menayangkan video singkat pemadaman listrik bergilir dan potensi krisis pasokan batu bara.",
          "Guru mengaitkan video dengan tujuan pembelajaran dan skema proyek pembuatan alat konversi energi sederhana.",
        ],
        core_activities: {
          syntax_steps: [
            "Fase 1 (Penentuan Pertanyaan Mendasar): Siswa menganalisis data konsumsi daya peralatan elektronik sekolah.",
            "Fase 2 (Mendesain Perencanaan Proyek): Siswa dalam kelompok merancang skema rangkaian sel fotovoltaik dan beban lampu LED.",
            "Fase 3 (Menyusun Jadwal Pembuatan): Siswa menetapkan pembagian tugas, pengadaan alat, dan linimasa pengujian.",
          ],
          differentiation_content:
            "Diferensiasi Konten: Disediakan artikel saintifik, video animasi PhET Photovoltaic, dan lembar diagram jalur konversi.",
          differentiation_process:
            "Diferensiasi Proses: Siswa kinestetik mempraktikkan susunan fisik, siswa analitis menghitung potensi daya P = V x I.",
          differentiation_product:
            "Diferensiasi Produk: Laporan proyek dapat berbentuk infografis digital, laporan teks ilmiah, atau video vlog edukatif.",
          deep_learning_principles: {
            mindful_awareness:
              "Siswa diajak mengamati jejak karbon penggunaan listrik pribadi dan bersyukur atas limpahan sinar mentari tropis.",
            meaningful_inquiry:
              "Menghubungkan rumus efisiensi konversi dengan penghematan biaya listrik keluarga secara nyata.",
            joyful_reflection:
              "Siswa merasakan antusiasme dan kegembiraan saat rancangan panel mini pertama kali menghasilkan tegangan terukur.",
          },
        },
        closing: [
          "Siswa bersama guru menyimpulkan prinsip dasar fotolistrik dan konversi energi.",
          "Refleksi 3-2-1: Tiga konsep yang dipahami, dua hal yang mengejutkan, satu pertanyaan lanjutan.",
          "Guru mengingatkan persiapan alat perakitan untuk pertemuan kedua.",
        ],
      },
      {
        meeting_number: 2,
        duration_minutes: 90,
        introduction: [
          "Guru menyapa siswa dan memfasilitasi review kesiapan komponen proyek tiap kelompok.",
          "Ice breaking konsentrasi: Cepat Tepat Hukum Kekekalan Energi.",
        ],
        core_activities: {
          syntax_steps: [
            "Fase 4 (Memonitor Keaktifan Proyek): Siswa menguji coba alat di bawah intensitas sinar matahari bervariasi dengan lux meter.",
            "Fase 5 (Menguji Hasil): Siswa mencatat besaran tegangan dan kuat arus serta menghitung daya puncak.",
            "Fase 6 (Evaluasi Pengalaman): Setiap kelompok mempresentasikan data hasil uji dan menjawab pertanyaan rekan sejawat.",
          ],
          differentiation_content:
            "Diferensiasi Konten: Kelompok tingkat lanjut ditantang menghitung pengaruh sudut kemiringan panel terhadap output arus.",
          differentiation_process:
            "Diferensiasi Proses: Guru memberikan bimbingan khusus (scaffolding) pada teknik kalibrasi multimeter digital.",
          differentiation_product:
            "Diferensiasi Produk: Presentasi dapat menggunakan papan pajang poster atau slide presentasi interaktif.",
          deep_learning_principles: {
            mindful_awareness:
              "Fokus dan kehati-hatian dalam merangkai konektor polaritas positif dan negatif baterai.",
            meaningful_inquiry:
              "Memahami mengapa intensitas cahaya matahari di pagi hari berbeda dengan siang hari secara fisis.",
            joyful_reflection:
              "Tepuk tangan apresiasi bersama saat seluruh prototipe kelompok berfungsi dengan baik.",
          },
        },
        closing: [
          "Guru memberikan umpan balik menyeluruh terhadap hasil pengujian dan laporan karya.",
          "Penguatan nilai Profil Pelajar Pancasila: Gotong royong dan kemandirian.",
          "Doa dan penutup.",
        ],
      },
    ],
  },
  assessments: {
    diagnostic:
      "Asesmen Diagnostik Kognitif: 5 soal pemahaman besaran energi dan daya pada pertemuan awal.",
    formative:
      "Asesmen Formatif: Lembar observasi keterlibatan diskusi kelompok dan rubrik unjuk kerja perakitan sirkuit.",
    summative:
      "Asesmen Sumatif: Tes tertulis 15 butir pilihan ganda beralasan dan uji fungsi prototipe konversi energi.",
  },
  format_mode: "lengkap_bkpdm",
  appendices: {
    student_worksheet_lkpd:
      "LEMBAR KERJA PESERTA DIDIK (LKPD)\nTopik: Investigasi Karakteristik Sel Fotovoltaik Mini\nTujuan: Menentukan hubungan intensitas cahaya matahari terhadap tegangan dan arus listrik.\nAlat: Sel surya 6V, Multimeter, Kabel jumper, Lux meter, Penggaris busur sudut.\n\nLangkah Kerja:\n1. Arahkan sel surya tegak lurus sinar matahari (sudut 90 derajat).\n2. Catat nilai kuat penerangan (Lux) dan ukur tegangan terbuka (Voc).\n3. Pasang beban resistor 100 Ohm dan ukur arus yang mengalir (I).\n4. Ulangi untuk sudut kemiringan 60, 45, dan 30 derajat.\n5. Hitung daya output P = V x I dan gambarkan grafik hubungannya.",
    reading_materials:
      "Bahan Bacaan: Modul Transisi Energi Nasional 2025-2060, Prinsip Efek Fotolistrik Semikonduktor Silikon, dan Perbandingan Emisi Karbon Pembangkit Listrik.",
    glossary: [
      {
        term: "Fotovoltaik",
        definition:
          "Metode langsung konversi radiasi gelombang elektromagnetik cahaya matahari menjadi arus searah (DC).",
      },
      {
        term: "Efisiensi Konversi",
        definition:
          "Persentase energi radiasi cahaya yang berhasil diubah menjadi energi listrik terpakai.",
      },
      {
        term: "Daya Puncak (Wp)",
        definition:
          "Daya listrik maksimum yang mampu dihasilkan modul fotovoltaik pada kondisi uji standar.",
      },
    ],
    references: [
      "Halliday, D., Resnick, R., & Walker, J. (2020). Fundamentals of Physics. John Wiley & Sons.",
      "Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP). (2024). Capaian Pembelajaran Fase E Fisika.",
    ],
  },
};

// 2. DATA SEED SOAL & KISI-KISI HOTS
const SEED_SOAL_CONTENT: QuestionPackage = {
  id: "pkg-seed-soal-1",
  user_id: "seed-user-1",
  title: "Paket Soal STS Ganjil HOTS & Matriks Kisi-Kisi KaTeX",
  subject: "Fisika",
  education_level: "SMA",
  grade: "Kelas X (Fase E)",
  phase: "E",
  semester: "Ganjil",
  academic_year: "2025/2026",
  source_type: "text",
  chapter_or_material: "Kinematika Gerak Lurus & Konversi Energi",
  learning_objectives:
    "Peserta didik mampu menganalisis gerak lurus beraturan dan prinsip konversi energi dalam konteks teknologi terbarukan.",
  total_questions: 5,
  difficulty_distribution: { mudah: 1, sedang: 3, sulit: 1 },
  cognitive_distribution: { lots: 1, mots: 3, hots: 1 },
  bloom_distribution: { c1: 0, c2: 1, c3: 2, c4: 1, c5: 1, c6: 0 },
  stimulus_type: "variatif",
  created_at: "2026-10-09T09:15:00.000Z",
  updated_at: "2026-10-09T09:15:00.000Z",
  questions: [
    {
      id: "q-seed-1",
      question_number: 1,
      question_type: "Pilihan Ganda",
      difficulty: "Sedang",
      cognitive_level: "HOTS",
      bloom_level: "C4",
      score_weight: 20,
      question_text:
        "Seorang atlet berlari mengelilingi lintasan atletik berbentuk lingkaran dengan diameter $140\\text{ m}$. Atlet tersebut menempuh setengah lingkaran dalam waktu $20\\text{ detik}$. Berapakah kelajuan rata-rata ($v$) dan kecepatan rata-rata ($\\vec{v}$) atlet tersebut? (Gunakan $\\pi = \\frac{22}{7}$)",
      options: [
        { label: "A", text: "$11\\text{ m/s}$ dan $7\\text{ m/s}$" },
        { label: "B", text: "$22\\text{ m/s}$ dan $14\\text{ m/s}$" },
        { label: "C", text: "$7\\text{ m/s}$ dan $11\\text{ m/s}$" },
        { label: "D", text: "$11\\text{ m/s}$ dan $11\\text{ m/s}$" },
        { label: "E", text: "$14\\text{ m/s}$ dan $22\\text{ m/s}$" },
      ],
      correct_answer: "A",
      explanation:
        "Jarak tempuh setengah lingkaran: $s = \\frac{1}{2} \\pi d = \\frac{1}{2} \\times \\frac{22}{7} \\times 140 = 220\\text{ m}$. Kelajuan rata-rata: $v = \\frac{s}{t} = \\frac{220}{20} = 11\\text{ m/s}$. Perpindahan posisi sama dengan diameter lingkaran: $\\Delta x = 140\\text{ m}$. Maka besar kecepatan rata-rata: $\\vec{v} = \\frac{\\Delta x}{t} = \\frac{140}{20} = 7\\text{ m/s}$.",
    },
    {
      id: "q-seed-2",
      question_number: 2,
      question_type: "Pilihan Ganda",
      difficulty: "Sedang",
      cognitive_level: "MOTS",
      bloom_level: "C3",
      score_weight: 20,
      question_text:
        "Sebuah modul panel surya memiliki luas permukaan efektif $1.5\\text{ m}^2$ dengan efisiensi konversi daya $\\eta = 20\\%$. Jika modul tersebut terpapar sinar matahari dengan radiasi intensitas $I = 800\\text{ W/m}^2$, berapakah daya listrik ($P$) yang dihasilkan oleh panel surya tersebut?",
      options: [
        { label: "A", text: "$120\\text{ Watt}$" },
        { label: "B", text: "$240\\text{ Watt}$" },
        { label: "C", text: "$360\\text{ Watt}$" },
        { label: "D", text: "$480\\text{ Watt}$" },
        { label: "E", text: "$600\\text{ Watt}$" },
      ],
      correct_answer: "B",
      explanation:
        "Daya radiasi input: $P_{\\text{in}} = I \\times A = 800\\text{ W/m}^2 \\times 1.5\\text{ m}^2 = 1200\\text{ Watt}$. Daya listrik output: $P = \\eta \\times P_{\\text{in}} = 20\\% \\times 1200\\text{ Watt} = 240\\text{ Watt}$.",
    },
    {
      id: "q-seed-3",
      question_number: 3,
      question_type: "Pilihan Ganda",
      difficulty: "Sedang",
      cognitive_level: "MOTS",
      bloom_level: "C3",
      score_weight: 20,
      question_text:
        "Sebuah mobil listrik bermassa $m = 1200\\text{ kg}$ melaju dengan kelajuan konstan $72\\text{ km/jam}$. Pengemudi menginjak rem hingga mobil berhenti dalam selang waktu $4\\text{ detik}$. Tentukan besar gaya pengereman rata-rata ($F$) yang dialami mobil tersebut!",
      options: [
        { label: "A", text: "$3000\\text{ N}$" },
        { label: "B", text: "$4500\\text{ N}$" },
        { label: "C", text: "$6000\\text{ N}$" },
        { label: "D", text: "$7200\\text{ N}$" },
        { label: "E", text: "$8000\\text{ N}$" },
      ],
      correct_answer: "C",
      explanation:
        "Konversi kelajuan ke satuan SI: $v_0 = 72\\text{ km/jam} = 20\\text{ m/s}$. Perlambatan pengereman: $a = \\frac{v_t - v_0}{t} = \\frac{0 - 20}{4} = -5\\text{ m/s}^2$. Berdasarkan Hukum II Newton: $F = m \\times |a| = 1200\\text{ kg} \\times 5\\text{ m/s}^2 = 6000\\text{ N}$.",
    },
    {
      id: "q-seed-4",
      question_number: 4,
      question_type: "Pilihan Ganda",
      difficulty: "Sulit",
      cognitive_level: "HOTS",
      bloom_level: "C4",
      score_weight: 20,
      question_text:
        "Air bermassa $m = 2\\text{ kg}$ bersuhu $25^\\circ\\text{C}$ dipanaskan menggunakan ketel listrik berefisiensi $80\\%$ hingga mencapai titik didih $100^\\circ\\text{C}$. Diketahui kalor jenis air $c = 4200\\text{ J/kg}^\\circ\\text{C}$ dan daya ketel $P = 700\\text{ W}$. Berapakah waktu ($t$) yang dibutuhkan untuk proses pemanasan tersebut?",
      options: [
        { label: "A", text: "$1000\\text{ detik}$" },
        { label: "B", text: "$1125\\text{ detik}$" },
        { label: "C", text: "$1250\\text{ detik}$" },
        { label: "D", text: "$1350\\text{ detik}$" },
        { label: "E", text: "$1500\\text{ detik}$" },
      ],
      correct_answer: "B",
      explanation:
        "Kalor yang dibutuhkan: $Q = m \\times c \\times \\Delta T = 2 \\times 4200 \\times (100 - 25) = 630.000\\text{ Joule}$. Energi listrik yang disuplai: $W = \\frac{Q}{\\eta} = \\frac{630.000}{0.8} = 787.500\\text{ Joule}$. Waktu pemanasan: $t = \\frac{W}{P} = \\frac{787.500}{700} = 1125\\text{ detik}$.",
    },
    {
      id: "q-seed-5",
      question_number: 5,
      question_type: "Pilihan Ganda",
      difficulty: "Mudah",
      cognitive_level: "LOTS",
      bloom_level: "C2",
      score_weight: 20,
      question_text:
        "Pernyataan yang tepat mengenai prinsip kerja pembangkit listrik tenaga angin (PLTB) berdasarkan hukum kekekalan energi adalah...",
      options: [
        { label: "A", text: "Energi kalor diubah menjadi energi kinetik kemudian menjadi energi listrik" },
        { label: "B", text: "Energi kinetik massa udara yang mengalir diubah menjadi energi kinetik rotasi sudu turbin lalu dikonversi menjadi energi listrik oleh generator" },
        { label: "C", text: "Energi potensial angin langsung diubah menjadi muatan listrik statis" },
        { label: "D", text: "Energi kimia udara atmosfer memicu reaksi induksi elektromagnetik generator" },
        { label: "E", text: "Turbin menghasilkan energi baru tanpa mengurangi kecepatan angin yang melewatinya" },
      ],
      correct_answer: "B",
      explanation:
        "PLTB memanfaatkan energi kinetik aliran massa udara $E_k = \\frac{1}{2} m v^2$ untuk memutar sudu rotor turbin. Putaran poros memutar rotor generator untuk menghasilkan energi listrik melalui induksi elektromagnetik.",
    },
  ],
  kisi_kisi: [
    {
      nomor_urut: 1,
      capaian_pembelajaran: "Menganalisis konsep kinematika gerak lurus beraturan dan berubah beraturan.",
      tujuan_pembelajaran_materi: "Menghitung kelajuan rata-rata dan kecepatan rata-rata pada lintasan melingkar.",
      indikator_soal: "Disajikan narasi atlet berlari pada lintasan lingkaran, siswa dapat membedakan nilai kelajuan dan kecepatan.",
      level_kognitif: "C4 (Analisis) / HOTS",
      bentuk_soal: "Pilihan Ganda",
      nomor_soal: 1,
      bobot_skor: 20,
    },
    {
      nomor_urut: 2,
      capaian_pembelajaran: "Menganalisis prinsip kerja dan efisiensi teknologi energi terbarukan.",
      tujuan_pembelajaran_materi: "Menghitung output daya listrik modul fotovoltaik berdasarkan radiasi matahari.",
      indikator_soal: "Disajikan data intensitas radiasi dan luas panel, siswa dapat menghitung daya listrik terkonversi.",
      level_kognitif: "C3 (Aplikasi) / MOTS",
      bentuk_soal: "Pilihan Ganda",
      nomor_soal: 2,
      bobot_skor: 20,
    },
    {
      nomor_urut: 3,
      capaian_pembelajaran: "Menerapkan hukum-hukum Newton tentang gerak dan dinamika.",
      tujuan_pembelajaran_materi: "Menentukan gaya pengereman rata-rata pada kendaraan listrik.",
      indikator_soal: "Disajikan massa mobil dan waktu pengereman hingga berhenti, siswa dapat menentukan besar gaya rem.",
      level_kognitif: "C3 (Aplikasi) / MOTS",
      bentuk_soal: "Pilihan Ganda",
      nomor_soal: 3,
      bobot_skor: 20,
    },
    {
      nomor_urut: 4,
      capaian_pembelajaran: "Menganalisis konsep kalor dan hukum asas Black serta efisiensi energi.",
      tujuan_pembelajaran_materi: "Menghitung waktu pemanasan air menggunakan pemanas listrik berefisiensi tertentu.",
      indikator_soal: "Disajikan massa air, kalor jenis, dan daya ketel, siswa dapat menghitung durasi waktu mendidih.",
      level_kognitif: "C4 (Analisis) / HOTS",
      bentuk_soal: "Pilihan Ganda",
      nomor_soal: 4,
      bobot_skor: 20,
    },
    {
      nomor_urut: 5,
      capaian_pembelajaran: "Memahami konsep perubahan energi mekanik menjadi energi listrik.",
      tujuan_pembelajaran_materi: "Mengidentifikasi alur transformasi energi pada turbin angin.",
      indikator_soal: "Disajikan pilihan pernyataan, siswa dapat mengidentifikasi tahapan konversi energi PLTB.",
      level_kognitif: "C2 (Pemahaman) / LOTS",
      bentuk_soal: "Pilihan Ganda",
      nomor_soal: 5,
      bobot_skor: 20,
    },
  ],
  scoring_guide: {
    skor_maksimal_total: 100,
    rumus_nilai_akhir: "Nilai Akhir = (Total Skor Perolehan / 100) x 100",
    rubrik_uraian: [
      { aspek: "Ketepatan Rumus & Variabel", kriteria: "Mengidentifikasi rumus fisika dan satuan SI dengan benar", skor_maksimal: 40 },
      { aspek: "Proses Komputasi Matematis", kriteria: "Langkah penyederhanaan dan substitusi angka bebas galat", skor_maksimal: 40 },
      { aspek: "Kesimpulan & Satuan Akhir", kriteria: "Menuliskan nilai akhir beserta satuan fisika yang valid", skor_maksimal: 20 },
    ],
  },
};

// 3. DATA SEED PERANGKAT TAHUNAN (ATP, PROTA, PROMES)
const SEED_PERANGKAT_CONTENT: PerangkatTahunanBundle = {
  calendar: {
    academic_year: "2025/2026",
    jp_per_week: 3,
    semester_1: {
      total_calendar_weeks: 24,
      ineffective_weeks: 6,
      effective_weeks: 18,
      effective_hours: 54,
      non_effective_details: [{ activity: "Libur Semester & MPLS", count_weeks: 6 }],
    },
    semester_2: {
      total_calendar_weeks: 24,
      ineffective_weeks: 6,
      effective_weeks: 18,
      effective_hours: 54,
      non_effective_details: [{ activity: "Libur Akhir Tahun & Asesmen Sekolah", count_weeks: 6 }],
    },
    total_annual_jp: 108,
  },
  atp: {
    id: "atp-seed-1",
    subject: "Fisika",
    phase: "E",
    grade: "Kelas X",
    academic_year: "2025/2026",
    rationale:
      "Fisika Fase E membekali peserta didik dengan pemahaman saintifik tentang metode ilmiah, pengukuran besaran fisis, kinematika, dan energi terbarukan.",
    elements: [
      { name: "Pemahaman Fisika", cp_description: "Menganalisis besaran fisis, gerak lurus, dan prinsip konversi energi terbarukan." },
      { name: "Keterampilan Proses", cp_description: "Mengamati, merancang penyelidikan, dan mempresentasikan solusi fisis." },
    ],
    tp_items: [
      {
        id: "tp-1",
        code: "TP.10.1",
        element: "Pemahaman Fisika",
        statement: "Menerapkan prinsip pengukuran besaran fisis, ketidakpastian, dan angka penting dalam kerja ilmiah.",
        competency: "Menerapkan",
        material_scope: "Pengukuran & Besaran Fisis",
        allocated_jp: 18,
        semester: 1,
        evaluation_technique: "Tes Tertulis & Praktik",
        pancasila_dimensions: ["Penalaran Kritis"],
      },
      {
        id: "tp-2",
        code: "TP.10.2",
        element: "Pemahaman Fisika",
        statement: "Menganalisis besaran fisis gerak lurus beraturan (GLB) dan gerak lurus berubah beraturan (GLBB).",
        competency: "Menganalisis",
        material_scope: "Kinematika Gerak Lurus",
        allocated_jp: 24,
        semester: 1,
        evaluation_technique: "Tes Tertulis",
        pancasila_dimensions: ["Kemandirian"],
      },
      {
        id: "tp-3",
        code: "TP.10.3",
        element: "Pemahaman Fisika",
        statement: "Menganalisis bentuk energi dan prinsip kekekalan energi dalam sistem konversi energi terbarukan.",
        competency: "Menganalisis",
        material_scope: "Energi Terbarukan",
        allocated_jp: 30,
        semester: 2,
        evaluation_technique: "Proyek & Unjuk Kerja",
        pancasila_dimensions: ["Kreativitas", "Gotong Royong"],
      },
      {
        id: "tp-4",
        code: "TP.10.4",
        element: "Keterampilan Proses",
        statement: "Mengevaluasi dampak pemanasan global dan menyusun aksi mitigasi pengurangan jejak karbon.",
        competency: "Mengevaluasi",
        material_scope: "Pemanasan Global & Mitigasi",
        allocated_jp: 36,
        semester: 2,
        evaluation_technique: "Portofolio & Laporan",
        pancasila_dimensions: ["Kewargaan Global"],
      },
    ],
    total_jp: 108,
  },
  prota: {
    id: "prota-seed-1",
    subject: "Fisika",
    grade: "Kelas X",
    academic_year: "2025/2026",
    semester_1_items: [
      { no: 1, tp_code: "TP.10.1", material: "Pengukuran & Besaran Fisis", allocated_jp: 18 },
      { no: 2, tp_code: "TP.10.2", material: "Kinematika Gerak Lurus", allocated_jp: 24 },
      { no: 3, tp_code: "PTS/PAS", material: "Cadangan Asesmen Sumatif & Remidial", allocated_jp: 12 },
    ],
    semester_1_total_jp: 54,
    semester_2_items: [
      { no: 4, tp_code: "TP.10.3", material: "Energi Baru Terbarukan", allocated_jp: 30 },
      { no: 5, tp_code: "TP.10.4", material: "Pemanasan Global & Mitigasi Iklim", allocated_jp: 24 },
    ],
    semester_2_total_jp: 54,
    total_yearly_jp: 108,
  },
  promes_1: {
    id: "promes-seed-1",
    semester: 1,
    academic_year: "2025/2026",
    subject: "Fisika",
    grade: "Kelas X",
    months: ["Juli", "Agustus", "September", "Oktober", "November", "Desember"],
    weeks_distribution: [4, 5, 4, 4, 5, 4],
    matrix_rows: [
      {
        no: 1,
        tp_code: "TP.10.1",
        material: "Pengukuran Besaran Fisis (Jangka Sorong & Mikrometer)",
        allocated_jp: 18,
        weekly_allocations: { "Juli-3": 3, "Juli-4": 3, "Agustus-1": 3, "Agustus-2": 3, "Agustus-3": 3, "Agustus-4": 3 },
      },
      {
        no: 2,
        tp_code: "TP.10.2",
        material: "Kinematika Gerak Lurus (GLB dan GLBB Vertikal)",
        allocated_jp: 24,
        weekly_allocations: { "Agustus-5": 3, "September-1": 3, "September-2": 3, "September-3": 3, "September-4": 3, "Oktober-1": 3, "Oktober-2": 3, "Oktober-3": 3 },
      },
      {
        no: 3,
        tp_code: "STS",
        material: "Sumatif Tengah Semester (STS) Ganjil",
        allocated_jp: 6,
        weekly_allocations: { "Oktober-4": 3, "November-1": 3 },
      },
      {
        no: 4,
        tp_code: "PAS",
        material: "Sumatif Akhir Semester (SAS) & Pengolahan Rapor",
        allocated_jp: 6,
        weekly_allocations: { "Desember-1": 3, "Desember-2": 3 },
      },
    ],
    agenda_legends: [
      { code: "EFR", label: "Efektif Tatap Muka", color: "bg-blue-100 text-blue-900" },
      { code: "STS", label: "Sumatif Tengah Semester", color: "bg-amber-100 text-amber-900" },
      { code: "SAS", label: "Sumatif Akhir Semester", color: "bg-rose-100 text-rose-900" },
      { code: "LHB", label: "Libur Hari Besar", color: "bg-slate-200 text-slate-800" },
    ],
  },
  promes_2: {
    id: "promes-seed-2",
    semester: 2,
    academic_year: "2025/2026",
    subject: "Fisika",
    grade: "Kelas X",
    months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
    weeks_distribution: [4, 4, 4, 4, 5, 4],
    matrix_rows: [
      {
        no: 1,
        tp_code: "TP.10.3",
        material: "Energi Baru Terbarukan & Efisiensi Fotovoltaik",
        allocated_jp: 30,
        weekly_allocations: { "Januari-1": 3, "Januari-2": 3, "Januari-3": 3, "Januari-4": 3, "Februari-1": 3, "Februari-2": 3, "Februari-3": 3, "Februari-4": 3, "Maret-1": 3, "Maret-2": 3 },
      },
      {
        no: 2,
        tp_code: "TP.10.4",
        material: "Pemanasan Global & Analisis Jejak Karbon",
        allocated_jp: 24,
        weekly_allocations: { "Maret-3": 3, "Maret-4": 3, "April-1": 3, "April-2": 3, "April-3": 3, "Mei-1": 3, "Mei-2": 3, "Mei-3": 3 },
      },
    ],
    agenda_legends: [
      { code: "EFR", label: "Efektif Tatap Muka", color: "bg-blue-100 text-blue-900" },
      { code: "SAT", label: "Sumatif Akhir Tahun", color: "bg-rose-100 text-rose-900" },
    ],
  },
};

// 4. DATA SEED PRESENTASI PPTX & LKPD
const SEED_PRESENTASI_CONTENT: MediaAjarBundle = {
  presentation: {
    id: "pres-seed-1",
    topic: "Konversi Energi Surya & Efisiensi Termal",
    subject: "Fisika",
    grade: "Kelas X (Fase E)",
    target_duration_minutes: 90,
    theme_palette: "navy_enterprise",
    slides: [
      {
        slide_number: 1,
        category: "judul",
        title: "Konversi Energi Surya & Efisiensi Termal",
        subtitle: "Fisika Fase E - Kurikulum Merdeka Terintegrasi Deep Learning",
        bullet_points: [
          "Mata Pelajaran: Fisika SMA",
          "Tingkat: Fase E (Kelas X)",
          "Model: Project Based Learning (PjBL)",
        ],
        key_takeaway: "Menjelajahi masa depan transisi energi bersih berkelanjutan di Indonesia.",
        speaker_notes: "Buka sesi presentasi dengan antusias, perkenalkan agenda pembelajaran dan pentingnya inovasi energi hijau.",
      },
      {
        slide_number: 2,
        category: "apersepsi",
        title: "Krisis Energi Fosil vs Potensi Sinar Tropis",
        subtitle: "Mengapa Kita Harus Bertransisi Sekarang?",
        bullet_points: [
          "Cadangan minyak bumi dan batu bara kian menipis secara eksponensial.",
          "Emisi gas rumah kaca memicu anomali cuaca dan pemanasan global.",
          "Indonesia memiliki potensi radiasi surya melimpah sepanjang tahun (~4.8 kWh/m2/hari).",
        ],
        key_takeaway: "Matahari menyediakan energi gratis dan terbarukan dalam jumlah melimpah.",
        speaker_notes: "Tanyakan kepada siswa: Berapa banyak alat di rumahmu yang bergantung pada listrik setiap jamnya?",
      },
      {
        slide_number: 3,
        category: "konsep_inti",
        title: "Prinsip Efek Fotovoltaik Semikonduktor",
        subtitle: "Bagaimana Foton Berubah Menjadi Aliran Elektron?",
        bullet_points: [
          "Foton cahaya matahari menabrak atom silikon pada panel surya.",
          "Energi foton memicu eksitasi elektron valensi menuju pita konduksi.",
          "Sambungan p-n junction mengalirkan beda potensial searah (DC).",
          "Rumus Daya Output: P = V x I (Volt dikali Ampere).",
        ],
        key_takeaway: "Efek fotolistrik Einstein merupakan fondasi teknologi panel surya modern.",
        speaker_notes: "Gambarkan diagram sambungan p-n di papan tulis untuk memperjelas aliran muatan listrik.",
      },
      {
        slide_number: 4,
        category: "studi_kasus",
        title: "Studi Efisiensi: Sudut Datang & Suhu Kerja",
        subtitle: "Mengapa Panel Tidak Menghasilkan 100% Energi?",
        bullet_points: [
          "Efisiensi panel komersial saat ini berkisar antara 18% hingga 22%.",
          "Faktor penentu: Sudut inklinasi matahari, debu permukaan, dan suhu lingkungan.",
          "Peningkatan suhu berlebih justru menurunkan tegangan keluaran semikonduktor.",
        ],
        key_takeaway: "Optimalisasi sudut hadap panel meningkatkan serapan energi harian hingga 35%.",
        speaker_notes: "Ajak siswa memprediksi waktu terbaik penyerapan energi matahari di wilayah sekolah.",
      },
      {
        slide_number: 5,
        category: "kuis_interaktif",
        title: "Cepat Tepat: Uji Logika Energi",
        subtitle: "Pilihan Ganda Cepat Berhadiah Poin Proyek",
        bullet_points: [
          "Jika panel menerima daya cahaya 1000 Watt dengan efisiensi 20%, berapakah daya listrik yang dihasilkan?",
          "A. 100 Watt",
          "B. 200 Watt (Jawaban Benar)",
          "C. 500 Watt",
          "D. 800 Watt",
        ],
        interactive_question: "Siapa kelompok pertama yang dapat membuktikan perhitungannya di depan kelas?",
        speaker_notes: "Beri kesempatan perwakilan tiap kelompok mengangkat tangan untuk menjawab.",
      },
      {
        slide_number: 6,
        category: "refleksi",
        title: "Refleksi Mindful & Makna Pembelajaran",
        subtitle: "Menjadi Generasi Penjaga Bumi",
        bullet_points: [
          "Mindful: Menyadari penggunaan listrik harian dan mematikan perangkat siaga.",
          "Meaningful: Memahami bahwa rumus fisika berkaitan langsung dengan tagihan listrik rumah.",
          "Joyful: Bekerja sama merakit alat pembangkit energi sederhana dengan tim.",
        ],
        key_takeaway: "Energi masa depan ada di tangan generasi muda yang inovatif dan peduli lingkungan.",
        speaker_notes: "Tutup sesi presentasi dengan kutipan inspiratif dan arahkan siswa menuju pengerjaan lembar LKPD.",
      },
    ],
  },
  worksheet: {
    id: "lkpd-seed-1",
    title: "Eksplorasi Karakteristik dan Efisiensi Panel Surya Sederhana",
    subject: "Fisika",
    grade: "Kelas X (Fase E)",
    semester: 1,
    group_type: "Kelompok",
    estimated_minutes: 45,
    learning_objectives: [
      "Mengukur tegangan terbuka (Voc) dan kuat arus hubung singkat (Isc) dari modul fotovoltaik.",
      "Menentukan pengaruh variasi sudut datang sinar matahari terhadap output daya listrik.",
      "Menghitung persentase efisiensi konversi modul fotovoltaik sederhana.",
    ],
    materials_tools: [
      "Modul panel surya 6V 1 Watt",
      "Multimeter digital 2 unit (Voltmeter dan Amperemeter)",
      "Lux meter digital pengukur intensitas cahaya",
      "Kabel penghubung dengan jepit buaya",
      "Busur derajat penentu sudut kemiringan",
      "Resistor beban 100 Ohm",
    ],
    activity_steps: [
      "Letakkan panel surya di area terbuka terpapar sinar matahari langsung.",
      "Atur sudut kemiringan panel tepat 90 derajat terhadap arah sinar matahari.",
      "Ukur nilai kuat penerangan lingkungan (Lux) menggunakan lux meter dan catat pada tabel.",
      "Hubungkan terminal panel surya ke voltmeter untuk mengukur tegangan rangkaian terbuka (Voc).",
      "Pasang resistor beban dan ampermeter secara seri untuk mengukur arus kerja (I).",
      "Ulangi langkah pengukuran untuk variasi sudut kemiringan 60 derajat, 45 derajat, dan 30 derajat.",
    ],
    data_observation_table: {
      headers: ["Sudut Hadap (Derajat)", "Intensitas (Lux)", "Tegangan Voc (Volt)", "Arus I (mA)", "Daya Output P (mW)"],
      rows: [
        ["90 Derajat", "85.000 Lux", "6.20 V", "160 mA", "992 mW"],
        ["60 Derajat", "72.000 Lux", "5.90 V", "138 mA", "814 mW"],
        ["45 Derajat", "58.000 Lux", "5.40 V", "112 mA", "604 mW"],
        ["30 Derajat", "41.000 Lux", "4.80 V", "82 mA", "393 mW"],
      ],
    },
    analysis_questions: [
      "Bagaimanakah kecenderungan nilai daya keluaran panel surya saat sudut kemiringan diubah dari 90 derajat menuju 30 derajat?",
      "Faktor fisis apa saja yang menyebabkan efisiensi panel surya di dunia nyata tidak pernah mencapai 100%?",
      "Saran rancangan teknologi apa yang dapat diterapkan agar panel surya selalu menghadap tegak lurus matahari secara otomatis?",
    ],
    conclusion_prompts: [
      "Berdasarkan data eksperimen, daya maksimum panel surya tercapai pada kondisi...",
      "Pemanfaatan sel fotovoltaik efektif diterapkan pada daerah yang memiliki karakteristik...",
    ],
    rubric_scoring: [
      { aspect: "Ketelitian Pengambilan Data", criteria: "Mengambil data secara runtut dengan satuan fisis yang benar", max_score: 30 },
      { aspect: "Kedalaman Analisis Pertanyaan", criteria: "Menjawab pertanyaan dengan argumentasi fisika konseptual", max_score: 40 },
      { aspect: "Kekompakan Kerja Kelompok", criteria: "Seluruh anggota tim berkontribusi aktif dan bertanggung jawab", max_score: 30 },
    ],
  },
};

// Dokumen Contoh Awal (Seed) Terstruktur Standar BKPDM dengan Tanggal Statis
export const SEED_DOCUMENTS: StoredDocument[] = [
  {
    id: "doc-seed-1",
    title: "Modul Ajar Fisika: Energi Terbarukan & Efisiensi Termal",
    docType: "modul-ajar",
    subject: "Fisika",
    grade: "Kelas X (Fase E)",
    academicYear: "2025/2026",
    semester: "Ganjil",
    fileFormat: "DOCX",
    fileSizeBytes: 485 * 1024, // ~485 KB
    createdAt: "2026-10-12T08:00:00.000Z",
    updatedAt: "2026-10-12T08:00:00.000Z",
    isPmmEvidence: true,
    tags: ["BKPDM 2026", "Deep Learning", "Supervisi KS"],
    notes: "Lengkap dengan instrumen diferensiasi proses dan rubrik penilaian LKPD.",
    contentData: SEED_MODUL_AJAR_CONTENT,
  },
  {
    id: "doc-seed-2",
    title: "Paket Soal STS Ganjil HOTS & Matriks Kisi-Kisi KaTeX",
    docType: "soal",
    subject: "Fisika",
    grade: "Kelas X (Fase E)",
    academicYear: "2025/2026",
    semester: "Ganjil",
    fileFormat: "DOCX",
    fileSizeBytes: 320 * 1024, // ~320 KB
    createdAt: "2026-10-09T09:15:00.000Z",
    updatedAt: "2026-10-09T09:15:00.000Z",
    isPmmEvidence: true,
    tags: ["Taksonomi Bloom C4-C6", "Matriks Kisi-Kisi", "KKTP"],
    notes: "25 Butir soal AKM numerasi dan pemecahan masalah kontekstual.",
    contentData: SEED_SOAL_CONTENT,
  },
  {
    id: "doc-seed-3",
    title: "Perangkat Tahunan: ATP, Prota, & Promes Kalender 2025/2026",
    docType: "perangkat-tahunan",
    subject: "Fisika",
    grade: "Kelas X (Fase E)",
    academicYear: "2025/2026",
    semester: "Tahunan",
    fileFormat: "DOCX",
    fileSizeBytes: 560 * 1024, // ~560 KB
    createdAt: "2026-10-04T07:30:00.000Z",
    updatedAt: "2026-10-04T07:30:00.000Z",
    isPmmEvidence: false,
    tags: ["Pekan Efektif", "Promes Mingguan", "Capaian Pembelajaran"],
    notes: "Distribusi 108 Jam Pelajaran (JP) dengan penanda libur resmi daerah.",
    contentData: SEED_PERANGKAT_CONTENT,
  },
  {
    id: "doc-seed-4",
    title: "Slide Media Ajar PPTX: Konversi Energi Surya & LKPD Eksplorasi",
    docType: "presentasi",
    subject: "Fisika",
    grade: "Kelas X (Fase E)",
    academicYear: "2025/2026",
    semester: "Ganjil",
    fileFormat: "PPTX",
    fileSizeBytes: 1850 * 1024, // ~1.85 MB
    createdAt: "2026-10-14T10:00:00.000Z",
    updatedAt: "2026-10-14T10:00:00.000Z",
    isPmmEvidence: true,
    tags: ["PowerPoint 16:9", "LKPD Siswa", "Apersepsi Interaktif"],
    notes: "Bahan tayang ruang kelas interaktif 12 slide widescreen.",
    contentData: SEED_PRESENTASI_CONTENT,
  },
];

export const DEFAULT_STORAGE_SUMMARY: StorageUsageSummary = {
  tier: "free",
  tierLabel: "Guru Mandiri (Gratis)",
  usedBytes: 0,
  maxBytes: 50 * 1024 * 1024,
  percentageUsed: 0,
  totalDocuments: 0,
  remainingBytes: 50 * 1024 * 1024,
  isExceeded: false,
};

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getUserTier(userId?: string): SubscriptionTier {
  if (typeof window === "undefined") return "free";
  try {
    const key = getTierStorageKey(userId);
    const saved = localStorage.getItem(key) as SubscriptionTier | null;
    if (saved && (saved === "free" || saved === "pro" || saved === "school")) {
      return saved;
    }
  } catch {
    // Abaikan
  }
  return "free";
}

export function setUserTier(tier: SubscriptionTier, userId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = getTierStorageKey(userId);
    localStorage.setItem(key, tier);
    window.dispatchEvent(new CustomEvent("modulku-vault-changed"));
  } catch {
    // Abaikan
  }
}

export function getStoredDocuments(userId?: string): StoredDocument[] {
  const uid = userId || getActiveUserId();
  const key = getVaultStorageKey(uid);

  if (typeof window === "undefined") {
    return uid === "demo_guru" ? SEED_DOCUMENTS.map((d) => ({ ...d, user_id: uid })) : [];
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Inisialisasi vault khusus dokumen contoh HANYA jika akun adalah mode demo ("demo_guru")
      if (uid === "demo_guru") {
        const userSeeds = SEED_DOCUMENTS.map((doc) => ({
          ...doc,
          id: `${doc.id}-${uid.slice(0, 6)}`,
          user_id: uid,
        }));
        localStorage.setItem(key, JSON.stringify(userSeeds));
        return userSeeds;
      }

      // Akun pendidik nyata yang baru mendaftar: mulai dengan brankas bersih (0 dokumen)
      localStorage.setItem(key, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Otomatis lengkapi contentData dokumen seed jika sebelumnya tersimpan tanpa contentData
      const enriched = parsed.map((doc: StoredDocument) => {
        if (!doc.contentData && doc.id.includes("seed")) {
          const matchingSeed = SEED_DOCUMENTS.find((s) => doc.id.startsWith(s.id));
          if (matchingSeed) {
            return { ...doc, contentData: matchingSeed.contentData };
          }
        }
        return doc;
      });
      return enriched;
    }
  } catch {
    // Fallback jika korup
  }
  return SEED_DOCUMENTS.map((d) => ({ ...d, user_id: uid }));
}

export function getStorageUsageSummary(userId?: string): StorageUsageSummary {
  const tier = getUserTier(userId);
  const config = TIER_CONFIGS[tier];
  const docs = getStoredDocuments(userId);

  const usedBytes = docs.reduce((acc, curr) => acc + (curr.fileSizeBytes || 0), 0);
  const maxBytes = config.maxBytes;
  const percentageUsed = Math.min(100, Math.round((usedBytes / maxBytes) * 100));
  const remainingBytes = Math.max(0, maxBytes - usedBytes);
  const isExceeded = usedBytes > maxBytes;

  return {
    tier,
    tierLabel: config.label,
    usedBytes,
    maxBytes,
    percentageUsed,
    totalDocuments: docs.length,
    remainingBytes,
    isExceeded,
  };
}

export function saveDocumentToVault(
  doc: Omit<StoredDocument, "id" | "createdAt" | "updatedAt">,
  userId?: string
): { success: boolean; error?: string; document?: StoredDocument } {
  if (typeof window === "undefined") {
    return { success: false, error: "Lingkungan peramban tidak tersedia." };
  }

  const uid = userId || getActiveUserId();
  const key = getVaultStorageKey(uid);
  const summary = getStorageUsageSummary(uid);
  const newSize = doc.fileSizeBytes || 150 * 1024; // Default 150 KB jika tidak dispesifikasi

  if (summary.usedBytes + newSize > summary.maxBytes) {
    return {
      success: false,
      error: `Kapasitas penyimpanan ${summary.tierLabel} telah penuh (${formatBytes(summary.usedBytes)} / ${formatBytes(summary.maxBytes)}). Silakan upgrade paket langganan Anda untuk menambah ruang penyimpanan.`,
    };
  }

  const existingDocs = getStoredDocuments(uid);
  const newDoc: StoredDocument = {
    ...doc,
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const updatedDocs = [newDoc, ...existingDocs];
    localStorage.setItem(key, JSON.stringify(updatedDocs));
    window.dispatchEvent(new CustomEvent("modulku-vault-changed"));
    return { success: true, document: newDoc };
  } catch {
    return {
      success: false,
      error: "Gagal menyimpan berkas ke penyimpanan lokal peramban.",
    };
  }
}

export function deleteDocumentFromVault(docId: string, userId?: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const uid = userId || getActiveUserId();
    const key = getVaultStorageKey(uid);
    const docs = getStoredDocuments(uid);
    const filtered = docs.filter((d) => d.id !== docId);
    localStorage.setItem(key, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent("modulku-vault-changed"));
    return true;
  } catch {
    return false;
  }
}

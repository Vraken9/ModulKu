import { NextRequest, NextResponse } from "next/server";
import { presentationInputSchema } from "@/lib/validations/presentation";
import {
  MediaAjarBundle,
  PresentationBundle,
  SlideItem,
  StudentWorksheetLKPD,
} from "@/types";

export const runtime = "nodejs";

function generateFallbackMediaAjar(input: {
  topic: string;
  subject: string;
  grade: string;
  target_duration_minutes: number;
  slide_count: number;
  theme_palette: "navy_enterprise" | "emerald_nature" | "slate_academic" | "indigo_tech";
  include_lkpd: boolean;
}): MediaAjarBundle {
  const slides: SlideItem[] = [];

  // Slide 1: Cover
  slides.push({
    slide_number: 1,
    category: "judul",
    title: input.topic,
    subtitle: `Bahan Tayang Deep Learning (Mindful, Meaningful, Joyful) - ${input.subject}`,
    bullet_points: [],
    speaker_notes:
      "Guru membuka sesi secara mindful, menyapa peserta didik dengan hangat, mengecek kesiapan fisik dan mental kelas, serta mengaitkan suasana kelas dengan topik yang akan dipelajari.",
  });

  // Slide 2: Apersepsi
  slides.push({
    slide_number: 2,
    category: "apersepsi",
    title: "Mengapa Fenomena Ini Terjadi di Sekitar Kita?",
    bullet_points: [
      `Amati kejadian sehari-hari yang berkaitan langsung dengan materi ${input.topic}.`,
      "Apakah Anda pernah merasakan atau melihat langsung dampaknya dalam kehidupan nyata?",
      "Bagaimana sains atau konsep keilmuan mampu memberikan penjelasan logis atas kejadian tersebut?",
    ],
    interactive_question:
      "Menurut Anda, apa faktor terbesar yang memicu terjadinya fenomena ini?",
    key_takeaway: "Sains dan konsep ilmu berakar dari observasi kejadian konkret.",
    speaker_notes:
      "Guru memancing rasa ingin tahu peserta didik melalui dialog singkat. Berikan kesempatan pada 2-3 siswa untuk mengutarakan praduga awal tanpa dihakimi benar atau salah.",
  });

  // Slide 3: Tujuan Pembelajaran
  slides.push({
    slide_number: 3,
    category: "tujuan",
    title: "Tujuan Pembelajaran & Kriteria Keberhasilan",
    bullet_points: [
      `Menganalisis konsep fundamental dan karakteristik utama materi ${input.topic}.`,
      "Mengidentifikasi variabel atau faktor pengaruh melalui studi kasus kontekstual.",
      "Merumuskan solusi atau kesimpulan ilmiah secara kolaboratif bersama kelompok.",
    ],
    key_takeaway: "Target: Pemahaman bermakna dan keterampilan bernalar kritis.",
    speaker_notes:
      "Jelaskan target pencapaian sesi hari ini agar peserta didik memiliki peta belajar yang jelas selama 2x45 menit pertemuan.",
  });

  // Slide 4: Konsep Inti 1
  slides.push({
    slide_number: 4,
    category: "konsep_inti",
    title: `Prinsip Dasar & Terminologi: ${input.topic}`,
    bullet_points: [
      `Definisi formal dan hukum-hukum fundamental yang mendasari ${input.topic}.`,
      "Komponen penyusun serta variabel-variabel kunci yang saling berinteraksi.",
      "Hubungan matematis atau keterkaitan logis antar parameter yang terukur.",
    ],
    key_takeaway: "Kunci utama terletak pada pemahaman definisi dan hubungan sebab-akibat.",
    speaker_notes:
      "Sajikan konsep inti menggunakan analogi sederhana. Hindari membaca teks slide secara monoton; gunakan gestur dan ilustrasi verbal.",
  });

  // Slide 5: Konsep Inti 2
  slides.push({
    slide_number: 5,
    category: "konsep_inti",
    title: "Mekanisme Kerja & Dinamika Proses",
    bullet_points: [
      "Tahapan terjadinya proses dari kondisi awal menuju kesetimbangan baru.",
      "Dampak perubahan salah satu variabel terhadap keseluruhan performa sistem.",
      "Contoh grafik atau pemodelan data yang menggambarkan laju atau kestabilan.",
    ],
    key_takeaway: "Sistem bersifat dinamis dan bereaksi proporsional terhadap stimulus luar.",
    speaker_notes:
      "Tunjukkan grafik atau model konseptual. Tanyakan kepada siswa apa yang terjadi jika salah satu variabel dinaikkan nilainya.",
  });

  // Slide 6: Studi Kasus
  slides.push({
    slide_number: 6,
    category: "studi_kasus",
    title: `Studi Kasus Nyata: Implementasi ${input.topic}`,
    bullet_points: [
      "Kasus: Penerapan teknologi modern atau mitigasi bencana di lingkungan industri/masyarakat.",
      "Tantangan: Adanya anomali lingkungan yang menyebabkan sistem tidak berjalan optimal.",
      "Fokus Diskusi: Bagaimana alternatif rekayasa terbaik untuk memecahkan persoalan tersebut?",
    ],
    interactive_question:
      "Solusi mana yang paling hemat biaya namun memiliki efektivitas tertinggi?",
    key_takeaway: "Pemecahan masalah menuntut integrasi sains, ekonomi, dan etika.",
    speaker_notes:
      "Bagi kelas menjadi kelompok diskusi beranggotakan 4-5 peserta didik untuk membedah studi kasus ini selama 10 menit.",
  });

  // Slide 7: Kuis Interaktif
  slides.push({
    slide_number: 7,
    category: "kuis_interaktif",
    title: "Kuis Cepat: Uji Pemahaman Mandiri",
    bullet_points: [
      `Pertanyaan: Manakah pernyataan yang paling akurat mengenai perilaku ${input.topic}?`,
      "A. Nilai besaran selalu konstan terlepas dari pengaruh faktor eksternal.",
      "B. Terjadi transfer energi atau informasi yang proporsional dengan gradien perubahan.",
      "C. Perubahan kondisi hanya terjadi ketika terdapat intervensi buatan manusia.",
      "D. Seluruh variabel tidak memiliki korelasi yang dapat diukur secara empiris.",
    ],
    interactive_question: "Jawaban yang benar adalah B. Mengapa bukan opsi A?",
    key_takeaway: "Prinsip konservasi dan transfer gradien berlaku secara universal.",
    speaker_notes:
      "Ajak seluruh siswa mengangkat kartu jawaban atau menggunakan voting tangan. Minta 1 siswa yang menjawab benar untuk menjelaskan alasannya.",
  });

  // Slide 8: Tugas LKPD
  slides.push({
    slide_number: 8,
    category: "tugas_lkpd",
    title: "Aktivitas Kolaboratif: Petunjuk LKPD",
    bullet_points: [
      "Bekerjalah bersama kelompok yang telah ditentukan sesuai pembagian peran.",
      "Isi tabel data pengamatan berdasarkan simulasi virtual atau lembar kerja fisik.",
      "Jawablah 3 pertanyaan analitis dan rumuskan 1 kesimpulan umum kelompok.",
    ],
    key_takeaway: "Kolaborasi aktif, pembagian peran adil, dan integritas pengolahan data.",
    speaker_notes:
      "Guru berkeliling memfasilitasi kelompok yang memerlukan bimbingan diferensiasi proses.",
  });

  // Slide 9: Refleksi & Penutup
  slides.push({
    slide_number: 9,
    category: "refleksi",
    title: "Refleksi Joyful & Sintesis Pembelajaran Mendalam",
    bullet_points: [
      "Apa satu wawasan terpenting yang baru Anda pahami pada pembelajaran hari ini?",
      "Bagian mana dari konsep ini yang paling bermakna bagi kehidupan sehari-hari Anda?",
      "Tindak Lanjut: Tugas terstruktur eksploratif dan pengantar materi pertemuan berikutnya.",
    ],
    key_takeaway: "Belajar adalah proses bermakna yang menggembirakan untuk mengasah ketajaman bernalar.",
    speaker_notes:
      "Tutup sesi dengan suasana gembira, mengapresiasi keaktifan seluruh siswa dan memimpin doa penutup.",
  });

  // Presentation Bundle
  const presentation: PresentationBundle = {
    id: `pres-${Date.now()}`,
    topic: input.topic,
    subject: input.subject,
    grade: input.grade,
    target_duration_minutes: input.target_duration_minutes,
    theme_palette: input.theme_palette,
    slides: slides.slice(0, input.slide_count),
  };

  // Student Worksheet LKPD
  const worksheet: StudentWorksheetLKPD = {
    id: `lkpd-${Date.now()}`,
    title: `LEMBAR KERJA PESERTA DIDIK (LKPD) STANDAR BKPDM: ${input.topic.toUpperCase()}`,
    subject: input.subject,
    grade: input.grade,
    semester: 1,
    group_type: "Kelompok",
    estimated_minutes: 40,
    learning_objectives: [
      `Peserta didik mampu mengumpulkan dan mengorganisasikan data terkait fenomena ${input.topic}.`,
      "Peserta didik mampu menginterpretasikan grafik hubungan antar variabel secara ilmiah.",
      "Peserta didik mampu menyimpulkan prinsip kerja dan mempresentasikannya di depan kelas.",
    ],
    materials_tools: [
      "Perangkat modul eksperimen / simulasi digital (PhET / Lab Virtual)",
      "Lembar kerja dan alat tulis",
      "Kalkulator ilmiah atau lembar spreedsheet",
    ],
    activity_steps: [
      "Bentuklah kelompok yang terdiri atas 4-5 orang dan bagi tugas sebagai pencatat, operator alat, dan juru bicara.",
      "Lakukan pengukuran data untuk 3 variasi kondisi yang berbeda sesuai petunjuk tabel pengamatan.",
      "Catat setiap data angka pada tabel yang telah disediakan tanpa mengubah data riil.",
      "Diskusikan pertanyaan analitis bersama seluruh anggota tim dengan saling menghargai pendapat.",
      "Buatlah resume kesimpulan akhir untuk dipresentasikan di hadapan guru dan teman sekelas.",
    ],
    data_observation_table: {
      headers: ["Percobaan Ke-", "Kondisi / Variabel Manipulasi", "Hasil Ukur 1", "Hasil Ukur 2", "Rata-Rata"],
      rows: [
        ["1", "Kondisi Standar (Normal)", "12.4", "12.6", "12.5"],
        ["2", "Kondisi Perlakuan Rendah", "8.2", "8.4", "8.3"],
        ["3", "Kondisi Perlakuan Tinggi", "18.1", "17.9", "18.0"],
      ],
    },
    analysis_questions: [
      `Bagaimanakah pola perubahan hasil ukur ketika kondisi perlakuan ditingkatkan pada materi ${input.topic}?`,
      "Apakah terdapat anomali atau perbedaan antara prediksi teoritis dengan data empiris yang Anda peroleh?",
      "Faktor galat (error) apa saja yang berpotensi memengaruhi presisi pengukuran kelompok Anda?",
    ],
    conclusion_prompts: [
      `Berdasarkan seluruh hasil pengamatan, prinsip fundamental ${input.topic} terbukti bahwa ...`,
      "Rekomendasi pengembangan solusi praktis untuk meminimalkan dampak negatif adalah ...",
    ],
    rubric_scoring: [
      {
        aspect: "Ketelitian & Kejujuran Data",
        criteria: "Mencatat data sesuai hasil eksperimen riil tanpa manipulasi.",
        max_score: 25,
      },
      {
        aspect: "Ketajaman Analisis Masalah",
        criteria: "Mampu menjelaskan relasi sebab-akibat dengan argumen logis dan berbasis teori.",
        max_score: 35,
      },
      {
        aspect: "Kualitas Kesimpulan",
        criteria: "Menjawab tujuan praktikum secara tuntas dan aplikatif.",
        max_score: 25,
      },
      {
        aspect: "Kerja Sama & Tanggung Jawab",
        criteria: "Seluruh anggota berkontribusi aktif dan menyelesaikan tugas tepat waktu.",
        max_score: 15,
      },
    ],
  };

  return {
    presentation,
    worksheet,
  };
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parseResult = presentationInputSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validasi parameter presentasi gagal",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const bundle = generateFallbackMediaAjar(data);

    return NextResponse.json({
      success: true,
      data: bundle,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return NextResponse.json(
      {
        error: "Gagal memproses pembuatan bahan tayang presentasi",
        details: errorMsg,
      },
      { status: 500 }
    );
  }
}

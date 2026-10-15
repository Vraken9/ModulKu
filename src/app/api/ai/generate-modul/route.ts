import { NextRequest, NextResponse } from "next/server";
import { teachingModuleSchema } from "@/lib/validations/modul-ajar";
import { TeachingModule } from "@/types";

// Security by Design: Handler aman dengan validasi Zod ketat
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    const validation = teachingModuleSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validasi parameter gagal",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const apiKey = process.env.GEMINI_API_KEY;

    let moduleResult: Partial<TeachingModule>;

    if (apiKey && apiKey !== "your-gemini-api-key-placeholder") {
      try {
        moduleResult = await callGeminiModulAI(data, apiKey);
      } catch {
        moduleResult = generatePedagogicalModule(data);
      }
    } else {
      moduleResult = generatePedagogicalModule(data);
    }

    return NextResponse.json({
      success: true,
      data: moduleResult,
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat memproses modul ajar" },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function callGeminiModulAI(data: any, apiKey: string): Promise<Partial<TeachingModule>> {
  const prompt = `Anda adalah Pengembang Kurikulum Resmi BKPDM Kemendikdasmen Republik Indonesia.
Rancang Modul Ajar berstandar Keputusan Kepala BKPDM No. 020 Tahun 2026 dan Permendikdasmen No. 13 Tahun 2025:
- Jenjang: ${data.education_level} (${data.grade}, Fase ${data.phase})
- Mapel: ${data.subject}
- Materi Pokok: ${data.chapter_or_material}
- Model Pembelajaran: ${data.learning_model}
- Alokasi Waktu: ${data.total_meetings} Pertemuan (${data.duration_jp} JP)
- Karakter & Profil Lulusan BKPDM: ${data.pancasila_dimensions.join(", ")}
- Pendekatan Utama: Deep Learning (Mindful, Meaningful, Joyful) terintegrasi Diferensiasi Konten, Proses, & Produk.
- Format Mode: ${data.format_mode}

Wajib menyusun komponen terstruktur:
1. Informasi Umum (Identitas, Kompetensi Awal, Sarpras, Target Peserta Didik)
2. Komponen Inti:
   - Tujuan Pembelajaran terukur
   - Pemahaman Bermakna (Meaningful Learning: terhubung kehidupan nyata)
   - Pertanyaan Pemantik (Mindful Hook)
   - Skenario Pembelajaran:
     * Pendahuluan Berkesadaran (Mindful Awareness)
     * Kegiatan Inti Berdiferensiasi (Konten, Proses, Produk) & Penyelidikan Bermakna (Meaningful Inquiry)
     * Penutup Menggembirakan (Joyful Reflection & Self-Regulation)
   - Asesmen: Diagnostik, Formatif Berkelanjutan, Sumatif + Rubrik Kriteria Ketercapaian (KKTP)
   - Pengayaan & Remedial
3. Lampiran: Lembar Kerja Peserta Didik (LKPD), Bahan Bacaan, Glosarium, Daftar Pustaka.

Hasilkan output JSON murni sesuai format TeachingModule tanpa markdown pembungkus.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      }),
    }
  );

  if (!response.ok) throw new Error("Gagal menghubungi AI");
  const json = await response.json();
  const textOutput = json.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(textOutput);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generatePedagogicalModule(data: any): Partial<TeachingModule> {
  return {
    id: crypto.randomUUID(),
    title: `Modul Ajar BKPDM: ${data.subject} - ${data.chapter_or_material}`,
    subject: data.subject,
    grade: data.grade,
    phase: data.phase,
    semester: data.semester,
    academic_year: data.academic_year,
    duration_jp: data.duration_jp,
    total_meetings: data.total_meetings,
    learning_model: data.learning_model,
    target_students: data.target_students,
    pancasila_dimensions: data.pancasila_dimensions,
    initial_competency: data.initial_competency,
    learning_objectives: [
      data.learning_objectives,
      `Peserta didik dapat menganalisis dan menerapkan konsep ${data.chapter_or_material} dalam pemecahan masalah kontekstual secara kritis.`,
      `Peserta didik mampu mengomunikasikan hasil investigasi secara kolaboratif dengan etika komunikasi ilmiah yang santun.`,
    ],
    meaningful_understanding: `Peserta didik menyadari bahwa materi ${data.chapter_or_material} bukan sekadar teori tekstual, melainkan konsep fundamental yang terhubung langsung dengan fenomena lingkungan sekitar, pemecahan masalah nyata, serta inovasi teknologi berkelanjutan.`,
    trigger_questions: [
      `Bagaimanakah keterkaitan langsung antara fenomena ${data.chapter_or_material} dengan kejadian yang kita jumpai dalam kehidupan sehari-hari?`,
      `Mengapa pemahaman mendalam terhadap prinsip ini penting untuk menyelesaikan tantangan di masa depan?`,
      `Apa akibat logis yang timbul apabila variabel pendukung dalam sistem ini mengalami perubahan drastis?`,
    ],
    learning_activities: {
      meetings: [
        {
          meeting_number: 1,
          duration_minutes: data.duration_jp * 45,
          introduction: [
            "Pilar Mindful (Berkesadaran): Guru membuka kelas dengan salam hangat, membimbing hening cipta sejenak untuk menata fokus dan kesiapan emosional siswa.",
            "Apersepsi Kontekstual: Menayangkan studi kasus nyata atau demonstrasi singkat terkait fenomena " + data.chapter_or_material + ".",
            "Mindful Questioning: Guru melontarkan Pertanyaan Pemantik untuk membangkitkan rasa ingin tahu alami peserta didik tanpa menghakimi benar/salah.",
            "Asesmen Diagnostik Awal: Mengidentifikasi kesiapan belajar dan pra-konsepsi peserta didik melalui kuis interaktif singkat.",
            "Penyampaian Tujuan & Kontrak Belajar: Menjelaskan kriteria keberhasilan dan alur kegiatan belajar yang humanis dan terstruktur.",
          ],
          core_activities: {
            syntax_steps: [
              "Tahap 1 (Orientasi Masalah Kontekstual): Peserta didik mengamati simulasi atau wacana autentik yang memuat tantangan riil terkait " + data.chapter_or_material + ".",
              "Tahap 2 (Organisasi Belajar Kolaboratif): Peserta didik berkolaborasi dalam kelompok heterogen dengan peran tugas yang jelas.",
              "Tahap 3 (Meaningful Inquiry & Penyelidikan Terbimbing): Setiap kelompok melakukan eksplorasi data, eksperimen atau studi pustaka menggunakan LKPD terstruktur.",
              "Tahap 4 (Konstruksi & Visualisasi Solusi): Peserta didik menyusun temuan dan menghubungkan konsep ilmiah dengan alternatif solusi konkret.",
              "Tahap 5 (Evaluasi & Umpan Balik Rekan): Kelompok membagikan hasil temuan untuk mendapatkan masukan kritis dan reflektif dari teman sejawat.",
            ],
            differentiation_content:
              "Diferensiasi Konten: Disediakan bahan ajar modular bertingkat (ringkasan infografis untuk kesiapan pemula, modul analisis komprehensif untuk reguler, dan studi kasus mutakhir untuk kelompok mahir).",
            differentiation_process:
              "Diferensiasi Proses: Guru memberikan pendampingan adaptif (scaffolding terarah) bagi siswa yang membutuhkan bantuan konsep dasar, serta memberikan tantangan eksplorasi mandiri bagi siswa berkemampuan tinggi.",
            differentiation_product:
              "Diferensiasi Produk: Peserta didik dapat menyajikan laporan solusi dalam format yang sesuai minat: laporan analitis, infografis ringkas, atau presentasi lisan interaktif.",
            deep_learning_principles: {
              mindful_awareness: "Siswa secara sadar memetakan strategi belajarnya sendiri dan mengenali hal yang sudah maupun belum dipahami.",
              meaningful_inquiry: "Setiap aktivitas diarahkan pada pemahaman konsep fungsional yang aplikatif di dunia nyata, bukan sekadar menghafal rumus.",
              joyful_reflection: "Pembelajaran berlangsung interaktif, saling mengapresiasi keunikan ide, dan merayakan progres pencapaian setiap anak.",
            },
          },
          closing: [
            "Pilar Joyful (Menggembirakan): Refleksi belajar bermakna dengan menanyakan: 'Apa hal paling berkesan dan bermanfaat yang Anda temukan hari ini?'.",
            "Apresiasi Guru: Guru memberikan penguatan positif atas kerja keras, kolaborasi, dan nalar kritis seluruh siswa.",
            "Tindak Lanjut & Rencana Pertemuan Berikutnya: Memberikan arahan penugasan eksploratif ringan dan menutup sesi dengan doa bersama.",
          ],
        },
      ],
    },
    assessments: {
      diagnostic:
        "Asesmen Diagnostik Non-Kognitif & Kognitif: Pemetaan gaya belajar, kondisi emosi, serta tes uji 3 butir konsep prasyarat.",
      formative:
        "Asesmen Formatif Berkelanjutan: Observasi keterlibatan diskusi kelompok, lembar ceklis nalar kritis, dan catatan penilaian unjuk kerja berkala.",
      summative:
        "Asesmen Sumatif (KKTP): Tes performa pemecahan masalah kontekstual atau tes tulis butir soal analitis dengan rubrik analitik berjenjang (Perlu Bimbingan, Cukup, Baik, Mahir).",
      rubric: {
        aspek_penilaian: [
          "Kedalaman Pemahaman Konsep (Meaningful Learning)",
          "Keterampilan Bernalar Kritis & Pemecahan Masalah",
          "Kolaborasi dan Komunikasi Efektif (Karakter BKPDM)",
        ],
        rentang_nilai: "Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) Skala 0 - 100",
      },
    },
    appendices: {
      student_worksheet_lkpd: `LEMBAR KERJA PESERTA DIDIK (LKPD) BKPDM\nTopik: ${data.chapter_or_material}\nKelas/Fase: ${data.grade} / Fase ${data.phase}\n\nA. Tujuan Penyelidikan:\nPeserta didik mampu mengidentifikasi variabel dan merumuskan kesimpulan berbasis bukti empiris.\n\nB. Stimulus Fenomena Nyata:\nAmati kondisi kontekstual di lingkungan sekitar terkait topik ini.\n\nC. Langkah Investigasi:\n1. Rumuskan pertanyaan mendasar mengenai faktor-faktor yang berpengaruh.\n2. Catat data hasil observasi pada tabel instrumen.\n3. Diskusikan bersama rekan kelompok: apa pola yang ditemukan?\n\nD. Refleksi Diri (Mindful Check):\n- Bagian mana yang paling menantang bagi saya?\n- Bagaimana saya mengatasi kesulitan tersebut?`,
      reading_materials: `Buku Siswa dan Panduan Guru Kurikulum Nasional Kemendikdasmen, Buku Referensi Kontekstual SIKN, serta sumber digital pendukung resmi.`,
      glossary: [
        { term: "Mindful Learning", definition: "Pembelajaran dengan kesadaran penuh terhadap tujuan, proses, dan emosi belajar diri sendiri." },
        { term: "Meaningful Learning", definition: "Pembelajaran bermakna yang mengaitkan konsep baru secara kontekstual dengan kehidupan nyata peserta didik." },
        { term: "Joyful Learning", definition: "Suasana belajar yang humanis, menyenangkan, bebas intimidasi, dan menumbuhkan rasa ingin tahu berkelanjutan." },
        { term: "Diferensiasi", definition: "Penyesuaian strategi pembelajaran berdasarkan kesiapan, minat, dan profil belajar unik setiap murid." },
      ],
      references: [
        "Keputusan Kepala BKPDM Kemendikdasmen No. 020 Tahun 2026 tentang Capaian Pembelajaran.",
        "Permendikdasmen No. 13 Tahun 2025 tentang Kerangka Dasar Kurikulum Pendidikan Dasar dan Menengah.",
        "Panduan Pembelajaran dan Asesmen (PPA) Kemendikdasmen.",
      ],
    },
    format_mode: data.format_mode,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

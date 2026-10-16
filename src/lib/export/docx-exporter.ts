import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  Footer,
  PageNumber,
  convertInchesToTwip,
} from "docx";
import {
  QuestionPackage,
  KisiKisiItem,
  TeachingModule,
  SchoolProfile,
  TeacherProfile,
  PerangkatTahunanBundle,
  StudentWorksheetLKPD,
} from "@/types";

// Margin kedinasan Indonesia: Kiri 4 cm, Atas 3 cm, Kanan 3 cm, Bawah 3 cm
// 1 cm = ~567 twips.
const MARGINS_KEDINASAN = {
  top: 1701, // 3 cm
  bottom: 1701, // 3 cm
  left: 2268, // 4 cm
  right: 1701, // 3 cm
};

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Membersihkan sintaks LaTeX / KaTeX matematika menjadi representasi teks Unicode
 * yang rapi, natural, dan siap cetak di Microsoft Word tanpa simbol aneh ($ ... $).
 */
export function cleanLatexForDocx(raw: string | null | undefined): string {
  if (!raw) return "";
  let text = String(raw);

  // 1. Ekstrak teks dalam perintah pemformatan \text{...}, \mathrm{...}, dsb.
  text = text.replace(/\\(?:text|mathrm|mathbf|mathit)\{([^{}]+)\}/g, "$1");

  // 2. Vektor & Garis: \vec{v} -> v, \bar{v} -> v
  text = text.replace(/\\vec\{([^{}]+)\}/g, "$1");
  text = text.replace(/\\bar\{([^{}]+)\}/g, "$1");

  // 3. Pecahan: \frac{a}{b} -> a/b
  for (let i = 0; i < 3; i++) {
    text = text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2");
  }

  // 4. Huruf Yunani & Simbol Sains
  const greekMap: Record<string, string> = {
    "\\pi": "π",
    "\\Delta": "Δ",
    "\\delta": "δ",
    "\\theta": "θ",
    "\\alpha": "α",
    "\\beta": "β",
    "\\gamma": "γ",
    "\\lambda": "λ",
    "\\mu": "μ",
    "\\Sigma": "Σ",
    "\\sigma": "σ",
    "\\Omega": "Ω",
    "\\omega": "ω",
    "\\phi": "φ",
    "\\rho": "ρ",
    "\\epsilon": "ε",
    "\\eta": "η",
  };
  for (const [tex, uni] of Object.entries(greekMap)) {
    text = text.replaceAll(tex, uni);
  }

  // 5. Operator & Simbol Matematika
  const opMap: Record<string, string> = {
    "\\times": "×",
    "\\cdot": "·",
    "\\div": "÷",
    "\\pm": "±",
    "\\mp": "∓",
    "\\approx": "≈",
    "\\neq": "≠",
    "\\leq": "≤",
    "\\le": "≤",
    "\\geq": "≥",
    "\\ge": "≥",
    "\\infty": "∞",
    "\\degree": "°",
    "^\\circ": "°",
    "\\%": "%",
  };
  for (const [tex, uni] of Object.entries(opMap)) {
    text = text.replaceAll(tex, uni);
  }

  // Akar kuadrat: \sqrt{x} -> √(x)
  text = text.replace(/\\sqrt\{([^{}]+)\}/g, "√($1)");
  text = text.replace(/\\sqrt\b/g, "√");

  // 6. Pangkat Unicode: ^2 -> ², ^3 -> ³, dll.
  text = text.replace(/\^\{?-1\}?/g, "⁻¹");
  text = text.replace(/\^\{?-2\}?/g, "⁻²");
  text = text.replace(/\^\{?2\}?/g, "²");
  text = text.replace(/\^\{?3\}?/g, "³");
  text = text.replace(/\^\{?4\}?/g, "⁴");
  text = text.replace(/\^\{?0\}?/g, "⁰");
  text = text.replace(/\^\{?1\}?/g, "¹");

  // 7. Indeks / Subscript Unicode: _0 -> ₀, _1 -> ₁, dll.
  text = text.replace(/_\{?0\}?/g, "₀");
  text = text.replace(/_\{?1\}?/g, "₁");
  text = text.replace(/_\{?2\}?/g, "₂");
  text = text.replace(/_\{?3\}?/g, "₃");
  text = text.replace(/_\{?t\}?/g, "ₜ");
  text = text.replace(/_\{?x\}?/g, "ₓ");
  text = text.replace(/_\{?y\}?/g, "ᵧ");

  // 8. Tanda Kurung Grup LaTeX
  text = text.replace(/\\left\(/g, "(");
  text = text.replace(/\\right\)/g, ")");
  text = text.replace(/\\left\[/g, "[");
  text = text.replace(/\\right\]/g, "]");
  text = text.replace(/\\left\\\{/g, "{");
  text = text.replace(/\\right\\\}/g, "}");

  // 9. Spasi LaTeX
  text = text.replace(/\\quad\b/g, "  ");
  text = text.replace(/\\[;,!]/g, " ");

  // 10. Bersihkan Pembatas Matematika LaTeX ($$ dan $)
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, "$1");
  text = text.replace(/\$([^\$]+)\$/g, "$1");
  text = text.replace(/\$/g, "");

  // 11. Hapus sisa backslash perintah tunggal
  text = text.replace(/\\([a-zA-Z]+)/g, "$1");

  // 12. Normalisasi spasi berlebih
  text = text.replace(/[ \t]{2,}/g, " ").trim();

  return text;
}

// 1. Ekspor Naskah Soal Siswa & Kunci Pembahasan ke DOCX
export async function exportQuestionsToDocx(
  pkg: QuestionPackage,
  includeAnswerKey = false
): Promise<void> {
  const paragraphs: (Paragraph | Table)[] = [];

  // Kop Surat Textual DOCX
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: "PEMERINTAH DAERAH PROVINSI JAWA TIMUR",
          bold: true,
          size: 24, // 12 pt
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: "DINAS PENDIDIKAN DAN KEBUDAYAAN",
          bold: true,
          size: 24,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: "SMA NEGERI 1 PURWANTORO",
          bold: true,
          size: 26,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      border: {
        bottom: {
          color: "000000",
          space: 1,
          style: BorderStyle.DOUBLE,
          size: 18,
        },
      },
      children: [
        new TextRun({
          text: "Jl. Raya Purwantoro - Kismantoro Km. 2, Wonogiri | Telp. (0273) 415123",
          italics: true,
          size: 18,
          font: "Arial",
        }),
      ],
    })
  );

  // Judul Dokumen
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: includeAnswerKey
            ? "NASKAH SOAL EVALUASI & PEDOMAN PENSKORAN RESMI"
            : "NASKAH SOAL ASESMEN SUMATIF SISWA",
          bold: true,
          size: 26,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `Mata Pelajaran: ${pkg.subject}   |   Tingkat / Fase: Kelas ${pkg.grade} (Fase ${pkg.phase})   |   Tahun Ajaran: ${pkg.academic_year}`,
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  // Daftar Butir Soal
  if (pkg.questions && pkg.questions.length > 0) {
    pkg.questions.forEach((q, idx) => {
      // Stimulus jika ada
      if (q.stimulus_text) {
        paragraphs.push(
          new Paragraph({
            spacing: { before: 140, after: 60 },
            border: {
              left: { color: "666666", size: 12, space: 4, style: BorderStyle.SINGLE },
            },
            children: [
              new TextRun({
                text: `Wacana / Stimulus untuk Soal No. ${idx + 1}:`,
                bold: true,
                italics: true,
                size: 20,
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: cleanLatexForDocx(q.stimulus_text),
                italics: true,
                size: 20,
                font: "Arial",
              }),
            ],
          })
        );
      }

      // Pertanyaan
      paragraphs.push(
        new Paragraph({
          spacing: { before: 100, after: 80 },
          children: [
            new TextRun({
              text: `${idx + 1}. `,
              bold: true,
              size: 22,
              font: "Arial",
            }),
            new TextRun({
              text: cleanLatexForDocx(q.question_text),
              size: 22,
              font: "Arial",
            }),
          ],
        })
      );

      // Pilihan Jawaban
      if (q.options && q.options.length > 0) {
        q.options.forEach((opt) => {
          paragraphs.push(
            new Paragraph({
              indent: { left: 400 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: `${opt.label}. `,
                  bold: true,
                  size: 22,
                  font: "Arial",
                }),
                new TextRun({
                  text: cleanLatexForDocx(opt.text),
                  size: 22,
                  font: "Arial",
                }),
              ],
            })
          );
        });
      }

      // Kunci Jawaban & Pembahasan jika mode guru
      if (includeAnswerKey) {
        paragraphs.push(
          new Paragraph({
            indent: { left: 400 },
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({
                text: `Kunci Jawaban: ${q.correct_answer}`,
                bold: true,
                color: "1D4ED8",
                size: 20,
                font: "Arial",
              }),
              new TextRun({
                text: `  |  Level: ${q.cognitive_level} (${q.bloom_level})  |  Tingkat: ${q.difficulty}`,
                italics: true,
                size: 18,
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            indent: { left: 400 },
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `Pembahasan: ${cleanLatexForDocx(q.explanation)}`,
                size: 20,
                italics: true,
                font: "Arial",
              }),
            ],
          })
        );
      }
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: MARGINS_KEDINASAN,
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${pkg.title} - Halaman `,
                    size: 18,
                    font: "Arial",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    font: "Arial",
                  }),
                ],
              }),
            ],
          }),
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const suffix = includeAnswerKey ? "Kunci_Pembahasan" : "Siswa";
  triggerDownload(
    blob,
    `${pkg.title.replace(/[^a-zA-Z0-9_-]/g, "_")}_${suffix}.docx`
  );
}

// 2. Ekspor Matriks Kisi-Kisi ke DOCX
export async function exportKisiKisiToDocx(
  items: KisiKisiItem[],
  subject: string,
  grade: string,
  academicYear: string
): Promise<void> {
  const tableRows: TableRow[] = [];

  // Header Table
  tableRows.push(
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 600, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No", bold: true, size: 18, font: "Arial" })] })],
        }),
        new TableCell({
          width: { size: 2200, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: "Capaian Pembelajaran (CP)", bold: true, size: 18, font: "Arial" })] })],
        }),
        new TableCell({
          width: { size: 2200, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: "Tujuan Pembelajaran / Materi", bold: true, size: 18, font: "Arial" })] })],
        }),
        new TableCell({
          width: { size: 2400, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: "Indikator Soal", bold: true, size: 18, font: "Arial" })] })],
        }),
        new TableCell({
          width: { size: 1200, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Level", bold: true, size: 18, font: "Arial" })] })],
        }),
        new TableCell({
          width: { size: 1000, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Bentuk", bold: true, size: 18, font: "Arial" })] })],
        }),
        new TableCell({
          width: { size: 700, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No Soal", bold: true, size: 18, font: "Arial" })] })],
        }),
      ],
    })
  );

  // Data Rows
  items.forEach((item) => {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.nomor_urut), size: 18, font: "Arial" })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: cleanLatexForDocx(item.capaian_pembelajaran), size: 18, font: "Arial" })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: cleanLatexForDocx(item.tujuan_pembelajaran_materi), size: 18, font: "Arial" })] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: cleanLatexForDocx(item.indikator_soal), size: 18, font: "Arial" })] })],
          }),
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.level_kognitif, size: 18, font: "Arial" })] })],
          }),
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.bentuk_soal, size: 18, font: "Arial" })] })],
          }),
          new TableCell({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.nomor_soal), bold: true, size: 18, font: "Arial" })] })],
          }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: MARGINS_KEDINASAN,
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "MATRIKS KISI-KISI PENYUSUNAN SOAL UJIAN",
                bold: true,
                size: 26,
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `Mata Pelajaran: ${subject} | Kelas: ${grade} | Tahun Ajaran: ${academicYear}`,
                bold: true,
                size: 20,
                font: "Arial",
              }),
            ],
          }),
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `Kisi_Kisi_${subject.replace(/\s+/g, "_")}.docx`);
}

// Helper: Ambil profil sekolah tersimpan atau profil bawaan
export function getSavedSchoolProfile(override?: Partial<SchoolProfile>): Partial<SchoolProfile> {
  let saved: Partial<SchoolProfile> = {};
  if (typeof window !== "undefined") {
    try {
      const raw =
        localStorage.getItem("guru_school_profile") ||
        localStorage.getItem("modulku_school_profile");
      if (raw) saved = JSON.parse(raw);
    } catch {
      // Abaikan jika ada kegagalan parsing
    }
  }
  return {
    government_agency: "PEMERINTAH PROVINSI JAWA TIMUR",
    education_office: "DINAS PENDIDIKAN DAN KEBUDAYAAN",
    school_name: "SMA NEGERI 1 PURWANTORO",
    npsn: "20311234",
    accreditation: "A",
    address: "Jalan Raya Purwantoro - Kismantoro Km. 2, Purwantoro, Wonogiri",
    postal_code: "57695",
    phone: "(0273) 415123",
    email: "info@sman1purwantoro.sch.id",
    website: "www.sman1purwantoro.sch.id",
    ...saved,
    ...override,
  };
}

// Helper: Ambil profil guru tersimpan atau profil bawaan
export function getSavedTeacherProfile(override?: Partial<TeacherProfile>): Partial<TeacherProfile> {
  let saved: Partial<TeacherProfile> = {};
  if (typeof window !== "undefined") {
    try {
      const raw =
        localStorage.getItem("guru_teacher_profile") ||
        localStorage.getItem("modulku_teacher_profile");
      if (raw) saved = JSON.parse(raw);
    } catch {
      // Abaikan jika ada kegagalan parsing
    }
  }
  return {
    teacher_name: "Arfian Cahya, S.Pd.",
    teacher_title: "Guru Mata Pelajaran",
    teacher_nip: "19880412 201402 1 003",
    headmaster_name: "Drs. H. Mulyadi, M.Pd.",
    headmaster_title: "Kepala Sekolah",
    headmaster_nip: "19670815 199303 1 005",
    supervisor_name: "Dr. Hj. Sri Wahyuni, M.Pd.",
    supervisor_title: "Pengawas Pembina Cabang Dinas",
    supervisor_nip: "19651120 199002 2 002",
    ...saved,
    ...override,
  };
}

// Helper: Garis Kop Surat dan Format Kop Kedinasan
export function createDocxLetterhead(school?: Partial<SchoolProfile>): Paragraph[] {
  const governmentAgency = school?.government_agency || "PEMERINTAH PROVINSI JAWA TIMUR";
  const educationOffice = school?.education_office || "DINAS PENDIDIKAN DAN KEBUDAYAAN";
  const schoolName = school?.school_name || "SMA NEGERI 1 PURWANTORO";
  const npsn = school?.npsn || "20311234";
  const accreditation = school?.accreditation || "A";
  const address = school?.address || "Jalan Raya Purwantoro - Kismantoro Km. 2, Purwantoro, Wonogiri";
  const postalCode = school?.postal_code || "57695";
  const phone = school?.phone || "(0273) 415123";
  const email = school?.email || "info@sman1purwantoro.sch.id";
  const website = school?.website || "www.sman1purwantoro.sch.id";

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: governmentAgency.toUpperCase(),
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: educationOffice.toUpperCase(),
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: schoolName.toUpperCase(),
          bold: true,
          size: 24,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: `NPSN: ${npsn} | Akreditasi: ${accreditation} | Alamat: ${address}, Kode Pos: ${postalCode}`,
          size: 16,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      border: {
        bottom: {
          color: "000000",
          space: 2,
          style: BorderStyle.DOUBLE,
          size: 18,
        },
      },
      children: [
        new TextRun({
          text: `Telepon: ${phone} | Pos-el: ${email} | Laman: ${website}`,
          italics: true,
          size: 16,
          font: "Arial",
        }),
      ],
    }),
  ];
}

// Helper: Lembar Pengesahan Tripartit Kedinasan
export function createDocxEndorsementSheet(options: {
  school?: Partial<SchoolProfile>;
  teacher?: Partial<TeacherProfile>;
  subject?: string;
  grade?: string;
  academicYear?: string;
  semester?: string;
  documentType?: string;
  city?: string;
  date?: string;
}): (Paragraph | Table)[] {
  const teacherName = options.teacher?.teacher_name || "Arfian Cahya, S.Pd.";
  const teacherNip = options.teacher?.teacher_nip || "19880412 201402 1 003";
  const headmasterName = options.teacher?.headmaster_name || "Drs. H. Mulyadi, M.Pd.";
  const headmasterNip = options.teacher?.headmaster_nip || "19670815 199303 1 005";
  const supervisorName = options.teacher?.supervisor_name || "Dr. Hj. Sri Wahyuni, M.Pd.";
  const supervisorNip = options.teacher?.supervisor_nip || "19651120 199002 2 002";
  const schoolName = options.school?.school_name || "SMA NEGERI 1 PURWANTORO";
  const city = options.city || "Wonogiri";
  const date = options.date || "15 Juli 2026";
  const docType = options.documentType || "MODUL AJAR";
  const subject = options.subject || "Fisika";
  const grade = options.grade || "Fase E (Kelas X)";
  const academicYear = options.academicYear || "2026/2027";
  const semester = options.semester || "Ganjil";

  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      pageBreakBefore: true,
      alignment: AlignmentType.CENTER,
      spacing: { before: 140, after: 60 },
      children: [
        new TextRun({
          text: "LEMBAR PENGESAHAN RESMI",
          bold: true,
          size: 26,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: `${docType.toUpperCase()} KURIKULUM MERDEKA`,
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      border: {
        bottom: {
          color: "000000",
          space: 2,
          style: BorderStyle.SINGLE,
          size: 8,
        },
      },
      children: [
        new TextRun({
          text: `TAHUN PELAJARAN ${academicYear}`,
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.BOTH,
      spacing: { before: 100, after: 200, line: 360 },
      indent: { firstLine: 720 },
      children: [
        new TextRun({
          text: `Dokumen ${docType} Mata Pelajaran `,
          size: 20,
          font: "Arial",
        }),
        new TextRun({
          text: subject,
          bold: true,
          size: 20,
          font: "Arial",
        }),
        new TextRun({
          text: ` untuk tingkat `,
          size: 20,
          font: "Arial",
        }),
        new TextRun({
          text: grade,
          bold: true,
          size: 20,
          font: "Arial",
        }),
        new TextRun({
          text: ` Semester `,
          size: 20,
          font: "Arial",
        }),
        new TextRun({
          text: semester,
          bold: true,
          size: 20,
          font: "Arial",
        }),
        new TextRun({
          text: ` ini telah diperiksa, dievaluasi, dan diverifikasi sesuai dengan ketentuan Kurikulum Merdeka yang berlaku, serta disahkan sebagai pedoman pelaksanaan kegiatan belajar mengajar di `,
          size: 20,
          font: "Arial",
        }),
        new TextRun({
          text: schoolName,
          bold: true,
          size: 20,
          font: "Arial",
        }),
        new TextRun({
          text: ` pada Tahun Pelajaran ${academicYear}.`,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 80, after: 160 },
      children: [
        new TextRun({
          text: `Disahkan di: ${city}\nPada tanggal: ${date}`,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  // Tabel 2 Kolom Tanpa Border untuk Tanda Tangan
  const signatureTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Guru Mata Pelajaran,", bold: true, size: 20, font: "Arial" }),
                ],
              }),
              new Paragraph({
                spacing: { before: 1000 },
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: teacherName, bold: true, underline: {}, size: 20, font: "Arial" }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `NIP. ${teacherNip}`, size: 18, font: "Arial" }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: "Mengetahui,\n", bold: true, size: 20, font: "Arial" }),
                  new TextRun({ text: `Kepala ${schoolName}`, bold: true, size: 20, font: "Arial" }),
                ],
              }),
              new Paragraph({
                spacing: { before: 1000 },
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: headmasterName, bold: true, underline: {}, size: 20, font: "Arial" }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: `NIP. ${headmasterNip}`, size: 18, font: "Arial" }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  elements.push(signatureTable);

  // Blok Pengawas Pembina
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 260, after: 40 },
      border: {
        top: {
          color: "CCCCCC",
          space: 4,
          style: BorderStyle.DASHED,
          size: 6,
        },
      },
      children: [
        new TextRun({
          text: "Mengetahui / Mengesahkan:\n",
          size: 18,
          font: "Arial",
        }),
        new TextRun({
          text: "Pengawas Pembina Cabang Dinas Pendidikan,",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 20 },
      children: [
        new TextRun({
          text: supervisorName,
          bold: true,
          underline: {},
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `NIP. ${supervisorNip}`,
          size: 18,
          font: "Arial",
        }),
      ],
    })
  );

  return elements;
}

// 3. Ekspor Modul Ajar BKPDM Kemendikdasmen ke DOCX (Identik 1:1 Pratinjau Web)
export async function exportModulAjarToDocx(
  module: TeachingModule,
  customSchool?: Partial<SchoolProfile>,
  customTeacher?: Partial<TeacherProfile>
): Promise<void> {
  const school = getSavedSchoolProfile(customSchool);
  const teacher = getSavedTeacherProfile(customTeacher);
  const isRingkas = module.format_mode === "ringkas";

  const paragraphs: (Paragraph | Table)[] = [];

  // 1. Kop Surat Resmi Kedinasan
  paragraphs.push(...createDocxLetterhead(school));

  // 2. Judul Dokumen
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 40 },
      children: [
        new TextRun({
          text: "MODUL AJAR KURIKULUM NASIONAL BKPDM",
          bold: true,
          size: 26,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: `MATA PELAJARAN: ${module.subject.toUpperCase()}`,
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      border: {
        bottom: {
          color: "000000",
          space: 2,
          style: BorderStyle.SINGLE,
          size: 10,
        },
      },
      children: [
        new TextRun({
          text: `TAHUN PELAJARAN ${module.academic_year} — TINGKAT ${module.grade} (FASE ${module.phase})`,
          size: 18,
          font: "Arial",
        }),
      ],
    })
  );

  // 3. Bagian I: INFORMASI UMUM
  paragraphs.push(
    new Paragraph({
      spacing: { before: 140, after: 80 },
      children: [
        new TextRun({
          text: "I. INFORMASI UMUM",
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    })
  );

  // Tabel 2 Kolom Informasi Umum
  const infoRows = [
    { label: "Nama Penyusun", value: teacher.teacher_name || "Arfian Cahya, S.Pd." },
    { label: "Satuan Pendidikan", value: school.school_name || "SMA NEGERI 1 PURWANTORO" },
    { label: "Tahun Penyusunan", value: module.academic_year },
    { label: "Jenjang / Fase / Kelas", value: `Fase ${module.phase} — ${module.grade}` },
    {
      label: "Alokasi Waktu",
      value: `${module.total_meetings} Pertemuan (${module.duration_jp} Jam Pelajaran @45 Menit)`,
    },
    { label: "Model Pembelajaran", value: module.learning_model },
    { label: "Target Peserta Didik", value: module.target_students },
  ];

  const infoTableRows = infoRows.map(
    (row) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: 35, type: WidthType.PERCENTAGE },
            shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: row.label,
                    bold: true,
                    size: 19,
                    font: "Arial",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: row.value,
                    size: 19,
                    font: "Arial",
                  }),
                ],
              }),
            ],
          }),
        ],
      })
  );

  paragraphs.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
      },
      rows: infoTableRows,
    }),
    new Paragraph({
      spacing: { before: 140, after: 40 },
      children: [
        new TextRun({
          text: "A. Kompetensi Awal (Prasyarat):",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      indent: { left: 360 },
      children: [
        new TextRun({
          text: module.initial_competency,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [
        new TextRun({
          text: "B. Dimensi Profil Pelajar Pancasila:",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  module.pancasila_dimensions.forEach((dim) => {
    paragraphs.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({
            text: dim,
            size: 20,
            font: "Arial",
          }),
        ],
      })
    );
  });

  // 4. Bagian II: KOMPONEN INTI
  paragraphs.push(
    new Paragraph({
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({
          text: "II. KOMPONEN INTI",
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 60, after: 40 },
      children: [
        new TextRun({
          text: "A. Tujuan Pembelajaran (TP):",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  module.learning_objectives.forEach((tp, idx) => {
    paragraphs.push(
      new Paragraph({
        indent: { left: 360 },
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: `${idx + 1}. `,
            bold: true,
            size: 20,
            font: "Arial",
          }),
          new TextRun({
            text: tp,
            size: 20,
            font: "Arial",
          }),
        ],
      })
    );
  });

  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 40 },
      children: [
        new TextRun({
          text: "B. Pemahaman Bermakna:",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      indent: { left: 360 },
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: module.meaningful_understanding,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 80, after: 40 },
      children: [
        new TextRun({
          text: "C. Pertanyaan Pemantik:",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  module.trigger_questions.forEach((q) => {
    paragraphs.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [
          new TextRun({
            text: `"${q}"`,
            italics: true,
            size: 20,
            font: "Arial",
          }),
        ],
      })
    );
  });

  // D. Kegiatan Pembelajaran
  paragraphs.push(
    new Paragraph({
      spacing: { before: 140, after: 80 },
      children: [
        new TextRun({
          text: "D. Kegiatan Pembelajaran (Diferensiasi & Sintaks Deep Learning):",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  module.learning_activities.meetings.forEach((meet) => {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        border: {
          left: { color: "1D4ED8", size: 16, space: 4, style: BorderStyle.SINGLE },
        },
        children: [
          new TextRun({
            text: `Pertemuan Ke-${meet.meeting_number} (Alokasi Waktu: ${meet.duration_minutes} Menit)`,
            bold: true,
            size: 20,
            color: "1D4ED8",
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        spacing: { before: 60, after: 30 },
        children: [
          new TextRun({
            text: "1. Kegiatan Pendahuluan (15 Menit):",
            bold: true,
            size: 19,
            font: "Arial",
          }),
        ],
      })
    );

    meet.introduction.forEach((item) => {
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: item,
              size: 19,
              font: "Arial",
            }),
          ],
        })
      );
    });

    paragraphs.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: `2. Kegiatan Inti (${meet.duration_minutes - 30} Menit) — Model Pembelajaran: ${module.learning_model}:`,
            bold: true,
            size: 19,
            font: "Arial",
          }),
        ],
      })
    );

    meet.core_activities.syntax_steps.forEach((step, sIdx) => {
      paragraphs.push(
        new Paragraph({
          indent: { left: 360 },
          spacing: { after: 30 },
          children: [
            new TextRun({
              text: `${sIdx + 1}. `,
              bold: true,
              size: 19,
              font: "Arial",
            }),
            new TextRun({
              text: step,
              size: 19,
              font: "Arial",
            }),
          ],
        })
      );
    });

    // Box Diferensiasi & Deep Learning
    paragraphs.push(
      new Paragraph({
        spacing: { before: 80, after: 30 },
        indent: { left: 360 },
        children: [
          new TextRun({
            text: "Penerapan Deep Learning & Diferensiasi Pembelajaran (Standar BKPDM):",
            bold: true,
            size: 18,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 20 },
        indent: { left: 540 },
        children: [
          new TextRun({
            text: `• Diferensiasi Konten: `,
            bold: true,
            size: 18,
            font: "Arial",
          }),
          new TextRun({
            text: meet.core_activities.differentiation_content || "Penyediaan materi berjenjang teks dan infografis kontekstual.",
            size: 18,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 20 },
        indent: { left: 540 },
        children: [
          new TextRun({
            text: `• Diferensiasi Proses: `,
            bold: true,
            size: 18,
            font: "Arial",
          }),
          new TextRun({
            text: meet.core_activities.differentiation_process || "Pendampingan scaffolding bertahap sesuai kesiapan siswa.",
            size: 18,
            font: "Arial",
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 20 },
        indent: { left: 540 },
        children: [
          new TextRun({
            text: `• Diferensiasi Produk: `,
            bold: true,
            size: 18,
            font: "Arial",
          }),
          new TextRun({
            text: meet.core_activities.differentiation_product || "Pilihan bentuk laporan hasil diskusi (resume, peta konsep, atau presentasi).",
            size: 18,
            font: "Arial",
          }),
        ],
      })
    );

    if (meet.core_activities.deep_learning_principles) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 20 },
          indent: { left: 540 },
          children: [
            new TextRun({
              text: `• Mindful (Berkesadaran): `,
              bold: true,
              size: 18,
              font: "Arial",
            }),
            new TextRun({
              text: meet.core_activities.deep_learning_principles.mindful_awareness || "-",
              size: 18,
              font: "Arial",
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 20 },
          indent: { left: 540 },
          children: [
            new TextRun({
              text: `• Meaningful (Bermakna): `,
              bold: true,
              size: 18,
              font: "Arial",
            }),
            new TextRun({
              text: meet.core_activities.deep_learning_principles.meaningful_inquiry || "-",
              size: 18,
              font: "Arial",
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 20 },
          indent: { left: 540 },
          children: [
            new TextRun({
              text: `• Joyful (Menggembirakan): `,
              bold: true,
              size: 18,
              font: "Arial",
            }),
            new TextRun({
              text: meet.core_activities.deep_learning_principles.joyful_reflection || "-",
              size: 18,
              font: "Arial",
            }),
          ],
        })
      );
    }

    paragraphs.push(
      new Paragraph({
        spacing: { before: 80, after: 30 },
        children: [
          new TextRun({
            text: "3. Kegiatan Penutup (15 Menit):",
            bold: true,
            size: 19,
            font: "Arial",
          }),
        ],
      })
    );

    meet.closing.forEach((item) => {
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          children: [
            new TextRun({
              text: item,
              size: 19,
              font: "Arial",
            }),
          ],
        })
      );
    });
  });

  // E. Rencana Asesmen dan Evaluasi (Tabel 3 Kolom)
  paragraphs.push(
    new Paragraph({
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({
          text: "E. Rencana Asesmen dan Evaluasi:",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  const assessmentTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 28, type: WidthType.PERCENTAGE },
            shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Jenis Asesmen", bold: true, size: 19, font: "Arial" })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 32, type: WidthType.PERCENTAGE },
            shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Bentuk / Teknik", bold: true, size: 19, font: "Arial" })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Keterangan Instrumen", bold: true, size: 19, font: "Arial" })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "1. Asesmen Awal (Diagnostik)", bold: true, size: 18, font: "Arial" }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Tes Lisan / Pertanyaan Pemantik", size: 18, font: "Arial" })],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: module.assessments.diagnostic, size: 18, font: "Arial" })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "2. Asesmen Proses (Formatif)", bold: true, size: 18, font: "Arial" }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Observasi & Lembar Diskusi Siswa", size: 18, font: "Arial" })],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: module.assessments.formative, size: 18, font: "Arial" })],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "3. Asesmen Akhir (Sumatif)", bold: true, size: 18, font: "Arial" }),
                ],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Tes Tertulis / Penilaian Kinerja", size: 18, font: "Arial" })],
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: module.assessments.summative, size: 18, font: "Arial" })],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  paragraphs.push(assessmentTable);

  // 5. Bagian III: LAMPIRAN MODUL AJAR (Jika Mode Lengkap)
  if (!isRingkas && module.appendices) {
    paragraphs.push(
      new Paragraph({
        pageBreakBefore: true,
        spacing: { before: 140, after: 80 },
        children: [
          new TextRun({
            text: "III. LAMPIRAN MODUL AJAR",
            bold: true,
            size: 22,
            font: "Arial",
          }),
        ],
      })
    );

    // A. LKPD
    if (module.appendices.student_worksheet_lkpd) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: "A. Lembar Kerja Peserta Didik (LKPD):",
              bold: true,
              size: 20,
              font: "Arial",
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 120 },
          indent: { left: 360 },
          children: [
            new TextRun({
              text: module.appendices.student_worksheet_lkpd,
              size: 19,
              font: "Arial",
            }),
          ],
        })
      );
    }

    // B. Bahan Bacaan Guru & Peserta Didik
    if (module.appendices.reading_materials) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: "B. Bahan Bacaan Guru dan Peserta Didik:",
              bold: true,
              size: 20,
              font: "Arial",
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: 120 },
          indent: { left: 360 },
          children: [
            new TextRun({
              text: module.appendices.reading_materials,
              size: 19,
              font: "Arial",
            }),
          ],
        })
      );
    }

    // C. Glosarium
    if (module.appendices.glossary && module.appendices.glossary.length > 0) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: "C. Glosarium Istilah:",
              bold: true,
              size: 20,
              font: "Arial",
            }),
          ],
        })
      );
      module.appendices.glossary.forEach((item) => {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${item.term}: `,
                bold: true,
                size: 19,
                font: "Arial",
              }),
              new TextRun({
                text: item.definition,
                size: 19,
                font: "Arial",
              }),
            ],
          })
        );
      });
    }

    // D. Daftar Pustaka
    if (module.appendices.references && module.appendices.references.length > 0) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({
              text: "D. Daftar Pustaka:",
              bold: true,
              size: 20,
              font: "Arial",
            }),
          ],
        })
      );
      module.appendices.references.forEach((ref) => {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: ref,
                size: 19,
                font: "Arial",
              }),
            ],
          })
        );
      });
    }
  }

  // 6. Lembar Pengesahan Tripartit di Halaman Akhir
  paragraphs.push(
    ...createDocxEndorsementSheet({
      school,
      teacher,
      subject: module.subject,
      grade: `Fase ${module.phase} (${module.grade})`,
      academicYear: module.academic_year,
      semester: module.semester,
      documentType: "MODUL AJAR",
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: MARGINS_KEDINASAN,
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(
    blob,
    `Modul_Ajar_${module.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.docx`
  );
}

// 4. Ekspor Dokumen Perangkat Tahunan (ATP, Prota, Promes, RPE) ke DOCX
export async function exportPerangkatTahunanToDocx(
  bundle: PerangkatTahunanBundle,
  customSchool?: Partial<SchoolProfile>,
  customTeacher?: Partial<TeacherProfile>
): Promise<void> {
  const school = getSavedSchoolProfile(customSchool);
  const teacher = getSavedTeacherProfile(customTeacher);
  const paragraphs: (Paragraph | Table)[] = [];

  // Kop Surat
  paragraphs.push(...createDocxLetterhead(school));

  // Judul
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 40 },
      children: [
        new TextRun({
          text: "PERANGKAT ADMINISTRASI TAHUNAN KURIKULUM MERDEKA",
          bold: true,
          size: 24,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: `MATA PELAJARAN: ${bundle.atp.subject.toUpperCase()}`,
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      border: {
        bottom: {
          color: "000000",
          space: 2,
          style: BorderStyle.SINGLE,
          size: 10,
        },
      },
      children: [
        new TextRun({
          text: `TAHUN PELAJARAN ${bundle.calendar.academic_year} — KELAS ${bundle.atp.grade} (FASE ${bundle.atp.phase})`,
          size: 18,
          font: "Arial",
        }),
      ],
    })
  );

  // I. RINCIAN PEKAN EFEKTIF (RPE)
  paragraphs.push(
    new Paragraph({
      spacing: { before: 140, after: 80 },
      children: [
        new TextRun({
          text: "I. RINCIAN PEKAN EFEKTIF (RPE)",
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    })
  );

  const rpeTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Komponen Perhitungan", bold: true, size: 19, font: "Arial" })] })],
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Semester Ganjil", bold: true, size: 19, font: "Arial" })] })],
          }),
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Semester Genap", bold: true, size: 19, font: "Arial" })] })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Jumlah Pekan Kalender", size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${bundle.calendar.semester_1.total_calendar_weeks} Pekan`, size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${bundle.calendar.semester_2.total_calendar_weeks} Pekan`, size: 18, font: "Arial" })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Pekan Tidak Efektif", size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${bundle.calendar.semester_1.ineffective_weeks} Pekan`, size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${bundle.calendar.semester_2.ineffective_weeks} Pekan`, size: 18, font: "Arial" })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Pekan Efektif KBM", bold: true, size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${bundle.calendar.semester_1.effective_weeks} Pekan`, bold: true, size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${bundle.calendar.semester_2.effective_weeks} Pekan`, bold: true, size: 18, font: "Arial" })] })] }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `Jam Efektif (@${bundle.calendar.jp_per_week} JP/Pekan)`, bold: true, size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${bundle.calendar.semester_1.effective_hours} JP`, bold: true, size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${bundle.calendar.semester_2.effective_hours} JP`, bold: true, size: 18, font: "Arial" })] })] }),
        ],
      }),
    ],
  });

  paragraphs.push(rpeTable);

  // II. ALUR TUJUAN PEMBELAJARAN (ATP)
  paragraphs.push(
    new Paragraph({
      pageBreakBefore: true,
      spacing: { before: 140, after: 60 },
      children: [
        new TextRun({
          text: "II. ALUR TUJUAN PEMBELAJARAN (ATP)",
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `Rasional Penyusunan: ${bundle.atp.rationale}`,
          italics: true,
          size: 19,
          font: "Arial",
        }),
      ],
    })
  );

  // Tabel Matriks ATP
  const atpHeader = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No", bold: true, size: 18, font: "Arial" })] })] }),
      new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Kode TP", bold: true, size: 18, font: "Arial" })] })] }),
      new TableCell({ width: { size: 18, type: WidthType.PERCENTAGE }, shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Elemen CP", bold: true, size: 18, font: "Arial" })] })] }),
      new TableCell({ width: { size: 36, type: WidthType.PERCENTAGE }, shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Pernyataan Tujuan Pembelajaran", bold: true, size: 18, font: "Arial" })] })] }),
      new TableCell({ width: { size: 16, type: WidthType.PERCENTAGE }, shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Materi Pokok", bold: true, size: 18, font: "Arial" })] })] }),
      new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "JP", bold: true, size: 18, font: "Arial" })] })] }),
      new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Smt", bold: true, size: 18, font: "Arial" })] })] }),
    ],
  });

  const atpRows = bundle.atp.tp_items.map(
    (tp, idx) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: tp.code, bold: true, size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: tp.element, size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: tp.statement, size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: tp.material_scope, size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(tp.allocated_jp), size: 18, font: "Arial" })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(tp.semester), size: 18, font: "Arial" })] })] }),
        ],
      })
  );

  paragraphs.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
      },
      rows: [atpHeader, ...atpRows],
    })
  );

  // III. PROGRAM TAHUNAN (PROTA)
  paragraphs.push(
    new Paragraph({
      pageBreakBefore: true,
      spacing: { before: 140, after: 80 },
      children: [
        new TextRun({
          text: "III. PROGRAM TAHUNAN (PROTA)",
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: "Semester 1 (Ganjil):",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  const prota1Rows = bundle.prota.semester_1_items.map(
    (item) =>
      new TableRow({
        children: [
          new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.no), size: 18, font: "Arial" })] })] }),
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.tp_code, bold: true, size: 18, font: "Arial" })] })] }),
          new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: item.material, size: 18, font: "Arial" })] })] }),
          new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${item.allocated_jp} JP`, size: 18, font: "Arial" })] })] }),
        ],
      })
  );

  paragraphs.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
      },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No", bold: true, size: 18, font: "Arial" })] })] }),
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Kode TP", bold: true, size: 18, font: "Arial" })] })] }),
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Materi Pokok", bold: true, size: 18, font: "Arial" })] })] }),
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Alokasi", bold: true, size: 18, font: "Arial" })] })] }),
          ],
        }),
        ...prota1Rows,
        new TableRow({
          children: [
            new TableCell({ columnSpan: 3, shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Total Alokasi Semester Ganjil:", bold: true, size: 18, font: "Arial" })] })] }),
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${bundle.prota.semester_1_total_jp} JP`, bold: true, size: 18, font: "Arial" })] })] }),
          ],
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 120, after: 40 },
      children: [
        new TextRun({
          text: "Semester 2 (Genap):",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  const prota2Rows = bundle.prota.semester_2_items.map(
    (item) =>
      new TableRow({
        children: [
          new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(item.no), size: 18, font: "Arial" })] })] }),
          new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.tp_code, bold: true, size: 18, font: "Arial" })] })] }),
          new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: item.material, size: 18, font: "Arial" })] })] }),
          new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${item.allocated_jp} JP`, size: 18, font: "Arial" })] })] }),
        ],
      })
  );

  paragraphs.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
      },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "No", bold: true, size: 18, font: "Arial" })] })] }),
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Kode TP", bold: true, size: 18, font: "Arial" })] })] }),
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Materi Pokok", bold: true, size: 18, font: "Arial" })] })] }),
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Alokasi", bold: true, size: 18, font: "Arial" })] })] }),
          ],
        }),
        ...prota2Rows,
        new TableRow({
          children: [
            new TableCell({ columnSpan: 3, shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Total Alokasi Semester Genap:", bold: true, size: 18, font: "Arial" })] })] }),
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${bundle.prota.semester_2_total_jp} JP`, bold: true, size: 18, font: "Arial" })] })] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ columnSpan: 3, shading: { fill: "E5E7EB", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "TOTAL ALOKASI TAHUNAN:", bold: true, size: 19, font: "Arial" })] })] }),
            new TableCell({ shading: { fill: "E5E7EB", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${bundle.prota.total_yearly_jp} JP`, bold: true, size: 19, font: "Arial" })] })] }),
          ],
        }),
      ],
    })
  );

  // Lembar Pengesahan Tripartit di Akhir
  paragraphs.push(
    ...createDocxEndorsementSheet({
      school,
      teacher,
      subject: bundle.atp.subject,
      grade: `Fase ${bundle.atp.phase} (Kelas ${bundle.atp.grade})`,
      academicYear: bundle.calendar.academic_year,
      semester: "Tahunan (Ganjil & Genap)",
      documentType: "PERANGKAT PEMBELAJARAN TAHUNAN",
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: MARGINS_KEDINASAN,
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(
    blob,
    `Perangkat_Tahunan_${bundle.atp.subject.replace(/[^a-zA-Z0-9_-]/g, "_")}_${bundle.calendar.academic_year.replace(/[^a-zA-Z0-9_-]/g, "_")}.docx`
  );
}

// 5. Ekspor LKPD Siswa ke DOCX
export async function exportLkpdToDocx(
  worksheet: StudentWorksheetLKPD,
  customSchool?: Partial<SchoolProfile>,
  customTeacher?: Partial<TeacherProfile>
): Promise<void> {
  const school = getSavedSchoolProfile(customSchool);
  const teacher = getSavedTeacherProfile(customTeacher);
  const paragraphs: (Paragraph | Table)[] = [];

  // Kop Surat
  paragraphs.push(...createDocxLetterhead(school));

  // Judul
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 40 },
      children: [
        new TextRun({
          text: "LEMBAR KERJA PESERTA DIDIK (LKPD)",
          bold: true,
          size: 26,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 30 },
      children: [
        new TextRun({
          text: worksheet.title.toUpperCase(),
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      border: {
        bottom: {
          color: "000000",
          space: 2,
          style: BorderStyle.SINGLE,
          size: 10,
        },
      },
      children: [
        new TextRun({
          text: `Mata Pelajaran: ${worksheet.subject} | Tingkat: Kelas ${worksheet.grade} | Semester: ${worksheet.semester}`,
          size: 18,
          font: "Arial",
        }),
      ],
    })
  );

  // Identitas Pengerjaan LKPD
  const identitasTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "9CA3AF" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "9CA3AF" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "9CA3AF" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "9CA3AF" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "E5E7EB" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `Tipe Aktivitas: ${worksheet.group_type} (Estimasi: ${worksheet.estimated_minutes} Menit)`, bold: true, size: 18, font: "Arial" }),
                ],
              }),
              new Paragraph({
                spacing: { before: 40 },
                children: [
                  new TextRun({ text: "Nama Kelompok / Siswa: ........................................................", size: 18, font: "Arial" }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Hari / Tanggal Praktik: .......................................................", size: 18, font: "Arial" }),
                ],
              }),
              new Paragraph({
                spacing: { before: 40 },
                children: [
                  new TextRun({ text: `Kelas / Ruang: ${worksheet.grade}`, bold: true, size: 18, font: "Arial" }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "Nama Anggota Kelompok:", bold: true, size: 18, font: "Arial" }),
                ],
              }),
              new Paragraph({
                spacing: { before: 30 },
                children: [
                  new TextRun({ text: "1. ............................................................................ (Ketua)       2. ............................................................................", size: 17, font: "Arial" }),
                ],
              }),
              new Paragraph({
                spacing: { before: 30 },
                children: [
                  new TextRun({ text: "3. ............................................................................              4. ............................................................................", size: 17, font: "Arial" }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  paragraphs.push(identitasTable);

  // A. Tujuan Pembelajaran
  paragraphs.push(
    new Paragraph({
      spacing: { before: 140, after: 40 },
      children: [
        new TextRun({
          text: "A. Tujuan Aktivitas Pembelajaran",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  worksheet.learning_objectives.forEach((obj, idx) => {
    paragraphs.push(
      new Paragraph({
        indent: { left: 360 },
        spacing: { after: 30 },
        children: [
          new TextRun({ text: `${idx + 1}. `, bold: true, size: 19, font: "Arial" }),
          new TextRun({ text: obj, size: 19, font: "Arial" }),
        ],
      })
    );
  });

  // B. Alat dan Bahan
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({
          text: "B. Alat dan Bahan",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  worksheet.materials_tools.forEach((item) => {
    paragraphs.push(
      new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: item, size: 19, font: "Arial" })],
      })
    );
  });

  // C. Prosedur Kerja
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({
          text: "C. Langkah Kerja / Prosedur Aktivitas",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  worksheet.activity_steps.forEach((step, idx) => {
    paragraphs.push(
      new Paragraph({
        indent: { left: 360 },
        spacing: { after: 30 },
        children: [
          new TextRun({ text: `${idx + 1}. `, bold: true, size: 19, font: "Arial" }),
          new TextRun({ text: step, size: 19, font: "Arial" }),
        ],
      })
    );
  });

  // D. Tabel Observasi
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 40 },
      children: [
        new TextRun({
          text: "D. Tabel Pengamatan & Pengumpulan Data",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  if (
    worksheet.data_observation_table &&
    worksheet.data_observation_table.headers &&
    worksheet.data_observation_table.headers.length > 0
  ) {
    const obsHeaders = worksheet.data_observation_table.headers;
    const obsRows = worksheet.data_observation_table.rows || [];

    const obsTableRows = [
      new TableRow({
        tableHeader: true,
        children: obsHeaders.map(
          (h) =>
            new TableCell({
              shading: { fill: "F3F4F6", type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: h, bold: true, size: 18, font: "Arial" })],
                }),
              ],
            })
        ),
      }),
      ...obsRows.map(
        (r) =>
          new TableRow({
            children: r.map(
              (cell) =>
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: cell, size: 18, font: "Arial" })],
                    }),
                  ],
                })
            ),
          })
      ),
    ];

    paragraphs.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
          left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
          right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
          insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        },
        rows: obsTableRows,
      })
    );
  }

  // E. Pertanyaan Analisis
  paragraphs.push(
    new Paragraph({
      spacing: { before: 120, after: 40 },
      children: [
        new TextRun({
          text: "E. Pertanyaan Analisis & Diskusi Kelompok",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  worksheet.analysis_questions.forEach((q, idx) => {
    paragraphs.push(
      new Paragraph({
        indent: { left: 360 },
        spacing: { before: 40, after: 20 },
        children: [
          new TextRun({ text: `${idx + 1}. `, bold: true, size: 19, font: "Arial" }),
          new TextRun({ text: q, size: 19, font: "Arial" }),
        ],
      }),
      new Paragraph({
        indent: { left: 540 },
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: "Jawaban: ................................................................................................................................................................................\n................................................................................................................................................................................................",
            color: "666666",
            size: 17,
            font: "Arial",
          }),
        ],
      })
    );
  });

  // F. Kesimpulan
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({
          text: "F. Kesimpulan",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      indent: { left: 360 },
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: "Berdasarkan hasil eksperimen dan pengamatan di atas, dapat disimpulkan bahwa:\n................................................................................................................................................................................................\n................................................................................................................................................................................................",
          color: "666666",
          size: 18,
          font: "Arial",
        }),
      ],
    })
  );

  // G. Rubrik Penilaian
  paragraphs.push(
    new Paragraph({
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({
          text: "G. Rubrik Penilaian Asesmen LKPD",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  const rubricRows = worksheet.rubric_scoring.map(
    (r) =>
      new TableRow({
        children: [
          new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: r.aspect, bold: true, size: 18, font: "Arial" })] })] }),
          new TableCell({ width: { size: 55, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: r.criteria, size: 18, font: "Arial" })] })] }),
          new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(r.max_score), bold: true, size: 18, font: "Arial" })] })] }),
        ],
      })
  );

  paragraphs.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
      },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Aspek Penilaian", bold: true, size: 18, font: "Arial" })] })] }),
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Kriteria Indikator", bold: true, size: 18, font: "Arial" })] })] }),
            new TableCell({ shading: { fill: "F3F4F6", type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Skor Maks", bold: true, size: 18, font: "Arial" })] })] }),
          ],
        }),
        ...rubricRows,
      ],
    })
  );

  // Tanda Tangan
  const signatureTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 200 },
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Guru Pengampu Mata Pelajaran,", bold: true, size: 19, font: "Arial" })],
              }),
              new Paragraph({
                spacing: { before: 800 },
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: teacher.teacher_name || "Arfian Cahya, S.Pd.", bold: true, underline: {}, size: 19, font: "Arial" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: `NIP. ${teacher.teacher_nip || "-"}`, size: 18, font: "Arial" })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 200 },
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Ketua Kelompok / Peserta Didik,", bold: true, size: 19, font: "Arial" })],
              }),
              new Paragraph({
                spacing: { before: 800 },
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "....................................................", bold: true, size: 19, font: "Arial" })],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "NISN / No. Absen: ........................", size: 18, font: "Arial" })],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  paragraphs.push(signatureTable);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: MARGINS_KEDINASAN,
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(
    blob,
    `LKPD_${worksheet.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.docx`
  );
}


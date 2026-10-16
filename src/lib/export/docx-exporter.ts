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
  Footer,
  PageNumber,
  convertInchesToTwip,
} from "docx";
import { QuestionPackage, KisiKisiItem, TeachingModule } from "@/types";

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

// 3. Ekspor Modul Ajar BKPDM Kemendikdasmen ke DOCX
export async function exportModulAjarToDocx(module: TeachingModule): Promise<void> {
  const paragraphs: Paragraph[] = [];

  // Judul
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "MODUL AJAR KURIKULUM NASIONAL BKPDM",
          bold: true,
          size: 28,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: module.title,
          bold: true,
          size: 24,
          font: "Arial",
        }),
      ],
    })
  );

  // Bagian I: Informasi Umum
  paragraphs.push(
    new Paragraph({
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({
          text: "I. INFORMASI UMUM",
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Mata Pelajaran: ${module.subject}   |   Fase / Kelas: ${module.phase} / ${module.grade}`,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Alokasi Waktu: ${module.duration_jp} JP (${module.total_meetings} Pertemuan)   |   Model: ${module.learning_model}`,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Dimensi Profil Pelajar Pancasila: ${module.pancasila_dimensions.join(", ")}`,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `Kompetensi Awal: ${module.initial_competency}`,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  // Bagian II: Komponen Inti
  paragraphs.push(
    new Paragraph({
      spacing: { before: 160, after: 80 },
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
      children: [
        new TextRun({
          text: `Pemahaman Bermakna: ${module.meaningful_understanding}`,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );

  // Pertanyaan Pemantik
  paragraphs.push(
    new Paragraph({
      spacing: { before: 60, after: 40 },
      children: [
        new TextRun({
          text: "Pertanyaan Pemantik:",
          bold: true,
          size: 20,
          font: "Arial",
        }),
      ],
    })
  );
  module.trigger_questions.forEach((q, idx) => {
    paragraphs.push(
      new Paragraph({
        indent: { left: 300 },
        children: [
          new TextRun({
            text: `${idx + 1}. ${q}`,
            size: 20,
            font: "Arial",
          }),
        ],
      })
    );
  });

  // Kegiatan Pembelajaran
  paragraphs.push(
    new Paragraph({
      spacing: { before: 140, after: 60 },
      children: [
        new TextRun({
          text: "Kegiatan Pembelajaran (Diferensiasi Konten, Proses, dan Produk):",
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
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({
            text: `Pertemuan Ke-${meet.meeting_number} (${meet.duration_minutes} Menit):`,
            bold: true,
            size: 20,
            color: "1D4ED8",
            font: "Arial",
          }),
        ],
      })
    );

    // Langkah Sintaks Inti
    meet.core_activities.syntax_steps.forEach((step, sIdx) => {
      paragraphs.push(
        new Paragraph({
          indent: { left: 300 },
          children: [
            new TextRun({
              text: `Langkah ${sIdx + 1}: ${step}`,
              size: 20,
              font: "Arial",
            }),
          ],
        })
      );
    });
  });

  // Bagian III: Asesmen
  paragraphs.push(
    new Paragraph({
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({
          text: "III. ASESMEN & EVALUASI",
          bold: true,
          size: 22,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Asesmen Diagnostik: ${module.assessments.diagnostic}`,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Asesmen Formatif: ${module.assessments.formative}`,
          size: 20,
          font: "Arial",
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Asesmen Sumatif: ${module.assessments.summative}`,
          size: 20,
          font: "Arial",
        }),
      ],
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

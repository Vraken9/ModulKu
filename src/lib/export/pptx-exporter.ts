import PptxGenJS from "pptxgenjs";
import { PresentationBundle, SlideItem } from "@/types";

interface PaletteColor {
  bg: string;
  primary: string;
  accent: string;
  textDark: string;
  cardBg: string;
  border: string;
}

const PALETTES: Record<string, PaletteColor> = {
  navy_enterprise: {
    bg: "F8FAFC",
    primary: "0F172A",
    accent: "1D4ED8",
    textDark: "1E293B",
    cardBg: "FFFFFF",
    border: "CBD5E1",
  },
  emerald_nature: {
    bg: "F0FDF4",
    primary: "064E3B",
    accent: "059669",
    textDark: "1E293B",
    cardBg: "FFFFFF",
    border: "A7F3D0",
  },
  slate_academic: {
    bg: "F1F5F9",
    primary: "1E293B",
    accent: "334155",
    textDark: "0F172A",
    cardBg: "FFFFFF",
    border: "CBD5E1",
  },
  indigo_tech: {
    bg: "EEF2FF",
    primary: "312E81",
    accent: "4F46E5",
    textDark: "1E1B4B",
    cardBg: "FFFFFF",
    border: "C7D2FE",
  },
};

export async function exportPresentationToPptx(
  bundle: PresentationBundle
): Promise<void> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "ModulKu Engine";
  pptx.company = "Standar BKPDM Kemendikdasmen";
  pptx.title = bundle.topic;
  pptx.subject = bundle.subject;

  const palette = PALETTES[bundle.theme_palette] || PALETTES.navy_enterprise;

  bundle.slides.forEach((slideData: SlideItem, index: number) => {
    const slide = pptx.addSlide();

    // Notes pembicara
    if (slideData.speaker_notes) {
      slide.addNotes(slideData.speaker_notes);
    }

    if (slideData.category === "judul" || index === 0) {
      // SLIDE COVER / JUDUL
      slide.background = { color: palette.primary };

      // Header Top Tag
      slide.addText("DEEP LEARNING STANDAR BKPDM - BAHAN TAYANG PEMBELAJARAN", {
        x: 0.8,
        y: 1.0,
        w: 11.7,
        h: 0.4,
        fontSize: 12,
        bold: true,
        color: palette.accent === "1D4ED8" ? "93C5FD" : "A7F3D0",
        fontFace: "Calibri",
      });

      // Judul Utama
      slide.addText(slideData.title, {
        x: 0.8,
        y: 1.6,
        w: 11.7,
        h: 1.8,
        fontSize: 32,
        bold: true,
        color: "FFFFFF",
        fontFace: "Calibri",
        valign: "top",
      });

      // Subtitle atau Topik
      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: 0.8,
          y: 3.6,
          w: 11.7,
          h: 0.8,
          fontSize: 16,
          color: "E2E8F0",
          fontFace: "Calibri",
        });
      }

      // Metadata Footer Box
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: 5.4,
        w: 11.7,
        h: 1.0,
        fill: { color: "1E293B" },
        line: { color: "334155", width: 1 },
      });

      slide.addText(
        `Mata Pelajaran: ${bundle.subject}   |   Sasaran: Kelas ${bundle.grade}   |   Estimasi: ${bundle.target_duration_minutes} Menit`,
        {
          x: 1.0,
          y: 5.65,
          w: 11.3,
          h: 0.5,
          fontSize: 13,
          bold: true,
          color: "FFFFFF",
          fontFace: "Calibri",
        }
      );
    } else {
      // SLIDE KONTEN
      slide.background = { color: palette.bg };

      // Top Banner Container
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: 0.6,
        w: 11.7,
        h: 1.0,
        fill: { color: palette.cardBg },
        line: { color: palette.border, width: 1 },
      });

      // Category Tag
      const categoryLabel = slideData.category.replace("_", " ").toUpperCase();
      slide.addText(categoryLabel, {
        x: 1.0,
        y: 0.7,
        w: 4.0,
        h: 0.3,
        fontSize: 10,
        bold: true,
        color: palette.accent,
        fontFace: "Calibri",
      });

      // Slide Title
      slide.addText(slideData.title, {
        x: 1.0,
        y: 1.0,
        w: 10.0,
        h: 0.5,
        fontSize: 18,
        bold: true,
        color: palette.primary,
        fontFace: "Calibri",
      });

      // Main Content Box
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.8,
        y: 1.8,
        w: 11.7,
        h: 3.8,
        fill: { color: palette.cardBg },
        line: { color: palette.border, width: 1 },
      });

      // Bullet Points
      const bulletItems = slideData.bullet_points.map((pt) => ({
        text: pt,
        options: {
          fontSize: 14,
          color: palette.textDark,
          bullet: true,
          fontFace: "Calibri",
          paraSpaceAfter: 10,
        },
      }));

      slide.addText(bulletItems, {
        x: 1.1,
        y: 2.1,
        w: 11.1,
        h: 3.2,
        valign: "top",
      });

      // Key Takeaway / Highlight Box di Bagian Bawah
      if (slideData.key_takeaway || slideData.interactive_question) {
        slide.addShape(pptx.ShapeType.rect, {
          x: 0.8,
          y: 5.8,
          w: 11.7,
          h: 1.0,
          fill: { color: palette.primary },
        });

        const bottomText =
          slideData.interactive_question
            ? `Pertanyaan Interaktif: ${slideData.interactive_question}`
            : `Poin Kunci: ${slideData.key_takeaway}`;

        slide.addText(bottomText, {
          x: 1.1,
          y: 6.0,
          w: 11.1,
          h: 0.6,
          fontSize: 12,
          bold: true,
          color: "FFFFFF",
          fontFace: "Calibri",
        });
      }

      // Footer Slide Number
      slide.addText(
        `${bundle.subject} - Kelas ${bundle.grade}  |  Slide ${slideData.slide_number} / ${bundle.slides.length}`,
        {
          x: 0.8,
          y: 6.9,
          w: 11.7,
          h: 0.3,
          fontSize: 9,
          color: "64748B",
          fontFace: "Calibri",
          align: "right",
        }
      );
    }
  });

  const safeFilename = `${bundle.topic
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 40)}_Bahan_Tayang.pptx`;

  await pptx.writeFile({ fileName: safeFilename });
}

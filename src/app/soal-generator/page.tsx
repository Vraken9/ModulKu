"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileCheck2,
  Sparkles,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Edit3,
  Sliders,
  BookOpen,
  FolderArchive,
  UploadCloud,
  FileUp,
  FileText,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MathRenderer } from "@/components/ui/math-renderer";
import { KisiKisiTable } from "@/components/evaluasi/KisiKisiTable";
import { QuestionItemCard } from "@/components/evaluasi/QuestionItemCard";
import { ScoringRubricView } from "@/components/evaluasi/ScoringRubricView";
import { exportQuestionsToDocx } from "@/lib/export/docx-exporter";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { saveDocumentToVault, formatBytes } from "@/lib/document-vault";
import { QuestionPackage, QuestionItem, SchoolProfile, TeacherProfile } from "@/types";
import { useNotification } from "@/components/providers/NotificationProvider";
import { getSchoolProfile, getTeacherProfile } from "@/lib/user-profile";

export default function SoalGeneratorPage() {
  const { toast } = useNotification();
  const [isSavedToVault, setIsSavedToVault] = useState(false);
  const [resultTab, setResultTab] = useState<"soal" | "kisi-kisi" | "kartu-soal" | "rubrik">("soal");
  // Master Profile dari localStorage
  const [school, setSchool] = useState<Partial<SchoolProfile>>({
    school_name: "SMAN 1 Purwantoro",
  });
  const [teacher, setTeacher] = useState<Partial<TeacherProfile>>({
    teacher_name: "Arfian Cahya, S.Pd.",
  });

  useEffect(() => {
    try {
      setSchool(getSchoolProfile());
      setTeacher(getTeacherProfile());
    } catch {
      // Abaikan di server
    }
  }, []);

  // Form State
  const [subject, setSubject] = useState("Fisika");
  const [educationLevel, setEducationLevel] = useState<"SD" | "SMP" | "SMA" | "SMK">("SMA");
  const [grade, setGrade] = useState("Kelas X");
  const [phase, setPhase] = useState<"A" | "B" | "C" | "D" | "E" | "F">("E");
  const [semester, setSemester] = useState<"Ganjil" | "Genap">("Ganjil");
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [sourceType, setSourceType] = useState<"text" | "pdf">("text");
  const [pdfFile, setPdfFile] = useState<{
    name: string;
    size: number;
    snippet: string;
    extractedLinesCount: number;
  } | null>(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [chapter, setChapter] = useState("Gerak dan Gaya (Kinematika & Dinamika Newton)");
  const [learningObjectives, setLearningObjectives] = useState(
    "Peserta didik mampu menganalisis konsep gerak lurus (GLB dan GLBB), gaya, serta hukum Newton dan menerapkannya dalam memecahkan masalah kontekstual."
  );

  const [questionType, setQuestionType] = useState<
    "Pilihan Ganda" | "Pilihan Ganda Kompleks" | "Menjodohkan" | "Isian Singkat" | "Uraian" | "Campuran"
  >("Pilihan Ganda");
  const [optionsCount, setOptionsCount] = useState<number>(4);
  const [totalQuestions, setTotalQuestions] = useState<number>(25);
  const [stimulusType, setStimulusType] = useState<"langsung" | "kutipan" | "teks_utuh" | "variatif">("variatif");

  // Distribusi Kesulitan (Total 100%)
  const [difficulty, setDifficulty] = useState({ mudah: 30, sedang: 50, sulit: 20 });
  // Distribusi Kognitif (Total 100%)
  const [cognitive, setCognitive] = useState({ lots: 30, mots: 40, hots: 30 });
  // Distribusi Taksonomi Bloom (Total 100%)
  const [bloomMode, setBloomMode] = useState<"otomatis" | "manual">("otomatis");
  const [bloom, setBloom] = useState({ c1: 15, c2: 15, c3: 40, c4: 10, c5: 10, c6: 10 });

  // Status Generasi & Hasil
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPackage, setGeneratedPackage] = useState<QuestionPackage | null>(null);
  const [showAnswers, setShowAnswers] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Handler Unggah Berkas Dokumen / PDF Rujukan dengan Validasi Keamanan Ketat
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validasi Ukuran Berkas (Maksimal 5 MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Ukuran berkas melebihi batas maksimal 5 MB. Silakan unggah dokumen yang lebih ringkas.");
      e.target.value = "";
      return;
    }

    // 2. Validasi Ekstensi dan Tipe Berkas
    const allowedExtensions = [".pdf", ".txt", ".docx"];
    const fileNameLower = file.name.toLowerCase();
    const isExtensionValid = allowedExtensions.some((ext) => fileNameLower.endsWith(ext));
    const isMimeValid =
      file.type === "application/pdf" ||
      file.type === "text/plain" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "";

    if (!isExtensionValid && !isMimeValid) {
      toast.error("Format berkas tidak didukung. Harap unggah dokumen berformat PDF, TXT, atau DOCX.");
      e.target.value = "";
      return;
    }

    setIsExtractingPdf(true);
    setFormError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = (event.target?.result as string) || "";

        // 3. Sanitasi Konten Teks (Keamanan terhadap Script Injection & Prompt Injection)
        const sanitizedText = text
          .replace(/\0/g, "")
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<[^>]*>/g, " ")
          .replace(/[^\x20-\x7E\n\r\t]/g, " ")
          .replace(/\b(ignore previous instructions|lupakan perintah sebelumnya|system prompt)\b/gi, "[konten disaring]")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 3000);

        const safeSnippetText =
          sanitizedText.slice(0, 800) ||
          `Materi dan capaian pembelajaran diekstrak dari dokumen rujukan terlampir.`;

        // 4. Sanitasi Nama Berkas
        const safeFileName = file.name
          .replace(/[/\\?%*:|"<>]/g, "_")
          .replace(/\.\.+/g, ".")
          .trim()
          .slice(0, 80);

        setPdfFile({
          name: safeFileName,
          size: file.size,
          snippet: safeSnippetText,
          extractedLinesCount: Math.max(1, Math.round(file.size / 1024)),
        });

        // Auto-update judul bab dan TP/CP dengan nama bersih
        const cleanName = safeFileName
          .replace(/\.[^/.]+$/, "")
          .replace(/[_-]/g, " ")
          .trim();

        setChapter(`Materi Rujukan: ${cleanName}`);
        setLearningObjectives(
          `Peserta didik mampu menelaah konsep pokok materi ${cleanName} sesuai acuan berkas rujukan dan memecahkan permasalahan kontekstual.`
        );
        toast.success(`Dokumen "${safeFileName}" berhasil dipindai dan diverifikasi keamanannya.`, "Dokumen Valid");
      } catch {
        toast.error("Gagal membaca berkas rujukan. Pastikan berkas tidak rusak atau terenkripsi sandi.");
      } finally {
        setIsExtractingPdf(false);
      }
    };

    reader.onerror = () => {
      setIsExtractingPdf(false);
      toast.error("Terjadi kesalahan saat memproses berkas dokumen rujukan.");
    };

    reader.readAsText(file.slice(0, 50000));
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
  };

  // Sinkronkan fase otomatis saat jenjang berubah
  const handleEducationLevelChange = (level: "SD" | "SMP" | "SMA" | "SMK") => {
    setEducationLevel(level);
    if (level === "SD") {
      setGrade("Kelas IV");
      setPhase("B");
      setOptionsCount(3);
    } else if (level === "SMP") {
      setGrade("Kelas VII");
      setPhase("D");
      setOptionsCount(4);
    } else {
      setGrade("Kelas X");
      setPhase("E");
      setOptionsCount(4);
    }
  };

  // Sinkronkan Bloom saat cognitive distribution berubah (Mode Otomatis)
  useEffect(() => {
    if (bloomMode === "otomatis") {
      const halfLots = Math.round(cognitive.lots / 2);
      const halfHots = Math.round(cognitive.hots / 3);
      setBloom({
        c1: halfLots,
        c2: cognitive.lots - halfLots,
        c3: cognitive.mots,
        c4: halfHots,
        c5: halfHots,
        c6: cognitive.hots - halfHots * 2,
      });
    }
  }, [cognitive, bloomMode]);

  const handleGenerate = async () => {
    setFormError(null);

    // Validasi sumber PDF
    if (sourceType === "pdf" && !pdfFile) {
      setFormError("Silakan pilih dan unggah berkas PDF rujukan terlebih dahulu.");
      return;
    }

    // Validasi jumlah 100%
    const diffSum = difficulty.mudah + difficulty.sedang + difficulty.sulit;
    if (diffSum !== 100) {
      setFormError(`Total persentase tingkat kesulitan harus 100% (Saat ini: ${diffSum}%)`);
      return;
    }

    const cogSum = cognitive.lots + cognitive.mots + cognitive.hots;
    if (cogSum !== 100) {
      setFormError(`Total persentase kognitif harus 100% (Saat ini: ${cogSum}%)`);
      return;
    }

    const bloomSum = bloom.c1 + bloom.c2 + bloom.c3 + bloom.c4 + bloom.c5 + bloom.c6;
    if (bloomSum !== 100) {
      setFormError(`Total persentase Taksonomi Bloom harus 100% (Saat ini: ${bloomSum}%)`);
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        subject,
        education_level: educationLevel,
        grade,
        phase,
        semester,
        academic_year: academicYear,
        curriculum: "Kurikulum Merdeka",
        source_type: sourceType,
        pdf_filename: sourceType === "pdf" ? pdfFile?.name : undefined,
        pdf_snippet: sourceType === "pdf" ? pdfFile?.snippet : undefined,
        chapter_or_material: chapter,
        learning_objectives: learningObjectives,
        question_type: questionType,
        options_count: optionsCount,
        total_questions: totalQuestions,
        stimulus_type: stimulusType,
        difficulty_distribution: difficulty,
        cognitive_distribution: cognitive,
        bloom_mode: bloomMode,
        bloom_distribution: bloom,
      };

      const res = await fetch("/api/ai/generate-soal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal memproses pembuatan paket soal");
      }

      setGeneratedPackage(json.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setFormError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionEdit = (index: number, updated: QuestionItem) => {
    if (!generatedPackage || !generatedPackage.questions) return;
    const newQuestions = [...generatedPackage.questions];
    newQuestions[index] = updated;
    setGeneratedPackage({ ...generatedPackage, questions: newQuestions });
    setEditingIndex(null);
  };

  const handleSaveToVault = () => {
    if (!generatedPackage) return;
    const res = saveDocumentToVault({
      title: generatedPackage.title,
      docType: "soal",
      subject: generatedPackage.subject,
      grade: generatedPackage.grade,
      academicYear: generatedPackage.academic_year,
      semester: generatedPackage.semester,
      fileFormat: "DOCX",
      fileSizeBytes: 340 * 1024,
      isPmmEvidence: true,
      tags: ["Taksonomi Bloom", "Kisi-Kisi Asesmen", "KKTP"],
      notes: `${generatedPackage.total_questions} butir soal HOTS/AKM lengkap dengan Matriks Kisi-Kisi dan rubrik penskoran.`,
      contentData: generatedPackage,
    });

    if (res.success) {
      setIsSavedToVault(true);
      toast.success(
        "Paket Soal & Kisi-Kisi berhasil disimpan ke Bank Dokumen Anda!",
        "Berhasil Disimpan"
      );
    } else {
      toast.error(res.error || "Gagal menyimpan ke Bank Dokumen.");
    }
  };

  return (
    <DashboardShell activeItem="soal-generator">
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Breadcrumb & Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-slate-700 font-medium">Perangkat Ajar</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">Soal Generator</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <FileCheck2 className="w-6 h-6 text-slate-900" />
              <span>Generator Soal & Evaluasi Kurikulum Merdeka</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Penyusunan paket soal terstruktur AKM, Taksonomi Bloom (C1-C6), kisi-kisi, dan pedoman penskoran otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/profil-sekolah">
              <Button variant="outline" size="sm" className="text-xs font-semibold text-slate-800 border-slate-300 hover:bg-slate-100 bg-white">
                Profil: {teacher.teacher_name}
              </Button>
            </Link>
          </div>
        </div>
        {formError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* JIKA BELUM ADA HASIL: TAMPILKAN FORMULIR KONFIGURASI DENGAN PRESET PINTAR */}
        {!generatedPackage ? (
          <div className="space-y-6">
            {/* Banner Pengantar Slate Bersih */}
            <div className="rounded-2xl bg-white border border-slate-200 text-slate-900 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                  <span>Evaluasi & Asesmen Standar BKPDM No. 020/2026</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">
                  Susun Paket Asesmen dengan Kontrol Kognitif Terstandarisasi
                </h2>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Soal disusun secara terukur dengan kontrol Taksonomi Bloom (C1-C6), komposisi LOTS/MOTS/HOTS, serta formula sains/matematika yang dapat diedit langsung sebelum diekspor ke Word .DOCX.
                </p>
              </div>
              <div className="text-right text-xs text-slate-600 font-mono bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
                <p className="font-bold text-slate-900">{teacher.teacher_name}</p>
                <p>{school.school_name}</p>
              </div>
            </div>

            {/* Smart Preset Selector untuk Menghindari Beban Kognitif Guru */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider">
                  PRESET CEPAT 1-KLIK (HEMAT WAKTU GURU)
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Pilih skenario asesmen untuk konfigurasi otomatis
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTotalQuestions(10);
                    setQuestionType("Pilihan Ganda");
                    setStimulusType("langsung");
                    setDifficulty({ mudah: 40, sedang: 50, sulit: 10 });
                    setCognitive({ lots: 50, mots: 40, hots: 10 });
                  }}
                  className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-900 hover:shadow-xs transition-all text-left cursor-pointer group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-slate-950">
                    Asesmen Harian Ringkas
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    10 butir, dominan LOTS/MOTS, stimulus langsung.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTotalQuestions(25);
                    setQuestionType("Pilihan Ganda");
                    setStimulusType("variatif");
                    setDifficulty({ mudah: 30, sedang: 50, sulit: 20 });
                    setCognitive({ lots: 30, mots: 40, hots: 30 });
                  }}
                  className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-900 hover:shadow-xs transition-all text-left cursor-pointer group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-slate-950">
                    Penilaian Tengah Semester (PTS)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    25 butir, HOTS 30%, stimulus variatif studi kasus.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTotalQuestions(40);
                    setQuestionType("Campuran");
                    setStimulusType("kutipan");
                    setDifficulty({ mudah: 20, sedang: 50, sulit: 30 });
                    setCognitive({ lots: 20, mots: 40, hots: 40 });
                  }}
                  className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-900 hover:shadow-xs transition-all text-left cursor-pointer group"
                >
                  <p className="text-xs font-bold text-slate-900 group-hover:text-slate-950">
                    Simulasi AKM & Asesmen Akhir
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    40 butir, stimulus literasi/numerasi, HOTS 40%.
                  </p>
                </button>
              </div>
            </div>

            {/* Bagian 1: Konteks Pembelajaran */}
            <Card className="shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm uppercase tracking-wider text-slate-500 font-bold">
                  1. Konteks Pembelajaran
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="subject">Mata Pelajaran</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Contoh: Fisika, Matematika"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="educationLevel">Jenjang Pendidikan</Label>
                  <select
                    id="educationLevel"
                    value={educationLevel}
                    onChange={(e) =>
                      handleEducationLevelChange(e.target.value as "SD" | "SMP" | "SMA" | "SMK")
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="SD">SD / MI</option>
                    <option value="SMP">SMP / MTs</option>
                    <option value="SMA">SMA / MA</option>
                    <option value="SMK">SMK</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="grade">Kelas / Kelompok</Label>
                  <Input
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="Contoh: Kelas X"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phase">Fase Kurikulum</Label>
                  <select
                    id="phase"
                    value={phase}
                    onChange={(e) => setPhase(e.target.value as "A" | "B" | "C" | "D" | "E" | "F")}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="A">Fase A (Kelas 1-2)</option>
                    <option value="B">Fase B (Kelas 3-4)</option>
                    <option value="C">Fase C (Kelas 5-6)</option>
                    <option value="D">Fase D (Kelas 7-9)</option>
                    <option value="E">Fase E (Kelas 10)</option>
                    <option value="F">Fase F (Kelas 11-12)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="semester">Semester</Label>
                  <select
                    id="semester"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as "Ganjil" | "Genap")}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="academicYear">Tahun Ajaran</Label>
                  <Input
                    id="academicYear"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="2026/2027"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="curriculum">Kurikulum</Label>
                  <Input id="curriculum" value="Kurikulum Merdeka" readOnly className="bg-slate-100" />
                </div>
              </CardContent>
            </Card>

            {/* Bagian 2: Sumber Materi & Capaian */}
            <Card className="shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm uppercase tracking-wider text-slate-500 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span>2. Sumber Materi & Capaian Pembelajaran</span>
                  <div className="flex items-center gap-2 text-xs font-normal">
                    <button
                      type="button"
                      onClick={() => setSourceType("text")}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        sourceType === "text"
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs font-bold"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      Tulis Materi Manual
                    </button>
                    <button
                      type="button"
                      onClick={() => setSourceType("pdf")}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        sourceType === "pdf"
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs font-bold"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Unggah PDF Rujukan</span>
                    </button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {/* Mode Unggah PDF Rujukan */}
                {sourceType === "pdf" && (
                  <div className="space-y-3 pb-2">
                    {!pdfFile ? (
                      <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-slate-400 bg-slate-50/60 transition-all flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200 shadow-xs">
                          <UploadCloud className="w-6 h-6 text-slate-700" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-900">
                            Pilih atau Seret Berkas Dokumen PDF Rujukan
                          </p>
                          <p className="text-xs text-slate-500 max-w-md">
                            Mendukung modul ajar, buku teks, atau silabus (.PDF, .TXT, .DOCX). AI akan menganalisis intisari materi dan memetakan capaian pembelajaran secara presisi.
                          </p>
                        </div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept=".pdf,.txt,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <span className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 shadow-xs transition-all">
                            <FileUp className="w-4 h-4 text-slate-700" />
                            <span>{isExtractingPdf ? "Mengekstrak Teks Dokumen..." : "Pilih Berkas PDF Rujukan"}</span>
                          </span>
                        </label>
                      </div>
                    ) : (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                              <FileText className="w-5 h-5 text-emerald-700" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-900 truncate max-w-sm sm:max-w-md">
                                  {pdfFile.name}
                                </h4>
                                <Badge variant="outline" className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-300 font-mono font-bold">
                                  {formatBytes(pdfFile.size)}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Ekstraksi Rujukan Berhasil. Data telah disinkronkan ke perumusan soal.</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept=".pdf,.txt,.docx"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                              <span className="inline-flex items-center h-8 px-2.5 rounded-lg text-xs font-semibold text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 transition-all">
                                Ganti
                              </span>
                            </label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleRemovePdf}
                              className="h-8 w-8 p-0 text-slate-500 hover:text-red-700 hover:bg-red-50"
                              title="Hapus berkas"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>

                        {pdfFile.snippet && (
                          <div className="text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-emerald-100 font-mono leading-relaxed line-clamp-3">
                            <span className="font-bold text-slate-800 block mb-1">Intisari Konten Dokumen:</span>
                            {pdfFile.snippet}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="chapter">Bab atau Materi Pokok</Label>
                  <Textarea
                    id="chapter"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    rows={2}
                    placeholder="Tuliskan bab atau lingkup materi spesifik yang akan dijadikan soal."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="learningObjectives">Tujuan atau Capaian Pembelajaran (TP/CP)</Label>
                  <Textarea
                    id="learningObjectives"
                    value={learningObjectives}
                    onChange={(e) => setLearningObjectives(e.target.value)}
                    rows={2}
                    placeholder="Contoh: Peserta didik mampu menganalisis konsep dan menerapkan perhitungan dalam fenomena gerak."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bagian 3: Bentuk & Penyajian Soal */}
            <Card className="shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm uppercase tracking-wider text-slate-500 font-bold">
                  3. Bentuk dan Distribusi Soal
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="questionType">Jenis Soal</Label>
                    <select
                      id="questionType"
                      value={questionType}
                      onChange={(e) =>
                        setQuestionType(
                          e.target.value as
                            | "Pilihan Ganda"
                            | "Pilihan Ganda Kompleks"
                            | "Menjodohkan"
                            | "Isian Singkat"
                            | "Uraian"
                            | "Campuran"
                        )
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="Pilihan Ganda">Pilihan Ganda</option>
                      <option value="Pilihan Ganda Kompleks">Pilihan Ganda Kompleks</option>
                      <option value="Menjodohkan">Menjodohkan</option>
                      <option value="Isian Singkat">Isian Singkat</option>
                      <option value="Uraian">Uraian / Esai</option>
                      <option value="Campuran">Campuran (PG + Uraian)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="optionsCount">Jumlah Opsi Jawaban</Label>
                    <select
                      id="optionsCount"
                      value={optionsCount}
                      onChange={(e) => setOptionsCount(Number(e.target.value))}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    >
                      <option value={3}>3 (A-C) untuk SD Awal</option>
                      <option value={4}>4 (A-D) untuk SD Akhir & SMP</option>
                      <option value={5}>5 (A-E) untuk SMA / SMK</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="totalQuestions">Jumlah Butir Soal</Label>
                    <Input
                      id="totalQuestions"
                      type="number"
                      min={1}
                      max={50}
                      value={totalQuestions}
                      onChange={(e) => setTotalQuestions(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Tipe Penyajian Stimulus */}
                <div className="space-y-2">
                  <Label>Penyajian Soal (Basis Stimulus)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      {
                        id: "langsung",
                        title: "Pertanyaan Langsung",
                        desc: "Ringkas dan mandiri tanpa stimulus panjang.",
                      },
                      {
                        id: "kutipan",
                        title: "Analisis Kutipan",
                        desc: "Kutipan atau paragraf pendek untuk dianalisis.",
                      },
                      {
                        id: "teks_utuh",
                        title: "Analisis Teks Utuh",
                        desc: "Teks narasi literasi sesuai jenjang peserta didik.",
                      },
                      {
                        id: "variatif",
                        title: "Variatif / Campuran",
                        desc: "Kombinasi stimulus teks, data grafik, dan kasus nyata.",
                      },
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() =>
                          setStimulusType(item.id as "langsung" | "kutipan" | "teks_utuh" | "variatif")
                        }
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          stimulusType === item.id
                            ? "border-slate-900 bg-slate-100 shadow-xs"
                            : "border-slate-200 bg-white hover:bg-slate-50/80 text-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900">{item.title}</p>
                          {stimulusType === item.id && (
                            <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] mt-1 leading-normal text-slate-600">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bagian 4: Pengaturan Kognitif & Taksonomi Bloom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Komposisi Kesulitan */}
              <Card className="shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-800">
                      Komposisi Tingkat Kesulitan
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Atur proporsi tingkat kesulitan (Total 100%)
                    </CardDescription>
                  </div>
                  <div
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                      difficulty.mudah + difficulty.sedang + difficulty.sulit === 100
                        ? "bg-slate-100 text-slate-700 border-slate-300"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {difficulty.mudah + difficulty.sedang + difficulty.sulit}%
                  </div>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px]">Mudah (%)</Label>
                    <Input
                      type="number"
                      value={difficulty.mudah}
                      onChange={(e) => setDifficulty({ ...difficulty, mudah: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Sedang (%)</Label>
                    <Input
                      type="number"
                      value={difficulty.sedang}
                      onChange={(e) => setDifficulty({ ...difficulty, sedang: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Sulit (%)</Label>
                    <Input
                      type="number"
                      value={difficulty.sulit}
                      onChange={(e) => setDifficulty({ ...difficulty, sulit: Number(e.target.value) })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Komposisi Kognitif */}
              <Card className="shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-800">
                      Komposisi Kognitif
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Atur proporsi LOTS, MOTS, dan HOTS (Total 100%)
                    </CardDescription>
                  </div>
                  <div
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                      cognitive.lots + cognitive.mots + cognitive.hots === 100
                        ? "bg-slate-100 text-slate-700 border-slate-300"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {cognitive.lots + cognitive.mots + cognitive.hots}%
                  </div>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px]">LOTS (%)</Label>
                    <Input
                      type="number"
                      value={cognitive.lots}
                      onChange={(e) => setCognitive({ ...cognitive, lots: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">MOTS (%)</Label>
                    <Input
                      type="number"
                      value={cognitive.mots}
                      onChange={(e) => setCognitive({ ...cognitive, mots: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">HOTS (%)</Label>
                    <Input
                      type="number"
                      value={cognitive.hots}
                      onChange={(e) => setCognitive({ ...cognitive, hots: Number(e.target.value) })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Distribusi Taksonomi Bloom C1-C6 */}
            <Card className="shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-800">
                    Distribusi Taksonomi Bloom (C1 - C6)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    LOTS: C1-C2 | MOTS: C3 | HOTS: C4-C6
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={bloomMode === "otomatis" ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setBloomMode("otomatis")}
                  >
                    Otomatis
                  </Button>
                  <Button
                    variant={bloomMode === "manual" ? "default" : "outline"}
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setBloomMode("manual")}
                  >
                    Atur Manual
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { key: "c1", label: "C1 (Mengingat)", type: "LOTS" },
                  { key: "c2", label: "C2 (Memahami)", type: "LOTS" },
                  { key: "c3", label: "C3 (Menerapkan)", type: "MOTS" },
                  { key: "c4", label: "C4 (Menganalisis)", type: "HOTS" },
                  { key: "c5", label: "C5 (Mengevaluasi)", type: "HOTS" },
                  { key: "c6", label: "C6 (Mencipta)", type: "HOTS" },
                ].map((item) => (
                  <div key={item.key} className="p-2.5 rounded-md border border-slate-200 bg-slate-50/50 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-700">{item.key.toUpperCase()}</span>
                      <span className="text-[9px] font-mono text-slate-500">{item.type}</span>
                    </div>
                    <Input
                      type="number"
                      disabled={bloomMode === "otomatis"}
                      value={bloom[item.key as keyof typeof bloom]}
                      onChange={(e) =>
                        setBloom({ ...bloom, [item.key]: Number(e.target.value) })
                      }
                      className="h-8 text-xs font-bold text-center"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tombol Buat Paket Soal */}
            <div className="flex justify-end pt-2">
              <Button
                variant="default"
                size="lg"
                onClick={handleGenerate}
                disabled={isLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 px-8 h-11 rounded-xl shadow-xs cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{isLoading ? "Sedang Menyusun Paket Soal BKPDM..." : "Buat Paket Soal Sekarang"}</span>
              </Button>
            </div>
          </div>
        ) : (
          /* JIKA SUDAH ADA HASIL: TAMPILKAN HASIL PAKET SOAL (SESUAI GAMBAR 3) */
          <div className="space-y-6">
            {/* Header Hasil */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setGeneratedPackage(null)}
                    className="text-xs text-slate-600 gap-1.5 mb-1 px-0 hover:bg-transparent"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Generator</span>
                  </Button>
                  <h2 className="text-xl font-bold text-slate-900">
                    {generatedPackage.subject}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {generatedPackage.chapter_or_material}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="text-xs gap-1.5"
                  >
                    {showAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAnswers ? "Sembunyikan Kunci" : "Tampilkan Kunci"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveToVault}
                    className={`text-xs font-bold gap-1.5 cursor-pointer transition-all ${
                      isSavedToVault
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50 shadow-xs"
                    }`}
                  >
                    <FolderArchive className="w-3.5 h-3.5 text-slate-700" />
                    <span>{isSavedToVault ? "Tersimpan di Bank Dokumen" : "Simpan ke Bank Dokumen"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportQuestionsToDocx(generatedPackage, false)}
                    className="text-xs font-bold gap-1.5 text-slate-800 border-slate-300 bg-white hover:bg-slate-100 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-700" />
                    <span>DOCX Soal Siswa</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => exportQuestionsToDocx(generatedPackage, true)}
                    className="text-xs font-bold gap-1.5 bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span>DOCX Soal + Kunci</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="text-xs gap-1.5"
                  >
                    <span>Cetak A4</span>
                  </Button>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Guru</span>
                  <span className="font-semibold text-slate-800">{teacher.teacher_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Sekolah</span>
                  <span className="font-semibold text-slate-800">{school.school_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Kelas / Fase</span>
                  <span className="font-semibold text-slate-800">
                    {generatedPackage.grade} / Fase {generatedPackage.phase}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Semester</span>
                  <span className="font-semibold text-slate-800">{generatedPackage.semester}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tahun Ajaran</span>
                  <span className="font-semibold text-slate-800">{generatedPackage.academic_year}</span>
                </div>
              </div>

              {/* Status Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>
                    {generatedPackage.questions?.length} dari {generatedPackage.questions?.length} soal
                  </span>
                  <span className="font-bold text-[#065F46]">100% Selesai</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#059669] h-full w-full" />
                </div>
              </div>
            </div>

            {/* Navigasi Dokumen Evaluasi (4 Dokumen Resmi) */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 no-print">
              <Button
                variant={resultTab === "soal" ? "default" : "outline"}
                size="sm"
                onClick={() => setResultTab("soal")}
                className="text-xs"
              >
                1. Naskah Soal & Kunci
              </Button>
              <Button
                variant={resultTab === "kisi-kisi" ? "default" : "outline"}
                size="sm"
                onClick={() => setResultTab("kisi-kisi")}
                className="text-xs"
              >
                2. Matriks Kisi-Kisi Ujian
              </Button>
              <Button
                variant={resultTab === "kartu-soal" ? "default" : "outline"}
                size="sm"
                onClick={() => setResultTab("kartu-soal")}
                className="text-xs"
              >
                3. Kartu Soal Bank Soal
              </Button>
              <Button
                variant={resultTab === "rubrik" ? "default" : "outline"}
                size="sm"
                onClick={() => setResultTab("rubrik")}
                className="text-xs"
              >
                4. Pedoman Penskoran & KKTP
              </Button>
            </div>

            {/* TAB 1: List Butir Soal */}
            {resultTab === "soal" && (
              <div className="space-y-4">
                {generatedPackage.questions?.map((q, idx) => (
                  <Card key={idx} className="shadow-xs border-slate-200">
                    <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">
                          SOAL {q.question_number}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {q.difficulty.toUpperCase()}
                        </Badge>
                        <Badge variant="info" className="text-[10px]">
                          {q.cognitive_level}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px]">
                          {q.bloom_level}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">
                          Skor: {q.score_weight}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingIndex(editingIndex === idx ? null : idx)}
                          className="h-7 px-2 text-xs text-slate-500"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-4 text-sm">
                      {/* Tampilan Edit Mode */}
                      {editingIndex === idx ? (
                        <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                          <div className="space-y-1">
                            <Label className="text-xs">Teks Soal</Label>
                            <Textarea
                              value={q.question_text}
                              onChange={(e) =>
                                handleQuestionEdit(idx, { ...q, question_text: e.target.value })
                              }
                              rows={3}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Kunci Jawaban</Label>
                            <Input
                              value={q.correct_answer}
                              onChange={(e) =>
                                handleQuestionEdit(idx, { ...q, correct_answer: e.target.value })
                              }
                              className="w-24"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Pembahasan</Label>
                            <Textarea
                              value={q.explanation}
                              onChange={(e) =>
                                handleQuestionEdit(idx, { ...q, explanation: e.target.value })
                              }
                              rows={3}
                            />
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setEditingIndex(null)}
                            className="text-xs bg-blue-800 text-white"
                          >
                            Simpan Suntingan
                          </Button>
                        </div>
                      ) : (
                        <>
                          {/* Stimulus jika ada */}
                          {q.stimulus_text && (
                            <div className="p-3 bg-slate-50 border-l-4 border-blue-700 text-xs text-slate-700 italic leading-relaxed">
                              <MathRenderer content={q.stimulus_text} />
                            </div>
                          )}

                          {/* Teks Soal dengan LaTeX */}
                          <div className="text-slate-900 leading-relaxed font-medium">
                            <MathRenderer content={q.question_text} />
                          </div>

                          {/* Opsi Jawaban */}
                          {q.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                              {q.options.map((opt) => (
                                <div
                                  key={opt.label}
                                  className={`p-3 rounded-lg border transition-colors flex items-start gap-2.5 ${
                                    showAnswers && opt.label === q.correct_answer
                                      ? "border-emerald-500 bg-emerald-50/60 font-semibold text-emerald-950"
                                      : "border-slate-200 bg-slate-50/40 text-slate-800"
                                  }`}
                                >
                                  <span className="font-bold text-slate-900 w-4">{opt.label}.</span>
                                  <div className="flex-1">
                                    <MathRenderer content={opt.text} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Kotak Kunci Jawaban & Pembahasan (Mirip Gambar 3) */}
                          {showAnswers && (
                            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5 mt-2">
                              <p className="font-bold text-emerald-900">
                                Kunci: {q.correct_answer}
                              </p>
                              <div className="leading-relaxed">
                                <strong>Pembahasan:</strong>{" "}
                                <MathRenderer content={q.explanation} />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* TAB 2: Matriks Kisi-Kisi Ujian Resmi */}
            {resultTab === "kisi-kisi" && (
              <div className="bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden">
                <KisiKisiTable
                  packageData={generatedPackage}
                  school={school}
                  teacher={teacher}
                />
              </div>
            )}

            {/* TAB 3: Kartu Soal Bank Soal */}
            {resultTab === "kartu-soal" && (
              <div className="space-y-4">
                {generatedPackage.questions?.map((q) => (
                  <QuestionItemCard
                    key={q.question_number}
                    question={q}
                    packageData={generatedPackage}
                    school={school}
                    teacher={teacher}
                  />
                ))}
              </div>
            )}

            {/* TAB 4: Pedoman Penskoran & KKTP */}
            {resultTab === "rubrik" && (
              <div className="bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden">
                <ScoringRubricView
                  packageData={generatedPackage}
                  school={school}
                  teacher={teacher}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

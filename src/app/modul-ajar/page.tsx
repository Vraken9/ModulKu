"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Layers,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ModulAjarView } from "@/components/modul-ajar/ModulAjarView";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { exportModulAjarToDocx } from "@/lib/export/docx-exporter";
import { getOfficialCP } from "@/lib/data/capaian-pembelajaran";
import { TeachingModule, SchoolProfile, TeacherProfile } from "@/types";

export default function ModulAjarPage() {
  const [school, setSchool] = useState<Partial<SchoolProfile>>({
    school_name: "SMA NEGERI 1 PURWANTORO",
  });
  const [teacher, setTeacher] = useState<Partial<TeacherProfile>>({
    teacher_name: "Arfian Cahya, S.Pd.",
  });

  useEffect(() => {
    try {
      const savedSchool = localStorage.getItem("guru_school_profile");
      const savedTeacher = localStorage.getItem("guru_teacher_profile");
      if (savedSchool) setSchool(JSON.parse(savedSchool));
      if (savedTeacher) setTeacher(JSON.parse(savedTeacher));
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
  const [durationJp, setDurationJp] = useState<number>(3);
  const [totalMeetings, setTotalMeetings] = useState<number>(2);

  const [learningModel, setLearningModel] = useState(
    "Problem-Based Learning (PBL)"
  );
  const [targetStudents, setTargetStudents] = useState("Peserta Didik Reguler (Tipikal)");

  const [pancasilaDimensions, setPancasilaDimensions] = useState<string[]>([
    "Bernalar Kritis",
    "Bergotong Royong",
    "Mandiri",
  ]);

  const [chapter, setChapter] = useState("Kinematika Gerak Lurus dan Hukum Newton");
  const [initialCompetency, setInitialCompetency] = useState(
    "Peserta didik telah memahami konsep besaran pokok dan turunan, pengukuran panjang dan waktu, serta operasi aljabar dasar."
  );
  const [learningObjectives, setLearningObjectives] = useState(
    "Peserta didik mampu menganalisis gerak lurus beraturan (GLB) dan gerak lurus berubah beraturan (GLBB) serta menerapkan hukum Newton untuk memecahkan permasalahan gerak dalam kehidupan sehari-hari."
  );

  const [formatMode, setFormatMode] = useState<"ringkas" | "lengkap_bskap">("lengkap_bskap");

  const [isLoading, setIsLoading] = useState(false);
  const [generatedModule, setGeneratedModule] = useState<TeachingModule | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Penyesuaian Jenjang
  const handleLevelChange = (level: "SD" | "SMP" | "SMA" | "SMK") => {
    setEducationLevel(level);
    if (level === "SD") {
      setGrade("Kelas IV");
      setPhase("B");
      setSubject("IPAS");
    } else if (level === "SMP") {
      setGrade("Kelas VII");
      setPhase("D");
      setSubject("IPA");
    } else {
      setGrade("Kelas X");
      setPhase("E");
      setSubject("Fisika");
    }
  };

  // Muat CP Resmi Otomatis
  const handleAutoFillCP = () => {
    const cpData = getOfficialCP(phase, subject);
    if (cpData) {
      setInitialCompetency(`Peserta didik telah menempuh capaian elemen prasyarat pada Fase ${String.fromCharCode(phase.charCodeAt(0) - 1)}.`);
      setLearningObjectives(`Berdasarkan elemen "${cpData.element}", peserta didik mampu: ${cpData.description}`);
    } else {
      alert(`Data CP untuk Fase ${phase} dan Mapel ${subject} belum tersedia di database cepat. Anda dapat mengetik manual.`);
    }
  };

  const handleDimensionToggle = (dim: string) => {
    if (pancasilaDimensions.includes(dim)) {
      if (pancasilaDimensions.length === 1) return; // Minimal 1
      setPancasilaDimensions(pancasilaDimensions.filter((d) => d !== dim));
    } else {
      setPancasilaDimensions([...pancasilaDimensions, dim]);
    }
  };

  const handleGenerate = async () => {
    setFormError(null);
    setIsLoading(true);

    try {
      const payload = {
        subject,
        education_level: educationLevel,
        grade,
        phase,
        semester,
        academic_year: academicYear,
        duration_jp: durationJp,
        total_meetings: totalMeetings,
        learning_model: learningModel,
        target_students: targetStudents,
        pancasila_dimensions: pancasilaDimensions,
        chapter_or_material: chapter,
        initial_competency: initialCompetency,
        learning_objectives: learningObjectives,
        format_mode: formatMode,
      };

      const res = await fetch("/api/ai/generate-modul", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal menyusun modul ajar");
      }

      setGeneratedModule(json.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setFormError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardShell activeItem="modul-ajar">
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
              <span className="text-slate-900 font-bold">Modul Ajar BSKAP</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-slate-900" />
              <span>Generator Modul Ajar Kurikulum Merdeka</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Penyusunan modul ajar resmi standar BSKAP 032/H/KR/2024 terintegrasi 3 pilar diferensiasi & asesmen terstruktur.
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
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* JIKA BELUM ADA MODUL: TAMPILKAN FORMULIR WIZARD */}
        {!generatedModule ? (
          <div className="space-y-6">
            {/* Banner Pengantar Edukatif Bersih */}
            <div className="rounded-2xl border border-slate-200 bg-white text-slate-900 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200">
                  <Sparkles className="w-3 h-3 text-slate-700" />
                  <span>Standar BSKAP No. 032 Supervisi Resmi</span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  Susun Modul Ajar Resmi dengan Diferensiasi Terpeta
                </h2>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Menghasilkan struktur lengkap: Informasi Umum, Komponen Inti (dengan 3 pilar diferensiasi: konten, proses, produk), Asesmen diagnostik/formatif/sumatif, serta lampiran LKPD dan Lembar Pengesahan Pengawas Sekolah.
                </p>
              </div>
              <div className="text-right text-xs text-slate-600 font-mono bg-slate-50 p-3.5 rounded-xl border border-slate-200 shrink-0">
                <p className="font-bold text-slate-900">{teacher.teacher_name}</p>
                <p className="text-slate-500">{school.school_name}</p>
              </div>
            </div>

            {/* Bagian 1: Identitas & Konteks Pembelajaran */}
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm uppercase tracking-wider text-slate-900 font-bold">
                  1. Identitas Pembelajaran
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
                  <Label htmlFor="educationLevel">Jenjang</Label>
                  <select
                    id="educationLevel"
                    value={educationLevel}
                    onChange={(e) =>
                      handleLevelChange(e.target.value as "SD" | "SMP" | "SMA" | "SMK")
                    }
                    className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  >
                    <option value="SD">SD / MI</option>
                    <option value="SMP">SMP / MTs</option>
                    <option value="SMA">SMA / MA</option>
                    <option value="SMK">SMK</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="grade">Kelas</Label>
                  <Input
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phase">Fase Kurikulum</Label>
                  <select
                    id="phase"
                    value={phase}
                    onChange={(e) => setPhase(e.target.value as "A" | "B" | "C" | "D" | "E" | "F")}
                    className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
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
                    className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
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
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="durationJp">Alokasi JP per Minggu</Label>
                  <Input
                    id="durationJp"
                    type="number"
                    min={1}
                    max={10}
                    value={durationJp}
                    onChange={(e) => setDurationJp(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="totalMeetings">Jumlah Pertemuan</Label>
                  <Input
                    id="totalMeetings"
                    type="number"
                    min={1}
                    max={8}
                    value={totalMeetings}
                    onChange={(e) => setTotalMeetings(Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bagian 2: Capaian & Tujuan Pembelajaran */}
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-sm uppercase tracking-wider text-slate-900 font-bold">
                  2. Konteks Materi & Capaian Pembelajaran (CP)
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAutoFillCP}
                  className="text-xs gap-1.5 border-slate-300 text-slate-900 bg-white hover:bg-slate-100 font-bold shadow-xs cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-800" />
                  <span>Ambil CP Resmi BSKAP</span>
                </Button>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="chapter">Bab atau Materi Pokok</Label>
                  <Input
                    id="chapter"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="Contoh: Kinematika Gerak Lurus"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="initialCompetency">Kompetensi Awal (Prasyarat)</Label>
                  <Textarea
                    id="initialCompetency"
                    value={initialCompetency}
                    onChange={(e) => setInitialCompetency(e.target.value)}
                    rows={2}
                    placeholder="Pengetahuan/keterampilan yang perlu dikuasai sebelum modul ini."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="learningObjectives">Tujuan Pembelajaran (TP)</Label>
                  <Textarea
                    id="learningObjectives"
                    value={learningObjectives}
                    onChange={(e) => setLearningObjectives(e.target.value)}
                    rows={3}
                    placeholder="Rumusan kompetensi terukur yang dicapai peserta didik."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bagian 3: Model Pembelajaran & Dimensi Pancasila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Model & Target Siswa */}
              <Card className="bg-white border-slate-200 shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Model Pembelajaran & Target
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="learningModel">Model Pembelajaran</Label>
                    <select
                      id="learningModel"
                      value={learningModel}
                      onChange={(e) => setLearningModel(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    >
                      <option value="Problem-Based Learning (PBL)">Problem-Based Learning (PBL)</option>
                      <option value="Project-Based Learning (PjBL)">Project-Based Learning (PjBL)</option>
                      <option value="Discovery Learning">Discovery Learning</option>
                      <option value="Inkuiri Terbimbing">Inkuiri Terbimbing</option>
                      <option value="Cooperative Learning">Cooperative Learning</option>
                      <option value="Direct Instruction">Direct Instruction</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="targetStudents">Target Peserta Didik</Label>
                    <Input
                      id="targetStudents"
                      value={targetStudents}
                      onChange={(e) => setTargetStudents(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Format Dokumen Luaran</Label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div
                        onClick={() => setFormatMode("lengkap_bskap")}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          formatMode === "lengkap_bskap"
                            ? "border-slate-900 bg-slate-900 font-bold text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <p className={`font-bold ${formatMode === "lengkap_bskap" ? "text-white" : "text-slate-900"}`}>
                          Mode Lengkap BSKAP
                        </p>
                        <p className={`text-[10px] font-normal mt-0.5 ${formatMode === "lengkap_bskap" ? "text-slate-300" : "text-slate-500"}`}>
                          Format resmi supervisi (LKPD, Glosarium, Refleksi).
                        </p>
                      </div>
                      <div
                        onClick={() => setFormatMode("ringkas")}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          formatMode === "ringkas"
                            ? "border-slate-900 bg-slate-900 font-bold text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <p className={`font-bold ${formatMode === "ringkas" ? "text-white" : "text-slate-900"}`}>
                          Mode Ringkas (1-2 Lembar)
                        </p>
                        <p className={`text-[10px] font-normal mt-0.5 ${formatMode === "ringkas" ? "text-slate-300" : "text-slate-500"}`}>
                          Tujuan, langkah, dan asesmen esensial harian.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 6 Dimensi Profil Pelajar Pancasila */}
              <Card className="bg-white border-slate-200 shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-900">
                      Dimensi Profil Pelajar Pancasila
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Pilih 1 s/d 3 dimensi yang paling relevan
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200 font-bold font-mono text-[10px]">
                    {pancasilaDimensions.length} Dipilih
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
                  {[
                    "Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia",
                    "Berkebinekaan Global",
                    "Bergotong Royong",
                    "Mandiri",
                    "Bernalar Kritis",
                    "Kreatif",
                  ].map((dim) => {
                    const isChecked = pancasilaDimensions.includes(dim);
                    return (
                      <label
                        key={dim}
                        onClick={() => handleDimensionToggle(dim)}
                        className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer text-xs transition-colors ${
                          isChecked
                            ? "border-slate-900 bg-slate-50 font-bold text-slate-900 shadow-2xs"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                        />
                        <span className="font-medium text-slate-900">{dim}</span>
                      </label>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Tombol Buat Modul Ajar */}
            <div className="flex justify-end pt-2">
              <Button
                variant="default"
                size="lg"
                onClick={handleGenerate}
                disabled={isLoading}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 px-8 h-11 rounded-xl shadow-xs cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{isLoading ? "Sedang Menyusun Modul Ajar BSKAP..." : "Buat Modul Ajar Sekarang"}</span>
              </Button>
            </div>
          </div>
        ) : (
          /* JIKA SUDAH ADA HASIL MODUL AJAR: TAMPILKAN VIEWER DOKUMEN CETAK */
          <div className="space-y-6">
            {/* Header Kontrol Hasil */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setGeneratedModule(null)}
                  className="text-xs text-slate-600 gap-1.5 mb-1 px-0 hover:bg-transparent hover:text-slate-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Formulir Modul</span>
                </Button>
                <h2 className="text-lg font-bold text-slate-900">
                  {generatedModule.title}
                </h2>
                <p className="text-xs text-slate-600">
                  Model: {generatedModule.learning_model} | Format: {generatedModule.format_mode === "ringkas" ? "Ringkas (1-2 Lembar)" : "Lengkap BSKAP"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setGeneratedModule({
                      ...generatedModule,
                      format_mode:
                        generatedModule.format_mode === "ringkas"
                          ? "lengkap_bskap"
                          : "ringkas",
                    })
                  }
                  className="text-xs gap-1.5 text-slate-700 border-slate-300"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                    {generatedModule.format_mode === "ringkas"
                      ? "Beralih ke Mode Lengkap"
                      : "Beralih ke Mode Ringkas"}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportModulAjarToDocx(generatedModule)}
                  className="text-xs gap-1.5 text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOCX Modul Ajar</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="text-xs gap-1.5 bg-slate-900 text-white hover:bg-slate-800 font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak A4</span>
                </Button>
              </div>
            </div>

            {/* Viewer Dokumen Cetak Siap Pakai */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
              <ModulAjarView
                moduleData={generatedModule}
                school={school}
                teacher={teacher}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PerangkatTahunanBundle, Phase } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AtpTableView } from "@/components/perangkat-tahunan/AtpTableView";
import { ProtaTableView } from "@/components/perangkat-tahunan/ProtaTableView";
import { PromesMatrixView } from "@/components/perangkat-tahunan/PromesMatrixView";
import { KalkulatorMingguEfektif } from "@/components/perangkat-tahunan/KalkulatorMingguEfektif";

export default function PerangkatTahunanPage() {
  const [subject, setSubject] = useState("Fisika");
  const [phase, setPhase] = useState<Phase>("E");
  const [grade, setGrade] = useState("X (Sepuluh)");
  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [jpPerWeek, setJpPerWeek] = useState(3);
  const [sem1CalendarWeeks, setSem1CalendarWeeks] = useState(24);
  const [sem1IneffectiveWeeks, setSem1IneffectiveWeeks] = useState(5);
  const [sem2CalendarWeeks, setSem2CalendarWeeks] = useState(24);
  const [sem2IneffectiveWeeks, setSem2IneffectiveWeeks] = useState(6);
  const [learningScope, setLearningScope] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bundle, setBundle] = useState<PerangkatTahunanBundle | null>(null);
  const [activeTab, setActiveTab] = useState("atp");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        subject,
        phase,
        grade,
        academic_year: academicYear,
        jp_per_week: Number(jpPerWeek),
        sem1_calendar_weeks: Number(sem1CalendarWeeks),
        sem1_ineffective_weeks: Number(sem1IneffectiveWeeks),
        sem2_calendar_weeks: Number(sem2CalendarWeeks),
        sem2_ineffective_weeks: Number(sem2IneffectiveWeeks),
        learning_scope: learningScope,
      };

      const res = await fetch("/api/ai/generate-perangkat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal membuat perangkat tahunan");
      }

      setBundle(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <DashboardShell activeItem="perangkat-tahunan">
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Breadcrumb & Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-slate-700 font-medium">Perangkat Ajar</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">ATP, Prota, & Promes</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Perangkat Administrasi Tahunan (ATP, Prota, Promes, RPE)</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Otomasi dekonstruksi Capaian Pembelajaran (CP) Standar BKPDM No. 020/2026 menjadi Alur Tujuan Pembelajaran & Matriks Semester.
            </p>
          </div>

          {bundle && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 h-9 px-4 rounded-xl shadow-xs cursor-pointer"
              >
                Cetak Dokumen Resmi (A4)
              </Button>
            </div>
          )}
        </div>
        {/* Form Wizard */}
        <section className="print:hidden">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Penyusunan Perangkat Administrasi Tahunan Otomatis
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Otomasi dekonstruksi Capaian Pembelajaran (CP) Standar BKPDM No. 020/2026 menjadi Alur Tujuan Pembelajaran
                (ATP), distribusi jam Program Tahunan (PROTA), dan matriks mingguan Program Semester (PROMES).
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Baris 1: Mapel, Fase, Kelas, Tahun Ajaran */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="subject" className="text-xs font-bold text-slate-700">
                      Mata Pelajaran
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Contoh: Fisika, Matematika, IPAS"
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phase" className="text-xs font-bold text-slate-700">
                      Fase Kurikulum
                    </Label>
                    <select
                      id="phase"
                      value={phase}
                      onChange={(e) => setPhase(e.target.value as Phase)}
                      className="w-full text-xs h-9 px-3 rounded-md border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="A">Fase A (Kelas 1-2 SD)</option>
                      <option value="B">Fase B (Kelas 3-4 SD)</option>
                      <option value="C">Fase C (Kelas 5-6 SD)</option>
                      <option value="D">Fase D (Kelas 7-9 SMP)</option>
                      <option value="E">Fase E (Kelas 10 SMA)</option>
                      <option value="F">Fase F (Kelas 11-12 SMA)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="grade" className="text-xs font-bold text-slate-700">
                      Tingkat / Kelas
                    </Label>
                    <Input
                      id="grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Contoh: X (Sepuluh), VII (Tujuh)"
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="academicYear" className="text-xs font-bold text-slate-700">
                      Tahun Ajaran
                    </Label>
                    <Input
                      id="academicYear"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      placeholder="Contoh: 2024/2025"
                      required
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Baris 2: Kalender & Beban Belajar */}
                <div className="p-4 bg-slate-50/80 rounded-lg border border-slate-200 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Parameter Kalender Pendidikan dan Beban JP Mingguan
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="jpPerWeek" className="text-xs text-slate-600 font-semibold">
                        Beban Jam / Minggu (JP)
                      </Label>
                      <Input
                        id="jpPerWeek"
                        type="number"
                        min={1}
                        max={10}
                        value={jpPerWeek}
                        onChange={(e) => setJpPerWeek(Number(e.target.value))}
                        required
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sem1Cal" className="text-xs text-slate-600 font-semibold">
                        Pekan Kalender Sem. 1
                      </Label>
                      <Input
                        id="sem1Cal"
                        type="number"
                        min={15}
                        max={28}
                        value={sem1CalendarWeeks}
                        onChange={(e) => setSem1CalendarWeeks(Number(e.target.value))}
                        required
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sem1Ineff" className="text-xs text-slate-600 font-semibold">
                        Pekan Non-Efektif Sem. 1
                      </Label>
                      <Input
                        id="sem1Ineff"
                        type="number"
                        min={0}
                        max={12}
                        value={sem1IneffectiveWeeks}
                        onChange={(e) => setSem1IneffectiveWeeks(Number(e.target.value))}
                        required
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sem2Cal" className="text-xs text-slate-600 font-semibold">
                        Pekan Kalender Sem. 2
                      </Label>
                      <Input
                        id="sem2Cal"
                        type="number"
                        min={15}
                        max={28}
                        value={sem2CalendarWeeks}
                        onChange={(e) => setSem2CalendarWeeks(Number(e.target.value))}
                        required
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="sem2Ineff" className="text-xs text-slate-600 font-semibold">
                        Pekan Non-Efektif Sem. 2
                      </Label>
                      <Input
                        id="sem2Ineff"
                        type="number"
                        min={0}
                        max={12}
                        value={sem2IneffectiveWeeks}
                        onChange={(e) => setSem2IneffectiveWeeks(Number(e.target.value))}
                        required
                        className="text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Baris 3: Cakupan Materi Opsional */}
                <div className="space-y-1.5">
                  <Label htmlFor="learningScope" className="text-xs font-bold text-slate-700">
                    Cakupan Materi Khusus / Fokus Sekolah (Opsional)
                  </Label>
                  <Textarea
                    id="learningScope"
                    value={learningScope}
                    onChange={(e) => setLearningScope(e.target.value)}
                    placeholder="Masukkan daftar topik khusus jika ingin disesuaikan dengan kurikulum muatan lokal sekolah Anda..."
                    rows={2}
                    className="text-xs"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-medium">
                    {error}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-8 h-11 rounded-xl shadow-xs cursor-pointer transition-all"
                  >
                    {loading ? "Sedang Mengkalkulasi dan Menyusun..." : "Generate Perangkat Tahunan Sekarang"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Output Section with 4 Tabs */}
        {bundle && (
          <section className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-2 print:hidden">
                <TabsList className="bg-slate-100 p-1">
                  <TabsTrigger value="atp" className="text-xs font-semibold">
                    1. Alur Tujuan Pembelajaran (ATP)
                  </TabsTrigger>
                  <TabsTrigger value="prota" className="text-xs font-semibold">
                    2. Program Tahunan (PROTA)
                  </TabsTrigger>
                  <TabsTrigger value="promes" className="text-xs font-semibold">
                    3. Program Semester (PROMES)
                  </TabsTrigger>
                  <TabsTrigger value="rpe" className="text-xs font-semibold">
                    4. Rincian Pekan Efektif (RPE)
                  </TabsTrigger>
                </TabsList>

                <div className="text-xs text-slate-500 font-medium">
                  Total Beban: <span className="font-bold text-slate-800">{bundle.calendar.total_annual_jp} JP</span> / Tahun
                </div>
              </div>

              <TabsContent value="atp" className="pt-4">
                <AtpTableView data={bundle.atp} />
              </TabsContent>

              <TabsContent value="prota" className="pt-4">
                <ProtaTableView data={bundle.prota} />
              </TabsContent>

              <TabsContent value="promes" className="pt-4">
                <PromesMatrixView promes1={bundle.promes_1} promes2={bundle.promes_2} />
              </TabsContent>

              <TabsContent value="rpe" className="pt-4">
                <KalkulatorMingguEfektif data={bundle.calendar} />
              </TabsContent>
            </Tabs>
          </section>
        )}
      </div>
    </DashboardShell>
  );
}

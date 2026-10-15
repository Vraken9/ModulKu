"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MediaAjarBundle } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SlidePreviewViewer } from "@/components/presentasi/SlidePreviewViewer";
import { LkpdDocumentViewer } from "@/components/presentasi/LkpdDocumentViewer";

export default function PresentasiPage() {
  const [topic, setTopic] = useState("Hukum Gerak Newton & Penerapannya");
  const [subject, setSubject] = useState("Fisika");
  const [grade, setGrade] = useState("X (Sepuluh)");
  const [targetDuration, setTargetDuration] = useState(45);
  const [slideCount, setSlideCount] = useState(9);
  const [themePalette, setThemePalette] = useState<
    "navy_enterprise" | "emerald_nature" | "slate_academic" | "indigo_tech"
  >("navy_enterprise");
  const [includeLkpd, setIncludeLkpd] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bundle, setBundle] = useState<MediaAjarBundle | null>(null);
  const [activeTab, setActiveTab] = useState("slide");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        topic,
        subject,
        grade,
        target_duration_minutes: Number(targetDuration),
        slide_count: Number(slideCount),
        theme_palette: themePalette,
        include_lkpd: includeLkpd,
      };

      const res = await fetch("/api/ai/generate-presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal membuat materi presentasi");
      }

      setBundle(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell activeItem="presentasi">
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
              <span className="text-slate-900 font-bold">Slide Tayang & LKPD</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Penyusunan Slide Tayang (.PPTX) & LKPD Interaktif</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Otomasi presentasi kelas berpedagogi Kurikulum Merdeka (Apersepsi, Konsep Inti, Diskusi, Refleksi).
            </p>
          </div>
        </div>
        {/* Wizard Form */}
        <section className="print:hidden">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Penyusunan Slide Tayang & Lembar Kerja Siswa
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Otomasi penyusunan bahan tayang presentasi kelas berbasis alur pedagogis Kurikulum Merdeka
                (Apersepsi, Konsep Inti, Studi Kasus, Kuis Interaktif, Refleksi) yang dapat diedit langsung
                dalam format Microsoft PowerPoint (.pptx).
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1.5 lg:col-span-2">
                    <Label htmlFor="topic" className="text-xs font-bold text-slate-700">
                      Topik / Materi Pembelajaran
                    </Label>
                    <Input
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Contoh: Hukum Gerak Newton, Sistem Pencernaan, Barisan Aritmetika"
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subject" className="text-xs font-bold text-slate-700">
                      Mata Pelajaran
                    </Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Contoh: Fisika, Biologi, Matematika"
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="grade" className="text-xs font-bold text-slate-700">
                      Tingkat / Kelas
                    </Label>
                    <Input
                      id="grade"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Contoh: X (Sepuluh), VIII (Delapan)"
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="targetDuration" className="text-xs font-bold text-slate-700">
                      Alokasi Waktu (Menit)
                    </Label>
                    <Input
                      id="targetDuration"
                      type="number"
                      min={15}
                      max={120}
                      value={targetDuration}
                      onChange={(e) => setTargetDuration(Number(e.target.value))}
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="slideCount" className="text-xs font-bold text-slate-700">
                      Target Jumlah Slide
                    </Label>
                    <Input
                      id="slideCount"
                      type="number"
                      min={5}
                      max={15}
                      value={slideCount}
                      onChange={(e) => setSlideCount(Number(e.target.value))}
                      required
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Palet Tema */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">
                    Palet Tema Desain Slide (.PPTX)
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        id: "navy_enterprise",
                        name: "Navy Enterprise",
                        desc: "Biru kedinasan formal & elegan",
                        color: "bg-slate-900 border-blue-600",
                      },
                      {
                        id: "emerald_nature",
                        name: "Emerald Nature",
                        desc: "Hijau zamrud sains & biologi",
                        color: "bg-emerald-950 border-emerald-600",
                      },
                      {
                        id: "slate_academic",
                        name: "Slate Academic",
                        desc: "Abu netral akademik klasik",
                        color: "bg-slate-800 border-slate-500",
                      },
                      {
                        id: "indigo_tech",
                        name: "Indigo Tech",
                        desc: "Indigo modern teknologi & matematika",
                        color: "bg-indigo-950 border-indigo-600",
                      },
                    ].map((pal) => (
                      <div
                        key={pal.id}
                        onClick={() =>
                          setThemePalette(
                            pal.id as
                              | "navy_enterprise"
                              | "emerald_nature"
                              | "slate_academic"
                              | "indigo_tech"
                          )
                        }
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          themePalette === pal.id
                            ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 shadow-xs font-bold"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-3.5 h-3.5 rounded-full ${pal.color}`} />
                          <span className="font-bold text-slate-900">{pal.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{pal.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                    {error}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-8 h-11 rounded-xl shadow-xs cursor-pointer transition-all"
                  >
                    {loading ? "Sedang Merancang Slide & LKPD..." : "Generate Slide & LKPD Sekarang"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Output Section with 2 Tabs */}
        {bundle && (
          <section className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2 print:hidden">
                <TabsList className="bg-slate-100 p-1">
                  <TabsTrigger value="slide" className="text-xs font-semibold">
                    1. Bahan Tayang Presentasi ({bundle.presentation.slides.length} Slide)
                  </TabsTrigger>
                  <TabsTrigger value="lkpd" className="text-xs font-semibold">
                    2. Lembar Kerja Peserta Didik (LKPD)
                  </TabsTrigger>
                </TabsList>

                <div className="text-xs text-slate-500 font-medium">
                  Format Siap Ekspor: <span className="font-bold text-slate-800">.PPTX Asli & A4 Print</span>
                </div>
              </div>

              <TabsContent value="slide" className="pt-4">
                <SlidePreviewViewer bundle={bundle.presentation} />
              </TabsContent>

              <TabsContent value="lkpd" className="pt-4">
                <LkpdDocumentViewer worksheet={bundle.worksheet} />
              </TabsContent>
            </Tabs>
          </section>
        )}
      </div>
    </DashboardShell>
  );
}

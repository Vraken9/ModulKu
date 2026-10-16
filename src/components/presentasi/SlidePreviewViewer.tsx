"use client";

import React, { useState } from "react";
import { PresentationBundle } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { exportPresentationToPptx } from "@/lib/export/pptx-exporter";
import { useNotification } from "@/components/providers/NotificationProvider";

interface SlidePreviewViewerProps {
  bundle: PresentationBundle;
}

export function SlidePreviewViewer({ bundle }: SlidePreviewViewerProps) {
  const { toast } = useNotification();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const currentSlide = bundle.slides[currentIdx];

  async function handleDownloadPptx() {
    setDownloading(true);
    try {
      await exportPresentationToPptx(bundle);
      toast.success("Berkas PowerPoint (.pptx) berhasil diunduh.", "Unduhan Berhasil");
    } catch (err: unknown) {
      console.error("Gagal mengunduh presentasi:", err);
      toast.error("Gagal mengunduh presentasi PowerPoint.");
    } finally {
      setDownloading(false);
    }
  }

  const categoryLabels: Record<string, string> = {
    judul: "COVER / JUDUL",
    apersepsi: "APERSEPSI KONTEKSTUAL",
    tujuan: "TUJUAN PEMBELAJARAN",
    konsep_inti: "KONSEP INTI & PRINSIP",
    studi_kasus: "STUDI KASUS NYATA",
    kuis_interaktif: "KUIS INTERAKTIF",
    tugas_lkpd: "PETUNJUK LKPD",
    refleksi: "REFLEKSI & PENUTUP",
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-bold text-sm text-slate-900">
            {bundle.topic} ({bundle.slides.length} Slide Bahan Tayang)
          </h3>
          <p className="text-xs text-slate-500">
            {bundle.subject} | Kelas {bundle.grade} | Estimasi: {bundle.target_duration_minutes} Menit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleDownloadPptx}
            disabled={downloading}
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold"
          >
            {downloading ? "Menyusun File PPTX..." : "Unduh PowerPoint (.PPTX Asli)"}
          </Button>
        </div>
      </div>

      {/* Main 16:9 Slide Canvas */}
      <div className="w-full max-w-4xl mx-auto aspect-video bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 sm:p-10 flex flex-col justify-between text-white relative overflow-hidden select-none">
        {/* Top Header Slide */}
        <div className="flex justify-between items-start gap-4 z-10">
          <div>
            <Badge
              variant="outline"
              className="text-[10px] tracking-wider uppercase font-bold text-blue-300 border-blue-400/40 mb-2"
            >
              {categoryLabels[currentSlide.category] || "SLIDE KONTEN"}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
              {currentSlide.title}
            </h2>
            {currentSlide.subtitle && (
              <p className="text-xs sm:text-sm text-slate-300 mt-1">{currentSlide.subtitle}</p>
            )}
          </div>

          <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-2 py-1 rounded">
            {currentSlide.slide_number} / {bundle.slides.length}
          </span>
        </div>

        {/* Content Body */}
        <div className="my-auto py-4 z-10">
          {currentSlide.bullet_points.length > 0 && (
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-200">
              {currentSlide.bullet_points.map((pt, pIdx) => (
                <li key={pIdx} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom Key Takeaway Callout */}
        {(currentSlide.key_takeaway || currentSlide.interactive_question) && (
          <div className="bg-blue-950/60 border border-blue-800/60 rounded-lg p-3 z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
              {currentSlide.interactive_question ? "Pertanyaan Interaktif Kelas:" : "Poin Kunci Sesi Ini:"}
            </span>
            <p className="text-xs text-blue-100 font-medium">
              {currentSlide.interactive_question || currentSlide.key_takeaway}
            </p>
          </div>
        )}

        {/* Subtle Decorative Backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Navigation Controls */}
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="text-xs font-semibold"
        >
          Slide Sebelumnya
        </Button>

        <span className="text-xs font-medium text-slate-600">
          Slide {currentIdx + 1} dari {bundle.slides.length}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentIdx((prev) => Math.min(bundle.slides.length - 1, prev + 1))}
          disabled={currentIdx === bundle.slides.length - 1}
          className="text-xs font-semibold"
        >
          Slide Berikutnya
        </Button>
      </div>

      {/* Speaker Notes Drawer */}
      {currentSlide.speaker_notes && (
        <Card className="max-w-4xl mx-auto border-slate-200 shadow-sm bg-amber-50/50">
          <CardContent className="p-4 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wide text-amber-900 block">
              Catatan Pembicara & Panduan Fasilitasi Guru (Speaker Notes):
            </span>
            <p className="text-xs text-amber-950 leading-relaxed italic">
              {currentSlide.speaker_notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Slide Thumbnails List */}
      <div className="max-w-4xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
          Navigasi Butir Slide:
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {bundle.slides.map((s, idx) => (
            <button
              key={s.slide_number}
              onClick={() => setCurrentIdx(idx)}
              className={`p-2 rounded border text-left transition-all ${
                idx === currentIdx
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20 text-blue-900"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="text-[10px] font-bold">Slide {s.slide_number}</div>
              <div className="text-[9px] truncate font-medium text-slate-500">
                {s.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

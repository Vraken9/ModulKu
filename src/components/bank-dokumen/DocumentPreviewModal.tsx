"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Printer,
  Download,
  FileText,
  FileCheck2,
  CalendarDays,
  Presentation,
  ShieldCheck,
  Tag,
  CheckCircle2,
  HelpCircle,
  FolderArchive,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
} from "lucide-react";
import { StoredDocument, StoredDocType, QuestionItem, KisiKisiItem } from "@/types";
import { formatBytes } from "@/lib/document-vault";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MathRenderer } from "@/components/ui/math-renderer";
import { ModulAjarView } from "@/components/modul-ajar/ModulAjarView";
import { AtpTableView } from "@/components/perangkat-tahunan/AtpTableView";
import { ProtaTableView } from "@/components/perangkat-tahunan/ProtaTableView";
import { PromesMatrixView } from "@/components/perangkat-tahunan/PromesMatrixView";
import { SlidePreviewViewer } from "@/components/presentasi/SlidePreviewViewer";
import { LkpdDocumentViewer } from "@/components/presentasi/LkpdDocumentViewer";
import { exportModulAjarToDocx, exportQuestionsToDocx } from "@/lib/export/docx-exporter";

interface DocumentPreviewModalProps {
  document: StoredDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (doc: StoredDocument) => void;
}

export function DocumentPreviewModal({
  document: doc,
  isOpen,
  onClose,
  onDownload,
}: DocumentPreviewModalProps) {
  // Tab state untuk soal / perangkat tahunan / presentasi
  const [soalTab, setSoalTab] = useState<"soal" | "kisi-kisi" | "rubrik">("soal");
  const [perangkatTab, setPerangkatTab] = useState<"atp" | "prota" | "promes">("atp");
  const [presentasiTab, setPresentasiTab] = useState<"slides" | "lkpd">("slides");
  const [showAnswerKeys, setShowAnswerKeys] = useState(false);

  // Keyboard shortcut ESC untuk menutup modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Kunci scroll body saat modal aktif
  useEffect(() => {
    if (isOpen) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "unset";
    }
    return () => {
      window.document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !doc) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDirectDownload = () => {
    if (doc.docType === "modul-ajar" && doc.contentData) {
      exportModulAjarToDocx(doc.contentData);
    } else if (doc.docType === "soal" && doc.contentData) {
      exportQuestionsToDocx(doc.contentData, showAnswerKeys);
    } else if (onDownload) {
      onDownload(doc);
    }
  };

  const getDocTypeIcon = (type: StoredDocType) => {
    switch (type) {
      case "modul-ajar":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "soal":
        return <FileCheck2 className="w-5 h-5 text-indigo-600" />;
      case "perangkat-tahunan":
        return <CalendarDays className="w-5 h-5 text-emerald-600" />;
      case "presentasi":
        return <Presentation className="w-5 h-5 text-amber-600" />;
      default:
        return <FolderArchive className="w-5 h-5 text-slate-600" />;
    }
  };

  const getDocTypeLabel = (type: StoredDocType) => {
    switch (type) {
      case "modul-ajar":
        return "Modul Ajar Deep Learning";
      case "soal":
        return "Paket Asesmen & Kisi-Kisi";
      case "perangkat-tahunan":
        return "Perangkat Tahunan (ATP/Prota/Promes)";
      case "presentasi":
        return "Media Presentasi PPTX & LKPD";
      default:
        return "Dokumen Pembelajaran";
    }
  };

  // Render konten khusus sesuai docType
  const renderPreviewBody = () => {
    const content = doc.contentData;

    // 1. MODUL AJAR
    if (doc.docType === "modul-ajar") {
      if (content && content.learning_activities) {
        return (
          <div className="bg-white">
            <ModulAjarView moduleData={content} />
          </div>
        );
      }
      return (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-xl space-y-3">
          <FileText className="w-12 h-12 text-blue-500 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">{doc.title}</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            {doc.notes || "Dokumen Modul Ajar resmi siap diunduh dalam format .DOCX berstandar BKPDM Kemendikdasmen."}
          </p>
        </div>
      );
    }

    // 2. SOAL & KISI-KISI
    if (doc.docType === "soal") {
      const questions: QuestionItem[] = content?.questions || [];
      const kisiKisi: KisiKisiItem[] = content?.kisi_kisi || [];
      const scoringGuide = content?.scoring_guide;

      return (
        <div className="space-y-4">
          {/* Sub Navigation Bar untuk Soal */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs no-print">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSoalTab("soal")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  soalTab === "soal"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Naskah Soal ({questions.length > 0 ? questions.length : doc.notes?.match(/\d+/)?.[0] || 0} Butir)
              </button>
              <button
                type="button"
                onClick={() => setSoalTab("kisi-kisi")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  soalTab === "kisi-kisi"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Matriks Kisi-Kisi
              </button>
              <button
                type="button"
                onClick={() => setSoalTab("rubrik")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  soalTab === "rubrik"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Panduan Penskoran
              </button>
            </div>

            {soalTab === "soal" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAnswerKeys(!showAnswerKeys)}
                className="text-xs font-semibold gap-1.5 h-8 border-slate-300"
              >
                {showAnswerKeys ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                    <span>Sembunyikan Kunci & Pembahasan</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>Tampilkan Kunci & Pembahasan</span>
                  </>
                )}
              </Button>
            )}
          </div>

          {/* TAB 1: NASKAH SOAL */}
          {soalTab === "soal" && (
            <div className="space-y-4">
              {questions.length === 0 ? (
                <div className="p-8 text-center bg-white border border-slate-200 rounded-xl space-y-2">
                  <HelpCircle className="w-8 h-8 text-indigo-500 mx-auto" />
                  <p className="text-xs text-slate-700 font-medium">
                    {doc.notes || "Naskah soal tersimpan dalam format paket asesmen lengkap."}
                  </p>
                </div>
              ) : (
                questions.map((q, idx) => (
                  <div
                    key={q.id || `q-${idx}`}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3 print-avoid-break break-inside-avoid"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {q.question_number || idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          Tipe: {q.question_type === "Pilihan Ganda" ? "Pilihan Ganda" : q.question_type}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-bold uppercase text-slate-700">
                          {q.cognitive_level || "MOTS"}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-bold uppercase text-slate-700">
                          {q.bloom_level || "C3"}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600">
                          Bobot: {q.score_weight || 1}
                        </span>
                      </div>
                    </div>

                    {/* Stimulus jika ada */}
                    {q.stimulus_text && (
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-serif">
                        <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                          Stimulus Bacaan / Konteks:
                        </p>
                        <MathRenderer content={q.stimulus_text} />
                      </div>
                    )}

                    {/* Pertanyaan */}
                    <div className="text-xs font-medium text-slate-900 leading-relaxed">
                      <MathRenderer content={q.question_text} />
                    </div>

                    {/* Pilihan Jawaban */}
                    {q.options && q.options.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {q.options.map((opt) => {
                          const isCorrect = q.correct_answer === opt.label;
                          return (
                            <div
                              key={opt.label}
                              className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-all ${
                                showAnswerKeys && isCorrect
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                                  : "bg-white border-slate-200 text-slate-800"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                  showAnswerKeys && isCorrect
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {opt.label}
                              </span>
                              <div className="flex-1">
                                <MathRenderer content={opt.text} />
                              </div>
                              {showAnswerKeys && isCorrect && (
                                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                                  Kunci Jawaban
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Pembahasan & Solusi */}
                    {showAnswerKeys && q.explanation && (
                      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-1 mt-2">
                        <div className="flex items-center gap-1.5 font-bold text-blue-900 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
                          <span>Kunci & Pembahasan Konseptual:</span>
                        </div>
                        <div className="text-blue-950 text-xs leading-relaxed pl-5">
                          <MathRenderer content={q.explanation} />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: MATRIKS KISI-KISI */}
          {soalTab === "kisi-kisi" && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900">
                Matriks Kisi-Kisi Penulisan Soal Asesmen
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-[11px] font-serif">
                  <thead className="bg-slate-100 text-slate-800">
                    <tr>
                      <th className="border border-slate-300 p-2 text-center w-10">No</th>
                      <th className="border border-slate-300 p-2 text-left">Capaian Pembelajaran (CP)</th>
                      <th className="border border-slate-300 p-2 text-left">Tujuan & Materi Pokok</th>
                      <th className="border border-slate-300 p-2 text-left">Indikator Soal</th>
                      <th className="border border-slate-300 p-2 text-center w-20">Level Kognitif</th>
                      <th className="border border-slate-300 p-2 text-center w-20">Bentuk Soal</th>
                      <th className="border border-slate-300 p-2 text-center w-12">Bobot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kisiKisi.length > 0 ? (
                      kisiKisi.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="border border-slate-300 p-2 text-center font-bold">{row.nomor_urut || idx + 1}</td>
                          <td className="border border-slate-300 p-2">{row.capaian_pembelajaran}</td>
                          <td className="border border-slate-300 p-2 font-medium">{row.tujuan_pembelajaran_materi}</td>
                          <td className="border border-slate-300 p-2 text-slate-700">{row.indikator_soal}</td>
                          <td className="border border-slate-300 p-2 text-center font-semibold">{row.level_kognitif}</td>
                          <td className="border border-slate-300 p-2 text-center">{row.bentuk_soal}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{row.bobot_skor}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="border border-slate-300 p-4 text-center text-slate-500">
                          Matriks kisi-kisi terintegrasi dalam berkas naskah asesmen.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PANDUAN PENSKORAN */}
          {soalTab === "rubrik" && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <h4 className="font-bold text-sm text-slate-900">
                Panduan dan Rubrik Penskoran Nilai Akhir (KKTP)
              </h4>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p className="text-xs font-semibold text-slate-800">
                  Total Skor Maksimal: <span className="font-bold text-slate-950">{scoringGuide?.skor_maksimal_total || 100}</span>
                </p>
                <p className="text-xs font-mono text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                  Rumus Nilai Akhir = {scoringGuide?.rumus_nilai_akhir || "(Skor Perolehan / Skor Total Maksimal) x 100"}
                </p>
              </div>

              {scoringGuide?.rubrik_uraian && scoringGuide.rubrik_uraian.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-300 text-xs">
                    <thead className="bg-slate-100 font-bold">
                      <tr>
                        <th className="border border-slate-300 p-2 text-left">Aspek Penilaian</th>
                        <th className="border border-slate-300 p-2 text-left">Kriteria & Indikator Pencapaian</th>
                        <th className="border border-slate-300 p-2 text-center w-24">Skor Maks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scoringGuide.rubrik_uraian.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="border border-slate-300 p-2 font-medium">{item.aspek}</td>
                          <td className="border border-slate-300 p-2">{item.kriteria}</td>
                          <td className="border border-slate-300 p-2 text-center font-bold">{item.skor_maksimal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // 3. PERANGKAT TAHUNAN (ATP, PROTA, PROMES)
    if (doc.docType === "perangkat-tahunan") {
      const bundle = content;
      const hasBundle = bundle && (bundle.atp || bundle.prota || bundle.promes_1);

      if (!hasBundle) {
        return (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl space-y-3">
            <CalendarDays className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-base">{doc.title}</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {doc.notes || "Bundel Perangkat Tahunan meliputi matriks ATP, Program Tahunan (Prota), dan Program Semester (Promes) siap cetak."}
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs no-print">
            <button
              type="button"
              onClick={() => setPerangkatTab("atp")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                perangkatTab === "atp"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              1. Alur Tujuan Pembelajaran (ATP)
            </button>
            <button
              type="button"
              onClick={() => setPerangkatTab("prota")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                perangkatTab === "prota"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              2. Program Tahunan (PROTA)
            </button>
            <button
              type="button"
              onClick={() => setPerangkatTab("promes")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                perangkatTab === "promes"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              3. Program Semester (PROMES)
            </button>
          </div>

          <div className="bg-white rounded-xl overflow-hidden">
            {perangkatTab === "atp" && bundle.atp && <AtpTableView data={bundle.atp} />}
            {perangkatTab === "prota" && bundle.prota && <ProtaTableView data={bundle.prota} />}
            {perangkatTab === "promes" && bundle.promes_1 && (
              <PromesMatrixView promes1={bundle.promes_1} promes2={bundle.promes_2 || bundle.promes_1} />
            )}
          </div>
        </div>
      );
    }

    // 4. PRESENTASI & LKPD
    if (doc.docType === "presentasi") {
      const bundle = content;
      const presentation = bundle?.presentation;
      const worksheet = bundle?.worksheet;

      if (!presentation && !worksheet) {
        return (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl space-y-3">
            <Presentation className="w-12 h-12 text-amber-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-base">{doc.title}</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {doc.notes || "Slide tayang materi pembelajaran PowerPoint PPTX 16:9 dan berkas LKPD siswa terstruktur."}
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs no-print">
            {presentation && (
              <button
                type="button"
                onClick={() => setPresentasiTab("slides")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  presentasiTab === "slides"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                1. Slide Bahan Tayang ({presentation.slides?.length || 0} Slide)
              </button>
            )}
            {worksheet && (
              <button
                type="button"
                onClick={() => setPresentasiTab("lkpd")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  presentasiTab === "lkpd"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                2. Lembar Aktivitas Siswa (LKPD)
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl">
            {presentasiTab === "slides" && presentation && (
              <SlidePreviewViewer bundle={presentation} />
            )}
            {presentasiTab === "lkpd" && worksheet && (
              <LkpdDocumentViewer worksheet={worksheet} />
            )}
          </div>
        </div>
      );
    }

    // 5. FALLBACK / LAINNYA
    return (
      <div className="p-8 bg-white border border-slate-200 rounded-xl space-y-4 text-slate-800">
        <h3 className="font-bold text-base text-slate-900">{doc.title}</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {doc.notes || "Dokumen tersimpan rapi dan aman di Bank Dokumen ModulKu."}
        </p>
        {doc.tags && doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {doc.tags.map((t, idx) => (
              <Badge key={idx} variant="secondary" className="text-[10px]">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 print:p-0 print:m-0 print:bg-white print:static print:inset-auto print:block"
      onClick={onClose}
    >
      {/* Kartu Dialog Modal */}
      <div
        className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-50 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 print:max-w-none print:max-h-none print:h-auto print:border-none print:shadow-none print:rounded-none print:overflow-visible print:bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 no-print">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0 mt-0.5">
              {getDocTypeIcon(doc.docType)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span>{getDocTypeLabel(doc.docType)}</span>
                <span>&bull;</span>
                <span className="font-mono text-slate-700 font-bold">.{doc.fileFormat}</span>
                <span>&bull;</span>
                <span className="font-mono text-slate-700">{formatBytes(doc.fileSizeBytes)}</span>
                {doc.isPmmEvidence && (
                  <>
                    <span>&bull;</span>
                    <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Bukti PMM Valid</span>
                    </span>
                  </>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight line-clamp-1">
                {doc.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">{doc.subject}</span>
                <span>&mdash;</span>
                <span>{doc.grade}</span>
                <span>&mdash;</span>
                <span className="font-mono text-[11px] text-slate-500">{doc.academicYear} ({doc.semester})</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Top Right */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs font-semibold gap-1.5 h-9 bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
              <span>Cetak A4</span>
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleDirectDownload}
              className="text-xs font-bold gap-1.5 h-9 bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Unduh Berkas</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-9 h-9 p-0 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              title="Tutup Pratinjau (Esc)"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Document Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 print:p-0 print:m-0 print:overflow-visible">
          {renderPreviewBody()}
        </div>

        {/* Footer Modal */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 shrink-0 no-print">
          <div className="flex items-center gap-2 font-mono">
            <span>ID Berkas: {doc.id}</span>
            <span>&bull;</span>
            <span>Tersimpan di Bank Dokumen</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 h-7 px-2.5 cursor-pointer"
          >
            Tutup Pratinjau
          </Button>
        </div>
      </div>
    </div>
  );
}

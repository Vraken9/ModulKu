"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FolderArchive,
  Search,
  Filter,
  FileText,
  FileCheck2,
  CalendarDays,
  Presentation,
  Download,
  Trash2,
  Plus,
  Sparkles,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Tag,
  ArrowUpRight,
  BookOpen,
  Eye,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DocumentPreviewModal } from "@/components/bank-dokumen/DocumentPreviewModal";
import {
  getStoredDocuments,
  getStorageUsageSummary,
  deleteDocumentFromVault,
  setUserTier,
  formatBytes,
  TIER_CONFIGS,
  SEED_DOCUMENTS,
  DEFAULT_STORAGE_SUMMARY,
} from "@/lib/document-vault";
import {
  StoredDocument,
  StoredDocType,
  SubscriptionTier,
  StorageUsageSummary,
} from "@/types";

export default function BankDokumenPage() {
  const [documents, setDocuments] = useState<StoredDocument[]>(SEED_DOCUMENTS);
  const [usage, setUsage] = useState<StorageUsageSummary>(DEFAULT_STORAGE_SUMMARY);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [onlyPmm, setOnlyPmm] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "table">("grid");
  const [notification, setNotification] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<StoredDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOpenPreview = (doc: StoredDocument) => {
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  };

  // Muat dokumen saat inisialisasi & sinkronisasi event
  const refreshVault = () => {
    setDocuments(getStoredDocuments());
    setUsage(getStorageUsageSummary());
  };

  useEffect(() => {
    refreshVault();
    const handleVaultChange = () => {
      refreshVault();
    };
    window.addEventListener("modulku-vault-changed", handleVaultChange);
    return () => window.removeEventListener("modulku-vault-changed", handleVaultChange);
  }, []);

  const handleDelete = (doc: StoredDocument) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus "${doc.title}"?\nKapasitas sebesar ${formatBytes(doc.fileSizeBytes)} akan dibebaskan.`
    );
    if (!confirmDelete) return;

    const success = deleteDocumentFromVault(doc.id);
    if (success) {
      setNotification(`Dokumen "${doc.title}" berhasil dihapus. Kuota penyimpanan diperbarui.`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleSimulateDownload = (doc: StoredDocument) => {
    // Simulasi download berkas teks atau JSON
    const content = doc.contentData
      ? JSON.stringify(doc.contentData, null, 2)
      : `DOKUMEN RESMI STANDAR BKPDM\n\nJudul: ${doc.title}\nMata Pelajaran: ${doc.subject}\nJenjang/Fase: ${doc.grade}\nTahun Ajaran: ${doc.academicYear} (${doc.semester})\nUkuran: ${formatBytes(doc.fileSizeBytes)}\nFormat Asli: .${doc.fileFormat}\n\nDokumen ini tersimpan secara aman di Bank Dokumen ModulKu.`;
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.${doc.fileFormat.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter Dokumen
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Filter tipe
      if (selectedType !== "all" && doc.docType !== selectedType) {
        return false;
      }
      // Filter PMM
      if (onlyPmm && !doc.isPmmEvidence) {
        return false;
      }
      // Pencarian query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesSubject = doc.subject.toLowerCase().includes(q);
        const matchesTags = doc.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSubject && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [documents, selectedType, onlyPmm, searchQuery]);

  // Statistik Breakdown per Tipe Dokumen
  const statsByType = useMemo(() => {
    const counts: Record<string, { count: number; bytes: number }> = {
      "modul-ajar": { count: 0, bytes: 0 },
      soal: { count: 0, bytes: 0 },
      "perangkat-tahunan": { count: 0, bytes: 0 },
      presentasi: { count: 0, bytes: 0 },
    };

    documents.forEach((d) => {
      if (counts[d.docType]) {
        counts[d.docType].count += 1;
        counts[d.docType].bytes += d.fileSizeBytes || 0;
      }
    });

    return counts;
  }, [documents]);

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
        return "Modul Ajar BKPDM";
      case "soal":
        return "Paket Soal & Kisi-Kisi";
      case "perangkat-tahunan":
        return "ATP, Prota, & Promes";
      case "presentasi":
        return "Slide Bahan Tayang";
      default:
        return "Dokumen Arsip";
    }
  };

  const getFormatBadgeColor = (format: string) => {
    switch (format) {
      case "DOCX":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PPTX":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "PDF":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <DashboardShell activeItem="bank-dokumen">
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Header Title & Ringkasan */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <FolderArchive className="w-3.5 h-3.5 text-slate-800" />
              <span>Arsip Cloud Dokumen Kurikulum BKPDM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Bank Dokumen Pendidik
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Seluruh berkas modul ajar, bank soal, alur tujuan pembelajaran, dan media ajar yang Anda susun tersimpan aman dan terorganisasi otomatis berdasarkan tahun ajaran.
            </p>
          </div>

          {/* Quick Create Dropdown / Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/modul-ajar">
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-9 px-4 rounded-xl gap-2 shadow-xs">
                <Plus className="w-4 h-4" />
                <span>Susun Dokumen Baru</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Notifikasi feedback */}
        {notification && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{notification}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-700 hover:text-emerald-950 text-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Storage Analytics Card (Swiss Minimalist Vault Bar) */}
        <Card className="rounded-2xl border-slate-200 bg-white shadow-xs overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-slate-800" />
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Status Kuota Penyimpanan Cloud
                  </CardTitle>
                </div>
                <CardDescription className="text-xs text-slate-500">
                  Kapasitas terpakai saat ini pada paket {usage.tierLabel}
                </CardDescription>
              </div>

              {/* Tier Switcher / Simulation & Upgrade Link */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-[11px] font-semibold">
                  <span className="text-slate-500 px-1.5">Paket Aktif:</span>
                  <select
                    value={usage.tier}
                    onChange={(e) => setUserTier(e.target.value as SubscriptionTier)}
                    className="bg-white border border-slate-200 rounded px-2 py-0.5 font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="free">Free (50 MB)</option>
                    <option value="pro">Pro (2 GB)</option>
                    <option value="school">Sekolah (25 GB)</option>
                  </select>
                </div>
                <Link href="/#harga">
                  <Button variant="outline" size="sm" className="text-xs font-bold h-7 px-2.5 text-blue-700 border-blue-200 hover:bg-blue-50">
                    Upgrade
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 space-y-5">
            {/* Main Gauge Progress */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between text-xs">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-900">
                    {formatBytes(usage.usedBytes)}
                  </span>
                  <span className="text-slate-500 font-medium">
                    dari {TIER_CONFIGS[(usage.tier as SubscriptionTier) || "free"]?.formattedLimit || "50 MB"} ({usage.percentageUsed}% terpakai)
                  </span>
                </div>
                <span className="text-slate-600 font-medium">
                  {usage.totalDocuments} Berkas Tersimpan
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    usage.percentageUsed > 85 ? "bg-amber-500" : "bg-slate-900"
                  }`}
                  style={{ width: `${Math.max(2, usage.percentageUsed)}%` }}
                />
              </div>
            </div>

            {/* Sub-metrik Breakdown per Kategori Dokumen */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span>Modul Ajar</span>
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-slate-900 text-sm">{statsByType["modul-ajar"].count}</span>
                  <span className="text-[10px] text-slate-500">{formatBytes(statsByType["modul-ajar"].bytes)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span>Soal & Kisi-Kisi</span>
                  <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-slate-900 text-sm">{statsByType["soal"].count}</span>
                  <span className="text-[10px] text-slate-500">{formatBytes(statsByType["soal"].bytes)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span>Perangkat Tahunan</span>
                  <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-slate-900 text-sm">{statsByType["perangkat-tahunan"].count}</span>
                  <span className="text-[10px] text-slate-500">{formatBytes(statsByType["perangkat-tahunan"].bytes)}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span>Slide PPTX & LKPD</span>
                  <Presentation className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-slate-900 text-sm">{statsByType["presentasi"].count}</span>
                  <span className="text-[10px] text-slate-500">{formatBytes(statsByType["presentasi"].bytes)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Bar & Pencarian Multi-Kriteria */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari berdasarkan judul, mata pelajaran, atau kata kunci modul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-xs sm:text-sm h-10 rounded-xl bg-white border-slate-200"
              />
            </div>

            {/* Toggle Bukti Dukung PMM */}
            <Button
              type="button"
              variant={onlyPmm ? "default" : "outline"}
              onClick={() => setOnlyPmm(!onlyPmm)}
              className={`text-xs font-bold h-10 px-4 rounded-xl shrink-0 gap-2 ${
                onlyPmm
                  ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Hanya Bukti Dukung PMM</span>
            </Button>
          </div>

          {/* Filter Pills Tipe Berkas */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-slate-600 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-600" />
              <span>Kategori:</span>
            </span>
            {[
              { id: "all", label: "Semua Berkas" },
              { id: "modul-ajar", label: "Modul Ajar" },
              { id: "soal", label: "Paket Soal & Kisi-Kisi" },
              { id: "perangkat-tahunan", label: "ATP, Prota & Promes" },
              { id: "presentasi", label: "Slide Bahan Tayang" },
            ].map((tab) => {
              const isActive = selectedType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daftar Dokumen Grid Cards */}
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
              <FolderArchive className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Tidak ada dokumen yang sesuai kriteria pencarian
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Coba atur ulang kata kunci pencarian atau buat perangkat ajar baru menggunakan generator.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setOnlyPmm(false);
                }}
                className="text-xs font-bold"
              >
                Reset Semua Filter
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar Card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0 mt-0.5">
                        {getDocTypeIcon(doc.docType)}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {getDocTypeLabel(doc.docType)}
                        </span>
                        <h4
                          onClick={() => handleOpenPreview(doc)}
                          className="text-sm font-bold text-slate-900 tracking-tight leading-snug line-clamp-2 hover:text-blue-700 cursor-pointer transition-colors"
                          title="Klik untuk melihat pratinjau dokumen"
                        >
                          {doc.title}
                        </h4>
                      </div>
                    </div>

                    {/* Format Badge */}
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${getFormatBadgeColor(doc.fileFormat)}`}>
                      .{doc.fileFormat}
                    </span>
                  </div>

                  {/* Metadata Chips: Mapel, Jenjang, Tahun, Ukuran */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                      {doc.subject}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                      {doc.grade}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-500">
                      {doc.academicYear} ({doc.semester})
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-bold ml-auto">
                      {formatBytes(doc.fileSizeBytes)}
                    </span>
                  </div>

                  {/* Notes / Description */}
                  {doc.notes && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                      {doc.notes}
                    </p>
                  )}

                  {/* Tags & PMM Badge */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {doc.isPmmEvidence && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Bukti PMM Valid</span>
                      </span>
                    )}
                    {doc.tags?.map((t, tIdx) => (
                      <span
                        key={`tag-${doc.id}-${tIdx}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-600 font-mono" suppressHydrationWarning>
                    Diperbarui: {new Date(doc.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPreview(doc)}
                      className="text-xs font-bold h-8 px-3 text-blue-700 bg-blue-50/60 border-blue-200 hover:bg-blue-100/80 gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-700" />
                      <span>Pratinjau</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSimulateDownload(doc)}
                      className="text-xs font-bold h-8 px-3 text-slate-800 border-slate-200 hover:bg-slate-100 gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-700" />
                      <span>Unduh</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc)}
                      className="text-xs font-semibold h-8 w-8 p-0 text-slate-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      title="Hapus dari Bank Dokumen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Pratinjau Dokumen Responsif */}
        <DocumentPreviewModal
          document={previewDoc}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onDownload={handleSimulateDownload}
        />
      </div>
    </DashboardShell>
  );
}

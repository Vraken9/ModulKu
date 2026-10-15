import {
  StoredDocument,
  SubscriptionTier,
  TierStorageConfig,
  StorageUsageSummary,
} from "@/types";

export const TIER_CONFIGS: Record<SubscriptionTier, TierStorageConfig> = {
  free: {
    tier: "free",
    label: "Guru Mandiri (Gratis)",
    maxBytes: 50 * 1024 * 1024, // 50 MB
    formattedLimit: "50 MB",
  },
  pro: {
    tier: "pro",
    label: "Guru Profesional",
    maxBytes: 2 * 1024 * 1024 * 1024, // 2 GB
    formattedLimit: "2 GB",
  },
  school: {
    tier: "school",
    label: "Sekolah & MGMP",
    maxBytes: 25 * 1024 * 1024 * 1024, // 25 GB
    formattedLimit: "25 GB",
  },
};

const VAULT_STORAGE_KEY = "modulku_document_vault_items";
const TIER_STORAGE_KEY = "modulku_user_subscription_tier";

// Dokumen Contoh Awal (Seed) Terstruktur Standar BKPDM
const SEED_DOCUMENTS: StoredDocument[] = [
  {
    id: "doc-seed-1",
    title: "Modul Ajar Fisika: Energi Terbarukan & Efisiensi Termal",
    docType: "modul-ajar",
    subject: "Fisika",
    grade: "Kelas X (Fase E)",
    academicYear: "2025/2026",
    semester: "Ganjil",
    fileFormat: "DOCX",
    fileSizeBytes: 485 * 1024, // ~485 KB
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    isPmmEvidence: true,
    tags: ["BKPDM 2026", "Deep Learning", "Supervisi KS"],
    notes: "Lengkap dengan instrumen diferensiasi proses dan rubrik penilaian LKPD.",
  },
  {
    id: "doc-seed-2",
    title: "Paket Soal STS Ganjil HOTS & Matriks Kisi-Kisi KaTeX",
    docType: "soal",
    subject: "Fisika",
    grade: "Kelas X (Fase E)",
    academicYear: "2025/2026",
    semester: "Ganjil",
    fileFormat: "DOCX",
    fileSizeBytes: 320 * 1024, // ~320 KB
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    isPmmEvidence: true,
    tags: ["Taksonomi Bloom C4-C6", "Matriks Kisi-Kisi", "KKTP"],
    notes: "25 Butir soal AKM numerasi dan pemecahan masalah kontekstual.",
  },
  {
    id: "doc-seed-3",
    title: "Perangkat Tahunan: ATP, Prota, & Promes Kalender 2025/2026",
    docType: "perangkat-tahunan",
    subject: "Fisika",
    grade: "Kelas X (Fase E)",
    academicYear: "2025/2026",
    semester: "Ganjil",
    fileFormat: "DOCX",
    fileSizeBytes: 560 * 1024, // ~560 KB
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    isPmmEvidence: false,
    tags: ["Pekan Efektif", "Promes Mingguan", "Capaian Pembelajaran"],
    notes: "Distribusi 108 Jam Pelajaran (JP) dengan penanda libur resmi daerah.",
  },
  {
    id: "doc-seed-4",
    title: "Slide Media Ajar PPTX: Konversi Energi Surya & LKPD Eksplorasi",
    docType: "presentasi",
    subject: "Fisika",
    grade: "Kelas X (Fase E)",
    academicYear: "2025/2026",
    semester: "Ganjil",
    fileFormat: "PPTX",
    fileSizeBytes: 1850 * 1024, // ~1.85 MB
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    isPmmEvidence: true,
    tags: ["PowerPoint 16:9", "LKPD Siswa", "Apersepsi Interaktif"],
    notes: "Bahan tayang ruang kelas interaktif 12 slide widescreen.",
  },
];

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getUserTier(): SubscriptionTier {
  if (typeof window === "undefined") return "free";
  try {
    const saved = localStorage.getItem(TIER_STORAGE_KEY) as SubscriptionTier | null;
    if (saved && (saved === "free" || saved === "pro" || saved === "school")) {
      return saved;
    }
  } catch {
    // Abaikan
  }
  return "free";
}

export function setUserTier(tier: SubscriptionTier): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TIER_STORAGE_KEY, tier);
    window.dispatchEvent(new CustomEvent("modulku-vault-changed"));
  } catch {
    // Abaikan
  }
}

export function getStoredDocuments(): StoredDocument[] {
  if (typeof window === "undefined") return SEED_DOCUMENTS;
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) {
      // Inisialisasi dengan dokumen contoh
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(SEED_DOCUMENTS));
      return SEED_DOCUMENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Fallback jika korup
  }
  return SEED_DOCUMENTS;
}

export function getStorageUsageSummary(): StorageUsageSummary {
  const tier = getUserTier();
  const config = TIER_CONFIGS[tier];
  const docs = getStoredDocuments();

  const usedBytes = docs.reduce((acc, curr) => acc + (curr.fileSizeBytes || 0), 0);
  const maxBytes = config.maxBytes;
  const percentageUsed = Math.min(100, Math.round((usedBytes / maxBytes) * 100));
  const remainingBytes = Math.max(0, maxBytes - usedBytes);
  const isExceeded = usedBytes > maxBytes;

  return {
    tier,
    tierLabel: config.label,
    usedBytes,
    maxBytes,
    percentageUsed,
    totalDocuments: docs.length,
    remainingBytes,
    isExceeded,
  };
}

export function saveDocumentToVault(
  doc: Omit<StoredDocument, "id" | "createdAt" | "updatedAt">
): { success: boolean; error?: string; document?: StoredDocument } {
  if (typeof window === "undefined") {
    return { success: false, error: "Lingkungan peramban tidak tersedia." };
  }

  const summary = getStorageUsageSummary();
  const newSize = doc.fileSizeBytes || 150 * 1024; // Default 150 KB jika tidak dispesifikasi

  if (summary.usedBytes + newSize > summary.maxBytes) {
    return {
      success: false,
      error: `Kapasitas kuota penyimpanan tidak mencukupi (${summary.tierLabel} maksimal ${TIER_CONFIGS[summary.tier].formattedLimit}). Tingkatkan paket Anda untuk mendapatkan kapasitas lebih besar.`,
    };
  }

  const newDoc: StoredDocument = {
    ...doc,
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fileSizeBytes: newSize,
  };

  try {
    const currentDocs = getStoredDocuments();
    const updated = [newDoc, ...currentDocs];
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("modulku-vault-changed"));
    return { success: true, document: newDoc };
  } catch (err: any) {
    return {
      success: false,
      error: "Gagal menyimpan berkas ke penyimpanan lokal peramban: " + (err?.message || "Storage full"),
    };
  }
}

export function deleteDocumentFromVault(docId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const currentDocs = getStoredDocuments();
    const filtered = currentDocs.filter((d) => d.id !== docId);
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent("modulku-vault-changed"));
    return true;
  } catch {
    return false;
  }
}

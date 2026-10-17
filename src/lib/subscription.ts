import { SubscriptionTier } from "@/types";
import { setUserTier, setActiveUserId } from "@/lib/document-vault";

export type PaymentMethod = "QRIS" | "DANA" | "ShopeePay" | "BRI";
export type SubscriptionStatus = "pending" | "approved" | "rejected";

export interface SubscriptionPlanInfo {
  id: string;
  name: string;
  amount: number;
  formattedAmount: string;
  tier: SubscriptionTier;
  billingPeriod: string;
  qrisImage: string;
  description: string;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlanInfo> = {
  profesional_monthly: {
    id: "profesional_monthly",
    name: "Guru Profesional (Bulanan)",
    amount: 39000,
    formattedAmount: "Rp 39.000",
    tier: "pro",
    billingPeriod: "/ bulan",
    qrisImage: "/images/qris/qris_39000.jpg",
    description: "Modul Ajar Deep Learning tanpa batas & generator soal HOTS lengkap.",
  },
  profesional_annual: {
    id: "profesional_annual",
    name: "Guru Profesional (Tahunan)",
    amount: 299000,
    formattedAmount: "Rp 299.000",
    tier: "pro",
    billingPeriod: "/ tahun",
    qrisImage: "/images/qris/qris_299000.jpg",
    description: "Hemat 36%, arsip 2 GB cloud, slide presentasi PPTX asli dan ATP/Prota.",
  },
  sekolah_semester: {
    id: "sekolah_semester",
    name: "Sekolah & MGMP (Semesteran)",
    amount: 799000,
    formattedAmount: "Rp 799.000",
    tier: "school",
    billingPeriod: "/ semester",
    qrisImage: "/images/qris/qris_799000.jpg",
    description: "Standarisasi kop dan modul supervisi untuk seluruh dewan guru sekolah.",
  },
  sekolah_annual: {
    id: "sekolah_annual",
    name: "Sekolah & MGMP (Tahunan)",
    amount: 1490000,
    formattedAmount: "Rp 1.490.000",
    tier: "school",
    billingPeriod: "/ tahun ajaran",
    qrisImage: "/images/qris/qris_1490000.jpg",
    description: "Lisensi penuh hingga 30 akun guru, bank dokumen 25 GB, dan faktur SPJ BOSP.",
  },
};

export const PAYMENT_CHANNELS = {
  dana: {
    name: "DANA",
    accountNumber: "089530123608",
    accountName: "ModulKu Official (Admin)",
    notes: "Buka aplikasi DANA -> Kirim -> Masukkan nomor ponsel tujuan.",
  },
  shopeepay: {
    name: "ShopeePay",
    accountNumber: "0895301235608",
    accountName: "ModulKu Official (Admin)",
    notes: "Buka aplikasi Shopee -> ShopeePay -> Transfer -> Masukkan nomor ponsel.",
  },
  bri: {
    name: "Bank BRI",
    bankName: "PT Bank Rakyat Indonesia (Persero) Tbk",
    accountNumber: "662501037567538",
    accountName: "ModulKu Pendidik Mandiri",
    notes: "Transfer antar-bank atau via BRImo, ATM, dan Internet Banking.",
  },
  whatsapp: {
    number: "089530123608",
    formattedNumber: "+62 895-3012-3608",
  },
};

export interface SubscriptionRequest {
  id: string; // e.g. TRX-1021
  userId: string;
  userEmail: string;
  userName: string;
  planId: string;
  planName: string;
  tier: SubscriptionTier;
  amount: number;
  formattedAmount: string;
  paymentMethod: PaymentMethod;
  senderName: string;
  proofImageUrl: string;
  status: SubscriptionStatus;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  reviewedAt?: string;
}

const STORAGE_KEY = "modulku_subscription_requests";

// Data Seed Transaksi Awal untuk Pengujian Admin
const INITIAL_REQUESTS: SubscriptionRequest[] = [
  {
    id: "TRX-8491",
    userId: "seed-user-1",
    userEmail: "sri.wahyuni@guru.sma.belajar.id",
    userName: "Dra. Sri Wahyuni, M.Pd.",
    planId: "profesional_annual",
    planName: "Guru Profesional (Tahunan)",
    tier: "pro",
    amount: 299000,
    formattedAmount: "Rp 299.000",
    paymentMethod: "QRIS",
    senderName: "SRI WAHYUNI",
    proofImageUrl: "/images/qris/qris_299000.jpg",
    status: "pending",
    notes: "Sudah transfer via QRIS BCA Mobile, mohon diaktifkan akun pro untuk persiapan supervisi.",
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: "TRX-8492",
    userId: "seed-user-2",
    userEmail: "bambang.sudiro@guru.smp.belajar.id",
    userName: "Bambang Sudiro, S.Pd.",
    planId: "profesional_monthly",
    planName: "Guru Profesional (Bulanan)",
    tier: "pro",
    amount: 39000,
    formattedAmount: "Rp 39.000",
    paymentMethod: "DANA",
    senderName: "BAMBANG SUDIRO",
    proofImageUrl: "/images/qris/qris_39000.jpg",
    status: "pending",
    notes: "Transfer DANA berhasil, terima kasih admin.",
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
  },
  {
    id: "TRX-8488",
    userId: "seed-user-3",
    userEmail: "kurikulum.sman1purwantoro@sch.id",
    userName: "SMAN 1 Purwantoro (Tim Kurikulum)",
    planId: "sekolah_annual",
    planName: "Sekolah & MGMP (Tahunan)",
    tier: "school",
    amount: 1490000,
    formattedAmount: "Rp 1.490.000",
    paymentMethod: "BRI",
    senderName: "BENDAHARA BOSP SMAN 1",
    proofImageUrl: "/images/qris/qris_1490000.jpg",
    status: "approved",
    notes: "Pembayaran lisensi sekolah via rekening BRI SPJ BOSP.",
    adminNotes: "Dana terverifikasi di rekening koran BRI. Paket sekolah aktif.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 23 * 3600 * 1000).toISOString(),
  },
];

export function getSubscriptionRequests(): SubscriptionRequest[] {
  if (typeof window === "undefined") return INITIAL_REQUESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_REQUESTS;
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function saveSubscriptionRequest(
  data: Omit<SubscriptionRequest, "id" | "status" | "createdAt">
): { success: boolean; request: SubscriptionRequest } {
  const current = getSubscriptionRequests();
  const idNumber = Math.floor(1000 + Math.random() * 9000);
  const newRequest: SubscriptionRequest = {
    ...data,
    id: `TRX-${idNumber}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const updated = [newRequest, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("modulku-subscription-changed"));
  } catch {
    // ignore
  }
  return { success: true, request: newRequest };
}

export function approveSubscriptionRequest(
  requestId: string,
  adminNotes = "Pembayaran telah diverifikasi secara manual oleh administrator."
): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getSubscriptionRequests();
    const target = current.find((r) => r.id === requestId);
    if (!target) return false;

    // Tingkatkan tier pengguna di vault
    setUserTier(target.tier, target.userId);

    const updated = current.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: "approved" as SubscriptionStatus,
          adminNotes,
          reviewedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("modulku-subscription-changed"));
    window.dispatchEvent(new CustomEvent("modulku-vault-changed"));
    return true;
  } catch {
    return false;
  }
}

export function rejectSubscriptionRequest(
  requestId: string,
  adminNotes = "Bukti transfer tidak dapat diverifikasi atau nominal tidak sesuai."
): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getSubscriptionRequests();
    const updated = current.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: "rejected" as SubscriptionStatus,
          adminNotes,
          reviewedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("modulku-subscription-changed"));
    return true;
  } catch {
    return false;
  }
}

export function generateWhatsAppLink(
  planName: string,
  amount: string,
  method: string,
  transactionId: string
): string {
  const phone = "6289530123608";
  const message = encodeURIComponent(
    `Halo Admin ModulKu, saya telah melakukan transfer untuk paket ${planName} sebesar ${amount} melalui metode ${method} dengan Kode Transaksi: ${transactionId}. Mohon bantuannya untuk verifikasi akun. Terima kasih.`
  );
  return `https://wa.me/${phone}?text=${message}`;
}

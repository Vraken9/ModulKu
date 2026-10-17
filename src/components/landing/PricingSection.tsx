"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Sparkles, ArrowRight, ShieldCheck, School, Zap, Award, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: string;
  priceAnnual: string;
  periodMonthly: string;
  periodAnnual: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  isPopular?: boolean;
  buttonVariant: "default" | "outline";
}

const TIERS: PricingTier[] = [
  {
    id: "pemula",
    name: "Guru Mandiri",
    priceMonthly: "Rp 0",
    priceAnnual: "Rp 0",
    periodMonthly: "Gratis Selamanya",
    periodAnnual: "Gratis Selamanya",
    description: "Coba fitur dasar secara mandiri untuk merasakan kemudahan penyusunan modul ajar.",
    features: [
      "3 Modul Ajar BKPDM per bulan",
      "Generator 10 butir soal asesmen formatif / bulan",
      "Akses seluruh jenjang (SD, SMP, SMA, SMK)",
      "Ekspor dokumen Word (.DOCX) standar",
      "Penyimpanan profil sekolah lokal di peramban",
      "Akses materi kurikulum regulasi dasar",
    ],
    ctaText: "Mulai Gratis Sekarang",
    ctaHref: "/login",
    isPopular: false,
    buttonVariant: "outline",
  },
  {
    id: "profesional",
    name: "Guru Profesional",
    badge: "Paling Populer",
    priceMonthly: "Rp 39.000",
    priceAnnual: "Rp 299.000",
    periodMonthly: "/ bulan",
    periodAnnual: "/ tahun (Hemat 36%)",
    description: "Solusi lengkap tanpa batas untuk pendidik aktif dalam persiapan supervisi dinas & pengajaran harian.",
    features: [
      "Modul Ajar Deep Learning (Mindful, Meaningful, Joyful) Tanpa Batas",
      "Generator Soal HOTS Taksonomi Bloom C1-C6 Tak Terbatas",
      "Matriks Kisi-Kisi Penulisan Soal & Kartu Soal Resmi",
      "Penyusunan Otomatis ATP, Prota, & Promes Kalender Akademik",
      "Slide Presentasi (.PPTX) Asli Widescreen 16:9 Siap Tayang",
      "Ekspor Margin Kedinasan 4-3-3-3 cm & Kop Surat Dua Logo",
      "Penyelarasan Bukti Dukung Observasi Kinerja PMM (Perdirjen GTK)",
      "Prioritas pembaruan regulasi BKPDM Kemendikdasmen",
    ],
    ctaText: "Pilih Paket Profesional",
    ctaHref: "/login",
    isPopular: true,
    buttonVariant: "default",
  },
  {
    id: "sekolah",
    name: "Sekolah & MGMP",
    badge: "Lisensi Tim / Instansi",
    priceMonthly: "Rp 799.000",
    priceAnnual: "Rp 1.490.000",
    periodMonthly: "/ semester",
    periodAnnual: "/ tahun ajaran",
    description: "Standardisasi administrasi perangkat ajar dan instrumen evaluasi seluruh dewan guru satu sekolah.",
    features: [
      "Semua fitur Paket Profesional untuk hingga 30 Akun Guru",
      "Master Kop Surat Kedinasan, NIP Kepala Sekolah, & Pengawas Seragam",
      "Bank Dokumen Ajar Terpusat untuk Seluruh Rumpun Mata Pelajaran",
      "Dashboard Monitoring Kelengkapan Administrasi untuk Kepala Sekolah",
      "Sesi Pelatihan Teknis & Pendampingan Daring Resmi",
      "Dukungan Bantuan Prioritas Jalur WhatsApp Khusus Tim Kurikulum",
      "Faktur Resmi & Kwitansi BOSP / Komite untuk SPJ Dinas",
    ],
    ctaText: "Hubungi Lisensi Sekolah",
    ctaHref: "/login",
    isPopular: false,
    buttonVariant: "outline",
  },
];

export function PricingSection() {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);

  const handleOpenCheckout = (tierId: string) => {
    if (tierId === "gratis") return;
    let plan = "profesional_annual";
    if (tierId === "profesional") {
      plan = isAnnual ? "profesional_annual" : "profesional_monthly";
    } else if (tierId === "sekolah") {
      plan = isAnnual ? "sekolah_annual" : "sekolah_semester";
    }
    router.push(`/pembayaran?plan=${plan}`);
  };

  return (
    <div className="space-y-12">
      {/* Header Pengantar */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs">
          <Award className="w-3.5 h-3.5 text-slate-700" />
          <span>Investasi Efisiensi Pendidik Indonesia</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Paket Berlangganan Transparan Sesuai Kebutuhan Anda
        </h2>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Pilih paket yang paling tepat untuk mendukung kinerja mengajar Anda atau standarisasi dokumen administrasi seluruh satuan pendidikan.
        </p>

        {/* Toggle Periode Bulanan / Tahunan */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                !isAnnual
                  ? "bg-white text-slate-900 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bulanan
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                isAnnual
                  ? "bg-slate-900 text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Tahunan</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                Hemat 36%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Tier Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {TIERS.map((tier) => {
          const isFeatured = tier.isPopular;
          const currentPrice = isAnnual ? tier.priceAnnual : tier.priceMonthly;
          const currentPeriod = isAnnual ? tier.periodAnnual : tier.periodMonthly;

          return (
            <div
              key={tier.id}
              className={`relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 transition-all duration-200 ${
                isFeatured
                  ? "bg-slate-900 text-white border-2 border-slate-900 shadow-xl shadow-slate-900/10 md:-translate-y-2"
                  : "bg-white text-slate-900 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md"
              }`}
            >
              {/* Badge Popular / Instansi */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-tight shadow-xs ${
                      isFeatured
                        ? "bg-blue-600 text-white border border-blue-500"
                        : "bg-slate-100 text-slate-800 border border-slate-200"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{tier.badge}</span>
                  </span>
                </div>
              )}

              {/* Top Section: Tier Title, Price, Description */}
              <div className="space-y-6">
                <div className="space-y-2 border-b pb-5 border-slate-100 dark:border-slate-800">
                  <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${
                    isFeatured ? "text-white" : "text-slate-900"
                  }`}>
                    {tier.name}
                  </h3>
                  <p className={`text-xs sm:text-[13px] leading-relaxed ${
                    isFeatured ? "text-slate-300" : "text-slate-600"
                  }`}>
                    {tier.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black tracking-tight">
                      {currentPrice}
                    </span>
                    <span className={`text-xs sm:text-sm font-medium ${
                      isFeatured ? "text-slate-300" : "text-slate-500"
                    }`}>
                      {currentPeriod}
                    </span>
                  </div>
                </div>

                {/* Feature List */}
                <div className="space-y-3 pt-2">
                  <span className={`text-xs font-bold uppercase tracking-wider block ${
                    isFeatured ? "text-slate-400" : "text-slate-400"
                  }`}>
                    Termasuk Semua Fitur:
                  </span>
                  <ul className="space-y-2.5 text-xs sm:text-[13px]">
                    {tier.features.map((feat, fIdx) => (
                      <li key={`feat-${tier.id}-${fIdx}`} className="flex items-start gap-2.5 leading-snug">
                        <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                          isFeatured ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"
                        }`}>
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className={isFeatured ? "text-slate-200" : "text-slate-700"}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Action CTA */}
              <div className="pt-8">
                {tier.id === "gratis" ? (
                  <Link href={tier.ctaHref} className="w-full block">
                    <Button
                      id={`btn-pricing-${tier.id}`}
                      size="lg"
                      className="w-full font-bold text-xs sm:text-sm h-11 sm:h-12 rounded-xl transition-all bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                    >
                      <span>{tier.ctaText}</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    id={`btn-pricing-${tier.id}`}
                    size="lg"
                    onClick={() => handleOpenCheckout(tier.id)}
                    className={`w-full font-bold text-xs sm:text-sm h-11 sm:h-12 rounded-xl transition-all cursor-pointer ${
                      isFeatured
                        ? "bg-white text-slate-950 hover:bg-slate-100 shadow-md border border-slate-200"
                        : "bg-slate-900 hover:bg-slate-800 text-white"
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Sub-bar */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-800" />
          <span>Tanpa Kontrak Mengikat & Bebas Batalkan Kapan Saja</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-800" />
          <span>Faktur Kedinasan Resmi untuk SPJ Dana BOS</span>
        </div>
      </div>
    </div>
  );
}

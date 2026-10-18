"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  CreditCard,
  Activity,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Eye,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PAYMENT_CHANNELS,
  getSubscriptionRequests,
  approveSubscriptionRequest,
  rejectSubscriptionRequest,
  getPaymentChannels,
  generateAdminToUserWhatsAppLink,
  SubscriptionRequest,
} from "@/lib/subscription";
import { getApiUsageMetrics, DEFAULT_API_METRICS } from "@/lib/api-tracker";
import { useNotification } from "@/components/providers/NotificationProvider";

export default function AdminOverviewPage() {
  const { toast } = useNotification();
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [metrics, setMetrics] = useState(DEFAULT_API_METRICS);
  const [channels, setChannels] = useState(PAYMENT_CHANNELS);
  const [feedbackList, setFeedbackList] = useState<
    Array<{
      id: string;
      senderName: string;
      senderSchool: string;
      category: string;
      text: string;
      timestamp: string;
      status: string;
    }>
  >([]);

  const loadData = () => {
    setRequests(getSubscriptionRequests());
    setMetrics(getApiUsageMetrics());
    setChannels(getPaymentChannels());
    try {
      const raw = localStorage.getItem("modulku_admin_feedback_inbox");
      if (raw) setFeedbackList(JSON.parse(raw));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("modulku-subscription-changed", loadData);
    window.addEventListener("modulku-api-logs-changed", loadData);
    window.addEventListener("modulku-feedback-received", loadData);
    window.addEventListener("modulku-payment-channels-changed", loadData);
    return () => {
      window.removeEventListener("modulku-subscription-changed", loadData);
      window.removeEventListener("modulku-api-logs-changed", loadData);
      window.removeEventListener("modulku-feedback-received", loadData);
      window.removeEventListener("modulku-payment-channels-changed", loadData);
    };
  }, []);

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedRequests = requests.filter((r) => r.status === "approved");

  const handleApprove = (req: SubscriptionRequest) => {
    const success = approveSubscriptionRequest(req.id);
    if (success) {
      toast.success(
        `Pembayaran ${req.id} (${req.planName}) berhasil disetujui. Paket akun guru otomatis ditingkatkan.`,
        "Langganan Diaktifkan"
      );
    }
  };

  const handleReject = (req: SubscriptionRequest) => {
    const reason = prompt("Masukkan alasan penolakan transaksi:", "Nominal tidak sesuai struk atau struk buram.");
    if (reason === null) return;
    const success = rejectSubscriptionRequest(req.id, reason);
    if (success) {
      toast.warning(`Transaksi ${req.id} ditolak dengan alasan: ${reason}`, "Transaksi Ditolak");
    }
  };

  return (
    <div className="space-y-8">
      {/* Greeting Banner Header - Bersih, Elegan, dengan Architectural Dot Pattern */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-slate-800" />
              <span>Pusat Kendali Operasional Platform</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              Selamat Datang di ModulKu Control Center
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Pantau aktivitas akun pendidik, persetujuan transaksi langganan manual, dan efisiensi konsumsi token AI secara terpusat dan presisi.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
            <Link href="/admin/persetujuan">
              <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs gap-2 cursor-pointer">
                <span>Verifikasi Tiket ({pendingRequests.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
            <Link href="/admin/pengaturan">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 border-slate-300 font-semibold text-xs h-10 px-5 rounded-xl gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                <span>Pengaturan Sistem</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Kartu Metrik Utama - Bento Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Total Pengguna */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              TOTAL PENDIDIK
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Users className="w-5 h-5 text-slate-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
              148 Guru
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
              <span className="text-[#059669] font-bold">+12 guru</span>
              <span>mendaftar minggu ini</span>
            </p>
          </div>
        </div>

        {/* Metrik 2: Permintaan Menunggu Persetujuan */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              VERIFIKASI LANGGANAN
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <CreditCard className="w-5 h-5 text-slate-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
              {pendingRequests.length} Pending
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {approvedRequests.length} pembayaran telah aktif
            </p>
          </div>
        </div>

        {/* Metrik 3: Hit API Hari Ini */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              PANGGILAN AI HARI INI
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Activity className="w-5 h-5 text-slate-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
              {metrics.todayHits} Panggilan
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">
              ~{Math.round(metrics.totalTokensToday / 1000)}k token diproses hari ini
            </p>
          </div>
        </div>

        {/* Metrik 4: Estimasi Biaya Gemini Bulan Ini */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              ESTIMASI BIAYA BULAN INI
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <DollarSign className="w-5 h-5 text-slate-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
              Rp {metrics.estimatedCostMonthIdr.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-1">
              ${metrics.estimatedCostMonthUsd} USD (Gemini 1.5 Flash)
            </p>
          </div>
        </div>
      </div>

      {/* Bagian 1: Antrean Verifikasi Langganan Manual Cepat */}
      <Card className="bg-white border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-black text-slate-900 tracking-tight">
                Permintaan Langganan Menunggu Persetujuan
              </CardTitle>
              {pendingRequests.length > 0 && (
                <span className="inline-flex font-mono text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {pendingRequests.length} Baru
                </span>
              )}
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1 leading-relaxed">
              Tinjau bukti struk QRIS, DANA, ShopeePay, atau Bank BRI sebelum menaikkan hak akses paket guru.
            </CardDescription>
          </div>

          <Link href="/admin/persetujuan">
            <Button variant="outline" size="sm" className="text-xs font-semibold border-slate-300 text-slate-800 hover:bg-slate-100 bg-white gap-1.5 h-8 rounded-xl cursor-pointer">
              <span>Kelola Semua Transaksi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#059669] mx-auto opacity-70" />
              <p className="text-xs font-bold text-slate-800">
                Seluruh pengajuan transaksi pembayaran telah selesai diproses!
              </p>
              <p className="text-[11px] text-slate-500">
                Tidak ada tiket pending yang membutuhkan verifikasi manual saat ini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                    <th className="py-3 px-4 whitespace-nowrap">Kode Trx</th>
                    <th className="py-3 px-4">Pendidik / Pemesan</th>
                    <th className="py-3 px-4">Paket Langganan</th>
                    <th className="py-3 px-4">Nominal & Metode</th>
                    <th className="py-3 px-4 whitespace-nowrap">Bukti Bayar</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Aksi Persetujuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {pendingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex font-mono tabular-nums text-xs text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded whitespace-nowrap font-bold">
                          {req.id}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{req.userName}</div>
                        <div className="text-[11px] text-slate-500 font-mono truncate max-w-[180px]">
                          {req.userEmail}
                        </div>
                        {req.whatsappNumber && (
                          <div className="text-[11px] text-[#065F46] font-mono tabular-nums font-semibold flex items-center gap-1 mt-0.5">
                            <MessageCircle className="w-3 h-3 text-[#059669]" />
                            <span>{req.whatsappNumber}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white whitespace-nowrap">
                          {req.planName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono tabular-nums font-bold text-slate-900">{req.formattedAmount}</div>
                        <div className="text-[10px] text-slate-500">Metode: {req.paymentMethod}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedProof(req.proofImageUrl)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Periksa Struk</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                          <a
                            href={generateAdminToUserWhatsAppLink(
                              req.whatsappNumber || "089530123608",
                              req.userName,
                              req.planName,
                              req.formattedAmount,
                              req.id,
                              req.status
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#065F46] border border-emerald-200 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
                            title={`Kirim pesan WhatsApp ke ${req.userName}`}
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-[#059669]" />
                            <span>Hubungi</span>
                          </a>

                          <Button
                            size="sm"
                            onClick={() => handleApprove(req)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-colors shadow-xs whitespace-nowrap cursor-pointer h-7"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Setujui</span>
                          </Button>
                          <button
                            type="button"
                            onClick={() => handleReject(req)}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shrink-0 cursor-pointer"
                            title="Tolak Transaksi"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bagian 2: Distribusi Hit Fitur AI Hari Ini & Saluran Pembayaran */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Aktivitas Panggilan Generator AI Bulan Ini
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Rincian beban pemrosesan fitur kurikulum dan evaluasi berbasis model Gemini Flash.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Soal Generator (AKM / HOTS)</span>
                <span className="font-mono text-xs text-slate-600 whitespace-nowrap font-bold">{metrics.hitsByRoute["generate-soal"]} kali</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-slate-900 h-full rounded-full transition-all" style={{ width: "55%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Modul Ajar BKPDM Deep Learning</span>
                <span className="font-mono text-xs text-slate-600 whitespace-nowrap font-bold">{metrics.hitsByRoute["generate-modul"]} kali</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full transition-all" style={{ width: "30%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">ATP, Prota, & Promes Mingguan</span>
                <span className="font-mono text-xs text-slate-600 whitespace-nowrap font-bold">{metrics.hitsByRoute["generate-perangkat"]} kali</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full transition-all" style={{ width: "10%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Slide Tayang PPTX & LKPD</span>
                <span className="font-mono text-xs text-slate-600 whitespace-nowrap font-bold">{metrics.hitsByRoute["generate-presentation"]} kali</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full transition-all" style={{ width: "5%" }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Info Rekening Pembayaran Aktif yang Ditampilkan ke Guru */}
        <Card className="bg-white border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Rekening & Saluran Pembayaran Aktif
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Informasi yang saat ini muncul pada modal checkout guru saat ingin berlangganan.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">QRIS Dinamis 4 Paket</span>
                <span className="text-[11px] text-slate-500">Preset Rp 39k, Rp 299k, Rp 799k, Rp 1.490k</span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECFDF5] text-[#065F46] border border-emerald-200">
                Aktif
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">E-Wallet DANA & ShopeePay</span>
                <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                  DANA: {channels?.dana?.accountNumber || "-"} | SPay: {channels?.shopeepay?.accountNumber || "-"}
                </span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECFDF5] text-[#065F46] border border-emerald-200">
                Aktif
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Transfer Bank BRI</span>
                <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                  No. Rekening: {channels?.bri?.accountNumber || "-"} (a.n. {channels?.bri?.accountName || "ModulKu"})
                </span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECFDF5] text-[#065F46] border border-emerald-200">
                Aktif
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Narahubung WhatsApp Bantuan</span>
                <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                  {channels?.whatsapp?.number || "089530123608"} (Direct Chat)
                </span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECFDF5] text-[#065F46] border border-emerald-200">
                Online
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Kotak Masuk Feedback & Keluh Kesah Pendidik */}
      <Card className="bg-white border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-row items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Kotak Masuk Masukan & Keluh Kesah Pendidik
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Umpan balik langsung yang dikirimkan oleh guru dari widget Chat Admin di ruang kerja dasbor.
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {feedbackList.length} Pesan
          </span>
        </div>

        <div>
          {feedbackList.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-mono">
              Belum ada keluhan atau pesan feedback baru dari guru.
            </div>
          ) : (
            <div className="space-y-3">
              {feedbackList.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{item.senderName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">({item.senderSchool})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 uppercase">
                        {item.category.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Modal Zoom Bukti Pembayaran */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative max-w-lg w-full bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-xs text-slate-900">Pratinjau Struk / Bukti Transfer</span>
              <button
                type="button"
                onClick={() => setSelectedProof(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-200">
              <Image
                src={selectedProof}
                alt="Bukti Transfer"
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <Button
              onClick={() => setSelectedProof(null)}
              className="w-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white h-9 rounded-xl cursor-pointer"
            >
              Tutup Pratinjau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

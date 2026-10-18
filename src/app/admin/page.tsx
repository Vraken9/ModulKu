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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getSubscriptionRequests,
  approveSubscriptionRequest,
  rejectSubscriptionRequest,
  SubscriptionRequest,
} from "@/lib/subscription";
import { getApiUsageMetrics } from "@/lib/api-tracker";
import { useNotification } from "@/components/providers/NotificationProvider";

export default function AdminOverviewPage() {
  const { toast } = useNotification();
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [metrics, setMetrics] = useState(getApiUsageMetrics());
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
    return () => {
      window.removeEventListener("modulku-subscription-changed", loadData);
      window.removeEventListener("modulku-api-logs-changed", loadData);
      window.removeEventListener("modulku-feedback-received", loadData);
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
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Ikhtisar Operasional & Metrik Bisnis
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Pantau aktivitas guru, verifikasi transaksi pembayaran manual, dan kontrol pengeluaran token AI secara presisi.
        </p>
      </div>

      {/* Kartu Metrik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Total Pengguna */}
        <Card className="bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-xs">
          <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Pendidik Terdaftar
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/70 flex items-center justify-center text-slate-300">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-1">
            <div className="text-2xl font-bold text-slate-50 tracking-tight">148 Guru</div>
            <p className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12 guru mendaftar minggu ini</span>
            </p>
          </CardContent>
        </Card>

        {/* Metrik 2: Permintaan Menunggu Persetujuan */}
        <Card className="bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-xs">
          <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verifikasi Langganan
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/70 flex items-center justify-center text-slate-300">
              <CreditCard className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-1">
            <div className="text-2xl font-bold text-slate-50 tracking-tight">
              {pendingRequests.length} Pending
            </div>
            <p className="text-xs text-slate-400">
              {approvedRequests.length} pembayaran telah aktif
            </p>
          </CardContent>
        </Card>

        {/* Metrik 3: Hit API Hari Ini */}
        <Card className="bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-xs">
          <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Panggilan AI Hari Ini
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/70 flex items-center justify-center text-slate-300">
              <Activity className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-1">
            <div className="text-2xl font-bold text-slate-50 tracking-tight">
              {metrics.todayHits} Panggilan
            </div>
            <p className="text-xs text-slate-400 font-mono">
              ~{Math.round(metrics.totalTokensToday / 1000)}k token diproses hari ini
            </p>
          </CardContent>
        </Card>

        {/* Metrik 4: Estimasi Biaya Gemini Bulan Ini */}
        <Card className="bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-xs">
          <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Estimasi Biaya AI Bulan Ini
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/70 flex items-center justify-center text-slate-300">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-1">
            <div className="text-2xl font-bold text-slate-50 tracking-tight font-mono">
              Rp {metrics.estimatedCostMonthIdr.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              ${metrics.estimatedCostMonthUsd} USD (Gemini 1.5 Flash)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bagian 1: Antrean Verifikasi Langganan Manual Cepat */}
      <Card className="bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold text-slate-100">
                Permintaan Langganan Menunggu Persetujuan
              </CardTitle>
              {pendingRequests.length > 0 && (
                <span className="inline-flex font-mono text-xs text-slate-200 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded whitespace-nowrap">
                  {pendingRequests.length} Baru
                </span>
              )}
            </div>
            <CardDescription className="text-xs text-slate-400 mt-0.5">
              Tinjau bukti struk QRIS, DANA, ShopeePay, atau Bank BRI sebelum menaikkan hak akses paket guru.
            </CardDescription>
          </div>

          <Link href="/admin/persetujuan">
            <Button variant="outline" size="sm" className="text-xs font-medium border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 gap-1.5 h-8 rounded-lg">
              <span>Kelola Semua Transaksi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="pt-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto opacity-70" />
              <p className="text-xs font-semibold text-slate-300">
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
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase">
                    <th className="py-2.5 px-3 whitespace-nowrap">Kode Trx</th>
                    <th className="py-2.5 px-3">Pendidik / Pemesan</th>
                    <th className="py-2.5 px-3">Paket Langganan</th>
                    <th className="py-2.5 px-3">Nominal & Metode</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Bukti Bayar</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Aksi Persetujuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {pendingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex font-mono text-xs text-slate-200 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded whitespace-nowrap">
                          {req.id}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-100">{req.userName}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                          {req.userEmail}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-100 border border-slate-700 whitespace-nowrap">
                          {req.planName}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-slate-100">{req.formattedAmount}</div>
                        <div className="text-[10px] text-slate-400">Metode: {req.paymentMethod}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedProof(req.proofImageUrl)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Periksa Struk</span>
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(req)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-xs whitespace-nowrap cursor-pointer h-8"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Setujui</span>
                          </Button>
                          <button
                            type="button"
                            onClick={() => handleReject(req)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors shrink-0 cursor-pointer"
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

      {/* Bagian 2: Distribusi Hit Fitur AI Hari Ini */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-800/80">
            <CardTitle className="text-base font-semibold text-slate-100">
              Aktivitas Panggilan Generator AI Bulan Ini
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Rincian beban pemrosesan fitur kurikulum dan evaluasi berbasis model Gemini Flash.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Soal Generator (AKM / HOTS)</span>
                <span className="font-mono text-xs text-slate-300 whitespace-nowrap">{metrics.hitsByRoute["generate-soal"]} kali</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-slate-100 h-full rounded-full" style={{ width: "55%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Modul Ajar BKPDM Deep Learning</span>
                <span className="font-mono text-xs text-slate-300 whitespace-nowrap">{metrics.hitsByRoute["generate-modul"]} kali</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: "30%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">ATP, Prota, & Promes Mingguan</span>
                <span className="font-mono text-xs text-slate-300 whitespace-nowrap">{metrics.hitsByRoute["generate-perangkat"]} kali</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: "10%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Slide Tayang PPTX & LKPD</span>
                <span className="font-mono text-xs text-slate-300 whitespace-nowrap">{metrics.hitsByRoute["generate-presentation"]} kali</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: "5%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Rekening Pembayaran Aktif yang Ditampilkan ke Guru */}
        <Card className="bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-800/80">
            <CardTitle className="text-base font-semibold text-slate-100">
              Rekening & Saluran Pembayaran Aktif
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Informasi yang saat ini muncul pada modal checkout guru saat ingin berlangganan.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-100 block">QRIS Dinamis 4 Paket</span>
                <span className="text-[11px] text-slate-400">Preset Rp 39k, Rp 299k, Rp 799k, Rp 1.490k</span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Aktif
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-100 block">E-Wallet DANA & ShopeePay</span>
                <span className="text-[11px] text-slate-400 font-mono">DANA: 089530123608 | SPay: 0895301235608</span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Aktif
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-100 block">Transfer Bank BRI</span>
                <span className="text-[11px] text-slate-400 font-mono">No. Rekening: 662501037567538</span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Aktif
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-100 block">Narahubung WhatsApp Bantuan</span>
                <span className="text-[11px] text-slate-400 font-mono">089530123608 (Direct Chat)</span>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Online
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kotak Masuk Feedback & Keluh Kesah Pendidik */}
      <Card className="bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-slate-100">
              Kotak Masuk Masukan & Keluh Kesah Pendidik
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Umpan balik langsung yang dikirimkan oleh guru dari widget Chat Admin di ruang kerja dasbor.
            </CardDescription>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
            {feedbackList.length} Pesan Masuk
          </span>
        </CardHeader>
        <CardContent className="pt-4">
          {feedbackList.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 font-mono">
              Belum ada keluhan atau pesan feedback baru dari guru.
            </div>
          ) : (
            <div className="space-y-3">
              {feedbackList.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-100">{item.senderName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({item.senderSchool})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 uppercase">
                        {item.category.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(item.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Zoom Bukti Pembayaran */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative max-w-lg w-full bg-slate-900 rounded-2xl border border-slate-700 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-xs text-white">Pratinjau Struk / Bukti Transfer</span>
              <button
                type="button"
                onClick={() => setSelectedProof(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
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
              className="w-full text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white h-9"
            >
              Tutup Pratinjau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

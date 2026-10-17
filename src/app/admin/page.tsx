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

  const loadData = () => {
    setRequests(getSubscriptionRequests());
    setMetrics(getApiUsageMetrics());
  };

  useEffect(() => {
    loadData();
    window.addEventListener("modulku-subscription-changed", loadData);
    window.addEventListener("modulku-api-logs-changed", loadData);
    return () => {
      window.removeEventListener("modulku-subscription-changed", loadData);
      window.removeEventListener("modulku-api-logs-changed", loadData);
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
        <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Pendidik Terdaftar
            </CardTitle>
            <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-black tracking-tight">148 Guru</div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12 guru mendaftar minggu ini</span>
            </p>
          </CardContent>
        </Card>

        {/* Metrik 2: Permintaan Menunggu Persetujuan */}
        <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verifikasi Langganan
            </CardTitle>
            <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/60">
              <CreditCard className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-black tracking-tight text-amber-400">
              {pendingRequests.length} Pending
            </div>
            <p className="text-[11px] text-slate-400">
              {approvedRequests.length} pembayaran telah aktif
            </p>
          </CardContent>
        </Card>

        {/* Metrik 3: Hit API Hari Ini */}
        <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Panggilan AI Hari Ini
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              <Activity className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-black tracking-tight text-emerald-400">
              {metrics.todayHits} Panggilan
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              ~{Math.round(metrics.totalTokensToday / 1000)}k token diproses hari ini
            </p>
          </CardContent>
        </Card>

        {/* Metrik 4: Estimasi Biaya Gemini Bulan Ini */}
        <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Estimasi Biaya AI Bulan Ini
            </CardTitle>
            <div className="p-2 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/60">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xl font-black tracking-tight font-mono text-white">
              Rp {metrics.estimatedCostMonthIdr.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              ${metrics.estimatedCostMonthUsd} USD (Gemini 1.5 Flash)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bagian 1: Antrean Verifikasi Langganan Manual Cepat */}
      <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-black tracking-tight">
                Permintaan Langganan Menunggu Persetujuan
              </CardTitle>
              {pendingRequests.length > 0 && (
                <Badge className="bg-rose-600 text-white font-mono text-xs px-2 py-0.5">
                  {pendingRequests.length} Baru
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs text-slate-400 mt-0.5">
              Tinjau bukti struk QRIS, DANA, ShopeePay, atau Bank BRI sebelum menaikkan hak akses paket guru.
            </CardDescription>
          </div>

          <Link href="/admin/persetujuan">
            <Button variant="outline" size="sm" className="text-xs font-bold border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 gap-1.5 h-8">
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
                    <th className="py-2.5 px-3">Kode Trx</th>
                    <th className="py-2.5 px-3">Pendidik / Pemesan</th>
                    <th className="py-2.5 px-3">Paket Langganan</th>
                    <th className="py-2.5 px-3">Nominal & Metode</th>
                    <th className="py-2.5 px-3">Bukti Bayar</th>
                    <th className="py-2.5 px-3 text-right">Aksi Persetujuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {pendingRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-300">
                        {req.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{req.userName}</div>
                        <div className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                          {req.userEmail}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="bg-slate-900 border-slate-700 text-indigo-300 font-semibold text-[11px]">
                          {req.planName}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-emerald-400">{req.formattedAmount}</div>
                        <div className="text-[10px] text-slate-400">Metode: {req.paymentMethod}</div>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => setSelectedProof(req.proofImageUrl)}
                          className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Periksa Struk</span>
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(req)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] h-8 px-3 rounded-lg shadow-2xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          <span>Setujui</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(req)}
                          className="border-slate-700 hover:bg-rose-950/60 text-rose-400 hover:border-rose-800 text-[11px] h-8 px-2.5 rounded-lg cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
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
        <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-800/80">
            <CardTitle className="text-base font-black tracking-tight">
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
                <span className="font-mono text-indigo-300">{metrics.hitsByRoute["generate-soal"]} kali</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: "55%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Modul Ajar BKPDM Deep Learning</span>
                <span className="font-mono text-emerald-300">{metrics.hitsByRoute["generate-modul"]} kali</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "30%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">ATP, Prota, & Promes Mingguan</span>
                <span className="font-mono text-amber-300">{metrics.hitsByRoute["generate-perangkat"]} kali</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: "10%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Slide Tayang PPTX & LKPD</span>
                <span className="font-mono text-blue-300">{metrics.hitsByRoute["generate-presentation"]} kali</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "5%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Rekening Pembayaran Aktif yang Ditampilkan ke Guru */}
        <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-800/80">
            <CardTitle className="text-base font-black tracking-tight">
              Rekening & Saluran Pembayaran Aktif
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Informasi yang saat ini muncul pada modal checkout guru saat ingin berlangganan.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">QRIS Dinamis 4 Paket</span>
                <span className="text-[11px] text-slate-400">Preset Rp 39k, Rp 299k, Rp 799k, Rp 1.490k</span>
              </div>
              <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800">Aktif</Badge>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">E-Wallet DANA & ShopeePay</span>
                <span className="text-[11px] text-slate-400 font-mono">DANA: 089530123608 | SPay: 0895301235608</span>
              </div>
              <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800">Aktif</Badge>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Transfer Bank BRI</span>
                <span className="text-[11px] text-slate-400 font-mono">No. Rekening: 662501037567538</span>
              </div>
              <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800">Aktif</Badge>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Narahubung WhatsApp Bantuan</span>
                <span className="text-[11px] text-slate-400 font-mono">089530123608 (Direct Chat)</span>
              </div>
              <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800">Online</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

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

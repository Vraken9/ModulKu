"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  DollarSign,
  TrendingDown,
  Sparkles,
  Server,
  Zap,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getApiLogs, getApiUsageMetrics, ApiHitLog } from "@/lib/api-tracker";

export default function AdminApiCostPage() {
  const [logs, setLogs] = useState<ApiHitLog[]>([]);
  const [metrics, setMetrics] = useState(getApiUsageMetrics());

  useEffect(() => {
    setLogs(getApiLogs());
    setMetrics(getApiUsageMetrics());
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Activity className="w-6 h-6 text-emerald-400" />
          <span>Pelacakan Hit API & Estimasi Biaya Model AI</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Transparansi konsumsi token, frekuensi pemanggilan model Google Gemini 1.5 Flash, dan proyeksi tagihan bulanan.
        </p>
      </div>

      {/* 4 Kartu Metrik Biaya */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Panggilan Hari Ini
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              <Zap className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-black tracking-tight text-emerald-400">
              {metrics.todayHits} Hits
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              ~{Math.round(metrics.totalTokensToday / 1000)}k token terpakai
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Panggilan Bulan Ini
            </CardTitle>
            <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
              <Server className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-black tracking-tight">
              {metrics.monthHits} Hits
            </div>
            <p className="text-[11px] text-slate-400">
              Rata-rata ~16 panggilan / hari
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Estimasi Biaya Hari Ini
            </CardTitle>
            <div className="p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-black tracking-tight text-white font-mono">
              Rp {metrics.estimatedCostTodayIdr.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              ${metrics.estimatedCostTodayUsd} USD
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Proyeksi Biaya Bulan Ini
            </CardTitle>
            <div className="p-2 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/60">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-black tracking-tight text-emerald-400 font-mono">
              Rp {metrics.estimatedCostMonthIdr.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              ${metrics.estimatedCostMonthUsd} USD (~Rp 25rb)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bagian Penjelasan Rumus Biaya Resmi Google Cloud */}
      <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <CardTitle className="text-base font-black tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>Dasar Perhitungan Tarif Token (Gemini 1.5 Flash Resmi)</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Model Google Gemini 1.5 Flash memiliki efisiensi biaya tertinggi di kelasnya dengan kecepatan respons di bawah 2 detik.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3 text-xs leading-relaxed text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tarif Input Token</span>
              <div className="text-base font-mono font-bold text-white">$0.075 / 1.000.000 Token</div>
              <p className="text-[11px] text-slate-400">Mencakup instruksi prompt, materi rujukan PDF, dan parameter kurikulum.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tarif Output Token</span>
              <div className="text-base font-mono font-bold text-white">$0.30 / 1.000.000 Token</div>
              <p className="text-[11px] text-slate-400">Mencakup hasil paket soal, kunci jawaban, tabel sintaks modul ajar, dan slide.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Kurs Acuan Konversi</span>
              <div className="text-base font-mono font-bold text-emerald-400">1 USD = Rp 15.850</div>
              <p className="text-[11px] text-slate-400">Biaya tagihan otomatis dikonversi ke Rupiah untuk kemudahan pembukuan.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/50 border border-indigo-800/60 text-indigo-200 text-xs">
            <strong>Kesimpulan Efisiensi Finansial:</strong> Dengan harga paket langganan Rp 39.000/bulan (Profesional) dan Rp 299.000/tahun, margin keuntungan bersih platform mencapai lebih dari <strong>95%</strong>, karena rata-rata biaya API satu akun guru aktif hanya sekitar <strong>Rp 500 s/d Rp 1.500 per bulan</strong>.
          </div>
        </CardContent>
      </Card>

      {/* Tabel Log Riwayat Panggilan Terakhir */}
      <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <CardTitle className="text-base font-black tracking-tight">
            Log Riwayat Panggilan AI Terbaru
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Catatan panggilan sukses ke model AI dari generator kurikulum dan soal.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-900/40">
                  <th className="py-3 px-4">Fitur / Rute API</th>
                  <th className="py-3 px-4">Waktu Panggilan</th>
                  <th className="py-3 px-4">Input Token</th>
                  <th className="py-3 px-4">Output Token</th>
                  <th className="py-3 px-4">Total Token</th>
                  <th className="py-3 px-4 text-right">Estimasi Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {logs.slice(0, 15).map((log, idx) => {
                  const inputCost = log.inputTokens * (0.075 / 1000000);
                  const outputCost = log.outputTokens * (0.30 / 1000000);
                  const totalCostIdr = Math.round((inputCost + outputCost) * 15850);

                  return (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{log.endpointName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">/api/ai/{log.endpoint}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {new Date(log.timestamp).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">{log.inputTokens.toLocaleString("id-ID")}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">{log.outputTokens.toLocaleString("id-ID")}</td>
                      <td className="py-3 px-4 font-mono text-indigo-300 font-bold">
                        {(log.inputTokens + log.outputTokens).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                        Rp {Math.max(1, totalCostIdr)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

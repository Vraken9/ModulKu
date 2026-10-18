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
        <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
          <Activity className="w-6 h-6 text-slate-300" />
          <span>Pelacakan Hit API & Estimasi Biaya Model AI</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Transparansi konsumsi token, frekuensi pemanggilan model Google Gemini 1.5 Flash, dan proyeksi tagihan bulanan.
        </p>
      </div>

      {/* 4 Kartu Metrik Biaya */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Panggilan Hari Ini</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/70 flex items-center justify-center text-slate-300">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-50 tracking-tight font-mono">
              {metrics.todayHits} Hits
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              ~{Math.round(metrics.totalTokensToday / 1000)}k token terpakai
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Panggilan Bulan Ini</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/70 flex items-center justify-center text-slate-300">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-50 tracking-tight font-mono">
              {metrics.monthHits} Hits
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Rata-rata ~16 panggilan / hari
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Estimasi Biaya Hari Ini</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/70 flex items-center justify-center text-slate-300">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-50 tracking-tight font-mono">
              Rp {metrics.estimatedCostTodayIdr.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              ${metrics.estimatedCostTodayUsd} USD
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Proyeksi Biaya Bulan Ini</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/70 flex items-center justify-center text-slate-300">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-50 tracking-tight font-mono">
              Rp {metrics.estimatedCostMonthIdr.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              ${metrics.estimatedCostMonthUsd} USD (~Rp 25rb)
            </p>
          </div>
        </div>
      </div>

      {/* Bagian Penjelasan Rumus Biaya Resmi Google Cloud */}
      <Card className="bg-slate-900 border border-slate-800 rounded-xl text-slate-100 shadow-xs">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <CardTitle className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-300" />
            <span>Dasar Perhitungan Tarif Token (Gemini 1.5 Flash Resmi)</span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Model Google Gemini 1.5 Flash memiliki efisiensi biaya tertinggi di kelasnya dengan kecepatan respons di bawah 2 detik.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3 text-xs leading-relaxed text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tarif Input Token</span>
              <div className="text-sm font-mono font-bold text-slate-100">$0.075 / 1.000.000 Token</div>
              <p className="text-[11px] text-slate-400">Mencakup instruksi prompt, materi rujukan PDF, dan parameter kurikulum.</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tarif Output Token</span>
              <div className="text-sm font-mono font-bold text-slate-100">$0.30 / 1.000.000 Token</div>
              <p className="text-[11px] text-slate-400">Mencakup hasil paket soal, kunci jawaban, tabel sintaks modul ajar, dan slide.</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Kurs Acuan Konversi</span>
              <div className="text-sm font-mono font-bold text-slate-100">1 USD = Rp 15.850</div>
              <p className="text-[11px] text-slate-400">Biaya tagihan otomatis dikonversi ke Rupiah untuk kemudahan pembukuan.</p>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/80 rounded-lg p-3.5 text-xs text-slate-300">
            <strong className="text-slate-100 font-semibold">Kesimpulan Efisiensi Finansial:</strong> Dengan harga paket langganan Rp 39.000/bulan (Profesional) dan Rp 299.000/tahun, margin keuntungan bersih platform mencapai lebih dari <strong className="text-slate-100 font-semibold">95%</strong>, karena rata-rata biaya API satu akun guru aktif hanya sekitar <strong className="text-slate-100 font-semibold">Rp 500 s/d Rp 1.500 per bulan</strong>.
          </div>
        </CardContent>
      </Card>

      {/* Tabel Log Riwayat Panggilan Terakhir */}
      <Card className="bg-slate-900 border border-slate-800 rounded-xl text-slate-100 shadow-xs">
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <CardTitle className="text-base font-semibold text-slate-100">
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
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/40">
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Fitur / Rute API</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Waktu Panggilan</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Input Token</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Output Token</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Total Token</th>
                  <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Estimasi Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {logs.slice(0, 15).map((log, idx) => {
                  const inputCost = log.inputTokens * (0.075 / 1000000);
                  const outputCost = log.outputTokens * (0.30 / 1000000);
                  const totalCostIdr = Math.round((inputCost + outputCost) * 15850);

                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-100">{log.endpointName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">/api/ai/{log.endpoint}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-300">{log.inputTokens.toLocaleString("id-ID")}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-300">{log.outputTokens.toLocaleString("id-ID")}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-200 font-medium">
                        {(log.inputTokens + log.outputTokens).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-emerald-400 font-medium">
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

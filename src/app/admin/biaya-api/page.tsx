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
import { getApiLogs, getApiUsageMetrics, DEFAULT_API_METRICS, ApiHitLog } from "@/lib/api-tracker";

export default function AdminApiCostPage() {
  const [logs, setLogs] = useState<ApiHitLog[]>([]);
  const [metrics, setMetrics] = useState(DEFAULT_API_METRICS);

  useEffect(() => {
    setLogs(getApiLogs());
    setMetrics(getApiUsageMetrics());
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Activity className="w-6 h-6 text-slate-700" />
          <span>Pelacakan Hit API & Estimasi Biaya Model AI</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Transparansi konsumsi token, frekuensi pemanggilan model Google Gemini 1.5 Flash, dan proyeksi tagihan bulanan.
        </p>
      </div>

      {/* 4 Kartu Metrik Biaya - Bento Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              TOTAL PANGGILAN HARI INI
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Zap className="w-5 h-5 text-slate-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
              {metrics.todayHits} Hits
            </div>
            <p className="text-xs text-slate-500 font-mono tabular-nums mt-1">
              ~{Math.round(metrics.totalTokensToday / 1000)}k token terpakai
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              TOTAL PANGGILAN BULAN INI
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Server className="w-5 h-5 text-slate-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
              {metrics.monthHits} Hits
            </div>
            <p className="text-xs text-slate-500 font-mono tabular-nums mt-1">
              Rata-rata ~16 panggilan / hari
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              ESTIMASI BIAYA HARI INI
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <DollarSign className="w-5 h-5 text-slate-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
              Rp {metrics.estimatedCostTodayIdr.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500 font-mono tabular-nums mt-1">
              ${metrics.estimatedCostTodayUsd} USD
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              PROYEKSI BIAYA BULAN INI
            </span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <TrendingDown className="w-5 h-5 text-slate-700" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono tabular-nums">
              Rp {metrics.estimatedCostMonthIdr.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-500 font-mono tabular-nums mt-1">
              ${metrics.estimatedCostMonthUsd} USD (~Rp 25rb)
            </p>
          </div>
        </div>
      </div>

      {/* Bagian Penjelasan Rumus Biaya Resmi Google Cloud */}
      <Card className="bg-white border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-700" />
            <span>Dasar Perhitungan Tarif Token (Gemini 1.5 Flash Resmi)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Model Google Gemini 1.5 Flash memiliki efisiensi biaya tertinggi di kelasnya dengan kecepatan respons di bawah 2 detik.
          </p>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Tarif Input Token</span>
              <div className="text-sm font-mono font-bold text-slate-900">$0.075 / 1.000.000 Token</div>
              <p className="text-[11px] text-slate-500">Mencakup instruksi prompt, materi rujukan PDF, dan parameter kurikulum.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Tarif Output Token</span>
              <div className="text-sm font-mono font-bold text-slate-900">$0.30 / 1.000.000 Token</div>
              <p className="text-[11px] text-slate-500">Mencakup hasil paket soal, kunci jawaban, tabel sintaks modul ajar, dan slide.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Kurs Acuan Konversi</span>
              <div className="text-sm font-mono font-bold text-slate-900">1 USD = Rp 15.850</div>
              <p className="text-[11px] text-slate-500">Biaya tagihan otomatis dikonversi ke Rupiah untuk kemudahan pembukuan.</p>
            </div>
          </div>

          <div className="bg-[#ECFDF5] border border-emerald-200 rounded-xl p-4 text-xs text-[#065F46]">
            <strong className="font-bold">Kesimpulan Efisiensi Finansial:</strong> Dengan harga paket langganan Rp 39.000/bulan (Profesional) dan Rp 299.000/tahun, margin keuntungan bersih platform mencapai lebih dari <strong className="font-bold">95%</strong>, karena rata-rata biaya API satu akun guru aktif hanya sekitar <strong className="font-bold">Rp 500 s/d Rp 1.500 per bulan</strong>.
          </div>
        </div>
      </Card>

      {/* Tabel Log Riwayat Panggilan Terakhir */}
      <Card className="bg-white border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            Log Riwayat Panggilan AI Terbaru
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Catatan panggilan sukses ke model AI dari generator kurikulum dan soal.
          </p>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                  <th className="py-3 px-4 font-bold whitespace-nowrap">Fitur / Rute API</th>
                  <th className="py-3 px-4 font-bold whitespace-nowrap">Waktu Panggilan</th>
                  <th className="py-3 px-4 font-bold whitespace-nowrap">Input Token</th>
                  <th className="py-3 px-4 font-bold whitespace-nowrap">Output Token</th>
                  <th className="py-3 px-4 font-bold whitespace-nowrap">Total Token</th>
                  <th className="py-3 px-4 text-right font-bold whitespace-nowrap">Estimasi Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {logs.slice(0, 15).map((log, idx) => {
                  const inputCost = log.inputTokens * (0.075 / 1000000);
                  const outputCost = log.outputTokens * (0.30 / 1000000);
                  const totalCostIdr = Math.round((inputCost + outputCost) * 15850);

                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{log.endpointName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">/api/ai/{log.endpoint}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString("id-ID", {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{log.inputTokens.toLocaleString("id-ID")}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{log.outputTokens.toLocaleString("id-ID")}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-900 font-bold">
                        {(log.inputTokens + log.outputTokens).toLocaleString("id-ID")}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs text-[#065F46] font-bold">
                        Rp {Math.max(1, totalCostIdr)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}

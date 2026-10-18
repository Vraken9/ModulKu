"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  CreditCard,
  Check,
  X,
  Eye,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getSubscriptionRequests,
  approveSubscriptionRequest,
  rejectSubscriptionRequest,
  SubscriptionRequest,
  SubscriptionStatus,
  generateWhatsAppLink,
} from "@/lib/subscription";
import { useNotification } from "@/components/providers/NotificationProvider";

export default function AdminApprovalsPage() {
  const { toast } = useNotification();
  const [requests, setRequests] = useState<SubscriptionRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const loadRequests = () => {
    setRequests(getSubscriptionRequests());
  };

  useEffect(() => {
    loadRequests();
    window.addEventListener("modulku-subscription-changed", loadRequests);
    return () => window.removeEventListener("modulku-subscription-changed", loadRequests);
  }, []);

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = filterStatus === "all" || req.status === filterStatus;
    const matchesSearch =
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.senderName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (req: SubscriptionRequest) => {
    const success = approveSubscriptionRequest(req.id);
    if (success) {
      toast.success(
        `Transaksi ${req.id} (${req.planName}) berhasil disetujui. Kuota dan paket guru telah aktif.`,
        "Persetujuan Berhasil"
      );
    }
  };

  const handleReject = (req: SubscriptionRequest) => {
    const reason = prompt("Masukkan alasan penolakan transaksi:", "Nominal tidak sesuai struk atau bukti tidak terbaca.");
    if (reason === null) return;
    const success = rejectSubscriptionRequest(req.id, reason);
    if (success) {
      toast.warning(`Transaksi ${req.id} ditolak dengan catatan: ${reason}`, "Transaksi Ditolak");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-slate-300" />
            <span>Persetujuan Langganan Manual</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verifikasi struk transfer pembayaran (QRIS, DANA, ShopeePay, Bank BRI) untuk aktivasi akun pendidik.
          </p>
        </div>
      </div>

      {/* Kontrol Pencarian & Filter */}
      <Card className="bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode transaksi, nama guru, atau email..."
              className="pl-9 text-xs h-9 bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "Semua Transaksi" },
              { id: "pending", label: "Menunggu Persetujuan" },
              { id: "approved", label: "Disetujui" },
              { id: "rejected", label: "Ditolak" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterStatus === tab.id
                    ? "bg-slate-100 text-slate-950 font-semibold"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabel Permintaan */}
      <Card className="bg-slate-900 border border-slate-800 text-white rounded-xl shadow-xs">
        <CardContent className="p-0">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Clock className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-300">
                Tidak ada data transaksi yang cocok dengan kriteria filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/40">
                    <th className="py-3 px-4 whitespace-nowrap">Kode Trx</th>
                    <th className="py-3 px-4">Pendidik & Email</th>
                    <th className="py-3 px-4">Paket & Biaya</th>
                    <th className="py-3 px-4">Metode & Pengirim</th>
                    <th className="py-3 px-4 whitespace-nowrap">Tanggal Masuk</th>
                    <th className="py-3 px-4 whitespace-nowrap">Status</th>
                    <th className="py-3 px-4 whitespace-nowrap">Bukti</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex font-mono text-xs text-slate-200 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded whitespace-nowrap">
                          {req.id}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-100">{req.userName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{req.userEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{req.planName}</div>
                        <div className="text-slate-100 font-mono font-bold text-[11px]">
                          {req.formattedAmount}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300 mb-0.5">
                          {req.paymentMethod}
                        </span>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          a.n. {req.senderName}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {req.status === "approved" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                            Disetujui
                          </span>
                        )}
                        {req.status === "pending" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                            Menunggu Verifikasi
                          </span>
                        )}
                        {req.status === "rejected" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 whitespace-nowrap">
                            Ditolak
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedProof(req.proofImageUrl)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Struk</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                          {req.status === "pending" ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(req)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-xs whitespace-nowrap cursor-pointer h-8"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </Button>
                              <button
                                type="button"
                                onClick={() => handleReject(req)}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors shrink-0 cursor-pointer"
                                title="Tolak Transaksi"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <a
                              href={generateWhatsAppLink(req.planName, req.formattedAmount, req.paymentMethod, req.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border border-slate-700 text-xs font-medium whitespace-nowrap transition-colors"
                              title="Hubungi Guru via WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Hubungi</span>
                            </a>
                          )}
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
              className="w-full text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white h-9 cursor-pointer"
            >
              Tutup Pratinjau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

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
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-indigo-400" />
            <span>Persetujuan Langganan Manual</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verifikasi struk transfer pembayaran (QRIS, DANA, ShopeePay, Bank BRI) untuk aktivasi akun pendidik.
          </p>
        </div>
      </div>

      {/* Kontrol Pencarian & Filter */}
      <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode transaksi, nama guru, atau email..."
              className="pl-9 text-xs h-9 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  filterStatus === tab.id
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabel Permintaan */}
      <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
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
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-900/40">
                    <th className="py-3 px-4">Kode Trx</th>
                    <th className="py-3 px-4">Pendidik & Email</th>
                    <th className="py-3 px-4">Paket & Biaya</th>
                    <th className="py-3 px-4">Metode & Pengirim</th>
                    <th className="py-3 px-4">Tanggal Masuk</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Bukti</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                        {req.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{req.userName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{req.userEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{req.planName}</div>
                        <div className="text-emerald-400 font-mono font-bold text-[11px]">
                          {req.formattedAmount}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 text-[10px] mb-0.5">
                          {req.paymentMethod}
                        </Badge>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          a.n. {req.senderName}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(req.createdAt).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        {req.status === "approved" && (
                          <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 font-semibold text-[10px]">
                            Disetujui
                          </Badge>
                        )}
                        {req.status === "pending" && (
                          <Badge className="bg-amber-950 text-amber-300 border-amber-800 font-semibold text-[10px]">
                            Menunggu Verifikasi
                          </Badge>
                        )}
                        {req.status === "rejected" && (
                          <Badge className="bg-rose-950 text-rose-300 border-rose-800 font-semibold text-[10px]">
                            Ditolak
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => setSelectedProof(req.proofImageUrl)}
                          className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Struk</span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {req.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(req)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] h-8 px-3 rounded-lg shadow-2xs cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" />
                              <span>Approve</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(req)}
                              className="border-slate-700 hover:bg-rose-950/60 text-rose-400 hover:border-rose-800 text-[11px] h-8 px-2 rounded-lg cursor-pointer"
                              title="Tolak Transaksi"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                          <a
                            href={generateWhatsAppLink(req.planName, req.formattedAmount, req.paymentMethod, req.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-emerald-400"
                            title="Hubungi Guru via WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Hubungi</span>
                          </a>
                        )}
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

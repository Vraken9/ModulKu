"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  QrCode,
  Smartphone,
  Building2,
  Copy,
  Check,
  Clock,
  UploadCloud,
  FileCheck2,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  Download,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  SUBSCRIPTION_PLANS,
  PAYMENT_CHANNELS,
  PaymentMethod,
  saveSubscriptionRequest,
  generateWhatsAppLink,
  SubscriptionRequest,
} from "@/lib/subscription";
import { getActiveUserId } from "@/lib/document-vault";
import { useNotification } from "@/components/providers/NotificationProvider";

interface SubscriptionCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanId?: string;
}

export function SubscriptionCheckoutModal({
  isOpen,
  onClose,
  defaultPlanId = "profesional_annual",
}: SubscriptionCheckoutModalProps) {
  const { toast } = useNotification();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QRIS");
  const [senderName, setSenderName] = useState("");
  const [notes, setNotes] = useState("");
  const [proofFile, setProofFile] = useState<{ name: string; url: string; size: number } | null>(
    null
  );
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTrx, setSubmittedTrx] = useState<SubscriptionRequest | null>(null);

  // Timer 60 Menit
  const [timeLeft, setTimeLeft] = useState(60 * 60);

  useEffect(() => {
    if (defaultPlanId && SUBSCRIPTION_PLANS[defaultPlanId]) {
      setSelectedPlanId(defaultPlanId);
    }
  }, [defaultPlanId]);

  useEffect(() => {
    if (!isOpen) {
      setSubmittedTrx(null);
      setProofFile(null);
      setSenderName("");
      setNotes("");
      setTimeLeft(60 * 60);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPlan = SUBSCRIPTION_PLANS[selectedPlanId] || SUBSCRIPTION_PLANS.profesional_annual;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success(`Nomor ${fieldId} berhasil disalin ke papan klip.`, "Tersalin");
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi Keamanan Berkas: Hanya Format Gambar & Maksimal 2 MB
    const allowedMime = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMime.includes(file.type)) {
      toast.error("Format berkas harus berupa gambar (JPG, PNG, atau WebP).");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran bukti transfer maksimal 2 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProofFile({
        name: file.name,
        url: (event.target?.result as string) || "",
        size: file.size,
      });
      toast.success("Foto bukti transfer berhasil dimuat.", "Bukti Terlampir");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) {
      toast.error("Nama pengirim / pemilik rekening wajib diisi.");
      return;
    }
    if (!proofFile) {
      toast.error("Silakan unggah foto bukti transfer pembayaran terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    const activeUserId = getActiveUserId();
    let userEmail = "pendidik@sekolah.sch.id";
    let userName = senderName.trim();

    try {
      const rawTeacher = localStorage.getItem("guru_teacher_profile");
      if (rawTeacher) {
        const parsed = JSON.parse(rawTeacher);
        if (parsed.teacher_name) userName = parsed.teacher_name;
      }
    } catch {
      // ignore
    }

    const res = saveSubscriptionRequest({
      userId: activeUserId,
      userEmail,
      userName,
      planId: currentPlan.id,
      planName: currentPlan.name,
      tier: currentPlan.tier,
      amount: currentPlan.amount,
      formattedAmount: currentPlan.formattedAmount,
      paymentMethod,
      senderName: senderName.trim(),
      proofImageUrl: proofFile.url,
      notes: notes.trim(),
    });

    setIsSubmitting(false);
    setSubmittedTrx(res.request);
    toast.success(
      `Permintaan aktivasi ${currentPlan.name} berhasil dibuat dengan Kode ${res.request.id}.`,
      "Tiket Pembayaran Dikirim"
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Langganan Resmi ModulKu
              </h3>
              <p className="text-[11px] text-slate-500">
                Penyelesaian pembayaran terverifikasi manual & aktivasi instan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Utama */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {submittedTrx ? (
            /* Layar Sukses Pengajuan */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1.5">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 font-mono text-xs px-3 py-1">
                  Status: Menunggu Konfirmasi Admin
                </Badge>
                <h4 className="text-xl font-black text-slate-900 tracking-tight">
                  Bukti Pembayaran Diterima!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Terima kasih atas kepercayaan Anda. Tiket transaksi{" "}
                  <strong className="text-slate-900">{submittedTrx.id}</strong> telah masuk ke antrean dasbor admin untuk diverifikasi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between pb-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500">Kode Transaksi:</span>
                  <span className="font-mono font-bold text-slate-900">{submittedTrx.id}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500">Paket Pilihan:</span>
                  <span className="font-bold text-slate-900">{submittedTrx.planName}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-200/60">
                  <span className="text-slate-500">Nominal:</span>
                  <span className="font-mono font-bold text-emerald-700">{submittedTrx.formattedAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode Bayar:</span>
                  <span className="font-bold text-slate-900">{submittedTrx.paymentMethod}</span>
                </div>
              </div>

              {/* Tombol WhatsApp Cepat */}
              <div className="pt-2 max-w-md mx-auto space-y-2.5">
                <a
                  href={generateWhatsAppLink(
                    submittedTrx.planName,
                    submittedTrx.formattedAmount,
                    submittedTrx.paymentMethod,
                    submittedTrx.id
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konfirmasi Cepat via WhatsApp (089530123608)</span>
                </a>

                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full h-10 text-xs font-bold text-slate-700"
                >
                  Tutup dan Kembali ke Ruang Kerja
                </Button>
              </div>
            </div>
          ) : (
            /* Formulir Pembayaran */
            <div className="space-y-6">
              {/* Ringkasan Pilihan Paket */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Paket yang Dipilih
                    </span>
                    <h4 className="text-base font-black tracking-tight">{currentPlan.name}</h4>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {currentPlan.formattedAmount}
                    </span>
                    <span className="text-[11px] text-slate-400 block">{currentPlan.billingPeriod}</span>
                  </div>
                </div>

                {/* Pemilih Paket Fleksibel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                  {Object.values(SUBSCRIPTION_PLANS).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-2 rounded-lg text-left border text-[11px] transition-all cursor-pointer ${
                        selectedPlanId === p.id
                          ? "bg-white text-slate-900 border-white font-bold shadow-xs"
                          : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700/80"
                      }`}
                    >
                      <div className="truncate">{p.name}</div>
                      <div className="text-[10px] font-mono opacity-80">{p.formattedAmount}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Jendela Batas Waktu Pembayaran */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-semibold text-xs">Batas Waktu Pembayaran Sesi Ini:</span>
                </div>
                <span className="font-mono font-bold text-sm bg-white px-2.5 py-0.5 rounded-lg border border-amber-300 text-amber-950">
                  {formatTimer(timeLeft)}
                </span>
              </div>

              {/* Tab Pemilihan Metode Bayar */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-slate-800">Pilih Metode Pembayaran Resmi:</Label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("QRIS")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                      paymentMethod === "QRIS"
                        ? "border-2 border-slate-900 bg-slate-100 font-bold text-slate-900 shadow-2xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-slate-800" />
                    <span className="text-xs">QRIS Dinamis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("DANA")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                      paymentMethod === "DANA" || paymentMethod === "ShopeePay"
                        ? "border-2 border-slate-900 bg-slate-100 font-bold text-slate-900 shadow-2xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-slate-800" />
                    <span className="text-xs">DANA / ShopeePay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("BRI")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer ${
                      paymentMethod === "BRI"
                        ? "border-2 border-slate-900 bg-slate-100 font-bold text-slate-900 shadow-2xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-slate-800" />
                    <span className="text-xs">Transfer Bank BRI</span>
                  </button>
                </div>
              </div>

              {/* Area Informasi Pembayaran Sesuai Metode */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
                {paymentMethod === "QRIS" && (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <p className="font-bold text-xs text-slate-900">
                        Pindai Kode QRIS dengan Aplikasi Mobile Banking / E-Wallet Anda
                      </p>
                      <p className="text-[11px] text-slate-500">
                        BCA, Mandiri, BRImo, BNI, BSI, GoPay, OVO, DANA, ShopeePay, dan LinkAja
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="relative p-3 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-[280px] w-full">
                        <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center">
                          <Image
                            src={currentPlan.qrisImage}
                            alt={`QRIS ${currentPlan.name}`}
                            fill
                            className="object-contain p-1"
                            unoptimized
                          />
                        </div>
                        <div className="pt-2 text-center">
                          <span className="text-[10px] font-mono font-bold text-slate-600 block">
                            Nominal Presisi: {currentPlan.formattedAmount}
                          </span>
                        </div>
                      </div>

                      <a
                        href={currentPlan.qrisImage}
                        download={`QRIS_ModulKu_${currentPlan.amount}.jpg`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-3 py-1.5 rounded-lg shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Gambar QR (Untuk Buka di HP)</span>
                      </a>
                    </div>
                  </div>
                )}

                {(paymentMethod === "DANA" || paymentMethod === "ShopeePay") && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-mono">
                            DANA
                          </span>
                          <span>{PAYMENT_CHANNELS.dana.name}</span>
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(PAYMENT_CHANNELS.dana.accountNumber, "DANA")}
                          className="h-7 text-[11px] gap-1"
                        >
                          {copiedField === "DANA" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>Salin</span>
                        </Button>
                      </div>
                      <div className="font-mono text-sm font-bold text-slate-900 pl-1">
                        {PAYMENT_CHANNELS.dana.accountNumber}
                      </div>
                      <p className="text-[11px] text-slate-500 pl-1">a.n. {PAYMENT_CHANNELS.dana.accountName}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-mono">
                            ShopeePay
                          </span>
                          <span>{PAYMENT_CHANNELS.shopeepay.name}</span>
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(PAYMENT_CHANNELS.shopeepay.accountNumber, "ShopeePay")}
                          className="h-7 text-[11px] gap-1"
                        >
                          {copiedField === "ShopeePay" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>Salin</span>
                        </Button>
                      </div>
                      <div className="font-mono text-sm font-bold text-slate-900 pl-1">
                        {PAYMENT_CHANNELS.shopeepay.accountNumber}
                      </div>
                      <p className="text-[11px] text-slate-500 pl-1">a.n. {PAYMENT_CHANNELS.shopeepay.accountName}</p>
                    </div>
                  </div>
                )}

                {paymentMethod === "BRI" && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-900 text-[10px] font-mono font-bold">
                            BRI
                          </span>
                          <span>{PAYMENT_CHANNELS.bri.bankName}</span>
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(PAYMENT_CHANNELS.bri.accountNumber, "Rekening BRI")}
                          className="h-7 text-[11px] gap-1"
                        >
                          {copiedField === "Rekening BRI" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>Salin Rekening</span>
                        </Button>
                      </div>
                      <div className="font-mono text-base font-bold text-slate-900 tracking-wider">
                        {PAYMENT_CHANNELS.bri.accountNumber}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Atas Nama: <strong className="text-slate-800">{PAYMENT_CHANNELS.bri.accountName}</strong>
                      </p>
                      <p className="text-[10px] text-slate-400">{PAYMENT_CHANNELS.bri.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Formulir Pengunggahan Bukti Bayar */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <Label htmlFor="sender" className="text-xs font-bold text-slate-800">
                    Nama Pengirim / Pemilik Rekening / Instansi
                  </Label>
                  <Input
                    id="sender"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Contoh: Dra. Sri Wahyuni / Bendahara SMAN 1"
                    className="text-xs h-10 border-slate-300"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-800">
                    Foto Bukti Transfer / Struk Pembayaran (JPG/PNG, Maks. 2 MB)
                  </Label>
                  <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleProofUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {proofFile ? (
                      <div className="flex items-center justify-center gap-2.5 text-xs text-emerald-800 font-semibold">
                        <FileCheck2 className="w-5 h-5 text-emerald-600" />
                        <span className="truncate max-w-[300px]">{proofFile.name}</span>
                        <span className="text-[10px] text-slate-400">({Math.round(proofFile.size / 1024)} KB)</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
                        <p className="text-xs font-semibold text-slate-700">
                          Klik untuk memilih berkas foto atau tangkapan layar struk
                        </p>
                        <p className="text-[10px] text-slate-400">Format JPG, PNG, atau WebP</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="text-xs font-bold text-slate-800">
                    Catatan Tambahan (Opsional)
                  </Label>
                  <Input
                    id="notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Mohon aktivasi segera untuk persiapan akreditasi"
                    className="text-xs h-9 border-slate-300"
                  />
                </div>

                {/* Tombol Kirim */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-11 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  {isSubmitting ? "Mengirimkan Bukti..." : "Kirim Bukti Pembayaran & Konfirmasi"}
                </Button>

                {/* Saluran Bantuan WhatsApp */}
                <div className="text-center pt-1">
                  <p className="text-[11px] text-slate-500">
                    Ada pertanyaan atau butuh bantuan pembayaran? Hubungi WhatsApp Admin di{" "}
                    <a
                      href={`https://wa.me/6289530123608?text=Halo%20Admin%20ModulKu,%20saya%20ingin%20bertanya%20mengenai%20langganan%20paket%20${encodeURIComponent(currentPlan.name)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      089530123608
                    </a>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Clock,
  QrCode,
  Smartphone,
  Building2,
  Copy,
  Check,
  Download,
  UploadCloud,
  FileCheck2,
  ChevronLeft,
  ArrowRight,
  ExternalLink,
  Lock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { ModulKuLogo } from "@/components/ui/ModulKuLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SUBSCRIPTION_PLANS,
  PAYMENT_CHANNELS,
  ActivePaymentOrder,
  getActivePaymentOrder,
  createOrGetActiveOrder,
  resetActiveOrder,
  updateActiveOrderStatus,
  saveSubscriptionRequest,
  generateWhatsAppLink,
  PaymentMethod,
} from "@/lib/subscription";

export default function PembayaranPage() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState("profesional_annual");
  const [activeOrder, setActiveOrder] = useState<ActivePaymentOrder | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("QRIS");
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(3600);
  const [isExpired, setIsExpired] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form Upload Bukti
  const [senderName, setSenderName] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inisialisasi order aktif & parameter URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const requestedPlan = params.get("plan") || "profesional_annual";
      setSelectedPlanId(requestedPlan);

      // Cek apakah ada order aktif dengan plan yang sama yang belum habis waktunya
      const order = createOrGetActiveOrder(requestedPlan);
      setActiveOrder(order);
      setSelectedMethod(order.paymentMethod || "QRIS");

      if (order.senderName) setSenderName(order.senderName);
      if (order.proofImageUrl) setProofPreview(order.proofImageUrl);
      if (order.status === "waiting_approval") setSubmitSuccess(true);
    }
  }, []);

  // Countdown timer clock
  useEffect(() => {
    if (!activeOrder) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingMs = activeOrder.expiresAt - now;

      if (remainingMs <= 0) {
        setTimeLeftSeconds(0);
        setIsExpired(true);
        clearInterval(interval);
      } else {
        setTimeLeftSeconds(Math.floor(remainingMs / 1000));
        setIsExpired(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrder]);

  // Format Timer MM:SS
  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeftSeconds / 60);
    const seconds = timeLeftSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [timeLeftSeconds]);

  const currentPlan = activeOrder ? SUBSCRIPTION_PLANS[activeOrder.planId] || SUBSCRIPTION_PLANS.profesional_annual : SUBSCRIPTION_PLANS.profesional_annual;

  const handleCopy = (text: string, fieldId: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const handleResetSession = () => {
    const newOrder = resetActiveOrder(selectedPlanId);
    setActiveOrder(newOrder);
    setIsExpired(false);
    setSubmitSuccess(false);
    setErrorMessage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security check: MIME format & Size (< 2MB)
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Format berkas harus berupa gambar (JPG, PNG, atau WEBP).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar bukti transfer maksimal 2 MB.");
      return;
    }

    setErrorMessage(null);
    setProofFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      setProofPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    if (!senderName.trim()) {
      setErrorMessage("Silakan isi nama pengirim atau nama pemilik rekening.");
      return;
    }

    if (!proofPreview) {
      setErrorMessage("Silakan unggah foto struk atau tangkapan layar bukti transfer.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Dapatkan data profil guru
    let userEmail = "pendidik@guru.belajar.id";
    let userName = senderName.trim();
    let userId = "user-local";

    try {
      const rawTeacher = localStorage.getItem("guru_teacher_profile");
      if (rawTeacher) {
        const parsed = JSON.parse(rawTeacher);
        if (parsed.teacher_name) userName = parsed.teacher_name;
        if (parsed.user_id) userId = parsed.user_id;
      }
    } catch {
      // ignore
    }

    // Simpan permohonan ke admin
    saveSubscriptionRequest({
      userId,
      userEmail,
      userName,
      planId: activeOrder.planId,
      planName: activeOrder.planName,
      tier: activeOrder.tier,
      amount: activeOrder.amount,
      formattedAmount: activeOrder.formattedAmount,
      paymentMethod: selectedMethod,
      senderName: senderName.trim(),
      proofImageUrl: proofPreview,
      notes: `Pembayaran ${selectedMethod} oleh ${senderName.trim()} untuk pesanan ${activeOrder.orderId}.`,
    });

    updateActiveOrderStatus("waiting_approval", senderName.trim(), proofPreview);
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header Navigasi Resmi */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <ModulKuLogo size="md" />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Koneksi Enkripsi 256-Bit SSL</span>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-700 hover:text-slate-900 gap-1.5 h-8">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Ruang Kerja</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Step Flow Indicator */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-800 text-[11px] font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pusat Pembayaran Resmi ModulKu</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Selesaikan Pembayaran Langganan
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Lakukan transfer sesuai rincian tagihan di bawah ini untuk aktivasi akun pendidik atau lisensi sekolah Anda.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span className="text-xs font-bold text-slate-800">Langkah 2 dari 2: Verifikasi Pembayaran</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* KOLOM KIRI (5 Kolom): Rincian Pesanan & Tagihan Resmi */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="rounded-2xl border-slate-200 shadow-xs bg-white overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Rincian Pesanan & Faktur
                  </CardTitle>
                  <Badge variant="outline" className="font-mono text-[10px] bg-white text-slate-700 border-slate-300">
                    Tagihan Sah
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {/* Kode Transaksi / Invoice */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Nomor Invoice:</span>
                    <button
                      type="button"
                      onClick={() => activeOrder && handleCopy(activeOrder.orderId, "invoice")}
                      className="font-mono font-bold text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{activeOrder?.orderId || "INV-MEMUAT..."}</span>
                      {copiedField === "invoice" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Waktu Pemesanan:</span>
                    <span className="font-mono">
                      {activeOrder ? new Date(activeOrder.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                    </span>
                  </div>
                </div>

                {/* Info Paket */}
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{currentPlan.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{currentPlan.description}</p>
                    </div>
                    <span className="text-xs font-bold font-mono text-slate-900 whitespace-nowrap">
                      {currentPlan.formattedAmount}
                    </span>
                  </div>
                </div>

                {/* Perincian Biaya */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal Tagihan:</span>
                    <span className="font-mono">{currentPlan.formattedAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>PPN Pendidikan (0%):</span>
                    <span className="font-mono">Rp 0</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Layanan & Administrasi:</span>
                    <span className="font-mono text-emerald-600 font-semibold">Gratis</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900">
                    <span className="text-sm">Total Pembayaran:</span>
                    <span className="text-xl font-mono text-blue-700">{currentPlan.formattedAmount}</span>
                  </div>
                </div>

                {/* Keamanan & Transparansi */}
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-[11px] text-blue-900 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-blue-950">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>Jaminan Keamanan & Hak Konsumen</span>
                  </div>
                  <p className="leading-relaxed text-blue-800">
                    Akun aktif langsung setelah bukti transfer diverifikasi oleh administrator. Dilengkapi kuitansi resmi bertanda tangan digital untuk bukti dukung SPJ Dana BOS/BOSP.
                  </p>
                </div>

                <div className="pt-2">
                  <Link href="/#harga" className="block w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-50">
                      Ganti Pilihan Paket
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* KOLOM KANAN (7 Kolom): Countdown, Metode Bayar, & Upload Bukti */}
          <div className="lg:col-span-7 space-y-6">
            {/* Countdown Timer Alert */}
            <Card className="rounded-2xl border-slate-200 shadow-xs bg-white overflow-hidden">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isExpired ? "bg-rose-50 text-rose-600 border-rose-200" : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {isExpired ? "Sesi Pembayaran Telah Berakhir" : "Batas Waktu Sesi Pembayaran"}
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {isExpired
                          ? "Sesi ini telah melewati 60 menit. Klik tombol perbarui untuk memulai sesi baru."
                          : "Selesaikan pembayaran dan unggah bukti sebelum waktu berakhir."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isExpired ? (
                      <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-base font-black text-slate-800 tracking-wider">
                        {formattedTime}
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleResetSession}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 rounded-xl gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Mulai Ulang Waktu</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pilihan Metode Pembayaran (Tabs Bersih & Ramah Mata) */}
            <Card className="rounded-2xl border-slate-200 shadow-xs bg-white overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Pilih Saluran Pembayaran
                </CardTitle>
                <CardDescription className="text-xs">
                  Pilih saluran yang paling mudah untuk Anda. Semua metode bebas biaya admin.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 space-y-5">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("QRIS")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      selectedMethod === "QRIS"
                        ? "border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20 shadow-xs font-bold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-blue-700" />
                    <span className="text-xs">QRIS Dinamis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("DANA")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      selectedMethod === "DANA" || selectedMethod === "ShopeePay"
                        ? "border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20 shadow-xs font-bold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-blue-700" />
                    <span className="text-xs">E-Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("BRI")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      selectedMethod === "BRI"
                        ? "border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20 shadow-xs font-bold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-blue-700" />
                    <span className="text-xs">Transfer Bank</span>
                  </button>
                </div>

                {/* KONTEN METODE 1: QRIS */}
                {selectedMethod === "QRIS" && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0 flex flex-col items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={currentPlan.qrisImage}
                          alt={`QRIS ${currentPlan.name}`}
                          className="w-48 h-48 object-contain rounded-lg"
                        />
                        <a
                          href={currentPlan.qrisImage}
                          download={`QRIS_ModulKu_${currentPlan.amount}.jpg`}
                          className="mt-2 text-[11px] font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Unduh Gambar QRIS</span>
                        </a>
                      </div>

                      <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-bold">
                          <span>Nominal Pas: {currentPlan.formattedAmount}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">Cara Pembayaran QRIS:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-slate-600">
                          <li>Buka m-Banking (BCA, BRI, Mandiri, BNI) atau E-Wallet (GoPay, OVO, Dana, ShopeePay).</li>
                          <li>Pilih menu <strong>Pindai / Scan QRIS</strong>.</li>
                          <li>Arahkan kamera ke kode QR di atas atau unggah gambar yang telah diunduh.</li>
                          <li>Pastikan nama penerima tertulis <strong>ModulKu Official</strong> dan nominal <strong>{currentPlan.formattedAmount}</strong>.</li>
                          <li>Simpan bukti transfer untuk diunggah di formulir bawah.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                )}

                {/* KONTEN METODE 2: E-WALLET */}
                {(selectedMethod === "DANA" || selectedMethod === "ShopeePay") && (
                  <div className="space-y-3">
                    {/* DANA Card */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{PAYMENT_CHANNELS.dana.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">Resmi</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">a.n. {PAYMENT_CHANNELS.dana.accountName}</p>
                        <p className="font-mono font-bold text-base text-slate-900 mt-1">{PAYMENT_CHANNELS.dana.accountNumber}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(PAYMENT_CHANNELS.dana.accountNumber, "dana")}
                        className="text-xs font-semibold text-slate-800 border-slate-300 hover:bg-white bg-white h-9 shrink-0 gap-1.5 cursor-pointer"
                      >
                        {copiedField === "dana" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === "dana" ? "Tersalin" : "Salin Nomor DANA"}</span>
                      </Button>
                    </div>

                    {/* ShopeePay Card */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{PAYMENT_CHANNELS.shopeepay.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Resmi</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">a.n. {PAYMENT_CHANNELS.shopeepay.accountName}</p>
                        <p className="font-mono font-bold text-base text-slate-900 mt-1">{PAYMENT_CHANNELS.shopeepay.accountNumber}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(PAYMENT_CHANNELS.shopeepay.accountNumber, "shopee")}
                        className="text-xs font-semibold text-slate-800 border-slate-300 hover:bg-white bg-white h-9 shrink-0 gap-1.5 cursor-pointer"
                      >
                        {copiedField === "shopee" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === "shopee" ? "Tersalin" : "Salin ShopeePay"}</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* KONTEN METODE 3: TRANSFER BANK BRI */}
                {selectedMethod === "BRI" && (
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{PAYMENT_CHANNELS.bri.bankName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">BOS / BOSP Ready</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">a.n. {PAYMENT_CHANNELS.bri.accountName}</p>
                        <p className="font-mono font-bold text-lg text-slate-900 mt-1">{PAYMENT_CHANNELS.bri.accountNumber}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(PAYMENT_CHANNELS.bri.accountNumber, "bri")}
                        className="text-xs font-semibold text-slate-800 border-slate-300 hover:bg-white bg-white h-9 shrink-0 gap-1.5 cursor-pointer"
                      >
                        {copiedField === "bri" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === "bri" ? "Tersalin" : "Salin No. Rekening"}</span>
                      </Button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 pt-2">
                      Mendukung transfer via ATM BRI, BRImo, transfer antar-bank via BI-FAST, serta pencairan dana resmi SPJ BOS sekolah.
                    </p>
                  </div>
                )}

                {/* FORMULIR UNGGAH BUKTI TRANSFER */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Konfirmasi Bukti Pembayaran
                    </h3>
                    <span className="text-[11px] text-slate-500">Wajib Diisi</span>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {submitSuccess ? (
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 animate-in fade-in">
                      <div className="flex items-center gap-2.5 font-bold text-sm text-emerald-950">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>Bukti Pembayaran Berhasil Diterima</span>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        Terima kasih, <strong>{senderName}</strong>. Bukti transfer telah tersimpan dalam sistem antrean admin. Administrator kami akan memverifikasi dalam waktu kurang dari 15 menit. Anda juga dapat melakukan konfirmasi cepat via WhatsApp.
                      </p>

                      <div className="pt-2 flex flex-wrap gap-2">
                        {activeOrder && (
                          <a
                            href={generateWhatsAppLink(
                              activeOrder.planName,
                              activeOrder.formattedAmount,
                              selectedMethod,
                              activeOrder.orderId
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 rounded-xl gap-2 cursor-pointer">
                              <span>Konfirmasi Instan ke WhatsApp Admin</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </a>
                        )}
                        <Link href="/dashboard">
                          <Button variant="outline" size="sm" className="text-xs font-semibold h-9 rounded-xl border-emerald-300 text-emerald-900 bg-white hover:bg-emerald-100">
                            Kembali ke Ruang Kerja
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitProof} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="senderName" className="text-xs font-semibold">
                          Nama Pengirim / Pemilik Rekening / Instansi
                        </Label>
                        <Input
                          id="senderName"
                          type="text"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="Contoh: Dra. Sri Wahyuni / Bendahara SMAN 1"
                          required
                          className="text-xs h-9 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">
                          Foto Struk / Tangkapan Layar Bukti Transfer (Maks. 2MB)
                        </Label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-slate-400 bg-slate-50/50 transition-all">
                          {proofPreview ? (
                            <div className="space-y-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={proofPreview}
                                alt="Pratinjau Struk"
                                className="max-h-40 mx-auto rounded-lg border border-slate-200 object-contain"
                              />
                              <p className="text-[11px] text-slate-500 font-mono">{proofFile?.name || "struk_transfer.jpg"}</p>
                              <label className="cursor-pointer inline-block">
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={handleFileChange}
                                  className="hidden"
                                />
                                <span className="text-xs font-bold text-blue-700 hover:underline">
                                  Ganti Foto Struk
                                </span>
                              </label>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-2">
                              <UploadCloud className="w-8 h-8 text-slate-400" />
                              <div className="space-y-0.5">
                                <p className="text-xs font-bold text-slate-800">
                                  Klik untuk memilih berkas struk pembayaran
                                </p>
                                <p className="text-[11px] text-slate-500">
                                  Mendukung JPG, PNG, WEBP (Maksimal 2 MB)
                                </p>
                              </div>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                        <Button
                          type="submit"
                          disabled={isSubmitting || isExpired}
                          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          <FileCheck2 className="w-4 h-4 mr-1.5" />
                          <span>{isSubmitting ? "Mengirim Verifikasi..." : "Konfirmasi Pembayaran Saya"}</span>
                        </Button>

                        {activeOrder && (
                          <a
                            href={generateWhatsAppLink(
                              activeOrder.planName,
                              activeOrder.formattedAmount,
                              selectedMethod,
                              activeOrder.orderId
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto text-center"
                          >
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-50 h-10 px-4 rounded-xl gap-1.5"
                            >
                              <span>Hubungi CS WhatsApp</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

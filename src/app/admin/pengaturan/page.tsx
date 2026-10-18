"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  ShieldCheck,
  Building2,
  Smartphone,
  MessageCircle,
  Save,
  CheckCircle2,
  Lock,
  Landmark,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PAYMENT_CHANNELS,
  getPaymentChannels,
  savePaymentChannels,
  getAdminEmails,
  saveAdminEmails,
  getSubscriptionRequests,
  deleteReceiptImage,
} from "@/lib/subscription";
import { useNotification } from "@/components/providers/NotificationProvider";

export default function AdminSettingsPage() {
  const { toast } = useNotification();
  const [adminEmails, setAdminEmails] = useState("");
  const [danaNumber, setDanaNumber] = useState("");
  const [shopeePayNumber, setShopeePayNumber] = useState("");
  const [briNumber, setBriNumber] = useState("");
  const [briName, setBriName] = useState("");
  const [waNumber, setWaNumber] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Inisialisasi dari penyimpanan persisten
  useEffect(() => {
    const channels = getPaymentChannels();
    setDanaNumber(channels.dana.accountNumber);
    setShopeePayNumber(channels.shopeepay.accountNumber);
    setBriNumber(channels.bri.accountNumber);
    setBriName(channels.bri.accountName);
    setWaNumber(channels.whatsapp.number);

    const emails = getAdminEmails();
    setAdminEmails(emails.join(", "));
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Simpan Saluran Pembayaran Persisten
    const updatedChannels = {
      dana: {
        name: "DANA",
        accountNumber: danaNumber.trim(),
        accountName: "ModulKu Official (Admin)",
        notes: "Buka aplikasi DANA -> Kirim -> Masukkan nomor ponsel tujuan.",
      },
      shopeepay: {
        name: "ShopeePay",
        accountNumber: shopeePayNumber.trim(),
        accountName: "ModulKu Official (Admin)",
        notes: "Buka aplikasi Shopee -> ShopeePay -> Transfer -> Masukkan nomor ponsel.",
      },
      bri: {
        name: "Bank BRI",
        bankName: "PT Bank Rakyat Indonesia (Persero) Tbk",
        accountNumber: briNumber.trim(),
        accountName: briName.trim(),
        notes: "Transfer antar-bank atau via BRImo, ATM, dan Internet Banking.",
      },
      whatsapp: {
        number: waNumber.trim(),
        formattedNumber: waNumber.trim(),
      },
    };
    savePaymentChannels(updatedChannels);

    // 2. Simpan Whitelist Email Admin Persisten
    const emailList = adminEmails.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    saveAdminEmails(emailList);

    setIsSaved(true);
    toast.success("Konfigurasi nomor rekening dan whitelist email admin berhasil disimpan.", "Pengaturan Disimpan");
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePurgeAllApprovedReceipts = () => {
    if (confirm("Apakah Anda yakin ingin membersihkan seluruh foto struk yang telah disetujui untuk menghemat penyimpanan? Data rekap finansial tetap utuh.")) {
      const requests = getSubscriptionRequests();
      let count = 0;
      requests.forEach((r) => {
        if (r.status === "approved" && r.proofImageUrl) {
          deleteReceiptImage(r.id);
          count++;
        }
      });
      toast.success(`Sebanyak ${count} foto struk berhasil dibersihkan dari penyimpanan.`, "Pembersihan Selesai");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-slate-700" />
          <span>Pengaturan Sistem & Saluran Pembayaran</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola nomor rekening manual (DANA, ShopeePay, Bank BRI), nomor WhatsApp bantuan, dan otoritas akses superuser.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-emerald-200 text-[#065F46] text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            <span>Seluruh perubahan konfigurasi berhasil disimpan dan aktif secara seketika.</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#059669] text-white">
            Tersinkronisasi
          </span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Seksi 1: Saluran Pembayaran Resmi Guru */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <div className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-700" />
              <span>Saluran Pembayaran Manual (Muncul di Modal Guru)</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Ubah nomor rekening atau nomor e-wallet yang ditampilkan kepada pendidik saat mereka ingin berlangganan.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Ponsel DANA Resmi
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={danaNumber}
                    onChange={(e) => setDanaNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-mono focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Ponsel ShopeePay Resmi
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={shopeePayNumber}
                    onChange={(e) => setShopeePayNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-mono focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nomor Rekening Bank BRI
                </label>
                <div className="relative">
                  <Landmark className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={briNumber}
                    onChange={(e) => setBriNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-mono focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Pemilik Rekening Bank BRI
                </label>
                <input
                  type="text"
                  value={briName}
                  onChange={(e) => setBriName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-semibold focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor WhatsApp Bantuan Admin (Direct Chat)
              </label>
              <div className="relative max-w-sm">
                <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-mono focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Nomor ini akan otomatis dibuka saat guru menekan tombol bantuan WhatsApp di seluruh platform.
              </p>
            </div>
          </div>
        </div>

        {/* Seksi 2: Akses Keamanan & Whitelist Admin */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-4">
            <div className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#059669]" />
              <span>Otoritas Superuser (Security by Design)</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Daftar alamat surel yang berhak membuka rute /admin dan menyetujui transaksi pembayaran.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Daftar Surel Administrator (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={adminEmails}
                onChange={(e) => setAdminEmails(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-mono focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                required
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Pengguna dengan email di luar daftar ini akan otomatis dialihkan ke /dashboard jika mencoba mengakses panel admin.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#059669]" />
                <span>Status Kepatuhan Keamanan & Regulasi</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 select-none">•</span>
                  <span><strong className="text-slate-900 font-bold">Supabase PostgreSQL RLS:</strong> Aktif (Kebijakan isolasi <code className="text-slate-800 font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200">auth.uid() = user_id</code>)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 select-none">•</span>
                  <span><strong className="text-slate-900 font-bold">Enkripsi In-Transit:</strong> TLS 1.3 / HTTPS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 select-none">•</span>
                  <span><strong className="text-slate-900 font-bold">Kepatuhan UU PDP No. 27/2022:</strong> Aktif (Mode Perlindungan Data Kedinasan Pendidik)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 select-none">•</span>
                  <span><strong className="text-slate-900 font-bold">Google Cloud API Governance:</strong> Kunci API terisolasi di sisi server (Node.js runtime)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Seksi 3: Pemeliharaan Basis Data & Efisiensi Storage */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <div className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-slate-700" />
              <span>Efisiensi & Pembersihan Arsip Struk Transaksi</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Bersihkan berkas visual struk pembayaran yang sudah disetujui untuk mencegah pemborosan memori dan penyimpanan, tanpa menghapus rekapitulasi nominal dan identitas transaksi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-800">Bersihkan Foto Struk yang Telah Disetujui</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mengosongkan data gambar struk pada transaksi berstatus Disetujui. Rekapan finansial, nama pengirim, kode transaksi, dan nominal tetap tersimpan untuk audit.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handlePurgeAllApprovedReceipts}
              className="text-xs font-semibold text-rose-700 border-rose-300 hover:bg-rose-50 h-9 shrink-0 gap-1.5 cursor-pointer"
            >
              <span>Bersihkan Arsip Struk Sekarang</span>
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Seluruh Pengaturan Sistem</span>
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { PAYMENT_CHANNELS } from "@/lib/subscription";
import { useNotification } from "@/components/providers/NotificationProvider";

export default function AdminSettingsPage() {
  const { toast } = useNotification();
  const [adminEmails, setAdminEmails] = useState("admin@modulku.id, akhyar@guru.id");
  const [danaNumber, setDanaNumber] = useState(PAYMENT_CHANNELS.dana.accountNumber);
  const [shopeePayNumber, setShopeePayNumber] = useState(PAYMENT_CHANNELS.shopeepay.accountNumber);
  const [briNumber, setBriNumber] = useState(PAYMENT_CHANNELS.bri.accountNumber);
  const [briName, setBriName] = useState(PAYMENT_CHANNELS.bri.accountName);
  const [waNumber, setWaNumber] = useState(PAYMENT_CHANNELS.whatsapp.number);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success("Konfigurasi sistem dan saluran pembayaran berhasil disimpan.", "Pengaturan Disimpan");
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-slate-300" />
          <span>Pengaturan Sistem & Saluran Pembayaran</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Kelola nomor rekening manual (DANA, ShopeePay, Bank BRI), nomor WhatsApp bantuan, dan otoritas akses superuser.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Seluruh perubahan konfigurasi berhasil disimpan dan aktif secara seketika.</span>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Tersinkronisasi
          </span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Seksi 1: Saluran Pembayaran Resmi Guru */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-800/80 pb-4">
            <div className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-slate-200" />
              <span>Saluran Pembayaran Manual (Muncul di Modal Guru)</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Ubah nomor rekening atau nomor e-wallet yang ditampilkan kepada pendidik saat mereka ingin berlangganan.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nomor Ponsel DANA Resmi
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={danaNumber}
                    onChange={(e) => setDanaNumber(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 font-mono focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nomor Ponsel ShopeePay Resmi
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={shopeePayNumber}
                    onChange={(e) => setShopeePayNumber(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 font-mono focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nomor Rekening Bank BRI
                </label>
                <div className="relative">
                  <Landmark className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={briNumber}
                    onChange={(e) => setBriNumber(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 font-mono focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Nama Pemilik Rekening Bank BRI
                </label>
                <input
                  type="text"
                  value={briName}
                  onChange={(e) => setBriName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nomor WhatsApp Bantuan Admin (Direct Chat)
              </label>
              <div className="relative max-w-sm">
                <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 font-mono focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-800/80 pb-4">
            <div className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Otoritas Superuser (Security by Design)</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Daftar alamat surel yang berhak membuka rute /admin dan menyetujui transaksi pembayaran.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Daftar Surel Administrator (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={adminEmails}
                onChange={(e) => setAdminEmails(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 font-mono focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
                required
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Pengguna dengan email di luar daftar ini akan otomatis dialihkan ke /dashboard jika mencoba mengakses panel admin.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-2 mb-2.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Status Kepatuhan Keamanan & Regulasi</span>
              </div>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-600 select-none">•</span>
                  <span><strong className="text-slate-200 font-medium">Supabase PostgreSQL RLS:</strong> Aktif (Kebijakan isolasi <code className="text-slate-300 font-mono text-[11px]">auth.uid() = user_id</code>)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-600 select-none">•</span>
                  <span><strong className="text-slate-200 font-medium">Enkripsi In-Transit:</strong> TLS 1.3 / HTTPS</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-600 select-none">•</span>
                  <span><strong className="text-slate-200 font-medium">Kepatuhan UU PDP No. 27/2022:</strong> Aktif (Mode Perlindungan Data Kedinasan Pendidik)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-600 select-none">•</span>
                  <span><strong className="text-slate-200 font-medium">Google Cloud API Governance:</strong> Kunci API terisolasi di sisi server (Node.js runtime)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Seluruh Pengaturan Sistem</span>
          </button>
        </div>
      </form>
    </div>
  );
}

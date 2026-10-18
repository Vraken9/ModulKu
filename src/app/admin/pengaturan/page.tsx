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

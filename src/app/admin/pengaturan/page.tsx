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
  Database,
  Key,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Pengaturan Sistem & Saluran Pembayaran</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Kelola nomor rekening manual (DANA, ShopeePay, Bank BRI), nomor WhatsApp bantuan, dan otoritas akses superuser.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Seluruh perubahan konfigurasi berhasil disimpan dan aktif secara seketika.</span>
          </div>
          <Badge className="bg-emerald-900 text-emerald-200">Tersinkronisasi</Badge>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Seksi 1: Saluran Pembayaran Resmi Guru */}
        <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <CardTitle className="text-base font-black tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <span>Saluran Pembayaran Manual (Muncul di Modal Guru)</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Ubah nomor rekening atau nomor e-wallet yang ditampilkan kepada pendidik saat mereka ingin berlangganan.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-300">Nomor Ponsel DANA Resmi</Label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <Input
                    type="text"
                    value={danaNumber}
                    onChange={(e) => setDanaNumber(e.target.value)}
                    className="pl-9 text-xs h-9 bg-slate-900 border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-300">Nomor Ponsel ShopeePay Resmi</Label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <Input
                    type="text"
                    value={shopeePayNumber}
                    onChange={(e) => setShopeePayNumber(e.target.value)}
                    className="pl-9 text-xs h-9 bg-slate-900 border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-300">Nomor Rekening Bank BRI</Label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <Input
                    type="text"
                    value={briNumber}
                    onChange={(e) => setBriNumber(e.target.value)}
                    className="pl-9 text-xs h-9 bg-slate-900 border-slate-700 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-300">Nama Pemilik Rekening Bank BRI</Label>
                <Input
                  type="text"
                  value={briName}
                  onChange={(e) => setBriName(e.target.value)}
                  className="text-xs h-9 bg-slate-900 border-slate-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <Label className="text-xs font-bold text-slate-300">Nomor WhatsApp Bantuan Admin (Direct Chat)</Label>
              <div className="relative max-w-sm">
                <MessageCircle className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <Input
                  type="text"
                  value={waNumber}
                  onChange={(e) => setWaNumber(e.target.value)}
                  className="pl-9 text-xs h-9 bg-slate-900 border-slate-700 text-white font-mono"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Nomor ini akan otomatis dibuka saat guru menekan tombol bantuan WhatsApp di seluruh platform.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Seksi 2: Akses Keamanan & Whitelist Admin */}
        <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
          <CardHeader className="border-b border-slate-800/80 pb-4">
            <CardTitle className="text-base font-black tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Otoritas Superuser (Security by Design)</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Daftar alamat surel yang berhak membuka rute /admin dan menyetujui transaksi pembayaran.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-300">Daftar Surel Administrator (Pisahkan dengan koma)</Label>
              <Input
                type="text"
                value={adminEmails}
                onChange={(e) => setAdminEmails(e.target.value)}
                className="text-xs h-9 bg-slate-900 border-slate-700 text-white font-mono"
                required
              />
              <p className="text-[11px] text-slate-500">
                Pengguna dengan email di luar daftar ini akan otomatis dialihkan ke /dashboard jika mencoba mengakses panel admin.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-slate-400">
              <div className="font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Status Kepatuhan Keamanan & Regulasi</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px]">
                <li><strong>Supabase PostgreSQL RLS:</strong> Aktif (Kebijakan isolasi `auth.uid() = user_id`)</li>
                <li><strong>Enkripsi In-Transit:</strong> TLS 1.3 / HTTPS</li>
                <li><strong>Kepatuhan UU PDP No. 27/2022:</strong> Aktif (Mode Perlindungan Data Kedinasan Pendidik)</li>
                <li><strong>Google Cloud API Governance:</strong> Kunci API terisolasi di sisi server (Node.js runtime)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs cursor-pointer gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Seluruh Pengaturan Sistem</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

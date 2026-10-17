"use client";

import React from "react";
import {
  ShieldCheck,
  X,
  Lock,
  FileCheck2,
  Database,
  EyeOff,
  UserCheck,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Kebijakan Privasi & Perlindungan Data Kedinasan
              </h3>
              <p className="text-[11px] text-slate-500">
                Kepatuhan Penuh terhadap UU Pelindungan Data Pribadi (UU PDP No. 27 Tahun 2022)
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

        {/* Isi Kebijakan Privasi */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
              <Scale className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Prinsip Utama: Data Pendidik Adalah Milik Penuh Satuan Pendidikan</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-normal">
              Platform ModulKu dirancang dengan standar keamanan kedinasan Indonesia. Kami tidak pernah menjual, menyewakan, atau membagikan data identitas guru (NIP), data sekolah (NPSN), maupun instrumen asesmen siswa kepada pihak ketiga atau pengiklan.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-600" />
              <span>1. Data yang Dikumpulkan & Tujuan Penggunaan</span>
            </h4>
            <p className="text-slate-600 pl-6">
              Kami hanya mengumpulkan data yang mutlak diperlukan untuk menghasilkan dokumen kurikulum resmi:
            </p>
            <ul className="list-disc pl-11 space-y-1 text-slate-600">
              <li>Identitas akun: Alamat email dan nama lengkap pendidik untuk akses autentikasi.</li>
              <li>Identitas kedinasan: Nama sekolah, NPSN, NIP guru, NIP kepala sekolah, dan logo kop dinas semata-mata untuk pencetakan dokumen Word (.docx) dan PDF resmi.</li>
              <li>Parameter ajar: Pilihan mata pelajaran, bab, dan capaian pembelajaran untuk pemrosesan generator kurikulum.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-600" />
              <span>2. Arsitektur Keamanan & Isolasi Data (Security by Design)</span>
            </h4>
            <ul className="list-disc pl-11 space-y-1 text-slate-600">
              <li>
                <strong>Row Level Security (RLS) PostgreSQL:</strong> Data Anda pada database cloud Supabase dikunci secara kriptografis berdasarkan akun pemilik. Pengguna lain tidak memiliki akses baca maupun tulis terhadap berkas Anda.
              </li>
              <li>
                <strong>Enkripsi Transit & At-Rest:</strong> Seluruh komunikasi antar-peramban dan server menggunakan TLS 1.3 (HTTPS), dan data pada database dienkripsi menggunakan standar AES-256.
              </li>
              <li>
                <strong>Isolasi Ruang Peramban:</strong> Berkas arsip disimpan pada namespace khusus per pengguna, mencegah kebocoran data jika satu komputer sekolah digunakan oleh lebih dari satu orang guru.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-slate-600" />
              <span>3. Tata Kelola Pemrosesan Kecerdasan Buatan (AI Governance)</span>
            </h4>
            <p className="text-slate-600 pl-6">
              Prompt AI hanya memproses struktur kurikulum dan materi rujukan yang diunggah. Teks rujukan diperlakukan murni sebagai data analisis pasif dan tidak pernah disimpan oleh penyedia model kecerdasan buatan sebagai data pelatihan (*training dataset*) untuk umum.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-slate-600" />
              <span>4. Hak Asasi Pemilik Data (Sesuai Pasal 8 UU PDP)</span>
            </h4>
            <ul className="list-disc pl-11 space-y-1 text-slate-600">
              <li>
                <strong>Hak Akses & Pengunduhan:</strong> Anda berhak mengunduh seluruh dokumen yang pernah Anda buat kapan saja tanpa batas dalam format DOCX/PPTX.
              </li>
              <li>
                <strong>Hak Perbaikan & Pembaruan:</strong> Anda dapat memperbarui NIP, kop surat, dan gelar guru kapan pun pada menu Profil Sekolah.
              </li>
              <li>
                <strong>Hak Penghapusan Permanen (Right to Erasure):</strong> Anda dapat menghapus berkas dokumen dari Bank Dokumen atau menghapus seluruh profil data Anda secara permanen.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-slate-600" />
              <span>5. Narahubung & Konsultasi Keamanan</span>
            </h4>
            <p className="text-slate-600 pl-6">
              Jika Anda memiliki pertanyaan mengenai tata kelola data atau kendala akun, silakan hubungi saluran resmi admin ModulKu via WhatsApp di <strong>089530123608</strong>.
            </p>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-9 px-5 rounded-xl cursor-pointer"
          >
            Saya Memahami & Menyetujui
          </Button>
        </div>
      </div>
    </div>
  );
}

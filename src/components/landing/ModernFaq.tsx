"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    category: "REGULASI BSKAP",
    question: "Apakah seluruh dokumen luaran sesuai regulasi Kurikulum Merdeka terbaru?",
    answer: "Ya. Sistem ModulKu dikembangkan mengacu langsung pada Keputusan Kepala BSKAP Kemendikbudristek No. 032/H/KR/2024 tentang Capaian Pembelajaran, Permendikbudristek No. 12 Tahun 2024, serta panduan pembelajaran dan asesmen nasional terbaru.",
  },
  {
    id: "faq-2",
    category: "FORMAT BERKAS",
    question: "Dapatkah berkas yang dihasilkan diedit kembali di Microsoft Word dan PowerPoint?",
    answer: "Tentu saja. Mesin ekspor dokumen kami menghasilkan berkas .DOCX asli dengan margin standar kedinasan 4-3-3-3 cm dan file .PPTX native widescreen 16:9 yang dapat Anda buka, sunting, dan cetak langsung di komputer Anda tanpa distorsi layout.",
  },
  {
    id: "faq-3",
    category: "KINERJA PMM",
    question: "Bagaimana dokumen ModulKu dapat digunakan sebagai bukti dukung di Platform Merdeka Mengajar (PMM)?",
    answer: "Modul Ajar, instrumen asesmen, LKPD, dan media presentasi telah diselaraskan dengan 8 Indikator Observasi Kelas serta Rencana Hasil Kerja (RHK) pada Pengelolaan Kinerja Guru PMM sesuai Perdirjen GTK No. 7607/B.B1/HK.03/2023.",
  },
  {
    id: "faq-4",
    category: "MASTER SEKOLAH",
    question: "Apakah saya harus memasukkan Kop Surat dan profil sekolah berulang kali?",
    answer: "Tidak. Melalui modul Master Profil Sekolah, Anda cukup mengisi data sekolah (nama sekolah, NPSN, alamat, logo daerah, logo sekolah) dan data penandatangan satu kali. Seluruh naskah soal, modul ajar, ATP, dan LKPD akan otomatis memuat Kop Surat dan Lembar Pengesahan resmi.",
  },
  {
    id: "faq-5",
    category: "AKSES & LISENSI",
    question: "Apakah ada biaya langganan untuk mulai menggunakan sistem ini?",
    answer: "ModulKu menyediakan akses awal secara gratis bagi seluruh guru di Indonesia untuk menyusun modul ajar, paket soal HOTS, dan perangkat tahunan secara mandiri tanpa batasan komplikasi administratif.",
  },
];

export function ModernFaq() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Kolom Kiri: Deskripsi & Bantuan */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-[11px] font-mono font-bold text-slate-800 tracking-wide uppercase">
              <HelpCircle className="w-3.5 h-3.5 text-slate-700" />
              <span>// PUSAT INFORMASI & TANYA JAWAB</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Pertanyaan yang Sering Diajukan Guru
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pelajari bagaimana ModulKu dirancang untuk mematuhi regulasi kurikulum nasional dan mempermudah tugas sehari-hari Anda di sekolah.
            </p>
          </div>

          {/* Help Box Mini */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <MessageSquare className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Punya Pertanyaan Lain?</h4>
                <p className="text-xs text-slate-500">Tim pendidik kami siap membantu implementasi di sekolah Anda.</p>
              </div>
            </div>
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full text-xs font-bold text-slate-800 hover:text-slate-950 border-slate-300">
                Hubungi Bantuan Teknis
              </Button>
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: Accordion Items */}
        <div className="lg:col-span-7 space-y-3">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? "bg-white border-slate-900 shadow-sm ring-1 ring-slate-900/10"
                    : "bg-white hover:bg-slate-50/60 border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full p-5 text-left flex items-start justify-between gap-4 focus:outline-none"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider block">
                      [{item.category}]
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                      {item.question}
                    </h3>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 mt-1 ${
                      isOpen
                        ? "bg-slate-900 text-white rotate-180"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p className="pt-2">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

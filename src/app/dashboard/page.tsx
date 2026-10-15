"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck2,
  FileText,
  CalendarDays,
  Presentation,
  School,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Clock,
  Layers,
  Award,
  Settings,
  ChevronRight,
  Check,
  FileDown,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SchoolProfile, TeacherProfile } from "@/types";

export default function DashboardPage() {
  const [school, setSchool] = useState<Partial<SchoolProfile>>({
    school_name: "SMA NEGERI 1 PURWANTORO",
    government_agency: "PEMERINTAH PROVINSI JAWA TIMUR",
  });
  const [teacher, setTeacher] = useState<Partial<TeacherProfile>>({
    teacher_name: "Arfian Cahya, S.Pd.",
  });

  useEffect(() => {
    try {
      const savedSchool = localStorage.getItem("guru_school_profile");
      const savedTeacher = localStorage.getItem("guru_teacher_profile");
      if (savedSchool) setSchool(JSON.parse(savedSchool));
      if (savedTeacher) setTeacher(JSON.parse(savedTeacher));
    } catch {
      // ignore
    }
  }, []);

  const featureCards = [
    {
      title: "Soal & Evaluasi Generator",
      desc: "Susun paket soal AKM, literasi-numerasi, HOTS, dan Matriks Kisi-Kisi Ujian dalam hitungan detik.",
      href: "/soal-generator",
      icon: FileCheck2,
      badge: "HOTS / AKM",
      outputTag: "DOCX & PDF",
      buttonText: "Buka Soal Generator",
    },
    {
      title: "Modul Ajar BSKAP 2024",
      desc: "Rancang modul ajar dengan 3 pilar diferensiasi (konten, proses, produk) dan format supervisi kedinasan.",
      href: "/modul-ajar",
      icon: FileText,
      badge: "BSKAP 032/2024",
      outputTag: "Supervisi KS",
      buttonText: "Buka Modul Generator",
    },
    {
      title: "Perangkat Tahunan (ATP, Prota, Promes)",
      desc: "Dekonstruksi Capaian Pembelajaran ke TP dan susun matriks pekan efektif kalender pendidikan secara presisi.",
      href: "/perangkat-tahunan",
      icon: CalendarDays,
      badge: "Pekan Efektif",
      outputTag: "1 Tahun Ajaran",
      buttonText: "Buka Perangkat Tahunan",
    },
    {
      title: "Slide Bahan Tayang (.PPTX) & LKPD",
      desc: "Hasilkan file presentasi PowerPoint native yang dapat diedit langsung dan lembar aktivitas siswa siap cetak A4.",
      href: "/presentasi",
      icon: Presentation,
      badge: "PowerPoint Native",
      outputTag: "PPTX & LKPD A4",
      buttonText: "Buka Presentasi & LKPD",
    },
  ];

  return (
    <DashboardShell activeItem="dashboard">
      <div className="space-y-8 max-w-6xl mx-auto pb-10">
        {/* Welcome Greeting Header: Bersih, Hangat, & Bebas Gradasi Gelap Pejal */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-slate-800" />
                <span>Ruang Kerja Administrasi Resmi BSKAP</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                Selamat Datang, {teacher.teacher_name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pilih modul administrasi pembelajaran yang ingin Anda susun hari ini. Seluruh berkas otomatis disinkronkan dengan Kop Surat resmi <span className="font-bold text-slate-900">{school.school_name}</span> dan siap diekspor ke format dokumen resmi Microsoft Word serta PowerPoint.
              </p>
            </div>

            <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
              <Link href="/soal-generator">
                <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-xs gap-2 cursor-pointer">
                  <span>Mulai Buat Perangkat Baru</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Link href="/profil-sekolah">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-800 border-slate-300 font-semibold text-xs h-10 px-5 rounded-xl gap-2 cursor-pointer"
                >
                  <School className="w-3.5 h-3.5 text-slate-700" />
                  <span>Kop Surat & Profil NIP</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 4 Core Features Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
            <div>
              <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                MODUL UTAMA KURIKULUM MERDEKA
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Pilih Modul Perangkat Pembelajaran
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Format kedinasan standar supervisi pengawas & kepala sekolah
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link key={idx} href={card.href} className="block group">
                  <Card className="h-full border-slate-200 hover:border-slate-400 hover:shadow-sm transition-all bg-white cursor-pointer rounded-2xl">
                    <CardHeader className="pb-3 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition-colors flex items-center justify-center shrink-0 border border-slate-200">
                          <Icon className="w-5 h-5 transition-colors" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px] font-mono font-bold bg-slate-50 border-slate-200 text-slate-700">
                            {card.badge}
                          </Badge>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {card.outputTag}
                          </span>
                        </div>
                      </div>

                      <CardTitle className="text-base font-black text-slate-900 group-hover:text-slate-950 transition-colors">
                        {card.title}
                      </CardTitle>

                      <CardDescription className="text-xs text-slate-600 leading-relaxed">
                        {card.desc}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center text-xs font-bold text-slate-900 gap-1.5 pt-2 border-t border-slate-100 group-hover:text-slate-950">
                        <span>{card.buttonText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Info Penyelarasan Bukti Dukung Kinerja PMM (dashboard#panduan-pmm) */}
        <section id="panduan-pmm" className="space-y-4">
          <Card className="border-slate-200 bg-white shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-100 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-slate-800" />
                </div>
                <div>
                  <CardTitle className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    Panduan Bukti Dukung Platform Merdeka Mengajar (PMM)
                  </CardTitle>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    DASAR HUKUM: PERDIRJEN GTK NO. 7607/B.B1/HK.03/2023
                  </span>
                </div>
              </div>
              <CardDescription className="text-xs text-slate-600 leading-relaxed pt-1">
                Seluruh berkas yang dihasilkan pada platform ModulKu telah diselaraskan dengan indikator observasi kelas dan rencana hasil kerja (RHK) pengelolaan kinerja guru di PMM.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Matriks 3 RHK Interaktif */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* RHK 1 */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">RHK 1 (PMM)</span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">SUPERVISI</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs">Perangkat Ajar Berdiferensiasi</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Memuat 3 pilar diferensiasi (konten, proses, produk), pemahaman bermakna, dan pertanyaan pemantik untuk observasi kelas.
                    </p>
                  </div>
                  <Link href="/modul-ajar">
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold text-slate-800 border-slate-300 bg-white hover:bg-slate-100 h-9 justify-between cursor-pointer">
                      <span>Susun Modul Ajar</span>
                      <ArrowRight className="w-3 h-3 text-slate-700" />
                    </Button>
                  </Link>
                </div>

                {/* RHK 2 */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">RHK 2 (PMM)</span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">ASESMEN</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs">Evaluasi & Asesmen HOTS/AKM</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Naskah soal lengkap dengan Matriks Kisi-Kisi Ujian, Kartu Soal per butir, dan Rubrik interval KKTP standar nasional.
                    </p>
                  </div>
                  <Link href="/soal-generator">
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold text-slate-800 border-slate-300 bg-white hover:bg-slate-100 h-9 justify-between cursor-pointer">
                      <span>Susun Paket Soal</span>
                      <ArrowRight className="w-3 h-3 text-slate-700" />
                    </Button>
                  </Link>
                </div>

                {/* RHK 3 */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">RHK 3 (PMM)</span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">MEDIA AJAR</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs">Bahan Tayang (.PPTX) & LKPD</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Slide presentasi kelas berbasis alur pedagogis interaktif beserta lembar aktivitas siswa siap cetak untuk pelibatan murid.
                    </p>
                  </div>
                  <Link href="/presentasi">
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold text-slate-800 border-slate-300 bg-white hover:bg-slate-100 h-9 justify-between cursor-pointer">
                      <span>Hasilkan Slide & LKPD</span>
                      <ArrowRight className="w-3 h-3 text-slate-700" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* 4 Poin Checklist Verifikasi Kelayakan Berkas Kedinasan */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wider">
                    CHECKLIST PRA-UNGGAH BUKTI DUKUNG KE E-KINERJA PMM
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Format: PDF (Maksimal 10 MB)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                      <Check className="w-2.5 h-2.5 text-slate-800 stroke-[3]" />
                    </div>
                    <span>Kop surat dinas resmi terpasang dengan NPSN sekolah.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                      <Check className="w-2.5 h-2.5 text-slate-800 stroke-[3]" />
                    </div>
                    <span>Kolom pengesahan tanda tangan kepala sekolah & guru pengampu.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                      <Check className="w-2.5 h-2.5 text-slate-800 stroke-[3]" />
                    </div>
                    <span>Rubrik asesmen interval KKTP memuat tindak lanjut belajar.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                      <Check className="w-2.5 h-2.5 text-slate-800 stroke-[3]" />
                    </div>
                    <span>Materi selaras dengan Capaian Pembelajaran (CP) BSKAP 2024.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardShell>
  );
}

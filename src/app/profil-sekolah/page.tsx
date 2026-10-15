"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Save,
  Printer,
  RotateCcw,
  CheckCircle2,
  UserCheck,
  Eye,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { OfficialLetterhead } from "@/components/kop-surat/OfficialLetterhead";
import { EndorsementSheet } from "@/components/kop-surat/EndorsementSheet";
import {
  schoolProfileSchema,
  teacherProfileSchema,
  SchoolProfileFormValues,
  TeacherProfileFormValues,
} from "@/lib/validations/school-profile";
import { SchoolProfile, TeacherProfile } from "@/types";

const DEFAULT_SCHOOL: SchoolProfileFormValues = {
  government_agency: "PEMERINTAH PROVINSI JAWA TIMUR",
  education_office: "DINAS PENDIDIKAN DAN KEBUDAYAAN",
  school_name: "SMA NEGERI 1 PURWANTORO",
  npsn: "20311234",
  accreditation: "A",
  address: "Jalan Raya Purwantoro - Kismantoro Km. 2, Purwantoro, Wonogiri",
  postal_code: "57695",
  phone: "(0273) 415123",
  email: "info@sman1purwantoro.sch.id",
  website: "www.sman1purwantoro.sch.id",
  left_logo_url: "",
  right_logo_url: "",
};

const DEFAULT_TEACHER: TeacherProfileFormValues = {
  teacher_name: "Arfian Cahya, S.Pd.",
  teacher_title: "Guru Mata Pelajaran Fisika",
  teacher_nip: "19880412 201402 1 003",
  headmaster_name: "Drs. H. Mulyadi, M.Pd.",
  headmaster_title: "Kepala Sekolah",
  headmaster_nip: "19670815 199303 1 005",
  supervisor_name: "Dr. Hj. Sri Wahyuni, M.Pd.",
  supervisor_title: "Pengawas Pembina Cabang Dinas",
  supervisor_nip: "19651120 199002 2 002",
};

export default function ProfilSekolahPage() {
  const [schoolData, setSchoolData] = useState<SchoolProfileFormValues>(DEFAULT_SCHOOL);
  const [teacherData, setTeacherData] = useState<TeacherProfileFormValues>(DEFAULT_TEACHER);
  const [activeTab, setActiveTab] = useState<string>("sekolah");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Muat data dari localStorage saat komponen dibuka
  useEffect(() => {
    try {
      const savedSchool = localStorage.getItem("guru_school_profile");
      const savedTeacher = localStorage.getItem("guru_teacher_profile");
      if (savedSchool) setSchoolData(JSON.parse(savedSchool));
      if (savedTeacher) setTeacherData(JSON.parse(savedTeacher));
    } catch {
      // Abaikan jika localStorage tidak tersedia di server
    }
  }, []);

  const handleSchoolChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSchoolData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleTeacherChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setErrors({});

    // Validasi Zod (Security by Design)
    const schoolValidation = schoolProfileSchema.safeParse(schoolData);
    const teacherValidation = teacherProfileSchema.safeParse(teacherData);

    const newErrors: Record<string, string> = {};

    if (!schoolValidation.success) {
      schoolValidation.error.issues.forEach((err) => {
        newErrors[`school_${String(err.path[0])}`] = err.message;
      });
    }

    if (!teacherValidation.success) {
      teacherValidation.error.issues.forEach((err) => {
        newErrors[`teacher_${String(err.path[0])}`] = err.message;
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simpan ke localStorage
    localStorage.setItem("guru_school_profile", JSON.stringify(schoolData));
    localStorage.setItem("guru_teacher_profile", JSON.stringify(teacherData));
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  const handleReset = () => {
    if (confirm("Kembalikan data profil ke format contoh standar kedinasan?")) {
      setSchoolData(DEFAULT_SCHOOL);
      setTeacherData(DEFAULT_TEACHER);
      localStorage.setItem("guru_school_profile", JSON.stringify(DEFAULT_SCHOOL));
      localStorage.setItem("guru_teacher_profile", JSON.stringify(DEFAULT_TEACHER));
      setErrors({});
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handlePrintPreview = () => {
    window.print();
  };

  return (
    <DashboardShell activeItem="profil-sekolah">
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Breadcrumb & Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-slate-700 font-medium">Master Data</span>
              <span>/</span>
              <span className="text-slate-900 font-bold">Profil Sekolah & Kop</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-slate-900" />
              <span>Master Profil Sekolah & Kop Kedinasan</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Konfigurasi data satuan pendidikan, kepala sekolah, pengawas pembina, dan logo resmi untuk kop surat dokumen cetak A4.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} className="text-xs font-semibold gap-1.5 text-slate-700 border-slate-300 hover:bg-slate-100 bg-white rounded-xl h-9">
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrintPreview} className="text-xs font-semibold gap-1.5 text-slate-700 border-slate-300 hover:bg-slate-100 bg-white rounded-xl h-9">
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              Cetak A4
            </Button>
            <Button variant="default" size="sm" onClick={handleSave} className="text-xs gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl h-9 px-4 shadow-xs cursor-pointer">
              <Save className="w-3.5 h-3.5 text-white" />
              Simpan Profil
            </Button>
          </div>
        </div>
        {/* Status Alert */}
        {isSaved && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs no-print">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Data profil sekolah dan pejabat penandatangan berhasil disimpan secara permanen.</span>
            </div>
            <span className="text-[11px] text-emerald-700">Tersinkronisasi Otomatis</span>
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs no-print space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Harap perbaiki kolom formulir berikut:</span>
            </div>
            <ul className="list-disc list-inside text-rose-800 pl-4 space-y-0.5">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom Kiri: Form Input Data (7 Kolom) */}
          <div className="lg:col-span-7 space-y-6 no-print">
            <Card className="shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  Pengaturan Data Identitas Kedinasan
                </CardTitle>
                <CardDescription className="text-xs">
                  Informasi ini menjadi sumber tunggal (Single Source of Truth) untuk seluruh dokumen modul ajar, naskah soal, kisi-kisi, dan silabus.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="sekolah" className="gap-2">
                      <Building2 className="w-3.5 h-3.5" />
                      Satuan Pendidikan
                    </TabsTrigger>
                    <TabsTrigger value="pejabat" className="gap-2">
                      <UserCheck className="w-3.5 h-3.5" />
                      Pejabat Penandatangan
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Satuan Pendidikan */}
                  <TabsContent value="sekolah" className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="government_agency">Instansi Pembina / Pemda / Yayasan</Label>
                      <Input
                        id="government_agency"
                        name="government_agency"
                        value={schoolData.government_agency}
                        onChange={handleSchoolChange}
                        placeholder="Contoh: PEMERINTAH PROVINSI JAWA TIMUR"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="education_office">Dinas Pendidikan</Label>
                      <Input
                        id="education_office"
                        name="education_office"
                        value={schoolData.education_office}
                        onChange={handleSchoolChange}
                        placeholder="Contoh: DINAS PENDIDIKAN DAN KEBUDAYAAN"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1.5">
                        <Label htmlFor="school_name">Nama Satuan Pendidikan</Label>
                        <Input
                          id="school_name"
                          name="school_name"
                          value={schoolData.school_name}
                          onChange={handleSchoolChange}
                          placeholder="Contoh: SMA NEGERI 1 PURWANTORO"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="npsn">NPSN (8 Digit)</Label>
                        <Input
                          id="npsn"
                          name="npsn"
                          value={schoolData.npsn}
                          onChange={handleSchoolChange}
                          placeholder="20311234"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="accreditation">Akreditasi</Label>
                        <select
                          id="accreditation"
                          name="accreditation"
                          value={schoolData.accreditation}
                          onChange={handleSchoolChange}
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                        >
                          <option value="A">A (Unggul)</option>
                          <option value="B">B (Baik)</option>
                          <option value="C">C (Cukup)</option>
                          <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={schoolData.phone}
                          onChange={handleSchoolChange}
                          placeholder="(0273) 415123"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="postal_code">Kode Pos</Label>
                        <Input
                          id="postal_code"
                          name="postal_code"
                          value={schoolData.postal_code}
                          onChange={handleSchoolChange}
                          placeholder="57695"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="address">Alamat Lengkap Satuan Pendidikan</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={schoolData.address}
                        onChange={handleSchoolChange}
                        rows={2}
                        placeholder="Nama jalan, nomor, kecamatan, kabupaten/kota"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Alamat Pos-el (Email Resmi)</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={schoolData.email}
                          onChange={handleSchoolChange}
                          placeholder="sekolah@pendidikan.sch.id"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="website">Laman Resmi (Website)</Label>
                        <Input
                          id="website"
                          name="website"
                          value={schoolData.website}
                          onChange={handleSchoolChange}
                          placeholder="www.namasekolah.sch.id"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tab Pejabat Penandatangan */}
                  <TabsContent value="pejabat" className="space-y-5">
                    {/* Data Guru */}
                    <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="font-semibold text-xs text-blue-900 uppercase tracking-wide">
                        1. Guru Mata Pelajaran / Guru Kelas
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="teacher_name">Nama Lengkap & Gelar</Label>
                          <Input
                            id="teacher_name"
                            name="teacher_name"
                            value={teacherData.teacher_name}
                            onChange={handleTeacherChange}
                            placeholder="Contoh: Arfian Cahya, S.Pd."
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="teacher_nip">NIP / NUPTK</Label>
                          <Input
                            id="teacher_nip"
                            name="teacher_nip"
                            value={teacherData.teacher_nip}
                            onChange={handleTeacherChange}
                            placeholder="19880412 201402 1 003"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Data Kepala Sekolah */}
                    <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="font-semibold text-xs text-blue-900 uppercase tracking-wide">
                        2. Kepala Satuan Pendidikan
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="headmaster_name">Nama Lengkap & Gelar</Label>
                          <Input
                            id="headmaster_name"
                            name="headmaster_name"
                            value={teacherData.headmaster_name}
                            onChange={handleTeacherChange}
                            placeholder="Contoh: Drs. H. Mulyadi, M.Pd."
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="headmaster_nip">NIP Kepala Sekolah</Label>
                          <Input
                            id="headmaster_nip"
                            name="headmaster_nip"
                            value={teacherData.headmaster_nip}
                            onChange={handleTeacherChange}
                            placeholder="19670815 199303 1 005"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Data Pengawas Pembina */}
                    <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="font-semibold text-xs text-blue-900 uppercase tracking-wide">
                        3. Pengawas Pembina Sekolah
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="supervisor_name">Nama Pengawas & Gelar</Label>
                          <Input
                            id="supervisor_name"
                            name="supervisor_name"
                            value={teacherData.supervisor_name}
                            onChange={handleTeacherChange}
                            placeholder="Contoh: Dr. Hj. Sri Wahyuni, M.Pd."
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="supervisor_nip">NIP Pengawas</Label>
                          <Input
                            id="supervisor_nip"
                            name="supervisor_nip"
                            value={teacherData.supervisor_nip}
                            onChange={handleTeacherChange}
                            placeholder="19651120 199002 2 002"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Pratinjau Dokumen Real-Time (5 Kolom) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between no-print">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-blue-700" />
                Pratinjau Hasil Cetak Dokumen
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">Format Kertas A4</span>
            </div>

            {/* Kotak Kertas A4 Simulasi */}
            <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-sm space-y-6 print-page">
              <OfficialLetterhead school={schoolData as Partial<SchoolProfile>} />

              <div className="border border-dashed border-slate-200 p-4 rounded text-center text-xs text-slate-500 font-serif">
                [Bagian Tubuh Dokumen: Modul Ajar, Silabus, atau Naskah Soal]
              </div>

              <EndorsementSheet
                school={schoolData as Partial<SchoolProfile>}
                teacher={teacherData as Partial<TeacherProfile>}
                subject="Fisika"
                grade="Fase E (Kelas X)"
                academicYear="2026/2027"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

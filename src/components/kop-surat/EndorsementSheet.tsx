import React from "react";
import { SchoolProfile, TeacherProfile } from "@/types";

interface EndorsementSheetProps {
  school?: Partial<SchoolProfile>;
  teacher?: Partial<TeacherProfile>;
  subject?: string;
  grade?: string;
  phase?: string;
  academicYear?: string;
  semester?: string;
  documentType?: string;
  city?: string;
  date?: string;
}

export const EndorsementSheet: React.FC<EndorsementSheetProps> = ({
  school,
  teacher,
  subject = "Fisika",
  grade = "Fase E (Kelas X)",
  academicYear = "2026/2027",
  semester = "Ganjil",
  documentType = "MODUL AJAR / PERANGKAT PEMBELAJARAN",
  city = "Wonogiri",
  date = "15 Juli 2026",
}) => {
  const teacherName = teacher?.teacher_name || "Arfian Cahya, S.Pd.";
  const teacherNip = teacher?.teacher_nip || "19880412 201402 1 003";
  const headmasterName = teacher?.headmaster_name || "Drs. H. Mulyadi, M.Pd.";
  const headmasterNip = teacher?.headmaster_nip || "19670815 199303 1 005";
  const supervisorName = teacher?.supervisor_name || "Dr. Hj. Sri Wahyuni, M.Pd.";
  const supervisorNip = teacher?.supervisor_nip || "19651120 199002 2 002";
  const schoolName = school?.school_name || "SMA NEGERI 1 PURWANTORO";

  return (
    <div className="w-full bg-white text-black p-6 font-serif leading-relaxed select-none border border-gray-200 rounded-lg print:border-none print:p-0 print:rounded-none print-avoid-break break-inside-avoid">
      <div className="text-center mb-8">
        <h2 className="text-base font-bold tracking-wider uppercase">
          LEMBAR PENGESAHAN
        </h2>
        <h3 className="text-sm font-bold tracking-wider uppercase mt-1">
          {documentType} KURIKULUM MERDEKA
        </h3>
        <p className="text-xs uppercase font-medium text-gray-700 mt-1">
          TAHUN PELAJARAN {academicYear}
        </p>
      </div>

      <p className="text-xs text-justify indent-8 mb-6">
        Dokumen {documentType} Mata Pelajaran <strong>{subject}</strong> untuk tingkat{" "}
        <strong>{grade}</strong> Semester <strong>{semester}</strong> ini telah diperiksa, dievaluasi, dan diverifikasi sesuai dengan ketentuan Kurikulum Merdeka yang berlaku, serta disahkan sebagai pedoman pelaksanaan kegiatan belajar mengajar di <strong>{schoolName}</strong> pada Tahun Pelajaran {academicYear}.
      </p>

      {/* Tanggal & Tempat Pengesahan */}
      <div className="flex justify-end mb-8 text-xs">
        <div>
          <p>Disahkan di: {city}</p>
          <p>Pada tanggal: {date}</p>
        </div>
      </div>

      {/* Tabel Tanda Tangan: Guru & Kepala Sekolah */}
      <div className="grid grid-cols-2 gap-8 text-center text-xs mb-10">
        <div>
          <p className="font-semibold">Guru Mata Pelajaran,</p>
          <div className="h-20" />
          <p className="font-bold underline uppercase">{teacherName}</p>
          <p className="text-[11px] text-gray-700">NIP. {teacherNip}</p>
        </div>

        <div>
          <p className="font-semibold">Mengetahui,</p>
          <p className="font-semibold">Kepala {schoolName},</p>
          <div className="h-16" />
          <p className="font-bold underline uppercase">{headmasterName}</p>
          <p className="text-[11px] text-gray-700">NIP. {headmasterNip}</p>
        </div>
      </div>

      {/* Tanda Tangan Pengawas Pembina */}
      <div className="text-center text-xs border-t border-dashed border-gray-300 pt-6">
        <p className="font-semibold">Mengetahui / Mengesahkan:</p>
        <p className="font-semibold text-gray-700">Pengawas Pembina Sekolah,</p>
        <div className="h-16" />
        <p className="font-bold underline uppercase">{supervisorName}</p>
        <p className="text-[11px] text-gray-700">NIP. {supervisorNip}</p>
      </div>
    </div>
  );
};

import React from "react";
import { TeachingModule, SchoolProfile, TeacherProfile } from "@/types";
import { OfficialLetterhead } from "@/components/kop-surat/OfficialLetterhead";
import { EndorsementSheet } from "@/components/kop-surat/EndorsementSheet";

interface ModulAjarViewProps {
  moduleData: TeachingModule;
  school?: Partial<SchoolProfile>;
  teacher?: Partial<TeacherProfile>;
  className?: string;
}

export const ModulAjarView: React.FC<ModulAjarViewProps> = ({
  moduleData,
  school,
  teacher,
  className = "",
}) => {
  const isRingkas = moduleData.format_mode === "ringkas";

  return (
    <div
      className={`w-full bg-white text-black p-8 sm:p-12 font-serif text-xs leading-relaxed select-none shadow-sm border border-slate-300 rounded-lg print:border-none print:shadow-none print:rounded-none print:p-0 print:m-0 print:text-black print:w-full print-page ${className}`}
    >
      {/* 1. KOP SURAT RESMI DI HALAMAN PERTAMA */}
      <div className="print-avoid-break break-inside-avoid">
        <OfficialLetterhead school={school} />
      </div>

      {/* JUDUL DOKUMEN MODUL AJAR */}
      <div className="text-center py-4 mb-6 border-b border-black print-avoid-break break-inside-avoid">
        <h1 className="text-base font-bold uppercase tracking-wider">
          MODUL AJAR KURIKULUM NASIONAL BKPDM
        </h1>
        <h2 className="text-xs font-bold uppercase text-gray-800 mt-1">
          MATA PELAJARAN: {moduleData.subject}
        </h2>
        <p className="text-[11px] text-gray-700 mt-0.5">
          TAHUN PELAJARAN {moduleData.academic_year} &mdash; TINGKAT {moduleData.grade} (FASE {moduleData.phase})
        </p>
      </div>

      {/* ============================================================== */}
      {/* BAGIAN I: INFORMASI UMUM                                       */}
      {/* ============================================================== */}
      <div className="mb-6 space-y-3 print-avoid-break break-inside-avoid">
        <h2 className="text-xs font-bold uppercase tracking-wide bg-gray-100 p-1.5 border-l-4 border-black">
          I. INFORMASI UMUM
        </h2>

        <table className="w-full border-collapse border border-black text-[11px] mb-3">
          <tbody>
            <tr>
              <td className="border border-black p-1.5 font-semibold bg-gray-50 w-44">Nama Penyusun</td>
              <td className="border border-black p-1.5">{teacher?.teacher_name || "Arfian Cahya, S.Pd."}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-semibold bg-gray-50">Satuan Pendidikan</td>
              <td className="border border-black p-1.5">{school?.school_name || "SMA NEGERI 1 PURWANTORO"}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-semibold bg-gray-50">Tahun Penyusunan</td>
              <td className="border border-black p-1.5">{moduleData.academic_year}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-semibold bg-gray-50">Jenjang / Fase / Kelas</td>
              <td className="border border-black p-1.5">
                Fase {moduleData.phase} &mdash; {moduleData.grade}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-semibold bg-gray-50">Alokasi Waktu</td>
              <td className="border border-black p-1.5">
                {moduleData.total_meetings} Pertemuan ({moduleData.duration_jp} Jam Pelajaran @45 Menit)
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-semibold bg-gray-50">Model Pembelajaran</td>
              <td className="border border-black p-1.5 font-bold">{moduleData.learning_model}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5 font-semibold bg-gray-50">Target Peserta Didik</td>
              <td className="border border-black p-1.5">{moduleData.target_students}</td>
            </tr>
          </tbody>
        </table>

        {/* Kompetensi Awal */}
        <div className="space-y-1">
          <p className="font-bold text-[11px] text-gray-900">A. Kompetensi Awal (Prasyarat):</p>
          <p className="text-[11px] text-gray-800 leading-relaxed indent-6">
            {moduleData.initial_competency}
          </p>
        </div>

        {/* Profil Pelajar Pancasila */}
        <div className="space-y-1">
          <p className="font-bold text-[11px] text-gray-900">B. Dimensi Profil Pelajar Pancasila:</p>
          <ul className="list-disc list-inside text-[11px] text-gray-800 space-y-0.5 pl-4">
            {moduleData.pancasila_dimensions.map((dim, idx) => (
              <li key={idx}>{dim}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BAGIAN II: KOMPONEN INTI                                       */}
      {/* ============================================================== */}
      <div className="mb-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wide bg-gray-100 p-1.5 border-l-4 border-black">
          II. KOMPONEN INTI
        </h2>

        {/* Tujuan Pembelajaran */}
        <div className="space-y-1">
          <p className="font-bold text-[11px] text-gray-900">A. Tujuan Pembelajaran (TP):</p>
          <ol className="list-decimal list-inside text-[11px] text-gray-800 space-y-1 pl-4 leading-relaxed">
            {moduleData.learning_objectives.map((tp, idx) => (
              <li key={idx}>{tp}</li>
            ))}
          </ol>
        </div>

        {/* Pemahaman Bermakna */}
        <div className="space-y-1">
          <p className="font-bold text-[11px] text-gray-900">B. Pemahaman Bermakna:</p>
          <p className="text-[11px] text-gray-800 leading-relaxed indent-6 bg-gray-50 p-2.5 border border-gray-200 rounded">
            {moduleData.meaningful_understanding}
          </p>
        </div>

        {/* Pertanyaan Pemantik */}
        <div className="space-y-1">
          <p className="font-bold text-[11px] text-gray-900">C. Pertanyaan Pemantik:</p>
          <ul className="list-disc list-inside text-[11px] text-gray-800 space-y-1 pl-4">
            {moduleData.trigger_questions.map((q, idx) => (
              <li key={idx} className="italic">&ldquo;{q}&rdquo;</li>
            ))}
          </ul>
        </div>

        {/* Kegiatan Pembelajaran */}
        <div className="space-y-3">
          <p className="font-bold text-[11px] text-gray-900">D. Kegiatan Pembelajaran:</p>

          {moduleData.learning_activities.meetings.map((meeting) => (
            <div key={meeting.meeting_number} className="border border-black p-3.5 space-y-3 rounded-sm print-avoid-break break-inside-avoid">
              <div className="font-bold text-xs uppercase border-b border-black pb-1">
                Pertemuan ke-{meeting.meeting_number} (Alokasi: {meeting.duration_minutes} Menit)
              </div>

              {/* 1. Pendahuluan */}
              <div>
                <p className="font-bold text-[11px] text-blue-950">1. Kegiatan Pendahuluan (15 Menit):</p>
                <ul className="list-disc list-inside text-[11px] text-gray-800 pl-4 space-y-0.5">
                  {meeting.introduction.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* 2. Kegiatan Inti dengan Sintaks Model */}
              <div className="space-y-2">
                <p className="font-bold text-[11px] text-blue-950">
                  2. Kegiatan Inti ({meeting.duration_minutes - 30} Menit) &mdash; Model {moduleData.learning_model}:
                </p>
                <ul className="list-decimal list-inside text-[11px] text-gray-800 pl-4 space-y-1">
                  {meeting.core_activities.syntax_steps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">{step}</li>
                  ))}
                </ul>

                {/* TABEL DIFERENSIASI & DEEP LEARNING PEMBELAJARAN (STANDAR BKPDM) */}
                <div className="mt-3 p-3 bg-blue-50/50 border border-blue-200 rounded text-[11px] space-y-1.5">
                  <p className="font-bold text-blue-900 uppercase tracking-wide">
                    Penerapan Deep Learning & Diferensiasi Pembelajaran (Standar BKPDM Kemendikdasmen):
                  </p>
                  <p className="leading-relaxed">
                    <strong>1. {meeting.core_activities.differentiation_content}</strong>
                  </p>
                  <p className="leading-relaxed">
                    <strong>2. {meeting.core_activities.differentiation_process}</strong>
                  </p>
                  <p className="leading-relaxed">
                    <strong>3. {meeting.core_activities.differentiation_product}</strong>
                  </p>
                  {meeting.core_activities.deep_learning_principles && (
                    <div className="pt-2 mt-2 border-t border-blue-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-2 bg-white rounded border border-blue-100">
                        <span className="font-bold text-blue-950 block text-[10px] uppercase">Mindful (Berkesadaran):</span>
                        <span className="text-[10px] text-gray-700">{meeting.core_activities.deep_learning_principles.mindful_awareness}</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-blue-100">
                        <span className="font-bold text-blue-950 block text-[10px] uppercase">Meaningful (Bermakna):</span>
                        <span className="text-[10px] text-gray-700">{meeting.core_activities.deep_learning_principles.meaningful_inquiry}</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-blue-100">
                        <span className="font-bold text-blue-950 block text-[10px] uppercase">Joyful (Menggembirakan):</span>
                        <span className="text-[10px] text-gray-700">{meeting.core_activities.deep_learning_principles.joyful_reflection}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Penutup */}
              <div>
                <p className="font-bold text-[11px] text-blue-950">3. Kegiatan Penutup (15 Menit):</p>
                <ul className="list-disc list-inside text-[11px] text-gray-800 pl-4 space-y-0.5">
                  {meeting.closing.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Rencana Asesmen */}
        <div className="space-y-2 print-avoid-break break-inside-avoid">
          <p className="font-bold text-[11px] text-gray-900">E. Rencana Asesmen dan Evaluasi:</p>
          <table className="w-full border-collapse border border-black text-[11px]">
            <thead>
              <tr className="bg-gray-100 font-bold text-center">
                <th className="border border-black p-1.5 w-36">Jenis Asesmen</th>
                <th className="border border-black p-1.5 w-44">Bentuk / Teknik</th>
                <th className="border border-black p-1.5">Keterangan Instrumen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-1.5 font-semibold">1. Asesmen Awal (Diagnostik)</td>
                <td className="border border-black p-1.5">Tes Lisan / Pertanyaan Pemantik</td>
                <td className="border border-black p-1.5">{moduleData.assessments.diagnostic}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-semibold">2. Asesmen Proses (Formatif)</td>
                <td className="border border-black p-1.5">Observasi & Lembar Diskusi</td>
                <td className="border border-black p-1.5">{moduleData.assessments.formative}</td>
              </tr>
              <tr>
                <td className="border border-black p-1.5 font-semibold">3. Asesmen Akhir (Sumatif)</td>
                <td className="border border-black p-1.5">Tes Tertulis / Unjuk Kerja</td>
                <td className="border border-black p-1.5">{moduleData.assessments.summative}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BAGIAN III: LAMPIRAN (Hanya tampil jika mode supervisi lengkap) */}
      {/* ============================================================== */}
      {!isRingkas && moduleData.appendices && (
        <div className="mb-6 space-y-4 pt-4 border-t border-black">
          <h2 className="text-xs font-bold uppercase tracking-wide bg-gray-100 p-1.5 border-l-4 border-black">
            III. LAMPIRAN MODUL AJAR
          </h2>

          {/* LKPD */}
          {moduleData.appendices.student_worksheet_lkpd && (
            <div className="space-y-1.5 border border-black p-3.5 rounded-sm bg-gray-50/30 print-avoid-break break-inside-avoid">
              <p className="font-bold text-xs uppercase tracking-wide">
                A. Lembar Kerja Peserta Didik (LKPD):
              </p>
              <pre className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed text-gray-800 bg-white p-3 border border-gray-300 rounded">
                {moduleData.appendices.student_worksheet_lkpd}
              </pre>
            </div>
          )}

          {/* Bahan Bacaan */}
          {moduleData.appendices.reading_materials && (
            <div className="space-y-1 print-avoid-break break-inside-avoid">
              <p className="font-bold text-[11px] text-gray-900">B. Bahan Bacaan Guru dan Peserta Didik:</p>
              <p className="text-[11px] text-gray-800 leading-relaxed p-3 bg-gray-50 border border-gray-200 rounded">
                {moduleData.appendices.reading_materials}
              </p>
            </div>
          )}

          {/* Glosarium */}
          {moduleData.appendices.glossary && (
            <div className="space-y-1 print-avoid-break break-inside-avoid">
              <p className="font-bold text-[11px] text-gray-900">C. Glosarium Istilah:</p>
              <ul className="list-disc list-inside text-[11px] text-gray-800 space-y-1 pl-4">
                {moduleData.appendices.glossary.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.term}:</strong> {item.definition}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Daftar Pustaka */}
          {moduleData.appendices.references && (
            <div className="space-y-1 print-avoid-break break-inside-avoid">
              <p className="font-bold text-[11px] text-gray-900">D. Daftar Pustaka:</p>
              <ul className="list-disc list-inside text-[11px] text-gray-800 space-y-0.5 pl-4">
                {moduleData.appendices.references.map((ref, idx) => (
                  <li key={idx}>{ref}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* LEMBAR PENGESAHAN RESMI DI HALAMAN AKHIR */}
      <div className="pt-6 border-t-2 border-black print-avoid-break break-inside-avoid">
        <EndorsementSheet
          school={school}
          teacher={teacher}
          subject={moduleData.subject}
          grade={`${moduleData.grade} (Fase ${moduleData.phase})`}
          academicYear={moduleData.academic_year}
          semester={moduleData.semester}
          documentType="MODUL AJAR"
        />
      </div>
    </div>
  );
};

"use client";

import React from "react";
import { Download, Printer } from "lucide-react";
import { StudentWorksheetLKPD } from "@/types";
import { OfficialLetterhead } from "@/components/kop-surat/OfficialLetterhead";
import { EndorsementSheet } from "@/components/kop-surat/EndorsementSheet";
import { Button } from "@/components/ui/button";
import { exportLkpdToDocx } from "@/lib/export/docx-exporter";

interface LkpdDocumentViewerProps {
  worksheet: StudentWorksheetLKPD;
}

export function LkpdDocumentViewer({ worksheet }: LkpdDocumentViewerProps) {
  function handlePrint() {
    window.print();
  }

  function handleDownloadDocx() {
    exportLkpdToDocx(worksheet);
  }

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h4 className="font-bold text-sm text-slate-900">
            Lembar Aktivitas Siswa: {worksheet.title}
          </h4>
          <p className="text-xs text-slate-500">
            Format resmi cetak A4 kedinasan dilengkapi tabel data observasi dan rubrik penskoran.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDownloadDocx}
            size="sm"
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs font-semibold h-9 px-4 rounded-xl cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh LKPD (.docx)</span>
          </Button>
          <Button
            onClick={handlePrint}
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold h-9 px-4 rounded-xl cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak LKPD Siswa (A4)</span>
          </Button>
        </div>
      </div>

      {/* A4 Paper Document Canvas */}
      <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-6 sm:p-10 space-y-6 text-slate-800 text-sm">
        <OfficialLetterhead />

        <div className="text-center space-y-1 border-b pb-4">
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">
            {worksheet.title}
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Mata Pelajaran: {worksheet.subject} | Tingkat: Kelas {worksheet.grade} | Semester {worksheet.semester}
          </p>
        </div>

        {/* Identitas Peserta Didik */}
        <div className="border border-slate-300 rounded-md p-4 bg-slate-50 text-xs space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="font-bold text-slate-700 block mb-1">
                Tipe Aktivitas: {worksheet.group_type} (Estimasi: {worksheet.estimated_minutes} Menit)
              </span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Nama Kelompok:</span>
                <span className="border-b border-dotted border-slate-400 flex-1 min-h-[20px]" />
              </div>
            </div>
            <div>
              <span className="font-bold text-slate-700 block mb-1">Tanggal Praktik: .......................................</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Kelas / Ruang:</span>
                <span className="font-bold text-slate-800">{worksheet.grade}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="font-semibold text-slate-600 block mb-1">Nama Anggota Kelompok:</span>
            <div className="grid grid-cols-2 gap-2 text-slate-500">
              <div>1. .............................................................. (Ketua)</div>
              <div>3. ..............................................................</div>
              <div>2. ..............................................................</div>
              <div>4. ..............................................................</div>
            </div>
          </div>
        </div>

        {/* Bagian A: Tujuan & Alat Bahan */}
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-bold uppercase tracking-wide text-slate-800 mb-2">
              A. Tujuan Aktivitas Pembelajaran
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-2">
              {worksheet.learning_objectives.map((obj, idx) => (
                <li key={idx} className="leading-relaxed">
                  {obj}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wide text-slate-800 mb-2">
              B. Alat, Bahan, & Sumber Belajar
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-2">
              {worksheet.materials_tools.map((mat, idx) => (
                <li key={idx} className="leading-relaxed">
                  {mat}
                </li>
              ))}
            </ul>
          </div>

          {/* Bagian C: Langkah Kerja */}
          <div>
            <h4 className="font-bold uppercase tracking-wide text-slate-800 mb-2">
              C. Prosedur & Langkah Kerja Eksploratif
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-700 pl-2">
              {worksheet.activity_steps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Bagian D: Tabel Pengamatan */}
          {worksheet.data_observation_table && (
            <div>
              <h4 className="font-bold uppercase tracking-wide text-slate-800 mb-2">
                D. Lembar Pengamatan & Analisis Data
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 uppercase font-bold text-center">
                      {worksheet.data_observation_table.headers.map((h, idx) => (
                        <th key={idx} className="border border-slate-300 p-2">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {worksheet.data_observation_table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="text-center hover:bg-slate-50/50">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="border border-slate-300 p-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Empty placeholder rows for manual student experiment input */}
                    {[1, 2].map((extra) => (
                      <tr key={`extra-${extra}`} className="text-center h-8">
                        <td className="border border-slate-300 p-2 text-slate-400">
                          {worksheet.data_observation_table?.rows.length ? worksheet.data_observation_table.rows.length + extra : extra}
                        </td>
                        <td className="border border-slate-300 p-2" />
                        <td className="border border-slate-300 p-2" />
                        <td className="border border-slate-300 p-2" />
                        <td className="border border-slate-300 p-2" />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bagian E: Pertanyaan Analisis */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wide text-slate-800 mb-2">
              E. Pertanyaan Analisis & Diskusi Kritis
            </h4>
            {worksheet.analysis_questions.map((q, qIdx) => (
              <div key={qIdx} className="space-y-2">
                <p className="font-semibold text-slate-800">
                  {qIdx + 1}. {q}
                </p>
                <div className="border border-dashed border-slate-300 rounded p-2.5 min-h-[50px] bg-slate-50/40 text-slate-400 text-[11px]">
                  Jawaban: .................................................................................................................................................................................................................
                </div>
              </div>
            ))}
          </div>

          {/* Bagian F: Kesimpulan */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wide text-slate-800 mb-2">
              F. Kesimpulan Akhir Kelompok
            </h4>
            {worksheet.conclusion_prompts.map((cp, cIdx) => (
              <div key={cIdx} className="space-y-1">
                <p className="font-medium text-slate-700 italic">{cp}</p>
                <div className="border border-dashed border-slate-300 rounded p-2 min-h-[40px] bg-slate-50/40" />
              </div>
            ))}
          </div>

          {/* Bagian G: Rubrik Penilaian Kinerja Guru */}
          <div className="pt-2">
            <h4 className="font-bold uppercase tracking-wide text-slate-800 mb-2">
              G. Rubrik Penilaian Kinerja Praktik (Diisi Guru Penilai)
            </h4>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold uppercase">
                  <th className="border border-slate-300 p-2 text-center w-10">No</th>
                  <th className="border border-slate-300 p-2 text-left w-44">Aspek Penilaian</th>
                  <th className="border border-slate-300 p-2 text-left">Kriteria Capaian</th>
                  <th className="border border-slate-300 p-2 text-center w-24">Skor Maks</th>
                  <th className="border border-slate-300 p-2 text-center w-24">Skor Perolehan</th>
                </tr>
              </thead>
              <tbody>
                {worksheet.rubric_scoring.map((rub, rIdx) => (
                  <tr key={rIdx}>
                    <td className="border border-slate-300 p-2 text-center">{rIdx + 1}</td>
                    <td className="border border-slate-300 p-2 font-semibold text-slate-800">
                      {rub.aspect}
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-600">{rub.criteria}</td>
                    <td className="border border-slate-300 p-2 text-center font-bold">{rub.max_score}</td>
                    <td className="border border-slate-300 p-2 text-center font-bold text-slate-400">
                      .....
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold text-slate-900">
                  <td colSpan={3} className="border border-slate-300 p-2 text-right">
                    TOTAL SKOR AKHIR PENILAIAN (0 - 100):
                  </td>
                  <td className="border border-slate-300 p-2 text-center text-blue-900 font-extrabold">
                    100
                  </td>
                  <td className="border border-slate-300 p-2 text-center font-extrabold">.....</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <EndorsementSheet />
      </div>
    </div>
  );
}

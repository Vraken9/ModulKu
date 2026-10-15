"use client";

import React from "react";
import { AlurTujuanPembelajaran } from "@/types";
import { OfficialLetterhead } from "@/components/kop-surat/OfficialLetterhead";
import { EndorsementSheet } from "@/components/kop-surat/EndorsementSheet";
import { Badge } from "@/components/ui/badge";

interface AtpTableViewProps {
  data: AlurTujuanPembelajaran;
  schoolName?: string;
}

export function AtpTableView({ data }: AtpTableViewProps) {
  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-6 sm:p-8 space-y-6 text-slate-800 text-sm">
      <OfficialLetterhead />

      <div className="text-center space-y-1 border-b pb-4">
        <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">
          ALUR TUJUAN PEMBELAJARAN (ATP)
        </h2>
        <p className="text-xs text-slate-600 font-medium">
          Mata Pelajaran: {data.subject} | Fase: {data.phase} (Kelas {data.grade}) | Tahun Ajaran: {data.academic_year}
        </p>
      </div>

      {/* Identitas & Rasional */}
      <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <span className="font-semibold text-slate-700">Mata Pelajaran:</span> {data.subject}
          </div>
          <div>
            <span className="font-semibold text-slate-700">Fase / Kelas:</span> Fase {data.phase} / Kelas {data.grade}
          </div>
          <div>
            <span className="font-semibold text-slate-700">Tahun Ajaran:</span> {data.academic_year}
          </div>
          <div>
            <span className="font-semibold text-slate-700">Total Alokasi Waktu:</span> {data.total_jp} JP
          </div>
        </div>

        <div>
          <span className="font-bold text-slate-800 block mb-1">Rasional Penyusunan Alur:</span>
          <p className="text-slate-600 leading-relaxed italic">{data.rationale}</p>
        </div>
      </div>

      {/* Capaian Pembelajaran Elemen */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">
          Capaian Pembelajaran Berdasarkan Regulasi BKPDM Kemendikdasmen No. 020/2026
        </h3>
        {data.elements.map((el, i) => (
          <div key={i} className="border border-slate-200 rounded p-3 text-xs bg-white">
            <span className="font-bold text-blue-900 block mb-1">Elemen: {el.name}</span>
            <p className="text-slate-600 leading-relaxed">{el.cp_description}</p>
          </div>
        ))}
      </div>

      {/* Tabel Alur Tujuan Pembelajaran */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-300 text-xs text-left">
          <thead>
            <tr className="bg-slate-100 text-slate-800 uppercase font-bold border-b border-slate-300">
              <th className="border border-slate-300 p-2 text-center w-12">No</th>
              <th className="border border-slate-300 p-2 text-center w-20">Kode TP</th>
              <th className="border border-slate-300 p-2 min-w-[200px]">Rumusan Tujuan Pembelajaran (TP)</th>
              <th className="border border-slate-300 p-2 min-w-[150px]">Lingkup Materi Inti</th>
              <th className="border border-slate-300 p-2 text-center w-16">Alokasi (JP)</th>
              <th className="border border-slate-300 p-2 text-center w-16">Sem.</th>
              <th className="border border-slate-300 p-2 min-w-[140px]">Dimensi Profil Pancasila</th>
              <th className="border border-slate-300 p-2 min-w-[130px]">Rencana Asesmen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.tp_items.map((tp, idx) => (
              <tr key={tp.id || idx} className="hover:bg-slate-50/50">
                <td className="border border-slate-300 p-2 text-center font-medium">{idx + 1}</td>
                <td className="border border-slate-300 p-2 text-center font-bold text-blue-800">{tp.code}</td>
                <td className="border border-slate-300 p-2 leading-relaxed">
                  <div className="font-medium text-slate-800">{tp.statement}</div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-600">Kompetensi (KKO):</span> {tp.competency}
                  </div>
                </td>
                <td className="border border-slate-300 p-2 font-medium text-slate-700">{tp.material_scope}</td>
                <td className="border border-slate-300 p-2 text-center font-bold">{tp.allocated_jp}</td>
                <td className="border border-slate-300 p-2 text-center">{tp.semester}</td>
                <td className="border border-slate-300 p-2">
                  <div className="flex flex-wrap gap-1">
                    {tp.pancasila_dimensions.map((dim, dIdx) => (
                      <Badge key={dIdx} variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                        {dim}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="border border-slate-300 p-2 text-slate-600">{tp.evaluation_technique}</td>
              </tr>
            ))}
            <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
              <td colSpan={4} className="border border-slate-300 p-2 text-right">
                TOTAL BEBAN BELAJAR KESELURUHAN (ATP TAHUNAN):
              </td>
              <td className="border border-slate-300 p-2 text-center text-blue-900 font-extrabold text-sm">
                {data.total_jp}
              </td>
              <td colSpan={3} className="border border-slate-300 p-2 text-slate-600 text-[11px]">
                JP terbagi proporsional dalam Semester 1 dan 2
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EndorsementSheet />
    </div>
  );
}

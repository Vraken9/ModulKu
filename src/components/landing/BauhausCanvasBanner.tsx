"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusSeparator } from "@/components/ui/plus-separator";

interface CellData {
  id: number;
  shapeType: "concentric" | "quarterCircle" | "stripes" | "nestedSquares" | "halfCircle" | "cross";
  color1: string;
  color2: string;
  rotation: number;
}

const PALETTES = [
  { c1: "#1E40AF", c2: "#DBEAFE" }, // Deep Blue & Ice Blue
  { c1: "#047857", c2: "#D1FAE5" }, // Emerald & Light Emerald
  { c1: "#D97706", c2: "#FEF3C7" }, // Amber & Light Amber
  { c1: "#334155", c2: "#F1F5F9" }, // Slate & Light Slate
  { c1: "#0284C7", c2: "#E0F2FE" }, // Sky & Light Sky
  { c1: "#475569", c2: "#FFFFFF" }, // Neutral
];

function generateRandomCells(count: number = 18): CellData[] {
  const shapeTypes: CellData["shapeType"][] = [
    "concentric",
    "quarterCircle",
    "stripes",
    "nestedSquares",
    "halfCircle",
    "cross",
  ];

  return Array.from({ length: count }, (_, idx) => {
    const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const shape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const rotations = [0, 90, 180, 270];
    const rot = rotations[Math.floor(Math.random() * rotations.length)];

    return {
      id: idx,
      shapeType: shape,
      color1: palette.c1,
      color2: palette.c2,
      rotation: rot,
    };
  });
}

export function BauhausCanvasBanner() {
  const [cells, setCells] = useState<CellData[]>([]);
  const [regenerateKey, setRegenerateKey] = useState(0);

  useEffect(() => {
    setCells(generateRandomCells(18));
  }, [regenerateKey]);

  const handleCellHover = (id: number) => {
    setCells((prev) =>
      prev.map((c) => (c.id === id ? { ...c, rotation: (c.rotation + 90) % 360 } : c))
    );
  };

  const handleRandomize = () => {
    setRegenerateKey((k) => k + 1);
  };

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <PlusSeparator position={["top-left", "top-right", "bottom-left", "bottom-right"]} />

      {/* Top Banner Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-slate-100 bg-slate-50/70 text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-mono">
          <span className="w-2 h-2 rounded-full bg-slate-900" />
          <span>[kanvas_geometris_kurikulum_merdeka]</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Arahkan kursor ke pola untuk memutar bentuk
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRandomize}
            className="text-[11px] h-7 gap-1.5 font-semibold text-slate-700 hover:text-slate-900 border-slate-300 bg-white cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Acak Pola Seni</span>
          </Button>
        </div>
      </div>

      {/* Grid Canvas Display */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-0 p-4 sm:p-6 bg-slate-50/30">
        {cells.map((cell) => (
          <div
            key={cell.id}
            onMouseEnter={() => handleCellHover(cell.id)}
            className="aspect-square p-1 sm:p-1.5 border border-slate-200/70 bg-white cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-md relative"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${cell.rotation}deg)` }}
            >
              {cell.shapeType === "concentric" && (
                <>
                  <rect width="100" height="100" fill={cell.color2} />
                  <circle cx="50" cy="50" r="40" fill={cell.color1} />
                  <circle cx="50" cy="50" r="24" fill={cell.color2} />
                  <circle cx="50" cy="50" r="10" fill={cell.color1} />
                </>
              )}

              {cell.shapeType === "quarterCircle" && (
                <>
                  <rect width="100" height="100" fill={cell.color2} />
                  <path d="M 0 0 L 100 0 A 100 100 0 0 1 0 100 Z" fill={cell.color1} />
                  <path d="M 0 0 L 50 0 A 50 50 0 0 1 0 50 Z" fill={cell.color2} />
                </>
              )}

              {cell.shapeType === "stripes" && (
                <>
                  <rect width="100" height="100" fill={cell.color2} />
                  <rect x="0" y="10" width="100" height="16" fill={cell.color1} />
                  <rect x="0" y="42" width="100" height="16" fill={cell.color1} />
                  <rect x="0" y="74" width="100" height="16" fill={cell.color1} />
                </>
              )}

              {cell.shapeType === "nestedSquares" && (
                <>
                  <rect width="100" height="100" fill={cell.color2} />
                  <rect x="15" y="15" width="70" height="70" fill={cell.color1} />
                  <rect x="30" y="30" width="40" height="40" fill={cell.color2} />
                  <rect x="42" y="42" width="16" height="16" fill={cell.color1} />
                </>
              )}

              {cell.shapeType === "halfCircle" && (
                <>
                  <rect width="100" height="100" fill={cell.color2} />
                  <path d="M 0 50 A 50 50 0 0 1 100 50 Z" fill={cell.color1} />
                  <circle cx="50" cy="80" r="14" fill={cell.color1} />
                </>
              )}

              {cell.shapeType === "cross" && (
                <>
                  <rect width="100" height="100" fill={cell.color2} />
                  <rect x="35" y="10" width="30" height="80" rx="6" fill={cell.color1} />
                  <rect x="10" y="35" width="80" height="30" rx="6" fill={cell.color1} />
                </>
              )}
            </svg>
          </div>
        ))}
      </div>

      {/* Spanduk Narasi di Bawah Kanvas */}
      <div className="p-6 sm:p-8 bg-white border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 font-bold">
            <Sparkles className="w-3 h-3 text-slate-700" />
            <span>STANDAR BSKAP KEMENDIKBUDRISTEK NO. 032/H/KR/2024</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Presisi Struktur Dokumen Tanpa Kompromi
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Setiap komponen instrumen pendidikan yang dihasilkan dirancang dengan tata letak modular presisi tinggi, memastikan kesiapan supervisi dinas, asesmen akreditasi, dan bukti dukung PMM kepala sekolah.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <div className="text-right text-xs font-mono text-slate-500">
            <p className="font-bold text-slate-900">100% Sesuai Regulasi</p>
            <p className="text-[11px] text-slate-700 font-semibold">Format Kedinasan A4</p>
          </div>
        </div>
      </div>
    </div>
  );
}

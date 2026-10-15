"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  CheckCircle2,
  Layers,
  Sparkles,
  Download,
  BookOpen,
  Award,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Hero3DModuleCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(10);
  const [rotateY, setRotateY] = useState<number>(-12);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile) {
        setRotateX(0);
        setRotateY(0);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle interactive 3D mouse move tilt (only on desktop/tablet)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-16 to +16 degrees)
    const rotX = ((y - centerY) / centerY) * -14;
    const rotY = ((x - centerX) / centerX) * 16;

    setRotateX(rotX);
    setRotateY(rotY);

    // Glare position in percent
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      setRotateX(8);
      setRotateY(-10);
    }
  };

  const resetAngle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className="relative w-full max-w-[660px] xl:max-w-[720px] mx-auto select-none py-2 sm:py-6 px-2 sm:px-0"
      style={{ perspective: isMobile ? "none" : "1200px" }}
    >
      {/* Interactive 3D Perspective Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative transition-transform duration-200 ease-out ${
          isMobile ? "" : "cursor-grab active:cursor-grabbing"
        }`}
        style={{
          transformStyle: isMobile ? "flat" : "preserve-3d",
          transform: isMobile
            ? "none"
            : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* Layer 0: 3D Cast Shadow Dasar */}
        <div
          className="absolute inset-4 rounded-3xl bg-slate-900/15 blur-2xl -z-10 pointer-events-none transition-opacity duration-300 hidden sm:block"
          style={{
            transform: "translateZ(-40px) translateY(24px) scale(0.92)",
            opacity: isHovered ? 0.35 : 0.2,
          }}
        />

        {/* Layer 1: Dokumen Belakang (Matriks Kisi-Kisi Ujian) - Ditampilkan hanya di Tablet & Desktop */}
        <div
          className="absolute -top-4 -right-4 w-full h-full rounded-2xl border border-slate-300 bg-slate-100/90 shadow-md p-6 pointer-events-none transition-transform duration-300 hidden sm:block"
          style={{
            transform: `translateZ(${isHovered ? "20px" : "12px"}) rotateZ(3deg)`,
          }}
        >
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium border-b border-slate-200 pb-2.5">
            <span className="font-semibold text-slate-700">Lampiran Matriks Kisi-Kisi</span>
            <span className="font-mono">Standar BKPDM Kemendikdasmen</span>
          </div>
          <div className="mt-4 space-y-2.5 opacity-50">
            <div className="h-3 bg-slate-300 rounded w-3/4" />
            <div className="h-2.5 bg-slate-200 rounded w-full" />
            <div className="h-2.5 bg-slate-200 rounded w-5/6" />
          </div>
        </div>

        {/* Layer 2: Dokumen Utama Modul Ajar (Main 3D Surface) */}
        <div
          className="relative rounded-2xl sm:rounded-3xl border border-slate-300/90 bg-white p-6 sm:p-8 lg:p-9 shadow-xl overflow-hidden transition-shadow duration-300"
          style={{
            transform: "translateZ(35px)",
            boxShadow: isHovered
              ? "0 30px 60px -15px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(15, 23, 42, 0.08)"
              : "0 20px 40px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.05)",
          }}
        >
          {/* Dynamic Light Glare Highlight */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-200 mix-blend-overlay"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.9) 0%, transparent 60%)`,
            }}
          />

          {/* Kop Surat Header Monokromatik */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-xs">
                M
              </div>
              <div>
                <span className="font-extrabold text-xs sm:text-sm tracking-tight text-slate-900 block uppercase">
                  Modul Ajar Terverifikasi
                </span>
                <span className="text-[11px] text-slate-600 font-mono block">
                  KODE DOKUMEN: MODULKU-BKPDM-2026
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetAngle}
                title="Reset Pandangan 3D"
                className="w-7 h-7 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="text-[11px] font-mono px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-800 font-bold">
                FASE E (SMA/SMK)
              </div>
            </div>
          </div>

          {/* Identitas Mata Pelajaran & Parameter */}
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Mata Pelajaran: Ilmu Pengetahuan Alam</span>
                <span className="font-mono text-slate-900 font-bold">Kelas X</span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                Modul Ajar Energi Terbarukan & Efisiensi Berkelanjutan
              </h4>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-700 font-medium">
                <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                  3 Pilar Diferensiasi & Deep Learning
                </span>
                <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs font-mono">
                  24 JP Efektif
                </span>
              </div>
            </div>

            {/* Stimulus & Contoh Butir Soal AKM */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-600 block">
                Contoh Stimulus Soal HOTS & Asesmen AKM
              </span>
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5 shadow-2xs">
                <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed italic">
                  &ldquo;Sebuah instalasi turbin angin mikro menghasilkan daya puncak pada kecepatan angin tertentu. Analisislah korelasi massa jenis udara terhadap daya keluaran mekanik...&rdquo;
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  <span className="font-medium">Taksonomi: C4 (Menganalisis)</span>
                  <span className="font-bold text-slate-900">Kunci: Opsi C</span>
                </div>
              </div>
            </div>

            {/* Output Dokumen Format Resmi */}
            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center text-xs font-bold">
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                .DOCX 4-3-3-3 cm
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
                Kop Dua Logo
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                Slide .PPTX 16:9
              </div>
            </div>
          </div>
        </div>

        {/* Layer 3: Floating 3D Stamp & Verification Badge (Pop-out 3D Effect) */}
        <div
          className="absolute -bottom-3 -left-3 sm:-bottom-5 sm:-left-5 bg-slate-900 text-white rounded-2xl border border-slate-700 p-4 shadow-2xl flex items-center gap-3.5 transition-transform duration-300 pointer-events-none"
          style={{
            transform: `translateZ(${isHovered ? "70px" : "55px"})`,
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-white shrink-0 border border-white/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] text-slate-300 block uppercase tracking-wider font-semibold">
              Verifikasi Resmi
            </span>
            <span className="text-xs sm:text-sm font-black text-white block">
              Standar BKPDM No. 020/2026
            </span>
          </div>
        </div>

        {/* Layer 4: Floating 3D Metric Badge (Pop-out 3D Top Right) */}
        <div
          className="absolute -top-3 -right-2 sm:-top-5 sm:-right-5 bg-white text-slate-900 rounded-2xl border border-slate-300 p-3 shadow-lg flex items-center gap-2.5 transition-transform duration-300 pointer-events-none text-xs"
          style={{
            transform: `translateZ(${isHovered ? "65px" : "50px"})`,
          }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 animate-pulse" />
          <span className="font-bold text-slate-800 font-mono">
            GENERASI INSTAN: 45 DETIK
          </span>
        </div>
      </div>

      {/* Helper Caption */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500 font-medium">
          Gerakkan kursor pada kartu untuk interaksi 3D perspektif
        </p>
      </div>
    </div>
  );
}

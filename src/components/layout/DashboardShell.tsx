"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileCheck2,
  FileText,
  CalendarDays,
  Presentation,
  Settings,
  LogOut,
  HelpCircle,
  School,
  User,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
  FolderArchive,
  HardDrive,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModulKuLogo } from "@/components/ui/ModulKuLogo";
import { SchoolProfile, TeacherProfile } from "@/types";
import {
  getStorageUsageSummary,
  formatBytes,
  TIER_CONFIGS,
  DEFAULT_STORAGE_SUMMARY,
} from "@/lib/document-vault";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  id: string;
  desc?: string;
}

interface MenuSection {
  label: string;
  badge?: string;
  items: MenuItem[];
}

interface DashboardShellProps {
  children: React.ReactNode;
  activeItem?: string;
}

export function DashboardShell({ children, activeItem }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vaultSummary, setVaultSummary] = useState(DEFAULT_STORAGE_SUMMARY);

  // Profil Guru & Sekolah dari localStorage
  const [school, setSchool] = useState<Partial<SchoolProfile>>({
    school_name: "SMA NEGERI 1 PURWANTORO",
  });
  const [teacher, setTeacher] = useState<Partial<TeacherProfile>>({
    teacher_name: "Arfian Cahya, S.Pd.",
    teacher_nip: "19880412 201402 1 002",
  });

  useEffect(() => {
    try {
      const savedSchool = localStorage.getItem("guru_school_profile");
      const savedTeacher = localStorage.getItem("guru_teacher_profile");
      if (savedSchool) setSchool(JSON.parse(savedSchool));
      if (savedTeacher) setTeacher(JSON.parse(savedTeacher));
      setVaultSummary(getStorageUsageSummary());
    } catch {
      // Abaikan di server
    }

    const handleVaultChange = () => {
      setVaultSummary(getStorageUsageSummary());
    };
    window.addEventListener("modulku-vault-changed", handleVaultChange);
    return () => window.removeEventListener("modulku-vault-changed", handleVaultChange);
  }, []);

  async function handleLogout() {
    try {
      localStorage.removeItem("guru_auth_token");
    } catch {
      // ignore
    }
    try {
      await signOut({ callbackUrl: "/" });
    } catch {
      router.push("/");
    }
  }

  const menuSections: MenuSection[] = [
    {
      label: "UTAMA",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          id: "dashboard",
        },
        {
          name: "Bank Dokumen",
          href: "/bank-dokumen",
          icon: FolderArchive,
          id: "bank-dokumen",
          desc: "Arsip & Kuota Cloud",
        },
      ],
    },
    {
      label: "PERANGKAT AJAR",
      badge: "HOT",
      items: [
        {
          name: "Soal Generator",
          href: "/soal-generator",
          icon: FileCheck2,
          id: "soal-generator",
          desc: "AKM, HOTS, & Kisi-Kisi",
        },
        {
          name: "Modul Ajar BKPDM",
          href: "/modul-ajar",
          icon: FileText,
          id: "modul-ajar",
          desc: "Deep Learning & Karakter",
        },
        {
          name: "ATP, Prota, & Promes",
          href: "/perangkat-tahunan",
          icon: CalendarDays,
          id: "perangkat-tahunan",
          desc: "Alur & Pekan Efektif",
        },
        {
          name: "Slide Tayang & LKPD",
          href: "/presentasi",
          icon: Presentation,
          id: "presentasi",
          desc: "PowerPoint Native",
        },
      ],
    },
    {
      label: "MASTER DATA",
      items: [
        {
          name: "Profil Sekolah & Kop",
          href: "/profil-sekolah",
          icon: School,
          id: "profil-sekolah",
          desc: "Kop Surat & NIP Guru",
        },
      ],
    },
    {
      label: "SISTEM",
      items: [
        {
          name: "Panduan Bukti PMM",
          href: "/dashboard#panduan-pmm",
          icon: BookOpen,
          id: "panduan-pmm",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900">
      {/* Mobile Topbar */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <ModulKuLogo size="sm" />
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Logo Brand Header */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <ModulKuLogo size="md" />
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-6 flex-1">
            {menuSections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-1.5">
                <div className="px-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                    {sec.label}
                  </span>
                  {sec.badge && (
                    <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                      {sec.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {sec.items.map((item) => {
                    const isActive =
                      Boolean(activeItem && activeItem === item.id) ||
                      Boolean(
                        pathname &&
                          (pathname === item.href ||
                            (item.href !== "/dashboard" && pathname.startsWith(item.href)))
                      );
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-slate-900 text-white font-bold shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? "text-white" : "text-slate-600"
                          }`}
                        />
                        <div className="flex-1 truncate">
                          <span className={isActive ? "text-white font-bold" : "text-slate-800"}>
                            {item.name}
                          </span>
                          {item.desc && (
                            <span
                              className={`text-[10px] block truncate font-normal ${
                                isActive ? "text-slate-300" : "text-slate-500"
                              }`}
                            >
                              {item.desc}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Storage Quota Progress Widget */}
        <div className="px-4 py-3 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 pb-1.5">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-slate-600" />
              <span>Penyimpanan Arsip</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-500">
              {vaultSummary.tier}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                vaultSummary.percentageUsed > 85 ? "bg-amber-500" : "bg-slate-900"
              }`}
              style={{ width: `${Math.max(4, vaultSummary.percentageUsed)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5">
            <span>{formatBytes(vaultSummary.usedBytes)} / {TIER_CONFIGS[vaultSummary.tier].formattedLimit}</span>
            <Link href="/#harga" className="text-blue-600 hover:underline font-bold">
              Upgrade
            </Link>
          </div>
        </div>

        {/* Sidebar Footer: Info Guru & Tombol Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-300">
              <User className="w-4 h-4 text-slate-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {teacher.teacher_name}
              </p>
              <p className="text-[10px] text-slate-600 truncate">
                {school.school_name}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-[11px] h-8 font-semibold text-slate-700 hover:text-slate-900 border-slate-300 bg-white"
              >
                Halaman Utama
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-[11px] h-8 px-2.5 font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 hover:border-red-200 border-slate-300 bg-white"
              title="Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Topbar Desktop */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 px-8 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Satuan Pendidikan:</span>
            <Badge variant="outline" className="text-xs font-bold bg-slate-50 text-slate-800">
              {school.school_name}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>BKPDM Kemendikdasmen</span>
            </div>

            <Link href="/profil-sekolah">
              <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 h-8">
                <Settings className="w-3.5 h-3.5" />
                <span>Pengaturan Kop</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

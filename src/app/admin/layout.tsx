"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Activity,
  Settings,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
} from "lucide-react";
import { ModulKuLogo } from "@/components/ui/ModulKuLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSubscriptionRequests } from "@/lib/subscription";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updatePending = () => {
      const requests = getSubscriptionRequests();
      const count = requests.filter((r) => r.status === "pending").length;
      setPendingCount(count);
    };

    updatePending();
    window.addEventListener("modulku-subscription-changed", updatePending);
    return () => window.removeEventListener("modulku-subscription-changed", updatePending);
  }, []);

  const navItems = [
    {
      name: "Ikhtisar & Metrik",
      href: "/admin",
      icon: LayoutDashboard,
      id: "overview",
      exact: true,
    },
    {
      name: "Persetujuan Langganan",
      href: "/admin/persetujuan",
      icon: CreditCard,
      id: "approvals",
      badge: pendingCount > 0 ? String(pendingCount) : undefined,
    },
    {
      name: "Manajemen Pengguna",
      href: "/admin/pengguna",
      icon: Users,
      id: "users",
    },
    {
      name: "Pelacakan Hit & Biaya API",
      href: "/admin/biaya-api",
      icon: Activity,
      id: "api-cost",
    },
    {
      name: "Pengaturan Sistem",
      href: "/admin/pengaturan",
      icon: Settings,
      id: "settings",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-indigo-600 selection:text-white">
      {/* Topbar Mobile */}
      <header className="md:hidden bg-slate-950 border-b border-slate-800 px-4 h-14 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <ModulKuLogo size="sm" showSubtitle subtitleText="Admin Console" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-300 hover:text-white hover:bg-slate-800"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Sidebar Navigasi Kiri Desktop & Drawer Mobile */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-30 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div className="flex items-center gap-2.5">
              <ModulKuLogo size="md" />
            </div>
            <Badge variant="outline" className="bg-indigo-950/80 border-indigo-700/60 text-indigo-300 font-mono text-[9px] px-1.5 py-0.5">
              ADMIN
            </Badge>
          </div>

          {/* Tag Status Keamanan */}
          <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Otoritas Superuser</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Panel Kontrol Produksi</p>
          </div>

          {/* Navigasi Utama di Sebelah Kiri */}
          <nav className="p-3 space-y-1 flex-1">
            <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              MODUL MANAJEMEN
            </div>

            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white font-bold shadow-xs"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono font-bold bg-rose-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar: Profil Admin & Navigasi Cepat */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Administrator Pusat</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">admin@modulku.id</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/dashboard" className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-[11px] h-8 font-semibold text-slate-300 hover:text-white border-slate-700 hover:bg-slate-800 bg-slate-900/80 gap-1.5"
              >
                <span>Ruang Guru</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/login")}
              className="text-[11px] h-8 px-2.5 font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 hover:border-rose-800/80 border-slate-700 bg-slate-900/80"
              title="Keluar dari Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Konten Utama di Sebelah Kanan */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        {/* Topbar Desktop */}
        <header className="hidden md:flex h-16 bg-slate-950/60 border-b border-slate-800 px-8 items-center justify-between sticky top-0 z-20 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">ModulKu Control Center</span>
            <span className="text-slate-600">/</span>
            <Badge variant="outline" className="text-[11px] font-mono bg-slate-900 text-slate-300 border-slate-700">
              {pathname}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Sistem Normal (99.98% Uptime)</span>
            </div>
          </div>
        </header>

        {/* Area Halaman */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

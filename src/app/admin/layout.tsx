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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-slate-700 selection:text-white">
      {/* Topbar Mobile */}
      <header className="md:hidden bg-slate-950 border-b border-slate-800 px-4 h-14 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-950 font-bold flex items-center justify-center text-xs shadow-xs">
            M
          </div>
          <span className="text-sm text-slate-50 font-bold tracking-tight">ModulKu</span>
          <span className="text-[10px] font-mono text-slate-400 pl-1">Admin</span>
        </Link>
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
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-950 font-bold flex items-center justify-center text-sm shadow-xs">
                M
              </div>
              <span className="text-base text-slate-50 font-bold tracking-tight">ModulKu</span>
            </Link>
            <span className="bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded">
              CONTROL
            </span>
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
                  className={`flex items-center justify-between px-3 py-2.5 text-xs transition-all ${
                    isActive
                      ? "bg-slate-100 text-slate-950 font-semibold rounded-xl shadow-xs"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-xl transition-colors"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-slate-900 text-slate-100"
                          : "bg-slate-800 text-slate-200 border border-slate-700"
                      }`}
                    >
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
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate">Administrator Pusat</p>
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
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Sistem Normal (99.98% Uptime)</span>
            </div>
          </div>
        </header>

        {/* Area Halaman */}
        <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  HardDrive,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubscriptionTier } from "@/types";
import { getUserTier, setUserTier } from "@/lib/document-vault";
import { useNotification } from "@/components/providers/NotificationProvider";

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  nip: string;
  schoolName: string;
  tier: SubscriptionTier;
  usedStorage: string;
  joinedAt: string;
  lastActive: string;
}

const SEED_USERS: AdminUserItem[] = [
  {
    id: "user-1",
    name: "Arfian Cahya, S.Pd.",
    email: "arfian.cahya@guru.sma.belajar.id",
    nip: "19880412 201402 1 002",
    schoolName: "SMA NEGERI 1 PURWANTORO",
    tier: "pro",
    usedStorage: "3.2 MB / 2 GB",
    joinedAt: "12 Okt 2026",
    lastActive: "10 menit yang lalu",
  },
  {
    id: "user-2",
    name: "Dra. Sri Wahyuni, M.Pd.",
    email: "sri.wahyuni@guru.sma.belajar.id",
    nip: "19651120 199002 2 002",
    schoolName: "SMAN 1 WONOGIRI",
    tier: "pro",
    usedStorage: "1.8 MB / 2 GB",
    joinedAt: "14 Okt 2026",
    lastActive: "25 menit yang lalu",
  },
  {
    id: "user-3",
    name: "Bambang Sudiro, S.Pd.",
    email: "bambang.sudiro@guru.smp.belajar.id",
    nip: "19790315 200801 1 014",
    schoolName: "SMP NEGERI 2 PURWANTORO",
    tier: "free",
    usedStorage: "1.1 MB / 50 MB",
    joinedAt: "15 Okt 2026",
    lastActive: "1 jam yang lalu",
  },
  {
    id: "user-4",
    name: "SMAN 1 Purwantoro (Tim Kurikulum)",
    email: "kurikulum.sman1purwantoro@sch.id",
    nip: "-",
    schoolName: "SMA NEGERI 1 PURWANTORO",
    tier: "school",
    usedStorage: "14.5 MB / 25 GB",
    joinedAt: "10 Okt 2026",
    lastActive: "3 jam yang lalu",
  },
  {
    id: "user-5",
    name: "Nurul Hidayati, S.Pd.SD",
    email: "nurul.hidayati@guru.sd.belajar.id",
    nip: "19920510 201903 2 018",
    schoolName: "SDN 1 KISMANTORO",
    tier: "free",
    usedStorage: "450 KB / 50 MB",
    joinedAt: "16 Okt 2026",
    lastActive: "Kemarin",
  },
];

const getStoragePercent = (storageStr: string) => {
  try {
    const [used, total] = storageStr.split(" / ");
    if (!used || !total) return "10%";
    const parseVal = (s: string) => {
      const num = parseFloat(s);
      if (s.includes("GB")) return num * 1024;
      if (s.includes("MB")) return num;
      if (s.includes("KB")) return num / 1024;
      return num;
    };
    const u = parseVal(used);
    const t = parseVal(total);
    if (!t || t === 0) return "10%";
    const pct = Math.min(100, Math.max(5, Math.round((u / t) * 100)));
    return `${pct}%`;
  } catch {
    return "10%";
  }
};

export default function AdminUsersPage() {
  const { toast } = useNotification();
  const [users, setUsers] = useState<AdminUserItem[]>(SEED_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");

  const filteredUsers = users.filter((u) => {
    const matchesTier = tierFilter === "all" || u.tier === tierFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const handleChangeTier = (userId: string, newTier: SubscriptionTier) => {
    setUserTier(newTier, userId);
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStorageLimit =
            newTier === "free" ? "50 MB" : newTier === "pro" ? "2 GB" : "25 GB";
          return {
            ...u,
            tier: newTier,
            usedStorage: `${u.usedStorage.split(" / ")[0]} / ${newStorageLimit}`,
          };
        }
        return u;
      })
    );
    toast.success(
      `Paket langganan pengguna berhasil diubah menjadi ${newTier.toUpperCase()}.`,
      "Paket Diperbarui"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
          <Users className="w-6 h-6 text-slate-300" />
          <span>Manajemen Akun Pendidik</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Kontrol hak akses paket langganan guru, pemantauan kapasitas penyimpanan arsip, dan status keaktifan akun.
        </p>
      </div>

      {/* Kontrol Pencarian & Filter */}
      <Card className="bg-slate-900 border border-slate-800 rounded-xl text-slate-100 shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama guru, email, atau sekolah..."
              className="pl-9 text-xs h-9 bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "Semua Paket" },
              { id: "free", label: "Guru Mandiri (Gratis)" },
              { id: "pro", label: "Guru Profesional" },
              { id: "school", label: "Sekolah & MGMP" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTierFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  tierFilter === tab.id
                    ? "bg-slate-100 text-slate-950 font-semibold"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabel Pengguna */}
      <Card className="bg-slate-900 border border-slate-800 rounded-xl text-slate-100 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-950/40">
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Pendidik</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Satuan Pendidikan</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Paket Langganan</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Penyimpanan Arsip</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Keaktifan</th>
                  <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Kontrol Manual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-100">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-semibold">{u.schoolName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">NIP: {u.nip}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {u.tier === "school" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                          Sekolah & MGMP
                        </span>
                      )}
                      {u.tier === "pro" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-100 border border-slate-700 whitespace-nowrap">
                          Guru Profesional
                        </span>
                      )}
                      {u.tier === "free" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900 text-slate-400 border border-slate-800 whitespace-nowrap">
                          Gratis (Mandiri)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-mono text-xs font-medium whitespace-nowrap">
                        {u.usedStorage}
                      </div>
                      <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="h-full bg-slate-300 rounded-full transition-all duration-300"
                          style={{ width: getStoragePercent(u.usedStorage) }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs whitespace-nowrap">
                      <div className="text-slate-300">{u.lastActive}</div>
                      <div className="text-[10px] text-slate-500">Bergabung: {u.joinedAt}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                        {u.tier !== "pro" && (
                          <button
                            type="button"
                            onClick={() => handleChangeTier(u.id, "pro")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
                          >
                            Jadikan Pro
                          </button>
                        )}
                        {u.tier !== "school" && (
                          <button
                            type="button"
                            onClick={() => handleChangeTier(u.id, "school")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
                          >
                            Jadikan Sekolah
                          </button>
                        )}
                        {u.tier !== "free" && (
                          <button
                            type="button"
                            onClick={() => handleChangeTier(u.id, "free")}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors shrink-0 cursor-pointer"
                            title="Kembalikan ke Paket Gratis"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

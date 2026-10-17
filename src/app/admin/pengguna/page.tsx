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
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Users className="w-6 h-6 text-indigo-400" />
          <span>Manajemen Akun Pendidik</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Kontrol hak akses paket langganan guru, pemantauan kapasitas penyimpanan arsip, dan status keaktifan akun.
        </p>
      </div>

      {/* Kontrol Pencarian & Filter */}
      <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama guru, email, atau sekolah..."
              className="pl-9 text-xs h-9 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  tierFilter === tab.id
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabel Pengguna */}
      <Card className="bg-slate-950 border-slate-800 text-white shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase bg-slate-900/40">
                  <th className="py-3 px-4">Pendidik</th>
                  <th className="py-3 px-4">Satuan Pendidikan</th>
                  <th className="py-3 px-4">Paket Langganan</th>
                  <th className="py-3 px-4">Penyimpanan Arsip</th>
                  <th className="py-3 px-4">Keaktifan</th>
                  <th className="py-3 px-4 text-right">Kontrol Manual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-semibold">{u.schoolName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">NIP: {u.nip}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.tier === "school" && (
                        <Badge className="bg-purple-950 text-purple-300 border-purple-800 font-semibold text-[10px]">
                          Sekolah & MGMP
                        </Badge>
                      )}
                      {u.tier === "pro" && (
                        <Badge className="bg-indigo-950 text-indigo-300 border-indigo-800 font-semibold text-[10px]">
                          Guru Profesional
                        </Badge>
                      )}
                      {u.tier === "free" && (
                        <Badge variant="outline" className="bg-slate-900 text-slate-400 border-slate-700 text-[10px]">
                          Gratis (Mandiri)
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">
                      {u.usedStorage}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      <div>{u.lastActive}</div>
                      <div className="text-[10px] text-slate-500">Bergabung: {u.joinedAt}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {u.tier !== "pro" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChangeTier(u.id, "pro")}
                          className="border-indigo-700/60 text-indigo-300 hover:bg-indigo-950 text-[11px] h-7 px-2.5 rounded-lg cursor-pointer"
                        >
                          Jadikan Pro
                        </Button>
                      )}
                      {u.tier !== "school" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChangeTier(u.id, "school")}
                          className="border-purple-700/60 text-purple-300 hover:bg-purple-950 text-[11px] h-7 px-2.5 rounded-lg cursor-pointer"
                        >
                          Jadikan Sekolah
                        </Button>
                      )}
                      {u.tier !== "free" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChangeTier(u.id, "free")}
                          className="border-slate-700 text-slate-400 hover:bg-slate-800 text-[11px] h-7 px-2 rounded-lg cursor-pointer"
                          title="Kembalikan ke Paket Gratis"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      )}
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

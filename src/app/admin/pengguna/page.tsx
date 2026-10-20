"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  RefreshCw,
  RotateCcw,
  Loader2,
  Cloud,
  CloudOff,
  ShieldCheck,
  Building2,
  HardDrive,
  Mail,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubscriptionTier } from "@/types";
import { setUserTier } from "@/lib/document-vault";
import { useNotification } from "@/components/providers/NotificationProvider";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

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
  provider?: string;
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
    provider: "google",
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
    provider: "google",
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
    provider: "email",
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
    provider: "email",
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
    provider: "google",
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
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isCloudData, setIsCloudData] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Helper untuk mendapatkan token otentikasi admin
  const getAuthHeaders = async (): Promise<HeadersInit> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      } else {
        const localToken = typeof window !== "undefined" ? localStorage.getItem("guru_auth_token") : null;
        if (localToken) {
          headers["Authorization"] = `Bearer ${localToken}`;
        }
      }
    } catch {
      // fallback
    }
    return headers;
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/users", {
        method: "GET",
        headers,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
          setIsCloudData(true);
          try {
            localStorage.setItem("modulku_admin_users", JSON.stringify(data.users));
          } catch {
            // ignore
          }
          return;
        }
      }
      throw new Error("Gagal mengambil data dari endpoint server");
    } catch {
      // Fallback ke penyimpanan lokal jika server offline
      try {
        const raw = localStorage.getItem("modulku_admin_users");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setUsers(parsed);
            setIsCloudData(false);
            return;
          }
        }
      } catch {
        // ignore
      }
      setUsers(SEED_USERS);
      setIsCloudData(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((u) => {
    const matchesTier = tierFilter === "all" || u.tier === tierFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.schoolName.toLowerCase().includes(query) ||
      (u.provider && u.provider.toLowerCase().includes(query));
    return matchesTier && matchesSearch;
  });

  const handleChangeTier = async (userId: string, newTier: SubscriptionTier) => {
    setUpdatingUserId(userId);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ userId, tier: newTier }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const newStorageLimit =
            newTier === "free" ? "50 MB" : newTier === "pro" ? "2 GB" : "25 GB";

          setUsers((prev) =>
            prev.map((u) => {
              if (u.id === userId) {
                return {
                  ...u,
                  tier: newTier,
                  usedStorage: `${u.usedStorage.split(" / ")[0]} / ${newStorageLimit}`,
                };
              }
              return u;
            })
          );

          setUserTier(newTier, userId);
          toast.success(
            `Paket langganan pengguna berhasil diubah menjadi ${newTier.toUpperCase()} di Supabase Cloud.`,
            "Paket Diperbarui"
          );
          return;
        }
      }

      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Gagal memperbarui paket pengguna");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
      toast.error(msg, "Pembaruan Gagal");

      // Perbarui lokal sebagai fallback darurat
      setUserTier(newTier, userId);
      const newStorageLimit =
        newTier === "free" ? "50 MB" : newTier === "pro" ? "2 GB" : "25 GB";
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              tier: newTier,
              usedStorage: `${u.usedStorage.split(" / ")[0]} / ${newStorageLimit}`,
            };
          }
          return u;
        })
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman & Kontrol Sinkronisasi Cloud */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-slate-700" />
            <span>Manajemen Akun Pendidik</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kontrol terpusat hak akses paket langganan guru, pemantauan kapasitas arsip, dan akun terdaftar di Supabase Auth.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isCloudData ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase Cloud Auth Live ({users.length} Akun)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              <CloudOff className="w-3.5 h-3.5 text-amber-600" />
              <span>Mode Cache ({users.length} Akun)</span>
            </span>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={isLoading}
            className="h-8 text-xs font-semibold border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isLoading && "animate-spin")} />
            <span>Segarkan</span>
          </Button>
        </div>
      </div>

      {/* Kontrol Pencarian & Filter Paket */}
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama guru, email, atau sekolah..."
              className="pl-9 text-xs h-9 bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
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
                className={`px-3.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all cursor-pointer ${
                  tierFilter === tab.id
                    ? "bg-slate-900 text-white font-bold shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 font-semibold"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabel Pengguna */}
      <Card className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                  <th className="py-3 px-4 font-bold whitespace-nowrap">Pendidik & Akun</th>
                  <th className="py-3 px-4 font-bold whitespace-nowrap">Satuan Pendidikan</th>
                  <th className="py-3 px-4 font-bold whitespace-nowrap">Paket Langganan</th>
                  <th className="py-3 px-4 font-bold whitespace-nowrap">Penyimpanan Arsip</th>
                  <th className="py-3 px-4 font-bold whitespace-nowrap">Keaktifan</th>
                  <th className="py-3 px-4 text-right font-bold whitespace-nowrap">Kontrol Akses Cloud</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {isLoading && users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                        <span className="text-xs font-semibold">Mengambil daftar pengguna dari Supabase Cloud Auth...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <div className="text-sm font-bold text-slate-700">Tidak ada data pengguna yang cocok</div>
                      <div className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter paket.</div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isUpdating = updatingUserId === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{u.name}</span>
                            {u.provider && (
                              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {u.provider}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">{u.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-semibold">{u.schoolName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">NIP: {u.nip}</div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {u.tier === "school" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#065F46] border border-emerald-200 whitespace-nowrap">
                              Sekolah & MGMP
                            </span>
                          )}
                          {u.tier === "pro" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white whitespace-nowrap">
                              Guru Profesional
                            </span>
                          )}
                          {u.tier === "free" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                              Gratis (Mandiri)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-mono text-xs font-semibold whitespace-nowrap">
                            {u.usedStorage}
                          </div>
                          <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                            <div
                              className="h-full bg-slate-900 rounded-full transition-all duration-300"
                              style={{ width: getStoragePercent(u.usedStorage) }}
                            />
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                          <div className="text-slate-800 font-semibold">{u.lastActive}</div>
                          <div className="text-[10px] text-slate-400">Bergabung: {u.joinedAt}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                            {isUpdating ? (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Menyimpan...</span>
                              </div>
                            ) : (
                              <>
                                {u.tier !== "pro" && (
                                  <button
                                    type="button"
                                    onClick={() => handleChangeTier(u.id, "pro")}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
                                  >
                                    Jadikan Pro
                                  </button>
                                )}
                                {u.tier !== "school" && (
                                  <button
                                    type="button"
                                    onClick={() => handleChangeTier(u.id, "school")}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
                                  >
                                    Jadikan Sekolah
                                  </button>
                                )}
                                {u.tier !== "free" && (
                                  <button
                                    type="button"
                                    onClick={() => handleChangeTier(u.id, "free")}
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 transition-colors shrink-0 cursor-pointer"
                                    title="Kembalikan ke Paket Gratis"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

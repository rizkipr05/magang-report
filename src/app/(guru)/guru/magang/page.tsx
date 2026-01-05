"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type MagangItem = {
  id: string;
  status?: string | null;
  siswa?: {
    id?: string | null;
    name?: string | null;
    nis?: string | null;
    kelas?: string | null;
  };
  dudi?: {
    name?: string | null;
  };
};

type LogbookItem = {
  siswa_id?: string | null;
  status?: string | null;
};

export default function GuruMagangPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [magangList, setMagangList] = useState<MagangItem[]>([]);
  const [logbooks, setLogbooks] = useState<LogbookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = await getAuthHeaders();

        const [magangRes, logbookRes] = await Promise.all([
          fetch("/api/magang", { headers }),
          fetch("/api/logbook", { headers }),
        ]);

        if (!magangRes.ok) {
          const payload = await magangRes.json().catch(() => null);
          throw new Error(payload?.message || "Gagal memuat data magang");
        }

        const magangPayload = await magangRes.json();
        const magangItems = Array.isArray(magangPayload?.data) ? magangPayload.data : [];

        const logbookItems = logbookRes.ok
          ? ((await logbookRes.json())?.data as LogbookItem[]) ?? []
          : [];

        if (!active) return;
        setMagangList(magangItems);
        setLogbooks(logbookItems);
      } catch (err: any) {
        if (!active) return;
        setError(err.message || "Gagal memuat data");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  const aggregated = useMemo(() => {
    const map = new Map<string, { total: number; pending: number }>();
    logbooks.forEach((item) => {
      if (!item.siswa_id) return;
      const entry = map.get(item.siswa_id) ?? { total: 0, pending: 0 };
      entry.total += 1;
      if ((item.status || "").toLowerCase() === "submitted") {
        entry.pending += 1;
      }
      map.set(item.siswa_id, entry);
    });
    return map;
  }, [logbooks]);

  const filteredSiswa = magangList.filter((magang) => {
    const nama = magang.siswa?.name || "";
    const nis = magang.siswa?.nis || "";
    const dudi = magang.dudi?.name || "";
    const status = (magang.status || "").toLowerCase();

    const matchesSearch =
      nama.toLowerCase().includes(search.toLowerCase()) ||
      nis.toLowerCase().includes(search.toLowerCase()) ||
      dudi.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || status === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Siswa Magang</h1>
        <p className="text-gray-500">Kelola dan pantau aktivitas siswa bimbingan magang.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama siswa, NIS, atau DUDI..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Belum Mulai">Belum Mulai</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Students Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-48 animate-pulse"></div>
          ))}
        </div>
      ) : filteredSiswa.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSiswa.map((magang) => {
            const siswaId = magang.siswa?.id || "";
            const stats = siswaId ? aggregated.get(siswaId) : undefined;
            const logbookCount = stats?.total ?? 0;
            const pendingReview = stats?.pending ?? 0;
            const statusRaw = magang.status || "Belum Mulai";
            const statusLabel = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);

            return (
              <div key={magang.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Student Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {(magang.siswa?.name || "S").charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{magang.siswa?.name || "-"}</h3>
                        <p className="text-sm text-gray-500">{magang.siswa?.nis || "-"}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabel === "Aktif"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                      }`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Student Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253" /></svg>
                      <span className="text-gray-600">Kelas: {magang.siswa?.kelas || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      <span className="text-gray-600">{magang.dudi?.name || "-"}</span>
                    </div>
                  </div>

                  {/* Logbook Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-600">{logbookCount}</p>
                      <p className="text-xs text-gray-600">Total Logbook</p>
                    </div>
                    <div className={`rounded-lg p-3 text-center ${pendingReview > 0 ? "bg-yellow-50" : "bg-green-50"
                      }`}>
                      <p className={`text-2xl font-bold ${pendingReview > 0 ? "text-yellow-600" : "text-green-600"
                        }`}>
                        {pendingReview}
                      </p>
                      <p className="text-xs text-gray-600">Perlu Review</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
                  <button className="py-2 px-3 text-sm font-medium text-emerald-600 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
                    Lihat Detail
                  </button>
                  <button className="py-2 px-3 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                    Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex content-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400 mt-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Tidak ditemukan</h3>
          <p className="text-gray-500">Coba kata kunci lain untuk mencari siswa.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type MagangDetail = {
  id: string;
  status?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  siswa?: { name?: string | null; nis?: string | null; kelas?: string | null; email?: string | null };
  dudi?: { name?: string | null; bidang?: string | null; address?: string | null };
};

type LogbookItem = {
  id: string;
  date?: string | null;
  activity?: string | null;
  status?: string | null;
  guru_note?: string | null;
};

export default function GuruMagangDetailPage() {
  const params = useParams<{ id: string }>();
  const magangId = params?.id;
  const router = useRouter();
  const [detail, setDetail] = useState<MagangDetail | null>(null);
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
    const fetchDetail = async () => {
      try {
        if (!magangId) return;
        setLoading(true);
        setError(null);
        const headers = await getAuthHeaders();

        const [detailRes, logbookRes] = await Promise.all([
          fetch(`/api/magang/${magangId}`, { headers }),
          fetch(`/api/logbook?magangId=${magangId}`, { headers }),
        ]);

        if (!detailRes.ok) {
          const payload = await detailRes.json().catch(() => null);
          throw new Error(payload?.message || "Gagal memuat detail magang");
        }

        const detailPayload = await detailRes.json();
        const logbookPayload = logbookRes.ok ? await logbookRes.json() : { data: [] };

        if (!active) return;
        setDetail(detailPayload?.data ?? null);
        setLogbooks(Array.isArray(logbookPayload?.data) ? logbookPayload.data : []);
      } catch (err: any) {
        if (!active) return;
        setError(err.message || "Gagal memuat detail magang");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      active = false;
    };
  }, [magangId]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail Magang</h1>
          <p className="text-gray-500">Informasi siswa dan logbook terkait.</p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          Kembali
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-40 animate-pulse"></div>
      ) : detail ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-1">Siswa</h3>
              <p className="text-gray-900 font-medium">{detail.siswa?.name || "-"}</p>
              <p className="text-sm text-gray-500">{detail.siswa?.nis || "-"}</p>
              <p className="text-sm text-gray-500">{detail.siswa?.kelas || "-"}</p>
              <p className="text-sm text-gray-500">{detail.siswa?.email || "-"}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-1">DUDI</h3>
              <p className="text-gray-900 font-medium">{detail.dudi?.name || "-"}</p>
              <p className="text-sm text-gray-500">{detail.dudi?.bidang || "-"}</p>
              <p className="text-sm text-gray-500">{detail.dudi?.address || "-"}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Status</span>
              <p className="text-gray-900 font-medium">{detail.status || "-"}</p>
            </div>
            <div>
              <span className="text-gray-500">Mulai</span>
              <p className="text-gray-900 font-medium">{detail.start_date || "-"}</p>
            </div>
            <div>
              <span className="text-gray-500">Selesai</span>
              <p className="text-gray-900 font-medium">{detail.end_date || "-"}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Logbook Siswa</h2>
          <Link
            href="/guru/logbook"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Buka Logbook
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Kegiatan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logbooks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Belum ada logbook untuk siswa ini.
                  </td>
                </tr>
              ) : (
                logbooks.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{log.date || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{log.activity || "-"}</td>
                    <td className="px-6 py-4">{log.status || "-"}</td>
                    <td className="px-6 py-4 text-gray-500">{log.guru_note || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

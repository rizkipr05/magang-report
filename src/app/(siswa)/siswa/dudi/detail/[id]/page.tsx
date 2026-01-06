"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type DudiDetail = {
  id: string;
  name?: string | null;
  bidang?: string | null;
  address?: string | null;
  contact_name?: string | null;
  contact_phone?: string | null;
  description?: string | null;
  photo_url?: string | null;
};

export default function DudiDetailPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const rawId = params?.id;
  const pathId = pathname ? pathname.split("/").pop() : undefined;
  const resolvedId = Array.isArray(rawId) ? rawId[0] : rawId || pathId;
  const dudiId = resolvedId === "detail" ? undefined : resolvedId;
  const isValidUuid = typeof dudiId === "string" && /^[0-9a-fA-F-]{36}$/.test(dudiId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<DudiDetail | null>(null);

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (!isValidUuid) {
      setError("ID DUDI tidak valid.");
      setLoading(false);
      return;
    }
    let active = true;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = await getAuthHeaders();
        const res = await fetch(`/api/dudi/${dudiId}`, { headers });
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.message || "Gagal memuat detail DUDI");
        }
        const payload = await res.json();
        if (!active) return;
        setDetail(payload?.data ?? null);
      } catch (err: any) {
        if (!active) return;
        setError(err.message || "Gagal memuat detail DUDI");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchDetail();
    return () => {
      active = false;
    };
  }, [dudiId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail DUDI</h1>
          <p className="text-gray-500">Memuat data...</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-64 animate-pulse"></div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail DUDI</h1>
          <p className="text-gray-500">Data tidak tersedia.</p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{detail.name || "DUDI"}</h1>
          <p className="text-gray-500">Detail tempat magang.</p>
        </div>
        <Link
          href={`/siswa/dudi/daftar/${detail.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          Daftar
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {detail.photo_url && (
          <div className="w-full h-56 bg-gray-100">
            <img
              src={detail.photo_url}
              alt={`Foto ${detail.name || "DUDI"}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6 space-y-4">
          {detail.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-1">Deskripsi</h3>
              <p className="text-gray-700">{detail.description}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="text-xs text-gray-500 mb-1">Bidang Usaha</p>
              <p className="font-medium">{detail.bidang || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Alamat</p>
              <p className="font-medium">{detail.address || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">PIC</p>
              <p className="font-medium">{detail.contact_name || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">No. HP PIC</p>
              <p className="font-medium">{detail.contact_phone || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

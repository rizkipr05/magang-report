"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type DudiItem = {
  id: string;
  name: string;
  field?: string | null;
  location?: string | null;
  pic?: string | null;
  contactPhone?: string | null;
  description?: string | null;
  photoUrl?: string | null;
};

export default function GuruDudiPage() {
  const [search, setSearch] = useState("");
  const [dudis, setDudis] = useState<DudiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data DUDI ini?")) return;
    try {
      setError(null);
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/dudi/${id}`, { method: "DELETE", headers });
      if (!res.ok) {
        const payloadErr = await res.json().catch(() => null);
        throw new Error(payloadErr?.message || "Gagal menghapus data DUDI");
      }
      alert("DUDI berhasil dihapus.");
      setDudis((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message || "Gagal menghapus data DUDI");
    }
  };

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = await getAuthHeaders();

        const dudiUrl = new URL("/api/dudi", window.location.origin);
        if (search) dudiUrl.searchParams.set("search", search);

        const dudiRes = await fetch(dudiUrl.toString(), { headers });

        if (!dudiRes.ok) {
          const payload = await dudiRes.json().catch(() => null);
          throw new Error(payload?.message || "Gagal memuat data DUDI");
        }

        const dudiPayload = await dudiRes.json();
        const dudiItems = Array.isArray(dudiPayload?.data) ? dudiPayload.data : [];

        if (!active) return;

        setDudis(
          dudiItems.map((item: any) => ({
            id: item.id,
            name: item.name,
            field: item.bidang ?? item.field ?? null,
            location: item.address ?? item.location ?? null,
            pic: item.contact_name ?? item.pic ?? null,
            contactPhone: item.contact_phone ?? null,
            description: item.description ?? null,
            photoUrl: item.photo_url ?? null,
          }))
        );
      } catch (err: any) {
        if (!active) return;
        setError(err.message || "Gagal memuat data DUDI");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [search]);

  const filteredDudis = dudis.filter((dudi) =>
    dudi.name.toLowerCase().includes(search.toLowerCase()) ||
    (dudi.field || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DUDI</h1>
          <p className="text-gray-500">Daftar tempat magang yang tersedia.</p>
        </div>
        <Link
          href="/guru/dudi/edit"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
        >
          + Tambah DUDI
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama DUDI atau bidang usaha..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-40 animate-pulse"></div>
          ))}
        </div>
      ) : filteredDudis.length > 0 ? (
        <div className="space-y-4">
          {filteredDudis.map((dudi) => (
            <div key={dudi.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    {dudi.photoUrl ? (
                      <img
                        src={dudi.photoUrl}
                        alt={`Foto ${dudi.name}`}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-bold text-gray-900">{dudi.name}</h3>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/guru/dudi/edit/${dudi.id}`}
                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(dudi.id)}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-emerald-600 font-medium mb-2">{dudi.field || "-"}</p>

                      {dudi.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dudi.description}</p>
                      )}

                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span>{dudi.location || "-"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          <span>PIC: {dudi.pic || "-"}</span>
                        </div>
                        {dudi.contactPhone && (
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.27 1.06l-2.2 2.2a11.04 11.04 0 005.18 5.18l2.2-2.2a1 1 0 011.06-.27l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.82 21 3 14.18 3 5V5z" /></svg>
                            <span>{dudi.contactPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex content-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg className="w-8 h-8 text-gray-400 mt-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Tidak ditemukan</h3>
          <p className="text-gray-500">Coba kata kunci lain untuk mencari DUDI.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type DudiItem = {
  id: string;
  name: string;
  field?: string | null;
  location?: string | null;
  pic?: string | null;
  quotaTotal?: number | null;
  quotaFilled?: number | null;
  siswaAktif: string[];
};

type MagangItem = {
  id: string;
  status?: string | null;
  dudi_id?: string | null;
  siswa_id?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  siswa?: { name?: string | null; nis?: string | null };
};

export default function GuruDudiPage() {
  const [search, setSearch] = useState("");
  const [dudis, setDudis] = useState<DudiItem[]>([]);
  const [magang, setMagang] = useState<MagangItem[]>([]);
  const [siswaList, setSiswaList] = useState<{ id: string; name: string; nis?: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingMagangId, setEditingMagangId] = useState<string | null>(null);
  const [form, setForm] = useState({
    dudi_id: "",
    siswa_id: "",
    start_date: "",
    end_date: "",
    status: "aktif",
  });

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const isActiveStatus = (status?: string | null) => {
    const normalized = (status || "").toLowerCase();
    if (!normalized) return true;
    return ["aktif", "active", "ongoing", "berjalan"].includes(normalized);
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

        const [dudiRes, magangRes, siswaRes] = await Promise.all([
          fetch(dudiUrl.toString(), { headers }),
          fetch("/api/magang", { headers }),
          fetch("/api/users?role=siswa", { headers }),
        ]);

        if (!dudiRes.ok) {
          const payload = await dudiRes.json().catch(() => null);
          throw new Error(payload?.message || "Gagal memuat data DUDI");
        }

        const dudiPayload = await dudiRes.json();
        const dudiItems = Array.isArray(dudiPayload?.data) ? dudiPayload.data : [];

        const magangItems = magangRes.ok
          ? ((await magangRes.json())?.data as MagangItem[]) ?? []
          : [];
        const siswaItems = siswaRes.ok
          ? ((await siswaRes.json())?.data as { id: string; name: string; nis?: string | null }[]) ?? []
          : [];

        if (!active) return;

        setMagang(magangItems);
        setSiswaList(siswaItems);
        setDudis(
          dudiItems.map((item: any) => ({
            id: item.id,
            name: item.name,
            field: item.bidang ?? item.field ?? null,
            location: item.address ?? item.location ?? null,
            pic: item.contact_name ?? item.pic ?? null,
            quotaTotal: item.quota_total ?? 10,
            quotaFilled: item.quota_filled ?? 0,
            siswaAktif: [],
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

  const resetForm = () => {
    setForm({
      dudi_id: "",
      siswa_id: "",
      start_date: "",
      end_date: "",
      status: "aktif",
    });
    setEditingMagangId(null);
  };

  const openCreate = (dudiId: string) => {
    resetForm();
    setForm((prev) => ({ ...prev, dudi_id: dudiId }));
    setFormOpen(true);
  };

  const openEdit = (entry: MagangItem) => {
    setEditingMagangId(entry.id);
    setForm({
      dudi_id: entry.dudi_id || "",
      siswa_id: entry.siswa_id || "",
      start_date: entry.start_date || "",
      end_date: entry.end_date || "",
      status: entry.status || "aktif",
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.dudi_id || !form.siswa_id || !form.start_date || !form.end_date) {
      setError("DUDI, siswa, tanggal mulai, dan tanggal selesai wajib diisi.");
      return;
    }
    try {
      setError(null);
      const headers = {
        ...(await getAuthHeaders()),
        "Content-Type": "application/json",
      };
      const payload = {
        dudi_id: form.dudi_id,
        siswa_id: form.siswa_id,
        start_date: form.start_date,
        end_date: form.end_date,
        status: form.status,
      };
      const res = await fetch(
        editingMagangId ? `/api/magang/${editingMagangId}` : "/api/magang",
        {
          method: editingMagangId ? "PUT" : "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const payloadErr = await res.json().catch(() => null);
        throw new Error(payloadErr?.message || "Gagal menyimpan data magang");
      }
      setFormOpen(false);
      resetForm();
      const refreshed = await fetch("/api/magang", { headers: await getAuthHeaders() });
      const refreshedData = refreshed.ok ? await refreshed.json() : null;
      setMagang(Array.isArray(refreshedData?.data) ? refreshedData.data : []);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data magang");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus data magang ini?")) return;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/magang/${id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Gagal menghapus data magang");
      setMagang((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message || "Gagal menghapus data magang");
    }
  };

  const enrichedDudis = useMemo(() => {
    const map = new Map<string, { siswa: Set<string>; filled: number }>();

    magang.forEach((item) => {
      if (!item?.dudi_id) return;
      if (!isActiveStatus(item.status)) return;
      const entry = map.get(item.dudi_id) ?? { siswa: new Set<string>(), filled: 0 };
      if (item.siswa?.name) entry.siswa.add(item.siswa.name);
      entry.filled += 1;
      map.set(item.dudi_id, entry);
    });

    return dudis.map((dudi) => {
      const entry = map.get(dudi.id);
      return {
        ...dudi,
        siswaAktif: entry ? Array.from(entry.siswa) : [],
        quotaFilled: entry ? entry.filled : dudi.quotaFilled ?? 0,
      };
    });
  }, [dudis, magang]);

  const filteredDudis = enrichedDudis.filter((dudi) =>
    dudi.name.toLowerCase().includes(search.toLowerCase()) ||
    (dudi.field || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kelola DUDI</h1>
        <p className="text-gray-500">Kelola data tempat magang dan penempatan siswa.</p>
      </div>

      {/* Search */}
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

      {formOpen && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">
              {editingMagangId ? "Edit Data Magang" : "Tambah Data Magang"}
            </h3>
            <button
              onClick={() => {
                setFormOpen(false);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Tutup
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DUDI</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.dudi_id}
                onChange={(e) => setForm((prev) => ({ ...prev, dudi_id: e.target.value }))}
              >
                <option value="">Pilih DUDI</option>
                {dudis.map((dudi) => (
                  <option key={dudi.id} value={dudi.id}>
                    {dudi.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Siswa</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.siswa_id}
                onChange={(e) => setForm((prev) => ({ ...prev, siswa_id: e.target.value }))}
                disabled={!!editingMagangId}
              >
                <option value="">Pilih Siswa</option>
                {siswaList.map((siswa) => (
                  <option key={siswa.id} value={siswa.id}>
                    {siswa.name} {siswa.nis ? `(${siswa.nis})` : ""}
                  </option>
                ))}
              </select>
              {editingMagangId && (
                <p className="text-xs text-gray-400 mt-1">Siswa tidak dapat diubah.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.start_date}
                onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.end_date}
                onChange={(e) => setForm((prev) => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="aktif">Aktif</option>
                <option value="belum mulai">Belum Mulai</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setFormOpen(false);
                resetForm();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* DUDI List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-40 animate-pulse"></div>
          ))}
        </div>
      ) : filteredDudis.length > 0 ? (
        <div className="space-y-4">
          {filteredDudis.map((dudi) => {
            const quotaTotal = dudi.quotaTotal ?? 10;
            const quotaFilled = dudi.quotaFilled ?? 0;
            const percentage = quotaTotal > 0 ? (quotaFilled / quotaTotal) * 100 : 0;
            const slotsLeft = quotaTotal - quotaFilled;
            const magangList = magang.filter((item) => item.dudi_id === dudi.id);

            return (
              <div key={dudi.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Company Info */}
                    <div className="flex gap-4 flex-1">
                      <div className="w-16 h-16 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{dudi.name}</h3>
                        <p className="text-sm text-emerald-600 font-medium mb-2">{dudi.field || "-"}</p>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span>{dudi.location || "-"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            <span>PIC: {dudi.pic || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quota Info */}
                    <div className="md:w-64">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-gray-500">Kuota Terisi</span>
                        <span className="text-gray-700">{quotaFilled}/{quotaTotal}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-400">{slotsLeft} slot tersisa</p>
                    </div>
                  </div>

                  {/* Students List */}
                  {dudi.siswaAktif.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Siswa Aktif ({dudi.siswaAktif.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {dudi.siswaAktif.map((siswa, idx) => (
                          <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {siswa}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex gap-3">
                  <button className="flex-1 py-2 px-3 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                    Lihat Detail
                  </button>
                  <button
                    onClick={() => openCreate(dudi.id)}
                    className="flex-1 py-2 px-3 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Tambah Magang
                  </button>
                </div>

                {/* Magang List */}
                <div className="px-6 pb-6">
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Penempatan Magang</p>
                    {magangList.length === 0 ? (
                      <p className="text-sm text-gray-500">Belum ada penempatan.</p>
                    ) : (
                      <div className="space-y-2">
                        {magangList.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                            <div>
                              <p className="font-medium text-gray-900">{item.siswa?.name || "Siswa"}</p>
                              <p className="text-xs text-gray-500">
                                {item.start_date || "-"} - {item.end_date || "-"} · {item.status || "-"}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEdit(item)}
                                className="text-emerald-600 hover:text-emerald-800 text-xs font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-700 text-xs font-medium"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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

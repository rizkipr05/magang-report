"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const APPLICATION_BUCKET = "magang-applications";

type DudiDetail = {
  id: string;
  name?: string | null;
  bidang?: string | null;
  address?: string | null;
};

export default function DudiDaftarPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const rawId = params?.id;
  const pathId = pathname ? pathname.split("/").pop() : undefined;
  const resolvedId = Array.isArray(rawId) ? rawId[0] : rawId || pathId;
  const dudiId = resolvedId === "daftar" ? undefined : resolvedId;
  const isValidUuid = typeof dudiId === "string" && /^[0-9a-fA-F-]{36}$/.test(dudiId);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<DudiDetail | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
  });

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const uploadFile = async (selected: File, label: string) => {
    if (selected.size > MAX_FILE_SIZE) {
      throw new Error(`Ukuran ${label} maksimal 5MB.`);
    }
    if (!selected.type.startsWith("image/") && selected.type !== "application/pdf") {
      throw new Error(`${label} harus berupa gambar atau PDF.`);
    }
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      throw new Error("Gagal membaca user login.");
    }
    const ext = selected.name.split(".").pop() || "pdf";
    const path = `${userData.user.id}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from(APPLICATION_BUCKET)
      .upload(path, selected, { cacheControl: "3600", upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(APPLICATION_BUCKET).getPublicUrl(path);
    return data.publicUrl;
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

  const handleSubmit = async () => {
    if (!form.start_date || !form.end_date) {
      setError("Tanggal mulai dan selesai wajib diisi.");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      let cv_url: string | null = null;
      let portfolio_url: string | null = null;
      if (cvFile) {
        cv_url = await uploadFile(cvFile, "CV");
      }
      if (portfolioFile) {
        portfolio_url = await uploadFile(portfolioFile, "Portofolio");
      }
      const headers = {
        ...(await getAuthHeaders()),
        "Content-Type": "application/json",
      };
      const payload = {
        dudi_id: dudiId,
        start_date: form.start_date,
        end_date: form.end_date,
        cv_url,
        portfolio_url,
      };
      const res = await fetch("/api/magang/apply", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const payloadErr = await res.json().catch(() => null);
        throw new Error(payloadErr?.message || "Gagal mengirim pendaftaran");
      }
      alert("Pendaftaran berhasil dikirim.");
      router.push("/siswa/logbook");
    } catch (err: any) {
      setError(err.message || "Gagal mengirim pendaftaran");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar DUDI</h1>
          <p className="text-gray-500">Memuat data...</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-40 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daftar DUDI</h1>
        <p className="text-gray-500">
          {detail?.name ? `Ajukan magang ke ${detail.name}.` : "Ajukan magang ke DUDI."}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload CV (PDF atau gambar, max 5MB)
            </label>
            <input
              type="file"
              accept="application/pdf,image/*"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              onChange={(e) => {
                const selected = e.target.files?.[0] ?? null;
                if (selected && selected.size > MAX_FILE_SIZE) {
                  setError("Ukuran CV maksimal 5MB.");
                  setCvFile(null);
                  return;
                }
                setError(null);
                setCvFile(selected);
              }}
            />
            {cvFile && <p className="text-xs text-gray-500 mt-1">{cvFile.name}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Portofolio (PDF atau gambar, max 5MB)
            </label>
            <input
              type="file"
              accept="application/pdf,image/*"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              onChange={(e) => {
                const selected = e.target.files?.[0] ?? null;
                if (selected && selected.size > MAX_FILE_SIZE) {
                  setError("Ukuran portofolio maksimal 5MB.");
                  setPortfolioFile(null);
                  return;
                }
                setError(null);
                setPortfolioFile(selected);
              }}
            />
            {portfolioFile && (
              <p className="text-xs text-gray-500 mt-1">{portfolioFile.name}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.push(`/siswa/dudi/detail/${dudiId}`)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            disabled={saving}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Mengirim..." : "Daftar"}
          </button>
        </div>
      </div>
    </div>
  );
}

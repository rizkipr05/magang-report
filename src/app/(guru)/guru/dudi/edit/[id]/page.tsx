"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const DUDI_BUCKET = "dudi-photos";

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

export default function DudiEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const dudiId = params?.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    bidang: "",
    address: "",
    contact_name: "",
    contact_phone: "",
    description: "",
  });

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const uploadPhoto = async (selected: File) => {
    if (selected.size > MAX_FILE_SIZE) {
      throw new Error("Ukuran gambar maksimal 2MB.");
    }
    if (!selected.type.startsWith("image/")) {
      throw new Error("File harus berupa gambar.");
    }
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      throw new Error("Gagal membaca user login.");
    }
    const ext = selected.name.split(".").pop() || "jpg";
    const path = `${userData.user.id}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from(DUDI_BUCKET)
      .upload(path, selected, { cacheControl: "3600", upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(DUDI_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  useEffect(() => {
    if (!dudiId) return;
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = await getAuthHeaders();
        const res = await fetch(`/api/dudi/${dudiId}`, { headers });
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          throw new Error(payload?.message || "Gagal memuat data DUDI");
        }
        const payload = await res.json();
        const data = payload?.data as DudiDetail | undefined;
        if (!active) return;
        setForm({
          name: data?.name ?? "",
          bidang: data?.bidang ?? "",
          address: data?.address ?? "",
          contact_name: data?.contact_name ?? "",
          contact_phone: data?.contact_phone ?? "",
          description: data?.description ?? "",
        });
        setPhotoUrl(data?.photo_url ?? null);
      } catch (err: any) {
        if (!active) return;
        setError(err.message || "Gagal memuat data DUDI");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [dudiId]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Nama DUDI wajib diisi.");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      let nextPhotoUrl = photoUrl;
      if (file) {
        nextPhotoUrl = await uploadPhoto(file);
      }
      const headers = {
        ...(await getAuthHeaders()),
        "Content-Type": "application/json",
      };
      const payload = {
        name: form.name,
        bidang: form.bidang || null,
        address: form.address || null,
        contact_name: form.contact_name || null,
        contact_phone: form.contact_phone || null,
        description: form.description || null,
        photo_url: nextPhotoUrl || null,
      };
      const res = await fetch(`/api/dudi/${dudiId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const payloadErr = await res.json().catch(() => null);
        throw new Error(payloadErr?.message || "Gagal menyimpan data DUDI");
      }
      router.push("/guru/dudi");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data DUDI");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit DUDI</h1>
          <p className="text-gray-500">Memuat data...</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-64 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit DUDI</h1>
        <p className="text-gray-500">Perbarui data tempat magang.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Form Edit DUDI</h3>
          <button
            onClick={() => router.push("/guru/dudi")}
            className="text-gray-500 hover:text-gray-700 text-sm"
            disabled={saving}
          >
            Batal
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama DUDI</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bidang Usaha</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.bidang}
              onChange={(e) => setForm((prev) => ({ ...prev, bidang: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama PIC</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.contact_name}
              onChange={(e) => setForm((prev) => ({ ...prev, contact_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. HP PIC</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={form.contact_phone}
              onChange={(e) => setForm((prev) => ({ ...prev, contact_phone: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Foto (max 2MB)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              onChange={(e) => {
                const selected = e.target.files?.[0] ?? null;
                if (selected && selected.size > MAX_FILE_SIZE) {
                  setError("Ukuran gambar maksimal 2MB.");
                  setFile(null);
                  return;
                }
                setError(null);
                setFile(selected);
              }}
            />
            {photoUrl && !file && (
              <div className="mt-2">
                <img
                  src={photoUrl}
                  alt="Foto DUDI"
                  className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                />
              </div>
            )}
            {file && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.push("/guru/dudi")}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            disabled={saving}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

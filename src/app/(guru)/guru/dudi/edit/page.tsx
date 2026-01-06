"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const DUDI_BUCKET = "dudi-photos";

export default function DudiCrudPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dudiForm, setDudiForm] = useState({
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

  const resetDudiForm = () => {
    setDudiForm({
      name: "",
      bidang: "",
      address: "",
      contact_name: "",
      contact_phone: "",
      description: "",
    });
    setFile(null);
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

  const handleDudiSave = async () => {
    if (!dudiForm.name.trim()) {
      setError("Nama DUDI wajib diisi.");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      let photo_url: string | null = null;
      if (file) {
        photo_url = await uploadPhoto(file);
      }
      const headers = {
        ...(await getAuthHeaders()),
        "Content-Type": "application/json",
      };
      const payload = {
        name: dudiForm.name,
        bidang: dudiForm.bidang || null,
        address: dudiForm.address || null,
        contact_name: dudiForm.contact_name || null,
        contact_phone: dudiForm.contact_phone || null,
        description: dudiForm.description || null,
        photo_url,
      };
      const res = await fetch("/api/dudi", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const payloadErr = await res.json().catch(() => null);
        throw new Error(payloadErr?.message || "Gagal menyimpan data DUDI");
      }
      resetDudiForm();
      router.push("/guru/dudi");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data DUDI");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kelola DUDI</h1>
        <p className="text-gray-500">Kelola data tempat magang dan penempatan siswa.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Tambah DUDI</h3>
          <button
            onClick={() => {
              resetDudiForm();
              router.push("/guru/dudi");
            }}
            className="text-gray-500 hover:text-gray-700 text-sm"
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
              value={dudiForm.name}
              onChange={(e) => setDudiForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bidang Usaha</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={dudiForm.bidang}
              onChange={(e) => setDudiForm((prev) => ({ ...prev, bidang: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={dudiForm.address}
              onChange={(e) => setDudiForm((prev) => ({ ...prev, address: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={dudiForm.description}
              onChange={(e) => setDudiForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama PIC</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={dudiForm.contact_name}
              onChange={(e) => setDudiForm((prev) => ({ ...prev, contact_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. HP PIC</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={dudiForm.contact_phone}
              onChange={(e) => setDudiForm((prev) => ({ ...prev, contact_phone: e.target.value }))}
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
            {file && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              resetDudiForm();
              router.push("/guru/dudi");
            }}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            disabled={saving}
          >
            Batal
          </button>
          <button
            onClick={handleDudiSave}
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

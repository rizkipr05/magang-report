"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const LOGBOOK_BUCKET = "logbook-attachments";

type LogbookItem = {
  id: string;
  date: string;
  activity: string;
  start_time: string | null;
  end_time: string | null;
  attachment_url: string | null;
};

export default function LogbookEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const logbookId = params?.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [removeAttachment, setRemoveAttachment] = useState(false);
  const [logbook, setLogbook] = useState<LogbookItem | null>(null);
  const [form, setForm] = useState({
    date: "",
    activity: "",
    start_time: "",
    end_time: "",
  });

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const uploadAttachment = async (selected: File) => {
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
      .from(LOGBOOK_BUCKET)
      .upload(path, selected, { cacheControl: "3600", upsert: false });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(LOGBOOK_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const fetchLogbook = async () => {
    if (!logbookId) return;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/logbook/${logbookId}`, { headers });
      if (!res.ok) throw new Error("Gagal memuat logbook");
      const payload = await res.json();
      const data = payload?.data as LogbookItem;
      setLogbook(data);
      setForm({
        date: data?.date ?? "",
        activity: data?.activity ?? "",
        start_time: data?.start_time ?? "",
        end_time: data?.end_time ?? "",
      });
    } catch (err: any) {
      setError(err.message || "Gagal memuat logbook");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!logbookId) return;
    if (!form.date || !form.activity.trim()) {
      setError("Tanggal dan kegiatan wajib diisi.");
      return;
    }
    try {
      setSaving(true);
      setError(null);
      let attachment_url = logbook?.attachment_url ?? null;
      if (removeAttachment) attachment_url = null;
      if (file) {
        attachment_url = await uploadAttachment(file);
      }
      const headers = {
        ...(await getAuthHeaders()),
        "Content-Type": "application/json",
      };
      const payload = {
        date: form.date,
        activity: form.activity.trim(),
        start_time: form.start_time || null,
        end_time: form.end_time || null,
        attachment_url,
      };
      const res = await fetch(`/api/logbook/${logbookId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errPayload = await res.json().catch(() => null);
        throw new Error(errPayload?.message || "Gagal menyimpan logbook");
      }
      router.push("/siswa/logbook");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan logbook");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchLogbook();
  }, [logbookId]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Edit Logbook</h1>
        <p className="text-blue-100 mt-2">Perbarui catatan kegiatan harianmu.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Gambar (max 2MB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selected = e.target.files?.[0] ?? null;
                if (selected && selected.size > MAX_FILE_SIZE) {
                  setError("Ukuran gambar maksimal 2MB.");
                  e.target.value = "";
                  setFile(null);
                  return;
                }
                setFile(selected);
                if (selected) setRemoveAttachment(false);
              }}
              className="w-full text-sm"
              disabled={loading || saving}
            />
            {file && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
            <input
              type="time"
              value={form.start_time}
              onChange={(e) => setForm((prev) => ({ ...prev, start_time: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
            <input
              type="time"
              value={form.end_time}
              onChange={(e) => setForm((prev) => ({ ...prev, end_time: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || saving}
            />
          </div>
        </div>
        {logbook?.attachment_url && !removeAttachment && (
          <div className="text-sm text-gray-600">
            Lampiran saat ini:{" "}
            <a
              href={logbook.attachment_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Lihat gambar
            </a>
            <button
              onClick={() => setRemoveAttachment(true)}
              className="ml-3 text-red-600 hover:text-red-700 text-xs"
              disabled={saving}
            >
              Hapus lampiran
            </button>
          </div>
        )}
        {removeAttachment && (
          <p className="text-xs text-red-600">Lampiran akan dihapus saat disimpan.</p>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kegiatan</label>
          <textarea
            value={form.activity}
            onChange={(e) => setForm((prev) => ({ ...prev, activity: e.target.value }))}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || saving}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => router.push("/siswa/logbook")}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            disabled={saving}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-70"
            disabled={loading || saving}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

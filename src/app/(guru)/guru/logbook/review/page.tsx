"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type LogbookItem = {
    id: string;
    date: string;
    activity: string;
    start_time: string | null;
    end_time: string | null;
    attachment_url: string | null;
    status: string;
    guru_note: string | null;
};

const statusLabels: Record<string, string> = {
    draft: "Draft",
    submitted: "Menunggu",
    reviewed: "Terverifikasi",
    rejected: "Perlu Perbaikan",
};

export default function GuruLogbookReviewPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const logbookId = searchParams.get("id") || "";

    const [logbook, setLogbook] = useState<LogbookItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [reviewStatus, setReviewStatus] = useState("reviewed");
    const [reviewNote, setReviewNote] = useState("");

    const getAuthHeaders = async (): Promise<Record<string, string>> => {
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchLogbook = async () => {
        if (!logbookId) return;
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            const headers = await getAuthHeaders();
            const res = await fetch(`/api/logbook?id=${logbookId}`, { headers });
            if (!res.ok) throw new Error("Gagal memuat detail logbook");
            const payload = await res.json();
            const items = Array.isArray(payload?.data) ? payload.data : [];
            const item = items[0] || null;
            setLogbook(item);
            setReviewStatus(item?.status === "rejected" ? "rejected" : "reviewed");
            setReviewNote(item?.guru_note || "");
        } catch (err: any) {
            setError(err.message || "Gagal memuat detail logbook");
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSave = async () => {
        if (!logbookId) return;
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            const headers = {
                ...(await getAuthHeaders()),
                "Content-Type": "application/json",
            };
            const res = await fetch(`/api/logbook/${logbookId}/review`, {
                method: "POST",
                headers,
                body: JSON.stringify({ status: reviewStatus, guru_note: reviewNote }),
            });
            const payload = await res.json().catch(() => null);
            if (!res.ok) {
                throw new Error(payload?.message || "Gagal menyimpan review");
            }
            setSuccess("Review berhasil disimpan.");
            await fetchLogbook();
        } catch (err: any) {
            setError(err.message || "Gagal menyimpan review");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchLogbook();
    }, [logbookId]);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Review Logbook</h1>
                    <p className="text-gray-500 mt-1">Verifikasi catatan harian siswa.</p>
                </div>
                <Link
                    href="/guru/logbook"
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Kembali
                </Link>
            </div>

            {!logbookId && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-4 py-3 text-sm">
                    ID logbook tidak ditemukan.
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-4 py-3 text-sm">
                    {success}
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
                {loading ? (
                    <div className="text-gray-500">Memuat detail logbook...</div>
                ) : logbook ? (
                    <>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <div className="text-sm text-gray-500">Tanggal</div>
                                <div className="text-lg font-semibold text-gray-900">{logbook.date}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {logbook.start_time || "--:--"} - {logbook.end_time || "--:--"}
                                </div>
                            </div>
                            <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    logbook.status === "reviewed"
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : logbook.status === "rejected"
                                            ? "bg-red-50 text-red-700 border-red-200"
                                            : logbook.status === "submitted"
                                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                : "bg-gray-100 text-gray-700 border-gray-200"
                                }`}
                            >
                                {statusLabels[logbook.status] ?? logbook.status}
                            </span>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Kegiatan</div>
                            <p className="text-gray-700 mt-1 whitespace-pre-wrap">{logbook.activity}</p>
                        </div>
                        {logbook.attachment_url && (
                            <div>
                                <a
                                    href={logbook.attachment_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Lihat lampiran
                                </a>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-gray-500">Data logbook tidak ditemukan.</div>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={reviewStatus}
                        onChange={(e) => setReviewStatus(e.target.value)}
                        disabled={!logbook}
                    >
                        <option value="reviewed">Terverifikasi</option>
                        <option value="rejected">Perlu Perbaikan</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Guru</label>
                    <textarea
                        rows={5}
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tulis catatan untuk siswa..."
                        disabled={!logbook}
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                        type="button"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleReviewSave}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-50"
                        disabled={!logbook || saving}
                    >
                        {saving ? "Menyimpan..." : "Simpan Review"}
                    </button>
                </div>
            </div>
        </div>
    );
}

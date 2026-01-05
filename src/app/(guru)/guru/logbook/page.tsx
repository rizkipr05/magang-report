"use client";

import { useEffect, useMemo, useState } from "react";
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
    siswa?: { id: string; name: string; email: string };
};

const statusLabels: Record<string, string> = {
    draft: "Draft",
    submitted: "Menunggu",
    reviewed: "Terverifikasi",
    rejected: "Perlu Perbaikan",
};

export default function GuruLogbookPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Semua");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [logbooks, setLogbooks] = useState<LogbookItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reviewingId, setReviewingId] = useState<string | null>(null);
    const [reviewStatus, setReviewStatus] = useState("reviewed");
    const [reviewNote, setReviewNote] = useState("");

    const stats = useMemo(() => {
        const total = logbooks.length;
        const submitted = logbooks.filter((l) => l.status === "submitted").length;
        const reviewed = logbooks.filter((l) => l.status === "reviewed").length;
        const rejected = logbooks.filter((l) => l.status === "rejected").length;
        return { total, submitted, reviewed, rejected };
    }, [logbooks]);

    const filteredLogbooks = useMemo(() => {
        return logbooks.filter((log) => {
            const matchesSearch =
                log.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.siswa?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.date.includes(searchTerm);
            const matchesStatus =
                statusFilter === "Semua" ||
                (statusFilter === "Menunggu" && log.status === "submitted") ||
                (statusFilter === "Terverifikasi" && log.status === "reviewed") ||
                (statusFilter === "Perbaikan" && log.status === "rejected") ||
                (statusFilter === "Draft" && log.status === "draft");
            return matchesSearch && matchesStatus;
        });
    }, [logbooks, searchTerm, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredLogbooks.length / itemsPerPage));
    const pagedLogbooks = filteredLogbooks.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const getAuthHeaders = async (): Promise<Record<string, string>> => {
        const { data } = await supabase.auth.getSession();
        const token = data?.session?.access_token;
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchLogbooks = async () => {
        try {
            setLoading(true);
            setError(null);
            const headers = await getAuthHeaders();
            const res = await fetch("/api/logbook", { headers });
            if (!res.ok) throw new Error("Gagal memuat logbook");
            const payload = await res.json();
            const items = Array.isArray(payload?.data) ? payload.data : [];
            setLogbooks(items);
        } catch (err: any) {
            setError(err.message || "Gagal memuat logbook");
        } finally {
            setLoading(false);
        }
    };

    const openReview = (log: LogbookItem) => {
        setReviewingId(log.id);
        setReviewStatus(log.status === "rejected" ? "rejected" : "reviewed");
        setReviewNote(log.guru_note || "");
    };

    const handleReviewSave = async () => {
        if (!reviewingId) return;
        try {
            const headers = {
                ...(await getAuthHeaders()),
                "Content-Type": "application/json",
            };
            const res = await fetch(`/api/logbook/${reviewingId}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ status: reviewStatus, guru_note: reviewNote }),
            });
            if (!res.ok) throw new Error("Gagal menyimpan review");
            setReviewingId(null);
            setReviewNote("");
            await fetchLogbooks();
        } catch (err: any) {
            setError(err.message || "Gagal menyimpan review");
        }
    };

    useEffect(() => {
        fetchLogbooks();
    }, []);

    useEffect(() => {
        const channel = supabase
            .channel("logbooks-guru")
            .on("postgres_changes", { event: "*", schema: "public", table: "logbooks" }, () => {
                fetchLogbooks();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, statusFilter, itemsPerPage]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Daftar Logbook Harian</h1>
                    <p className="text-gray-500 mt-1">Pantau dan verifikasi kegiatan harian siswa magang.</p>
                </div>
            <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">
                    Export Data
                </button>
            </div>
        </div>

        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
            </div>
        )}

        {reviewingId && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Review Logbook</h3>
                    <button
                        onClick={() => setReviewingId(null)}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                        Tutup
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={reviewStatus}
                        onChange={(e) => setReviewStatus(e.target.value)}
                    >
                        <option value="reviewed">Terverifikasi</option>
                        <option value="rejected">Perlu Perbaikan</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Guru</label>
                    <textarea
                        rows={4}
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setReviewingId(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleReviewSave}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
                    >
                        Simpan Review
                    </button>
                </div>
            </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium">Total Logbook</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                <p className="text-sm text-gray-500 mt-1">Keseluruhan catatan harian</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-yellow-600 text-sm font-medium">Menunggu Verifikasi</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.submitted}</p>
                <p className="text-sm text-gray-500 mt-1">Perlu tinjauan guru</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-green-600 text-sm font-medium">Telah Terverifikasi</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.reviewed}</p>
                <p className="text-sm text-gray-500 mt-1">Disetujui</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-red-600 text-sm font-medium">Perlu Perbaikan</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.rejected}</p>
                <p className="text-sm text-gray-500 mt-1">Dikembalikan ke siswa</p>
            </div>
        </div>

            {/* Filters & Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
                    <div className="w-full sm:max-w-md relative">
                        <input
                            type="text"
                            placeholder="Cari siswa, kegiatan, atau kendala..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg
                            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex gap-4 items-center w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 whitespace-nowrap">Status:</span>
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="Semua">Semua</option>
                            <option value="Menunggu">Menunggu</option>
                            <option value="Terverifikasi">Terverifikasi</option>
                            <option value="Perbaikan">Perbaikan</option>
                            <option value="Draft">Draft</option>
                        </select>
                    </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 whitespace-nowrap">Per halaman:</span>
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">SISWA</th>
                                <th className="px-6 py-4">TANGGAL & WAKTU</th>
                                <th className="px-6 py-4">KEGIATAN</th>
                                <th className="px-6 py-4">STATUS</th>
                                <th className="px-6 py-4">CATATAN VERIFIKASI</th>
                                <th className="px-6 py-4 text-right">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Memuat data logbook...
                                    </td>
                                </tr>
                            ) : pagedLogbooks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center p-4">
                                            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-900">Belum ada data logbook</p>
                                            <p className="text-gray-500 max-w-sm mt-1">Data logbook yang diisi oleh siswa akan muncul di sini.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pagedLogbooks.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 align-top w-56">
                                            <div className="font-medium text-gray-900">
                                                {log.siswa?.name || "Siswa"}
                                            </div>
                                            <div className="text-xs text-gray-500">{log.siswa?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 align-top w-48">
                                            <div className="font-medium text-gray-900">{log.date}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {log.start_time || "--:--"} - {log.end_time || "--:--"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top max-w-xs">
                                            <div className="text-gray-600">{log.activity}</div>
                                            {log.attachment_url && (
                                                <a
                                                    href={log.attachment_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                                                >
                                                    Lampiran
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${log.status === "reviewed"
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : log.status === "rejected"
                                                        ? "bg-red-50 text-red-700 border-red-200"
                                                        : log.status === "submitted"
                                                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                            : "bg-gray-100 text-gray-700 border-gray-200"
                                                    }`}
                                            >
                                                {statusLabels[log.status] ?? log.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-top text-gray-600 italic">
                                            {log.guru_note || "-"}
                                        </td>
                                        <td className="px-6 py-4 align-top text-right">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => openReview(log)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    Review
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Info */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                <span>
                    Menampilkan {(page - 1) * itemsPerPage + 1} sampai{" "}
                    {Math.min(page * itemsPerPage, filteredLogbooks.length)} dari{" "}
                    {filteredLogbooks.length} entri
                </span>
                <div className="flex gap-1">
                    <button
                        className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Previous
                    </button>
                    <button
                        className="px-3 py-1 border rounded bg-white disabled:opacity-50"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
}

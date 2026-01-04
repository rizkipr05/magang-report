"use client";

import { useState } from "react";
import Link from "next/link";

export default function GuruLogbookPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Semua");
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Dummy data
    const logbooks = [
        {
            id: 1,
            date: "2024-01-04",
            image: null,
            activity: "Mempelajari struktur project dan setup environment",
            issue: "Tidak ada kendala berarti",
            status: "Menunggu verifikasi",
            note: "-",
        },
        {
            id: 2,
            date: "2024-01-03",
            image: null,
            activity: "Instalasi Node.js dan Next.js",
            issue: "Koneksi internet lambat saat install packages",
            status: "Telah terverifikasi",
            note: "Lanjutkan progres",
        },
    ];

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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Total Logbook</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">128</p>
                    <p className="text-sm text-gray-500 mt-1">Keseluruhan catatan harian</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-yellow-600 text-sm font-medium">Menunggu Verifikasi</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                    <p className="text-sm text-gray-500 mt-1">Perlu tinjauan guru</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-green-600 text-sm font-medium">Telah Terverifikasi</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">110</p>
                    <p className="text-sm text-gray-500 mt-1">Disetujui</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-red-600 text-sm font-medium">Perlu Perbaikan</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">6</p>
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
                                <th className="px-6 py-4">TANGGAL & FOTO</th>
                                <th className="px-6 py-4">KEGIATAN & KENDALA</th>
                                <th className="px-6 py-4">STATUS</th>
                                <th className="px-6 py-4">CATATAN VERIFIKASI</th>
                                <th className="px-6 py-4 text-right">AKSI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logbooks.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
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
                                logbooks.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 align-top w-48">
                                            <div className="font-medium text-gray-900">{log.date}</div>
                                            <div className="mt-2 w-24 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                                {log.image ? "Foto" : "No img"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-top max-w-xs">
                                            <div className="font-medium text-gray-900 mb-1">Kegiatan:</div>
                                            <div className="text-gray-600 mb-3">{log.activity}</div>
                                            <div className="font-medium text-gray-900 mb-1">Kendala:</div>
                                            <div className="text-gray-600">{log.issue}</div>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${log.status === "Telah terverifikasi"
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : log.status === "Perlu perbaikan"
                                                            ? "bg-red-50 text-red-700 border-red-200"
                                                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                    }`}
                                            >
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-top text-gray-600 italic">
                                            {log.note || "-"}
                                        </td>
                                        <td className="px-6 py-4 align-top text-right">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                                Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Info */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                    <span>Menampilkan 1 sampai {logbooks.length} dari {logbooks.length} entri</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border rounded bg-white disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border rounded bg-white disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

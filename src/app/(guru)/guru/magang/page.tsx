"use client";

import { useState } from "react";

export default function GuruMagangPage() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const siswaList = [
        {
            id: 1,
            nama: "Rizky",
            nis: "12345678",
            kelas: "XII RPL 1",
            dudi: "DOT Indonesia",
            status: "Aktif",
            logbookCount: 45,
            pendingReview: 3,
        },
        {
            id: 2,
            nama: "Andi Saputra",
            nis: "12345679",
            kelas: "XII RPL 1",
            dudi: "DOT Indonesia",
            status: "Aktif",
            logbookCount: 42,
            pendingReview: 1,
        },
        {
            id: 3,
            nama: "Budi Santoso",
            nis: "12345680",
            kelas: "XII RPL 2",
            dudi: "DOT Indonesia",
            status: "Aktif",
            logbookCount: 48,
            pendingReview: 0,
        },
        {
            id: 4,
            nama: "Siti Nurhaliza",
            nis: "12345681",
            kelas: "XII RPL 1",
            dudi: "UBIG",
            status: "Aktif",
            logbookCount: 40,
            pendingReview: 5,
        },
        {
            id: 5,
            nama: "Dewi Lestari",
            nis: "12345682",
            kelas: "XII RPL 2",
            dudi: "UBIG",
            status: "Aktif",
            logbookCount: 38,
            pendingReview: 2,
        },
        {
            id: 6,
            nama: "Ahmad Fauzi",
            nis: "12345683",
            kelas: "XII RPL 1",
            dudi: "Nortish Academy",
            status: "Belum Mulai",
            logbookCount: 0,
            pendingReview: 0,
        },
    ];

    const filteredSiswa = siswaList.filter((siswa) => {
        const matchesSearch =
            siswa.nama.toLowerCase().includes(search.toLowerCase()) ||
            siswa.nis.includes(search) ||
            siswa.dudi.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            filterStatus === "all" ||
            siswa.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Data Siswa Magang</h1>
                <p className="text-gray-500">Kelola dan pantau aktivitas siswa bimbingan magang.</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari nama siswa, NIS, atau DUDI..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                        <option value="all">Semua Status</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Belum Mulai">Belum Mulai</option>
                        <option value="Selesai">Selesai</option>
                    </select>
                </div>
            </div>

            {/* Students Grid */}
            {filteredSiswa.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSiswa.map((siswa) => (
                        <div key={siswa.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                {/* Student Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                            {siswa.nama.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{siswa.nama}</h3>
                                            <p className="text-sm text-gray-500">{siswa.nis}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${siswa.status === "Aktif"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}>
                                        {siswa.status}
                                    </span>
                                </div>

                                {/* Student Info */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                        <span className="text-gray-600">Kelas: {siswa.kelas}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        <span className="text-gray-600">{siswa.dudi}</span>
                                    </div>
                                </div>

                                {/* Logbook Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-bold text-blue-600">{siswa.logbookCount}</p>
                                        <p className="text-xs text-gray-600">Total Logbook</p>
                                    </div>
                                    <div className={`rounded-lg p-3 text-center ${siswa.pendingReview > 0 ? "bg-yellow-50" : "bg-green-50"
                                        }`}>
                                        <p className={`text-2xl font-bold ${siswa.pendingReview > 0 ? "text-yellow-600" : "text-green-600"
                                            }`}>
                                            {siswa.pendingReview}
                                        </p>
                                        <p className="text-xs text-gray-600">Perlu Review</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
                                <button className="py-2 px-3 text-sm font-medium text-emerald-600 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">
                                    Lihat Detail
                                </button>
                                <button className="py-2 px-3 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                                    Review
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="inline-flex content-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <svg className="w-8 h-8 text-gray-400 mt-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Tidak ditemukan</h3>
                    <p className="text-gray-500">Coba kata kunci lain untuk mencari siswa.</p>
                </div>
            )}
        </div>
    );
}

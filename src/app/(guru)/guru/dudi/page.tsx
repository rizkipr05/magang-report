"use client";

import { useState } from "react";

export default function GuruDudiPage() {
    const [search, setSearch] = useState("");

    const dudis = [
        {
            id: 1,
            name: "DOT Indonesia",
            field: "Teknologi Informasi",
            location: "Malang",
            pic: "Bu Nungki",
            quotaTotal: 10,
            quotaFilled: 3,
            siswaAktif: ["Rizky", "Andi", "Budi"],
        },
        {
            id: 2,
            name: "UBIG",
            field: "Teknologi Informasi",
            location: "Tasik Madu",
            pic: "Bu Fajar",
            quotaTotal: 10,
            quotaFilled: 2,
            siswaAktif: ["Siti", "Dewi"],
        },
        {
            id: 3,
            name: "Nortish Academy",
            field: "Pendidikan & IT",
            location: "Jl. Haji Romo",
            pic: "Bu Ririn",
            quotaTotal: 10,
            quotaFilled: 5,
            siswaAktif: ["Ahmad", "Fatimah", "Joko", "Lina", "Rudi"],
        },
        {
            id: 4,
            name: "3-PM Solution",
            field: "Software House",
            location: "Perum Araya Barat No 15b",
            pic: "Pak Rendy",
            quotaTotal: 10,
            quotaFilled: 4,
            siswaAktif: ["Nina", "Oscar", "Putri", "Qori"],
        },
        {
            id: 5,
            name: "Alfahuma Malang",
            field: "Digital Agency",
            location: "Jl. Hamid Rusdi blok M",
            pic: "Pak Kus",
            quotaTotal: 10,
            quotaFilled: 2,
            siswaAktif: ["Tono", "Umar"],
        },
        {
            id: 6,
            name: "Telkom Indonesia",
            field: "Telekomunikasi",
            location: "Jl. Ahmad Yani, Malang",
            pic: "Pak Budi",
            quotaTotal: 5,
            quotaFilled: 2,
            siswaAktif: ["Vina", "Wawan"],
        },
    ];

    const filteredDudis = dudis.filter((dudi) =>
        dudi.name.toLowerCase().includes(search.toLowerCase()) ||
        dudi.field.toLowerCase().includes(search.toLowerCase())
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

            {/* DUDI List */}
            {filteredDudis.length > 0 ? (
                <div className="space-y-4">
                    {filteredDudis.map((dudi) => {
                        const percentage = (dudi.quotaFilled / dudi.quotaTotal) * 100;
                        const slotsLeft = dudi.quotaTotal - dudi.quotaFilled;

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
                                                <p className="text-sm text-emerald-600 font-medium mb-2">{dudi.field}</p>

                                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        <span>{dudi.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                        <span>PIC: {dudi.pic}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quota Info */}
                                        <div className="md:w-64">
                                            <div className="flex justify-between text-xs font-semibold mb-1">
                                                <span className="text-gray-500">Kuota Terisi</span>
                                                <span className="text-gray-700">{dudi.quotaFilled}/{dudi.quotaTotal}</span>
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
                                    <button className="flex-1 py-2 px-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        Edit Data
                                    </button>
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

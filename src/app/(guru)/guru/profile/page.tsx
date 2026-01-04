"use client";

import { useState } from "react";

export default function GuruProfilePage() {
    const [user, setUser] = useState({
        fullName: "Pak Budi",
        email: "budi@sekolah.sch.id",
        role: "Guru Pembimbing",
        nip: "19800101 200501 1 001",
        mapel: "Pemrograman Web & Perangkat Bergerak",
        telepon: "081987654321",
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Profil Guru</h1>
                <p className="text-gray-500">Informasi akun dan mata pelajaran yang diampu.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Cover & Avatar */}
                <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-400"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600">
                                    {user.fullName.charAt(0)}
                                </div>
                            </div>
                            <div className="mb-1">
                                <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                            Pengaturan
                        </button>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Detail Akun</h3>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                                <p className="text-gray-900 font-medium">{user.email}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">NIP</label>
                                <p className="text-gray-900 font-medium">{user.nip}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Akademik</h3>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mata Pelajaran</label>
                                <p className="text-gray-900 font-medium">{user.mapel}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kontak</label>
                                <p className="text-gray-900 font-medium">{user.telepon}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

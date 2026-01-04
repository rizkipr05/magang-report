"use client";

import { useState } from "react";

export default function SiswaProfilePage() {
    // Dummy data - in real app would come from DB/Auth
    const [user, setUser] = useState({
        fullName: "Rizky (Siswa)",
        email: "rizky@sekolah.sch.id",
        role: "Siswa Magang",
        nis: "12345678",
        kelas: "XII RPL 1",
        jurusan: "Rekayasa Perangkat Lunak",
        alamat: "Jl. Merdeka No. 10, Jakarta",
        telepon: "081234567890",
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
                <p className="text-gray-500">Kelola informasi pribadi dan akun Anda.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Cover & Avatar */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
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
                                <p className="text-gray-500 font-medium">{user.role}</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                            Edit Profil
                        </button>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Informasi Akun</h3>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                                <p className="text-gray-900 font-medium">{user.email}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">NIS</label>
                                <p className="text-gray-900 font-medium">{user.nis}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kelas</label>
                                <p className="text-gray-900 font-medium">{user.kelas}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Data Pribadi</h3>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Jurusan</label>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {user.jurusan}
                                </span>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nomor Telepon</label>
                                <p className="text-gray-900 font-medium">{user.telepon}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Alamat</label>
                                <p className="text-gray-900 font-medium">{user.alamat}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

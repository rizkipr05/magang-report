"use client";

import { useUserProfile } from "@/lib/supabase/hooks";
import { useRouter } from "next/navigation";

export default function SiswaProfilePage() {
    const { profile, loading, error } = useUserProfile();
    const router = useRouter();

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg animate-pulse">
                    <div className="h-8 bg-blue-700 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-blue-700 rounded w-64"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-64 animate-pulse"></div>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-64 animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-800 mb-2">Gagal Memuat Profil</h2>
                    <p className="text-red-600 mb-6">
                        {error ? `Error: ${error}` : "Anda belum login atau session telah berakhir."}
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Ke Halaman Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold">Profil Saya</h1>
                <p className="text-blue-100 mt-2">Kelola dan lihat informasi pribadi Anda.</p>
            </div>

            {/* Main Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Informasi Pribadi</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nama Lengkap</label>
                            <p className="text-gray-900 font-medium text-lg">{profile.name || "-"}</p>
                        </div>

                        {profile.nis && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">NIS</label>
                                <p className="text-gray-900 font-medium">{profile.nis}</p>
                            </div>
                        )}

                        {profile.kelas && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kelas</label>
                                <p className="text-gray-900 font-medium">{profile.kelas}</p>
                            </div>
                        )}

                        {profile.jurusan && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Jurusan</label>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {profile.jurusan}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Informasi Kontak</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                                <p className="text-gray-900 font-medium">{profile.email || "-"}</p>
                            </div>
                        </div>

                        {profile.telepon && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nomor Telepon</label>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    <p className="text-gray-900 font-medium">{profile.telepon}</p>
                                </div>
                            </div>
                        )}

                        {profile.alamat && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Alamat Lengkap</label>
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <p className="text-gray-900 font-medium">{profile.alamat}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

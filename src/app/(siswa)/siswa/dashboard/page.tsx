"use client";

import Link from "next/link";
import { useLogbookStats, useUserProfile } from "@/lib/supabase/hooks";

export default function SiswaDashboard() {
  const { stats, loading: statsLoading } = useLogbookStats();
  const { profile } = useUserProfile();

  const logbookData = [
    {
      label: "Disetujui",
      count: stats.disetujui,
      h: stats.total > 0 ? `${(stats.disetujui / stats.total) * 100}%` : "5%",
      color: "bg-emerald-500",
      hoverColor: "group-hover:bg-emerald-600",
      textColor: "text-emerald-600"
    },
    {
      label: "Pending",
      count: stats.pending,
      h: stats.total > 0 ? `${(stats.pending / stats.total) * 100}%` : "5%",
      color: "bg-yellow-500",
      hoverColor: "group-hover:bg-yellow-600",
      textColor: "text-yellow-600"
    },
    {
      label: "Ditolak",
      count: stats.ditolak,
      h: stats.total > 0 ? `${(stats.ditolak / stats.total) * 100}%` : "5%",
      color: "bg-blue-500",
      hoverColor: "group-hover:bg-blue-600",
      textColor: "text-blue-600"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Stats & Graph Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Welcome Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold">Selamat Datang, {profile?.name || "Siswa"}!</h1>
            <p className="mt-2 text-blue-100 max-w-xl">
              Selamat datang di Portal Magang. Pantau aktivitas, cari tempat magang, dan cek status penerimaanmu di sini.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.75l-2.5 1zm0 2.25l-5-2.5-5 2.5 10 5 10-5-5-2.5-5 2.5z" /></svg>
          </div>
        </div>

        {/* Logbook Graph */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Status Logbook</h3>
            <span className="text-xs text-gray-400">
              {statsLoading ? "..." : `Total: ${stats.total}`}
            </span>
          </div>

          {statsLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between gap-4 px-2">
              {logbookData.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3 group w-full">
                  <div className="w-full bg-gray-50 rounded-t-md relative h-40 flex items-end overflow-hidden group-hover:bg-gray-100 transition-colors border border-gray-100">
                    <div
                      className={`w-full ${item.color} rounded-t-md transition-all duration-500 ${item.hoverColor} relative`}
                      style={{ height: item.h }}
                    >
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {item.count} Logbook
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${item.textColor} mb-1`}>{item.count}</div>
                    <span className="text-xs font-medium text-gray-600">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions / Navigation Grid */}
      <h2 className="text-xl font-bold text-gray-800">Menu Utama</h2>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logbook Card */}
        <Link
          href="/siswa/logbook"
          className="group relative overflow-hidden p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Logbook Harian</h3>
            <p className="text-gray-500 text-sm mb-4">Isi dan laporkan kegiatan harian magangmu kepada guru pembimbing.</p>
            <span className="text-blue-600 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
              Buka Logbook &rarr;
            </span>
          </div>
        </Link>

        {/* DUDI Card */}
        <Link
          href="/siswa/dudi"
          className="group relative overflow-hidden p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-orange-300"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-orange-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" /></svg>
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Daftar DUDI</h3>
            <p className="text-gray-500 text-sm mb-4">Cari dan temukan informasi tempat magang yang tersedia.</p>
            <span className="text-orange-600 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
              Lihat DUDI &rarr;
            </span>
          </div>
        </Link>

        {/* Status Card */}
        <Link
          href="/siswa/status"
          className="group relative overflow-hidden p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-purple-300"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 7h10v2h-10v-2zm0 4h10v2h-10v-2z" opacity=".3" /><path d="M7 7h10v2H7zm0 4h10v2H7z" /></svg>
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Status Magang</h3>
            <p className="text-gray-500 text-sm mb-4">Cek status pendaftaran dan monitoring progress magang.</p>
            <span className="text-purple-600 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
              Cek Status &rarr;
            </span>
          </div>
        </Link>
      </main>
    </div>
  );
}

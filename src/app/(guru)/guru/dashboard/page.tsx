"use client";

import Link from "next/link";

export default function GuruDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats & Graph Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Welcome Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold">Selamat Datang, Guru!</h1>
            <p className="mt-2 text-emerald-100 max-w-xl">
              Pantau aktivitas siswa bimbingan, verifikasi logbook, dan kelola data magang dengan mudah.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.75l-2.5 1zm0 2.25l-5-2.5-5 2.5 10 5 10-5-5-2.5-5 2.5z" /></svg>
          </div>
        </div>

        {/* Logbook Verification Graph */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Verifikasi Logbook</h3>
            <span className="text-xs text-gray-400">Total</span>
          </div>

          <div className="flex-1 flex items-end justify-between gap-4 px-2">
            {[
              { label: "Disetujui", count: 45, h: "90%", color: "bg-emerald-500", hoverColor: "group-hover:bg-emerald-600", textColor: "text-emerald-600" },
              { label: "Pending", count: 12, h: "40%", color: "bg-yellow-500", hoverColor: "group-hover:bg-yellow-600", textColor: "text-yellow-600" },
              { label: "Revisi", count: 3, h: "15%", color: "bg-red-500", hoverColor: "group-hover:bg-red-600", textColor: "text-red-600" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group w-full">
                <div className="w-full bg-gray-50 rounded-t-md relative h-40 flex items-end overflow-hidden group-hover:bg-gray-100 transition-colors border border-gray-100">
                  <div
                    className={`w-full ${item.color} rounded-t-md transition-all duration-500 ${item.hoverColor}`}
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Siswa</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktif Magang</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Perlu Review</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total DUDI</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Menu Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/guru/logbook" className="group relative overflow-hidden p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-emerald-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Logbook Siswa</h3>
              <p className="text-sm text-gray-500">Verifikasi dan review logbook harian siswa</p>
            </div>
          </Link>

          <Link href="/guru/magang" className="group relative overflow-hidden p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Data Siswa Magang</h3>
              <p className="text-sm text-gray-500">Lihat dan kelola data siswa bimbingan</p>
            </div>
          </Link>

          <Link href="/guru/dudi" className="group relative overflow-hidden p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-purple-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Kelola DUDI</h3>
              <p className="text-sm text-gray-500">Kelola data tempat magang (DUDI)</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

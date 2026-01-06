"use client";

import { useState } from "react";
import Link from "next/link";
import { useDudiList } from "@/lib/supabase/hooks";

export default function DudiPage() {
  const [search, setSearch] = useState("");
  const { dudis, loading, error } = useDudiList(search);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">DUDI (Dunia Usaha & Industri)</h1>
          <p className="text-gray-500">Memuat data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-96 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">DUDI (Dunia Usaha & Industri)</h1>
        <p className="text-gray-500">Cari dan lamar tempat magang yang sesuai dengan minatmu.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari perusahaan, bidang usaha, lokasi..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* DUDI Grid */}
      {dudis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dudis.map((dudi) => {
            const quotaFilled = dudi.quota_filled || 0;
            const quotaTotal = dudi.quota_total || 10;
            const percentage = (quotaFilled / quotaTotal) * 100;
            const slotsLeft = quotaTotal - quotaFilled;
            const isFull = quotaFilled >= quotaTotal;

            return (
              <div key={dudi.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
                <div className="p-6 flex-1 flex flex-col gap-4">
                  {/* Card Header */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{dudi.name}</h3>
                      <p className="text-sm text-blue-600 font-medium">Perusahaan Mitra</p>
                    </div>
                  </div>

                  {/* Info Rows */}
                  <div className="space-y-2 text-sm text-gray-600">
                    {dudi.location && (
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="line-clamp-1">{dudi.location}</span>
                      </div>
                    )}
                    {dudi.pic && (
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span className="line-clamp-1">PIC: {dudi.pic}</span>
                      </div>
                    )}
                  </div>

                  {/* Quota Progress */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-500">Kuota Magang</span>
                      <span className="text-gray-700">{quotaFilled}/{quotaTotal}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-400">{slotsLeft} slot tersisa</span>
                    </div>
                  </div>

                  {dudi.field && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-400">Bidang: {dudi.field}</p>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 flex gap-3">
                  <Link
                    href={`/siswa/dudi/detail/${dudi.id}`}
                    className="flex-1 py-2 px-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
                  >
                    Detail
                  </Link>
                  {dudi.is_applied ? (
                    <button disabled className="flex-1 py-2 px-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg cursor-default border border-green-200">
                      ✔ Sudah Mendaftar
                    </button>
                  ) : isFull ? (
                    <button disabled className="flex-1 py-2 px-3 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed">
                      Penuh
                    </button>
                  ) : (
                    <Link
                      href={`/siswa/dudi/daftar/${dudi.id}`}
                      className="flex-1 py-2 px-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 text-center"
                    >
                      → Daftar
                    </Link>
                  )}
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

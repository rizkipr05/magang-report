"use client";

import { useState } from "react";

export default function DudiPage() {
  const [search, setSearch] = useState("");

  const dudis = [
    {
      id: 1,
      name: "DOT Indonesia",
      field: "Teknologi Informasi",
      location: "Malang",
      pic: "Bu Nungki",
      quotaTotal: 10,
      quotaFilled: 0,
      status: "Open",
      tags: ["Web", "Mobile"],
      isApplied: false,
    },
    {
      id: 2,
      name: "UBIG",
      field: "Teknologi Informasi",
      location: "Tasik Madu",
      pic: "Bu Fajar",
      quotaTotal: 10,
      quotaFilled: 1,
      status: "Open",
      tags: ["IoT", "AI"],
      isApplied: false,
    },
    {
      id: 3,
      name: "Nortish Academy",
      field: "Pendidikan & IT",
      location: "Jl. Haji Romo",
      pic: "Bu Ririn",
      quotaTotal: 10,
      quotaFilled: 0,
      status: "Open",
      tags: ["Teaching", "Coding"],
      isApplied: true,
    },
    {
      id: 4,
      name: "3-PM Solution",
      field: "Software House",
      location: "Perum Araya Barat No 15b",
      pic: "Pak Rendy",
      quotaTotal: 10,
      quotaFilled: 0,
      status: "Open",
      tags: ["Web", "System"],
      isApplied: false,
    },
    {
      id: 5,
      name: "Alfahuma Malang",
      field: "Digital Agency",
      location: "Jl. Hamid Rusdi blok M",
      pic: "Pak Kus",
      quotaTotal: 10,
      quotaFilled: 0,
      status: "Open",
      tags: ["Design", "Web"],
      isApplied: false,
    },
    {
      id: 6,
      name: "Telkom Indonesia",
      field: "Telekomunikasi",
      location: "Jl. Ahmad Yani, Malang",
      pic: "Pak Budi",
      quotaTotal: 5,
      quotaFilled: 5,
      status: "Full",
      tags: ["Network", "Support"],
      isApplied: false,
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
        <h1 className="text-2xl font-bold text-gray-900">DUDI (Dunia Usaha & Industri)</h1>
        <p className="text-gray-500">Cari dan lamar tempat magang yang sesuai dengan minatmu.</p>
      </div>

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
      {filteredDudis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDudis.map((dudi) => {
            const percentage = (dudi.quotaFilled / dudi.quotaTotal) * 100;
            const slotsLeft = dudi.quotaTotal - dudi.quotaFilled;

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
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="line-clamp-1">{dudi.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span className="line-clamp-1">PIC: {dudi.pic}</span>
                    </div>
                  </div>

                  {/* Quota Progress */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-gray-500">Kuota Magang</span>
                      <span className="text-gray-700">{dudi.quotaFilled}/{dudi.quotaTotal}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-400">{slotsLeft} slot tersisa</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-gray-400 mb-2">Bidang: {dudi.tags.join(", ")}</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 flex gap-3">
                  <button className="flex-1 py-2 px-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    Detail
                  </button>
                  {dudi.isApplied ? (
                    <button disabled className="flex-1 py-2 px-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg cursor-default border border-green-200">
                      ✔ Sudah Mendaftar
                    </button>
                  ) : dudi.status === 'Full' ? (
                    <button disabled className="flex-1 py-2 px-3 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed">
                      Penuh
                    </button>
                  ) : (
                    <button className="flex-1 py-2 px-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                      → Daftar
                    </button>
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

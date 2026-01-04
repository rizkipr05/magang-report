"use client";

import { useState } from "react";
import Link from "next/link";

export default function DudiPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const dudis = [
    {
      id: 1,
      name: "PT Teknologi Nusantara",
      field: "Software Engineering",
      address: "Jl. Sudirman No. 45, Jakarta Pusat",
      contact: "hrd@teknus.co.id",
      status: "Open",
      tags: ["Web", "Mobile", "Backend"]
    },
    {
      id: 2,
      name: "CV Kreatif Digital",
      field: "Multimedia & Design",
      address: "Jl. Bangka Raya No. 10, Jakarta Selatan",
      contact: "info@kreatif.id",
      status: "Full",
      tags: ["UI/UX", "Graphic Design", "Video"]
    },
    {
      id: 3,
      name: "PT Solusi Jaringan",
      field: "Network Engineering",
      address: "Jl. Gatot Subroto Kav. 22, Jakarta Selatan",
      contact: "recruitment@solusinet.com",
      status: "Open",
      tags: ["Cisco", "Mikrotik", "Server"]
    },
    {
      id: 4,
      name: "StartUp Maju Bersama",
      field: "Business Development",
      address: "BSD Green Office Park, Tangerang",
      contact: "hi@majubersama.com",
      status: "Open",
      tags: ["Marketing", "Sales", "Data"]
    },
  ];

  const filteredDudis = dudis.filter(dudi =>
    dudi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dudi.field.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar DUDI</h1>
          <p className="text-gray-500 mt-1">Temukan tempat magang yang sesuai dengan minat dan kompetensimu.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-lg">
        <input
          type="text"
          placeholder="Cari nama perusahaan atau bidang..."
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* DUDI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDudis.length > 0 ? (
          filteredDudis.map((dudi) => (
            <div key={dudi.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xl">
                    {dudi.name.charAt(0)}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${dudi.status === 'Open' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                    {dudi.status === 'Open' ? 'Dibuka' : 'Penuh'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{dudi.name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-3">{dudi.field}</p>

                <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>{dudi.address}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {dudi.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex gap-3">
                <button className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-100 transition-colors">
                  Detail
                </button>
                <button
                  disabled={dudi.status !== 'Open'}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lamar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Tidak ditemukan</h3>
            <p className="text-gray-500 mt-1">Coba kata kunci lain untuk mencari DUDI.</p>
          </div>
        )}
      </div>
    </div>
  );
}

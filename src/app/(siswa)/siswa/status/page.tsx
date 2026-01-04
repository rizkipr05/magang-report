"use client";

import Link from "next/link";

export default function StatusPage() {
  // Dummy status data
  const currentStep = 2; // 1-based index: 1=Pendaftaran, 2=Verifikasi, 3=Diterima, 4=Magang, 5=Selesai
  const steps = [
    { title: "Pendaftaran", desc: "Melengkapi data diri dan memilih DUDI", date: "01 Jan 2024" },
    { title: "Verifikasi Guru", desc: "Menunggu persetujuan guru pembimbing", date: "03 Jan 2024" },
    { title: "Konfirmasi DUDI", desc: "Menunggu jawaban dari tempat magang", date: "-" },
    { title: "Magang Berjalan", desc: "Melaksanakan kegiatan magang", date: "-" },
    { title: "Selesai", desc: "Laporan akhir dan penarikan", date: "-" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Status Magang</h1>
          <p className="text-gray-500 mt-1">Pantau progress pendaftaran dan pelaksanaan magangmu.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Status Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Timeline Aktivitas</h2>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
              {steps.map((step, index) => {
                const stepNum = index + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;

                return (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isCompleted ? 'bg-green-500 border-green-500 text-white' :
                      isActive ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.2)]' :
                        'bg-white border-gray-300 text-gray-400'
                      }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <span className="font-bold text-sm">{stepNum}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between mb-1">
                        <h3 className={`font-bold ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-900'}`}>{step.title}</h3>
                        <span className="text-xs text-gray-400 font-medium">{step.date}</span>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Current Status Badge */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-center text-white shadow-lg">
            <p className="text-blue-100 text-sm font-medium mb-2">STATUS SAAT INI</p>
            <h3 className="text-2xl font-bold mb-4">Menunggu Verifikasi Guru</h3>
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm border border-white/30">
              Sedang Diproses
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Detail Pendaftaran</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Perusahaan Pilihan</p>
                <p className="font-medium text-gray-900">PT Teknologi Nusantara</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Posisi</p>
                <p className="font-medium text-gray-900">Software Engineering</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Guru Pembimbing</p>
                <p className="font-medium text-gray-900">Bapak Budi Santoso</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm transition-colors border border-gray-200">
                Unduh Berkas Pendaftaran
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

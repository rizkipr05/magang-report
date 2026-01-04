"use client";
import Link from "next/link";
import LogoutButton from "@/components/layout/LogoutButton";

export default function SiswaDashboard() {
  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard Siswa</h1>
          <p style={{ margin: "6px 0 0", color: "#555" }}>Ringkasan aktivitas logbook, DUDI, dan status magang.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/siswa/logbook" style={{ padding: "8px 12px", background: "#0ea5a4", color: "white", borderRadius: 6, textDecoration: "none", display: "inline-block" }}>Logbook</Link>
          <Link href="/siswa/dudi" style={{ padding: "8px 12px", background: "#2563eb", color: "white", borderRadius: 6, textDecoration: "none", display: "inline-block" }}>DUDI</Link>
          <LogoutButton />
        </div>
      </header>

      <main style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <Link href="/siswa/logbook" style={{ padding: 18, borderRadius: 8, background: "#f8fafc", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", textDecoration: "none", color: "inherit", display: "block" }}>
          <h3 style={{ margin: 0 }}>Logbook</h3>
          <p style={{ marginTop: 8, color: "#4b5563" }}>Catatan harian kegiatan magangmu.</p>
        </Link>

        <Link href="/siswa/dudi" style={{ padding: 18, borderRadius: 8, background: "#fff7ed", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", textDecoration: "none", color: "inherit", display: "block" }}>
          <h3 style={{ margin: 0 }}>DUDI</h3>
          <p style={{ marginTop: 8, color: "#4b5563" }}>Informasi tempat magang dan kontak.</p>
        </Link>

        <Link href="/siswa/status" style={{ padding: 18, borderRadius: 8, background: "#eef2ff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", textDecoration: "none", color: "inherit", display: "block" }}>
          <h3 style={{ margin: 0 }}>Status Magang</h3>
          <p style={{ marginTop: 8, color: "#4b5563" }}>Lihat status penerimaan dan monitoring.</p>
        </Link>
      </main>
    </div>
  );
}

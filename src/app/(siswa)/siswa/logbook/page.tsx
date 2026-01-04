import Link from "next/link";

export default function LogbookPage() {
  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Logbook</h1>
        <Link href="/siswa/dashboard" style={{ color: "#2563eb" }}>Kembali</Link>
      </header>

      <main style={{ marginTop: 20 }}>
        <p>Catatan harian kegiatan magang.</p>

        <div style={{ marginTop: 12 }}>
          <div style={{ padding: 12, borderRadius: 8, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h4 style={{ margin: 0 }}>2026-01-04</h4>
            <p style={{ marginTop: 8, color: "#4b5563" }}>Mempelajari struktur proyek, menyiapkan environment.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

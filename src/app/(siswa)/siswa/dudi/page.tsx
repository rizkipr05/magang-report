import Link from "next/link";

export default function DudiPage() {
  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>DUDI</h1>
        <Link href="/siswa/dashboard" style={{ color: "#2563eb" }}>Kembali</Link>
      </header>

      <main style={{ marginTop: 20 }}>
        <p>Daftar tempat praktik industri (DUDI) tersedia di sini.</p>
        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 8, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: 0 }}>PT Contoh Industri</h3>
            <p style={{ marginTop: 6, color: "#4b5563" }}>Bidang: Teknologi — Kontak: 0812xxxx</p>
          </div>
        </div>
      </main>
    </div>
  );
}

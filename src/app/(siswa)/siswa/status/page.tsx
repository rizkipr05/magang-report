import Link from "next/link";

export default function StatusPage() {
  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Status Magang</h1>
        <Link href="/siswa/dashboard" style={{ color: "#2563eb" }}>Kembali</Link>
      </header>

      <main style={{ marginTop: 20 }}>
        <p>Status pendaftaran dan monitoring magangmu akan tampil di sini.</p>

        <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#f1f5f9" }}>
          <strong>Status:</strong> Menunggu konfirmasi DUDI
        </div>
      </main>
    </div>
  );
}

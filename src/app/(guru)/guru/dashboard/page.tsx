export default function GuruDashboard() {
  return (
    <div>
      <h1>Dashboard Guru</h1>
      <p>Ringkasan siswa bimbingan, logbook menunggu review, dll.</p>

      <form action="/api/auth/logout" method="post">
        <button style={{ marginTop: 16, padding: 10 }}>Logout</button>
      </form>
    </div>
  );
}

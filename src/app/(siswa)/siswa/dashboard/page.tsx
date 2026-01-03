export default function SiswaDashboard() {
  return (
    <div>
      <h1>Dashboard Siswa</h1>
      <p>Ringkasan aktivitas logbook, DUDI, dan status magang.</p>

      <form action="/api/auth/logout" method="post">
        <button style={{ marginTop: 16, padding: 10 }}>Logout</button>
      </form>
    </div>
  );
}

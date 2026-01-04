"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nis, setNis] = useState("");
  const [kelas, setKelas] = useState("");
  const [jurusan, setJurusan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          confirm_password: confirmPassword,
          nis,
          kelas,
          jurusan,
          alamat,
          telepon,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Gagal registrasi");
        setLoading(false);
        return;
      }

      setMsg("Registrasi berhasil. Redirecting to login...");
      setTimeout(() => router.replace("/login"), 1000);
    } catch (err) {
      setMsg("Terjadi error saat mendaftar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>Register (Siswa)</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          placeholder="Nama lengkap"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Konfirmasi Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="NIS"
          value={nis}
          onChange={(e) => setNis(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Kelas"
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Jurusan"
          value={jurusan}
          onChange={(e) => setJurusan(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Alamat"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
          style={{ padding: 10 }}
        />

        <input
          placeholder="Telepon"
          value={telepon}
          onChange={(e) => setTelepon(e.target.value)}
          style={{ padding: 10 }}
        />

        <button disabled={loading} style={{ padding: 10 }}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>

      {msg && <p style={{ marginTop: 12, color: msg.includes("berhasil") ? "green" : "crimson" }}>{msg}</p>}

      <p style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
        Registrasi ini hanya untuk <b>siswa</b>. Pastikan semua field diisi.
      </p>
    </div>
  );
}

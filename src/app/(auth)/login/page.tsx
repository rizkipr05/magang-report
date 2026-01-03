"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Gagal login");
        setLoading(false);
        return;
      }

      const role = data?.user?.role;
      if (role === "siswa") router.replace("/siswa/dashboard");
      else if (role === "guru") router.replace("/guru/dashboard");
      else router.replace("/login");
    } catch {
      setMsg("Terjadi error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>Login</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
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
        <button disabled={loading} style={{ padding: 10 }}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      {msg && <p style={{ marginTop: 12, color: "crimson" }}>{msg}</p>}
      <p style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
        Pastikan tabel <b>users</b> di Supabase punya kolom: id, email, role, name.
      </p>
    </div>
  );
}

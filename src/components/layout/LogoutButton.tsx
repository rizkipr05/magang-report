"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
      router.replace("/login");
    }
  }

  return (
    <button onClick={handleLogout} disabled={loading} style={{ padding: "8px 12px", background: "#ef4444", color: "white", borderRadius: 6, border: "none" }}>
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

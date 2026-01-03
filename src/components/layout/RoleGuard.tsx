"use client";

import React from "react";

export default function RoleGuard({
  allowed,
  role,
  children,
}: {
  allowed: Array<"siswa" | "guru">;
  role: "siswa" | "guru" | null;
  children: React.ReactNode;
}) {
  if (!role) {
    return (
      <div style={{ padding: 20 }}>
        <p>Belum login. Silakan login dulu.</p>
      </div>
    );
  }

  if (!allowed.includes(role)) {
    return (
      <div style={{ padding: 20 }}>
        <p>Akses ditolak untuk role: {role}</p>
      </div>
    );
  }

  return <>{children}</>;
}

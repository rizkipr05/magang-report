import { NextResponse } from "next/server";
import type { AppRole } from "@/lib/auth/session";

export function requireRole(role: AppRole, actualRole?: string | null) {
  if (!actualRole) return false;
  return actualRole === role;
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

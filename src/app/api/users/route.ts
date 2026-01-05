import { NextResponse } from "next/server";
import { getApiUser, requireGuru } from "@/lib/auth/api";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { profile } = await getApiUser(req);
  if (!profile) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!requireGuru(profile.role)) {
    return NextResponse.json({ message: "Forbidden (guru only)" }, { status: 403 });
  }

  const url = new URL(req.url);
  const role = url.searchParams.get("role");
  const search = url.searchParams.get("search")?.trim();

  let query = supabaseAdmin()
    .from("users")
    .select("id,name,email,role,nis,kelas,jurusan")
    .order("name");

  if (role) query = query.eq("role", role);
  if (search) {
    query = query.or(`name.ilike.%${search}%,nis.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ data: data ?? [] });
}

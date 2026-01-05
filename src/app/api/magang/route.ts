import { NextResponse } from "next/server";
import { getApiUser, requireGuru } from "@/lib/auth/api";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const siswaId = url.searchParams.get("siswaId");
  const dudiId = url.searchParams.get("dudiId");
  const status = url.searchParams.get("status");

  const supabase = supabaseServer(token);

  let q = supabase
    .from("magang")
    .select(
      `
      id, siswa_id, guru_id, dudi_id, start_date, end_date, status, created_at, updated_at,
      dudi:dudi_id (id, name, bidang),
      siswa:siswa_id (id, name, email, role, nis, kelas, jurusan),
      guru:guru_id (id, name, email, role)
    `
    )
    .order("created_at", { ascending: false });

  // filter optional
  if (siswaId) q = q.eq("siswa_id", siswaId);
  if (dudiId) q = q.eq("dudi_id", dudiId);
  if (status) q = q.eq("status", status);

  const { data, error } = await q;

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  // RLS akan otomatis membatasi:
  // - siswa hanya lihat miliknya
  // - guru hanya lihat bimbingannya
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!requireGuru(profile.role)) {
    return NextResponse.json({ message: "Forbidden (guru only)" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);

  const siswa_id = body?.siswa_id?.toString();
  const dudi_id = body?.dudi_id?.toString();
  const start_date = body?.start_date?.toString();
  const end_date = body?.end_date?.toString();
  const status = body?.status?.toString() ?? "pending";

  if (!siswa_id || !dudi_id || !start_date || !end_date) {
    return NextResponse.json(
      { message: "siswa_id, dudi_id, start_date, end_date wajib diisi" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer(token);

  // guru_id ambil dari profile (yang login)
  const { data, error } = await supabase
    .from("magang")
    .insert([
      {
        siswa_id,
        guru_id: profile.id,
        dudi_id,
        start_date,
        end_date,
        status,
      },
    ])
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ message: "Magang created", data }, { status: 201 });
}

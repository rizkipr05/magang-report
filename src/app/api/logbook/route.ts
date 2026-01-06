import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/api";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const magangId = url.searchParams.get("magangId");
  const siswaId = url.searchParams.get("siswaId");
  const status = url.searchParams.get("status");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const supabase = supabaseAdmin();

  let q = supabase
    .from("logbooks")
    .select(
      `
      id, magang_id, siswa_id, date, activity, start_time, end_time, attachment_url,
      status, guru_note, reviewed_by, reviewed_at, created_at, updated_at,
      siswa:siswa_id (id, name, email)
    `
    )
    .order("date", { ascending: false });

  if (profile.role === "siswa") {
    q = q.eq("siswa_id", profile.id);
  } else if (profile.role === "guru") {
    if (magangId) {
      q = q.eq("magang_id", magangId);
    } else {
      const { data: magangRows } = await supabase
        .from("magang")
        .select("id")
        .eq("guru_id", profile.id);
      const magangIds = Array.isArray(magangRows) ? magangRows.map((row) => row.id) : [];
      if (magangIds.length === 0) {
        return NextResponse.json({ data: [] });
      }
      q = q.in("magang_id", magangIds);
    }
  } else {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  if (siswaId && profile.role === "guru") q = q.eq("siswa_id", siswaId);
  if (status) q = q.eq("status", status);
  if (from) q = q.gte("date", from);
  if (to) q = q.lte("date", to);

  const { data, error } = await q;

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  // RLS otomatis membatasi akses
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // hanya siswa yang create
  if (profile.role !== "siswa") {
    return NextResponse.json({ message: "Forbidden (siswa only)" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);

  const magang_id = body?.magang_id?.toString();
  const date = body?.date?.toString();
  const activity = body?.activity?.toString()?.trim();
  const start_time = body?.start_time?.toString() ?? null;
  const end_time = body?.end_time?.toString() ?? null;
  const attachment_url = body?.attachment_url?.toString() ?? null;

  if (!magang_id || !date || !activity) {
    return NextResponse.json(
      { message: "magang_id, date, activity wajib diisi" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer(token);

  const { data, error } = await supabase
    .from("logbooks")
    .insert([
      {
        magang_id,
        siswa_id: profile.id,
        date,
        activity,
        start_time,
        end_time,
        attachment_url,
        status: "draft",
      },
    ])
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ message: "Logbook created", data }, { status: 201 });
}

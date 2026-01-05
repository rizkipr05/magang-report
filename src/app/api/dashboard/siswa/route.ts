import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/api";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if (profile.role !== "siswa") {
    return NextResponse.json({ message: "Forbidden (siswa only)" }, { status: 403 });
  }

  const supabase = supabaseServer(token);

  // 1) ambil magang aktif/paling baru siswa
  const { data: magang, error: magangErr } = await supabase
    .from("magang")
    .select(
      `
      id, status, start_date, end_date,
      dudi:dudi_id (id, name, bidang),
      guru:guru_id (id, name, email)
    `
    )
    .eq("siswa_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (magangErr) {
    return NextResponse.json({ message: magangErr.message }, { status: 400 });
  }

  // Kalau belum punya magang, return minimal
  if (!magang?.id) {
    return NextResponse.json({
      data: {
        profile,
        magang: null,
        stats: {
          total_logbook: 0,
          submitted: 0,
          reviewed: 0,
          draft: 0,
          minggu_ini: 0,
        },
        last_logbooks: [],
      },
    });
  }

  const magangId = magang.id;

  // range minggu ini (Senin..Minggu) - hitung di JS (WIB)
  const now = new Date();
  const day = now.getDay(); // 0 Minggu
  const diffToMonday = (day === 0 ? -6 : 1 - day);
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const from = monday.toISOString().slice(0, 10);
  const to = sunday.toISOString().slice(0, 10);

  // 2) statistik logbook siswa (untuk magang ini)
  const [
    { count: total_logbook },
    { count: draft },
    { count: submitted },
    { count: reviewed },
    { count: rejected },
  ] = await Promise.all([
    supabase.from("logbooks").select("id", { count: "exact", head: true }).eq("magang_id", magangId),
    supabase
      .from("logbooks")
      .select("id", { count: "exact", head: true })
      .eq("magang_id", magangId)
      .eq("status", "draft"),
    supabase
      .from("logbooks")
      .select("id", { count: "exact", head: true })
      .eq("magang_id", magangId)
      .eq("status", "submitted"),
    supabase
      .from("logbooks")
      .select("id", { count: "exact", head: true })
      .eq("magang_id", magangId)
      .eq("status", "reviewed"),
    supabase
      .from("logbooks")
      .select("id", { count: "exact", head: true })
      .eq("magang_id", magangId)
      .eq("status", "rejected"),
  ]);

  // 3) jumlah logbook minggu ini
  const { count: minggu_ini } = await supabase
    .from("logbooks")
    .select("id", { count: "exact", head: true })
    .eq("magang_id", magangId)
    .gte("date", from)
    .lte("date", to);

  // 4) logbook terbaru (limit 5)
  const { data: last_logbooks, error: lastErr } = await supabase
    .from("logbooks")
    .select("id,date,activity,status,guru_note,reviewed_at,created_at")
    .eq("magang_id", magangId)
    .order("date", { ascending: false })
    .limit(5);

  if (lastErr) return NextResponse.json({ message: lastErr.message }, { status: 400 });

  return NextResponse.json({
    data: {
      profile,
      magang,
      stats: {
        total_logbook: total_logbook ?? 0,
        draft: draft ?? 0,
        submitted: submitted ?? 0,
        reviewed: reviewed ?? 0,
        rejected: rejected ?? 0,
        minggu_ini: minggu_ini ?? 0,
      },
      last_logbooks: last_logbooks ?? [],
      week_range: { from, to },
    },
  });
}

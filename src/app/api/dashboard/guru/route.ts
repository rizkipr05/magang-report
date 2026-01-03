import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/api";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if (profile.role !== "guru") {
    return NextResponse.json({ message: "Forbidden (guru only)" }, { status: 403 });
  }

  const supabase = supabaseServer(token);

  // 1) total siswa bimbingan (magang yg guru_id = guru)
  const { count: total_magang } = await supabase
    .from("magang")
    .select("id", { count: "exact", head: true })
    .eq("guru_id", profile.id);

  // 2) total magang aktif
  const { count: magang_aktif } = await supabase
    .from("magang")
    .select("id", { count: "exact", head: true })
    .eq("guru_id", profile.id)
    .eq("status", "aktif");

  // 3) logbook pending review = status submitted
  // cara aman: ambil logbook yg magang-nya dibimbing guru ini
  // (RLS juga membatasi akses)
  const { count: pending_review } = await supabase
    .from("logbooks")
    .select("id", { count: "exact", head: true })
    .eq("status", "submitted");

  // 4) list terbaru logbook submitted (limit 10) untuk guru review
  const { data: review_queue, error: qErr } = await supabase
    .from("logbooks")
    .select(
      `
      id, date, activity, status, created_at,
      siswa:siswa_id (id, name, email),
      magang:magang_id (id, dudi_id),
      dudi:magang_id ( dudi_id )
    `
    )
    .eq("status", "submitted")
    .order("date", { ascending: false })
    .limit(10);

  // jika join dudi bikin error, hapus bagian dudi:... (sama seperti sebelumnya)
  if (qErr) {
    // fallback tanpa join dudi
    const { data: fallback, error: fbErr } = await supabase
      .from("logbooks")
      .select("id,date,activity,status,created_at,siswa:siswa_id(id,name,email),magang:magang_id(id,dudi_id)")
      .eq("status", "submitted")
      .order("date", { ascending: false })
      .limit(10);

    if (fbErr) return NextResponse.json({ message: fbErr.message }, { status: 400 });

    return NextResponse.json({
      data: {
        profile,
        stats: {
          total_magang: total_magang ?? 0,
          magang_aktif: magang_aktif ?? 0,
          pending_review: pending_review ?? 0,
        },
        review_queue: fallback ?? [],
      },
    });
  }

  return NextResponse.json({
    data: {
      profile,
      stats: {
        total_magang: total_magang ?? 0,
        magang_aktif: magang_aktif ?? 0,
        pending_review: pending_review ?? 0,
      },
      review_queue: review_queue ?? [],
    },
  });
}

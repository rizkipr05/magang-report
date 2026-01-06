import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/api";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (profile.role !== "siswa") {
    return NextResponse.json({ message: "Forbidden (siswa only)" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const dudi_id = body?.dudi_id?.toString();
  const start_date = body?.start_date?.toString();
  const end_date = body?.end_date?.toString();
  const cv_url = body?.cv_url?.toString() ?? null;
  const portfolio_url = body?.portfolio_url?.toString() ?? null;

  if (!dudi_id || dudi_id === "undefined" || !start_date || !end_date) {
    return NextResponse.json(
      { message: "dudi_id, start_date, end_date wajib diisi" },
      { status: 400 }
    );
  }

  const supabase = supabaseServer(token);

  const { data: existing } = await supabase
    .from("magang")
    .select("id,status")
    .eq("siswa_id", profile.id)
    .eq("dudi_id", dudi_id)
    .in("status", ["pending", "aktif", "active", "berjalan"])
    .maybeSingle();

  if (existing?.id) {
    return NextResponse.json(
      { message: "Anda sudah mendaftar pada DUDI ini." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("magang")
    .insert([
      {
        siswa_id: profile.id,
        dudi_id,
        start_date,
        end_date,
        status: "pending",
        cv_url,
        portfolio_url,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Pendaftaran terkirim", data }, { status: 201 });
}

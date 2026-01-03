import { NextResponse } from "next/server";
import { getApiUser, requireGuru } from "@/lib/auth/api";
import { supabaseServer } from "@/lib/supabase/server";

type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseServer(token);

  const { data, error } = await supabase
    .from("magang")
    .select(
      `
      id, siswa_id, guru_id, dudi_id, start_date, end_date, status, created_at, updated_at,
      dudi:dudi_id (id, name, address, bidang),
      siswa:siswa_id (id, name, email, role),
      guru:guru_id (id, name, email, role)
    `
    )
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 404 });

  return NextResponse.json({ data });
}

export async function PUT(req: Request, { params }: Params) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!requireGuru(profile.role)) {
    return NextResponse.json({ message: "Forbidden (guru only)" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);

  const patch: Record<string, any> = {};
  if (body?.dudi_id !== undefined) patch.dudi_id = String(body.dudi_id);
  if (body?.start_date !== undefined) patch.start_date = String(body.start_date);
  if (body?.end_date !== undefined) patch.end_date = String(body.end_date);
  if (body?.status !== undefined) patch.status = String(body.status);

  const supabase = supabaseServer(token);

  const { data, error } = await supabase
    .from("magang")
    .update(patch)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ message: "Magang updated", data });
}

export async function DELETE(req: Request, { params }: Params) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!requireGuru(profile.role)) {
    return NextResponse.json({ message: "Forbidden (guru only)" }, { status: 403 });
  }

  const supabase = supabaseServer(token);

  const { error } = await supabase.from("magang").delete().eq("id", params.id);

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ message: "Magang deleted" });
}

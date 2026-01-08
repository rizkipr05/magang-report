import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/api";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";

type Params = { params: { id: string } };

export async function GET(req: Request, { params }: Params) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("logbooks")
    .select(
      "id,magang_id,siswa_id,date,activity,start_time,end_time,attachment_url,status,guru_note,reviewed_by,reviewed_at,created_at,updated_at"
    )
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 404 });

  if (profile.role === "siswa" && data?.siswa_id !== profile.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  if (profile.role === "guru") {
    const { data: magangRows } = await supabase
      .from("magang")
      .select("id")
      .eq("guru_id", profile.id);
    const magangIds = Array.isArray(magangRows) ? magangRows.map((row) => row.id) : [];
    if (magangIds.length > 0 && !magangIds.includes(data?.magang_id)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.json({ data });
}

export async function PUT(req: Request, { params }: Params) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);

  const patch: Record<string, any> = {};

  // siswa update konten
  if (profile.role === "siswa") {
    if (body?.date !== undefined) patch.date = String(body.date);
    if (body?.activity !== undefined) patch.activity = String(body.activity).trim();
    if (body?.start_time !== undefined) patch.start_time = body.start_time ? String(body.start_time) : null;
    if (body?.end_time !== undefined) patch.end_time = body.end_time ? String(body.end_time) : null;
    if (body?.attachment_url !== undefined) patch.attachment_url = body.attachment_url ? String(body.attachment_url) : null;
  }

  // guru update review fields (note/status reviewed)
  if (profile.role === "guru") {
    if (body?.guru_note !== undefined) patch.guru_note = body.guru_note ? String(body.guru_note) : null;
    if (body?.status !== undefined) patch.status = String(body.status); // set reviewed / dll
    if (patch.status === "reviewed") {
      patch.reviewed_by = profile.id;
      patch.reviewed_at = new Date().toISOString();
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ message: "Tidak ada field untuk diupdate" }, { status: 400 });
  }

  const supabase = supabaseServer(token);

  const { data, error } = await supabase
    .from("logbooks")
    .update(patch)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ message: "Logbook updated", data });
}

export async function DELETE(req: Request, { params }: Params) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // hanya siswa, hanya draft (RLS juga mengunci)
  if (profile.role !== "siswa") {
    return NextResponse.json({ message: "Forbidden (siswa only)" }, { status: 403 });
  }

  const supabase = supabaseServer(token);

  const { error } = await supabase.from("logbooks").delete().eq("id", params.id);

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ message: "Logbook deleted" });
}

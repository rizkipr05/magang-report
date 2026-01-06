import { NextResponse } from "next/server";
import { getApiUser, requireGuru } from "@/lib/auth/api";
import { supabaseServer } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  if (!id || id === "undefined") {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseServer(token);

  const { data, error } = await supabase
    .from("dudi")
    .select("id,name,address,bidang,contact_name,contact_phone,description,photo_url,created_at,updated_at")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 404 });

  return NextResponse.json({ data });
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  if (!id || id === "undefined") {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!requireGuru(profile.role)) {
    return NextResponse.json({ message: "Forbidden (guru only)" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);

  const patch: Record<string, any> = {};
  if (body?.name !== undefined) patch.name = String(body.name).trim();
  if (body?.address !== undefined) patch.address = body.address ? String(body.address).trim() : null;
  if (body?.bidang !== undefined) patch.bidang = body.bidang ? String(body.bidang).trim() : null;
  if (body?.contact_name !== undefined) patch.contact_name = body.contact_name ? String(body.contact_name).trim() : null;
  if (body?.contact_phone !== undefined) patch.contact_phone = body.contact_phone ? String(body.contact_phone).trim() : null;
  if (body?.description !== undefined)
    patch.description = body.description ? String(body.description).trim() : null;
  if (body?.photo_url !== undefined)
    patch.photo_url = body.photo_url ? String(body.photo_url).trim() : null;

  if (patch.name !== undefined && !patch.name) {
    return NextResponse.json({ message: "name tidak boleh kosong" }, { status: 400 });
  }

  const supabase = supabaseServer(token);

  const { data, error } = await supabase
    .from("dudi")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ message: "DUDI updated", data });
}

export async function DELETE(req: Request, { params }: Params) {
  const { id } = await params;
  if (!id || id === "undefined") {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (!requireGuru(profile.role)) {
    return NextResponse.json({ message: "Forbidden (guru only)" }, { status: 403 });
  }

  const supabase = supabaseServer(token);

  const { error } = await supabase.from("dudi").delete().eq("id", id);

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ message: "DUDI deleted" });
}

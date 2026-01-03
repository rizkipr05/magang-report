import { NextResponse } from "next/server";
import { getApiUser, requireGuru } from "@/lib/auth/api";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseServer(token);

  const { data, error } = await supabase
    .from("dudi")
    .select("id,name,address,bidang,contact_name,contact_phone,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

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

  const name = body?.name?.toString().trim();
  const address = body?.address?.toString().trim() ?? null;
  const bidang = body?.bidang?.toString().trim() ?? null;
  const contact_name = body?.contact_name?.toString().trim() ?? null;
  const contact_phone = body?.contact_phone?.toString().trim() ?? null;

  if (!name) {
    return NextResponse.json({ message: "name wajib diisi" }, { status: 400 });
  }

  const supabase = supabaseServer(token);

  const { data, error } = await supabase
    .from("dudi")
    .insert([{ name, address, bidang, contact_name, contact_phone }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "DUDI created", data }, { status: 201 });
}

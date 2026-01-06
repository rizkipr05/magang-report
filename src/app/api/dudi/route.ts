import { NextResponse } from "next/server";
import { getApiUser, requireGuru } from "@/lib/auth/api";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseAdmin();
  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim();

  let query = supabase.from("dudi").select("*").order("created_at", { ascending: false });
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,bidang.ilike.%${search}%,address.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return NextResponse.json({ data: items });
  }

  const dudiIds = items.map((item: any) => item.id).filter(Boolean);
  let magangRows: { dudi_id?: string | null; siswa_id?: string | null }[] = [];

  if (dudiIds.length > 0) {
    const { data: magangData } = await supabase
      .from("magang")
      .select("dudi_id, siswa_id")
      .in("dudi_id", dudiIds);
    magangRows = Array.isArray(magangData) ? magangData : [];
  }

  const filledMap = new Map<string, number>();
  const appliedSet = new Set<string>();
  for (const row of magangRows) {
    if (row?.dudi_id) {
      filledMap.set(row.dudi_id, (filledMap.get(row.dudi_id) ?? 0) + 1);
    }
    if (row?.dudi_id && row?.siswa_id && row.siswa_id === profile.id) {
      appliedSet.add(row.dudi_id);
    }
  }

  const enriched = items.map((item: any) => ({
    ...item,
    quota_filled: filledMap.get(item.id) ?? item.quota_filled ?? 0,
    is_applied: appliedSet.has(item.id) || item.is_applied || false,
  }));

  return NextResponse.json({ data: enriched });
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
  const description = body?.description?.toString().trim() ?? null;
  const photo_url = body?.photo_url?.toString().trim() ?? null;

  if (!name) {
    return NextResponse.json({ message: "name wajib diisi" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("dudi")
    .insert([{ name, address, bidang, contact_name, contact_phone, description, photo_url }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "DUDI created", data }, { status: 201 });
}

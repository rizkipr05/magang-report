import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/api";
import { supabaseAdmin } from "@/lib/supabase/server";

type Params = { params: { id: string } };

export async function POST(req: Request, { params }: Params) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const fallbackId = pathParts.length >= 2 ? pathParts[pathParts.length - 2] : "";
  const logbookId = params?.id || fallbackId;
  if (!logbookId) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const { profile, token } = await getApiUser(req);
  if (!profile || !token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if (profile.role !== "guru") {
    return NextResponse.json({ message: "Forbidden (guru only)" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const guru_note = body?.guru_note ? String(body.guru_note) : null;
  const status = body?.status ? String(body.status) : "reviewed"; 

  if (!["reviewed", "rejected", "submitted", "draft"].includes(status)) {
    return NextResponse.json({ message: "status tidak valid" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  const { data: logbookRow, error: logbookErr } = await supabase
    .from("logbooks")
    .select("id, magang_id")
    .eq("id", logbookId)
    .single();
  if (logbookErr || !logbookRow) {
    return NextResponse.json({ message: "Logbook tidak ditemukan" }, { status: 404 });
  }

  const { data: magangRow, error: magangErr } = await supabase
    .from("magang")
    .select("id, guru_id")
    .eq("id", logbookRow.magang_id)
    .single();
  if (magangErr || !magangRow) {
    return NextResponse.json({ message: "Magang tidak ditemukan" }, { status: 404 });
  }
  if (magangRow.guru_id !== profile.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("logbooks")
    .update({
      guru_note,
      status,
      reviewed_by: profile.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", logbookId)
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ message: "Logbook reviewed", data });
}

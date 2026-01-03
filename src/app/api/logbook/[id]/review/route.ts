import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/api";
import { supabaseServer } from "@/lib/supabase/server";

type Params = { params: { id: string } };

export async function POST(req: Request, { params }: Params) {
  const { profile, token } = await getApiUser(req);
  if (!profile || !token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if (profile.role !== "guru") {
    return NextResponse.json({ message: "Forbidden (guru only)" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);

  const guru_note = body?.guru_note ? String(body.guru_note) : null;
  const status = body?.status ? String(body.status) : "reviewed"; // default reviewed

  if (!["reviewed", "submitted", "draft"].includes(status)) {
    return NextResponse.json({ message: "status tidak valid" }, { status: 400 });
  }

  const supabase = supabaseServer(token);

  const { data, error } = await supabase
    .from("logbooks")
    .update({
      guru_note,
      status,
      reviewed_by: profile.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ message: "Logbook reviewed", data });
}

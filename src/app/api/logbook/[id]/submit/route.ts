import { NextResponse } from "next/server";
import { getApiUser } from "@/lib/auth/api";
import { supabaseServer } from "@/lib/supabase/server";

type Params = { params: { id: string } };

export async function POST(req: Request, { params }: Params) {
  const resolvedParams = await Promise.resolve(params as any);
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const fallbackId = pathParts.length >= 2 ? pathParts[pathParts.length - 2] : "";
  const logbookId = resolvedParams?.id || fallbackId;
  if (!logbookId || logbookId === "undefined") {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const { profile, token } = await getApiUser(req);
  if (!profile || !token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if (profile.role !== "siswa") {
    return NextResponse.json({ message: "Forbidden (siswa only)" }, { status: 403 });
  }

  const supabase = supabaseServer(token);

  const { data, error } = await supabase
    .from("logbooks")
    .update({ status: "submitted" })
    .eq("id", logbookId)
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  return NextResponse.json({ message: "Logbook submitted", data });
}

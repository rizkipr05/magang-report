import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = supabaseServer();

  const { data } = await supabase.auth.getUser();
  if (!data?.user) return NextResponse.json({ user: null }, { status: 200 });

  const { data: userRow } = await supabase
    .from("users")
    .select("id,email,role,name")
    .eq("id", data.user.id)
    .single();

  return NextResponse.json({ user: userRow ?? null });
}

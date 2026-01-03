import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const body = await req.json().catch(() => null);

  const email = body?.email?.toString().trim();
  const password = body?.password?.toString();

  if (!email || !password) {
    return NextResponse.json({ message: "Email & password wajib diisi" }, { status: 400 });
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return NextResponse.json({ message: authError?.message || "Login gagal" }, { status: 401 });
  }

  // ambil role dari table users
  const { data: userRow, error: userErr } = await supabase
    .from("users")
    .select("id,email,role,name")
    .eq("id", authData.user.id)
    .single();

  if (userErr || !userRow) {
    return NextResponse.json(
      { message: "User profile belum ada di tabel users. Buat row user dulu." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Login sukses",
    user: userRow,
    // token ini berguna kalau mau client simpan sendiri
    session: authData.session,
  });
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = supabaseAdmin();
  const body = await req.json().catch(() => null);

  const full_name = body?.full_name?.toString().trim();
  const email = body?.email?.toString().trim();
  const password = body?.password?.toString();
  const confirm_password = body?.confirm_password?.toString();

  const nis = body?.nis?.toString().trim();
  const kelas = body?.kelas?.toString().trim();
  const jurusan = body?.jurusan?.toString().trim();
  const alamat = body?.alamat?.toString().trim();
  const telepon = body?.telepon?.toString().trim();

  // ================= VALIDASI =================
  if (
    !full_name ||
    !email ||
    !password ||
    !confirm_password ||
    !nis ||
    !kelas ||
    !jurusan ||
    !alamat ||
    !telepon
  ) {
    return NextResponse.json(
      { message: "Semua field wajib diisi" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { message: "Password minimal 6 karakter" },
      { status: 400 }
    );
  }

  if (password !== confirm_password) {
    return NextResponse.json(
      { message: "Password dan konfirmasi tidak sama" },
      { status: 400 }
    );
  }

  // ================= REGISTER AUTH =================
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

  if (authError || !authData.user) {
    return NextResponse.json(
      { message: authError?.message || "Gagal register" },
      { status: 400 }
    );
  }

  // ================= INSERT PROFILE =================
  const { error: profileError } = await supabase.from("users").insert([
    {
      id: authData.user.id,
      email,
      name: full_name,
      role: "siswa", // default
      nis,
      kelas,
      jurusan,
      alamat,
      telepon,
    },
  ]);

  if (profileError) {
    return NextResponse.json(
      {
        message:
          "User auth berhasil, tapi gagal simpan profil",
        error: profileError.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "Registrasi berhasil",
      user: {
        id: authData.user.id,
        email,
        name: full_name,
        role: "siswa",
        nis,
        kelas,
        jurusan,
        alamat,
        telepon,
      },
    },
    { status: 201 }
  );
}

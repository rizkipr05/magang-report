import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
    const supabase = supabaseAdmin();
    const body = await req.json().catch(() => null);

    const full_name = body?.full_name?.toString().trim();
    const email = body?.email?.toString().trim();
    const password = body?.password?.toString();
    const confirm_password = body?.confirm_password?.toString();

    const telepon = body?.telepon?.toString().trim() || null;
    const alamat = body?.alamat?.toString().trim() || null;

    if (!full_name || !email || !password || !confirm_password) {
        return NextResponse.json({ message: "full_name, email, password, confirm_password wajib diisi" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
        return NextResponse.json({ message: "Format email tidak valid" }, { status: 400 });
    }

    if (password.length < 6) {
        return NextResponse.json({ message: "Password minimal 6 karakter" }, { status: 400 });
    }

    if (password !== confirm_password) {
        return NextResponse.json({ message: "Password dan konfirmasi tidak sama" }, { status: 400 });
    }

    // 1) Create user di Supabase Auth (ADMIN)
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // ubah false kalau mau verifikasi email
    });

    if (createErr || !created?.user) {
        return NextResponse.json(
            { message: createErr?.message || "Gagal membuat akun auth" },
            { status: 400 }
        );
    }

    const userId = created.user.id;

    // 2) Insert profile ke public.users (ADMIN bypass RLS)
    const { error: profileErr } = await supabase.from("users").insert([
        {
            id: userId,
            email,
            name: full_name,
            role: "guru",
            telepon,
            alamat,
            // field siswa dibuat null biar rapi
            nis: null,
            kelas: null,
            jurusan: null,
        },
    ]);

    if (profileErr) {
        await supabase.auth.admin.deleteUser(userId);
        return NextResponse.json(
            { message: "Gagal simpan profil guru", error: profileErr.message },
            { status: 500 }
        );
    }

    return NextResponse.json(
        {
            message: "Registrasi guru berhasil",
            user: { id: userId, email, role: "guru", name: full_name },
        },
        { status: 201 }
    );
}

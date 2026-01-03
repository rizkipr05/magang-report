import { supabaseServer } from "@/lib/supabase/server";

export type AppRole = "siswa" | "guru";

export type SessionUser = {
  id: string;
  email: string | null;
  role: AppRole;
  name?: string | null;
};

export async function getMeFromDb(userId: string) {
  const supabase = supabaseServer();

  // tabel users kamu: id (uuid), email, role, name
  const { data, error } = await supabase
    .from("users")
    .select("id,email,role,name")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id as string,
    email: (data.email ?? null) as string | null,
    role: data.role as AppRole,
    name: (data.name ?? null) as string | null,
  } satisfies SessionUser;
}

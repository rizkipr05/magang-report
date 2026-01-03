import { supabaseServer } from "@/lib/supabase/server";

export type Role = "siswa" | "guru";

export function getBearerToken(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const [type, token] = auth.split(" ");
  if (type !== "Bearer" || !token) return null;
  return token;
}

export async function getApiUser(req: Request) {
  const token = getBearerToken(req);
  if (!token) return { user: null, profile: null, token: null };

  const supabase = supabaseServer(token);

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) return { user: null, profile: null, token };

  const { data: profile } = await supabase
    .from("users")
    .select("id,email,name,role")
    .eq("id", userData.user.id)
    .single();

  return { user: userData.user, profile: profile as any, token };
}

export function requireGuru(role?: string | null) {
  return role === "guru";
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // jika akses halaman private tapi belum login (versi simple)
  // nanti kita upgrade jadi SSR session-based
  if (pathname.startsWith("/siswa") || pathname.startsWith("/guru")) {
    // allow, karena starter ini belum strict cookie check
    // (strict check kita buat saat integrasi SSR auth Supabase)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/siswa/:path*", "/guru/:path*"],
};
  
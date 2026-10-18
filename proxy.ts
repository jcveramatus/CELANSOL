import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Chequeo optimista: la autorización real (rol de staff) se valida en el
// layout del panel y en cada Server Action con requireStaff().
export async function proxy(request: NextRequest) {
  const { response, isLoggedIn } = await updateSession(request);
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!isLoggedIn && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

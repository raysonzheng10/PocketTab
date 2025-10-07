import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthenticatedSession } from "./app/utils/auth";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const authRes = await getAuthenticatedSession(req);

  //? ------ if invalid user ------
  if (!authRes) {
    // Protect /dashboard and redirect to login
    if (pathname.startsWith("/dashboard")) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    //
    if (pathname.startsWith("/api/protected")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (pathname.startsWith("/join")) {
      const groupId = req.nextUrl.searchParams.get("groupId");
      if (groupId) {
        url.pathname = "/login";
        url.searchParams.delete("groupId");
        url.searchParams.set(
          "redirectTo",
          encodeURIComponent(`/join?groupId=${groupId}`),
        );
        return NextResponse.redirect(url);
      }
    }

    //! Note this should only be '/' and '/login' and '/api' not in protected
    return NextResponse.next();
  }

  //? ------ if valid user ------
  const res = NextResponse.next();
  const { session } = authRes;

  if (session) {
    // update token in cookies if we used refresh token
    res.cookies.set("sb-access-token", session.access_token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });
  }

  // log the user in if they are in landing or login page
  if (pathname === "/" || pathname.startsWith("/login")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // All other routes: allow
  return res;
}

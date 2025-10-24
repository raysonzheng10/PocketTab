import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthenticatedSession } from "./app/utils/auth";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const { access_token, refresh_token, success } =
    await getAuthenticatedSession(req);

  //? ------ if invalid user ------
  if (!success) {
    let res: NextResponse;

    if (pathname.startsWith("/home")) {
      // Protect /dashboard and redirect to login
      url.pathname = "/login";
      res = NextResponse.redirect(url);
    } else if (pathname.startsWith("/api/protected")) {
      // block unauthorized from reaching /api/protected
      res = new NextResponse(
        JSON.stringify({
          error:
            process.env.NODE_ENV === "production"
              ? "Error accessing API, UNAUTHORIZED"
              : `UNAUTHORIZED access to ${pathname} | Token info: ${access_token} ${refresh_token}`,
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    } else if (pathname.startsWith("/join")) {
      // users need to authenticate before joining a group
      const groupId = req.nextUrl.searchParams.get("groupId");
      if (groupId) {
        url.pathname = "/login";
        url.searchParams.delete("groupId");
        url.searchParams.set(
          "redirectTo",
          encodeURIComponent(`/join?groupId=${groupId}`),
        );
        res = NextResponse.redirect(url);
      } else {
        // if no groupId, we let /join page handle the error
        res = NextResponse.next();
      }
    } else {
      //! Note this should only be '/' and '/login' and '/join (no groupId)' and '/api' not in protected
      res = NextResponse.next();
    }

    // Update tokens
    res.cookies.set("sb-access-token", "", {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 0,
    });

    res.cookies.set("sb-refresh-token", "", {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 0,
    });

    return res;
  }

  //? ------ if valid user ------
  let res: NextResponse;

  // log the user in if they are in landing or login page
  if (pathname === "/" || pathname.startsWith("/login")) {
    url.pathname = "/home";
    res = NextResponse.redirect(url);
  } else {
    // All other routes: allow
    res = NextResponse.next();
  }

  // update tokens
  if (access_token) {
    res.cookies.set("sb-access-token", access_token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60, // 1 hour
    });
  } else {
    res.cookies.delete("sb-access-token");
  }

  if (refresh_token) {
    res.cookies.set("sb-refresh-token", refresh_token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year, should constantly be getting swapped out though
    });
  } else {
    res.cookies.delete("sb-refresh-token");
  }

  return res;
}

// src/app/api/auth/setToken/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { access_token, refresh_token } = await req.json();

  if (!access_token || !refresh_token) {
    return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("sb-access-token", access_token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60 * 60, // 1 hour,
  });

  res.cookies.set("sb-refresh-token", refresh_token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days to match Supabase refresh token duration
  });

  return res;
}

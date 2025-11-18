// src/app/api/protected/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Clear tokens by setting them with maxAge 0
  res.cookies.set("sb-access-token", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 0,
  });

  // res.cookies.set("sb-refresh-token", "", {
  //   httpOnly: true,
  //   path: "/",
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  //   maxAge: 0,
  // });

  return res;
}

import { NextRequest } from "next/server";
import { getServerSupabase, supabaseClient } from "./supabaseClient";
import type { User } from "@supabase/supabase-js";

type AuthSession = {
  access_token: string | null;
  refresh_token: string | null;
  success: boolean; // determines whether was successful or not
};

export async function getAuthenticatedSession(
  req: NextRequest,
): Promise<AuthSession> {
  const access_token = req.cookies.get("sb-access-token")?.value;
  const refresh_token = req.cookies.get("sb-refresh-token")?.value;

  // No tokens available
  if (!access_token && !refresh_token) {
    return {
      access_token: null,
      refresh_token: null,
      success: false,
    };
  }

  // Try validating the access token
  const server = getServerSupabase(access_token);
  const { data: user, error } = await server.auth.getUser();

  if (!error && user) {
    console.log("Access token succeeded");
    return {
      access_token: access_token || null,
      refresh_token: refresh_token || null,
      success: true,
    };
  }

  // Access token failed, try refresh token
  if (refresh_token) {
    console.log("Access Token failed, ATTEMPTING refresh token");
    const { data, error: refreshError } =
      await supabaseClient.auth.refreshSession({
        refresh_token,
      });

    // Refresh successful - return new tokens
    if (!refreshError && data?.user && data?.session) {
      console.log("Successfully used refreshToken to reset data");
      return {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        success: true,
      };
    }
  }

  // Both access token and refresh token failed
  return {
    access_token: null,
    refresh_token: null,
    success: false,
  };
}

type AuthUser = User | null;

// can be used by API routes to get Supabase auth.user
export async function getAuthenticatedUser(
  req: NextRequest,
): Promise<AuthUser> {
  const access_token = req.cookies.get("sb-access-token")?.value;
  if (!access_token) return null;

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser(access_token);

  if (error || !user) return null;
  return user;
}

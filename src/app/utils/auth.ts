import { NextRequest } from "next/server";
import { supabaseClient } from "./supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

//! if authResult is null, that means user is not valid
//! session is only defined if we had to use the refresh token
type AuthSession = null | {
  session: Session | null;
};

export async function getAuthenticatedSession(
  req: NextRequest,
): Promise<AuthSession> {
  const access_token = req.cookies.get("sb-access-token")?.value;
  const refresh_token = req.cookies.get("sb-refresh-token")?.value;

  if (!access_token && !refresh_token) return null;

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser(access_token);

  if ((error || !user) && refresh_token) {
    const { data, error: refreshError } =
      await supabaseClient.auth.refreshSession({
        refresh_token,
      });

    console.log(data);
    if (refreshError || !data?.user || !data?.session) return null;
    return { session: data.session };
  }

  return { session: null };
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

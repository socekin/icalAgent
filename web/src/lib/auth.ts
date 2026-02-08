import { cookies } from "next/headers";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const COOKIE_NAME = "icalagent-session";
const REFRESH_COOKIE_NAME = "icalagent-refresh";

let serviceRoleClient: SupabaseClient | null = null;

/**
 * 获取 service_role 权限的 Supabase 客户端（用于管理操作）
 */
export function getServiceRoleClient(): SupabaseClient {
  if (serviceRoleClient) {
    return serviceRoleClient;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("缺少 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY 环境变量");
  }
  serviceRoleClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serviceRoleClient;
}

/**
 * 从 cookie 中获取当前登录用户信息
 * 如果 access_token 过期，会自动用 refresh_token 刷新
 */
export async function getAuthenticatedUser(): Promise<{ id: string; email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return null;
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  // 尝试用 access_token 获取用户
  const { data, error } = await supabase.auth.getUser(token);
  if (!error && data.user) {
    return { id: data.user.id, email: data.user.email ?? "" };
  }

  // access_token 过期，尝试用 refresh_token 刷新
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
  if (!refreshToken) {
    return null;
  }

  const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (refreshError || !refreshData.session || !refreshData.user) {
    return null;
  }

  // 刷新成功，更新 cookies（Server Component 中无法写 Cookie，捕获忽略）
  try {
    await setSessionCookies(refreshData.session.access_token, refreshData.session.refresh_token);
  } catch {
    // 在 Server Component 中调用时写 Cookie 会抛错，忽略即可
  }

  return { id: refreshData.user.id, email: refreshData.user.email ?? "" };
}

/**
 * 设置 session cookies（access_token + refresh_token）
 */
export async function setSessionCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set(COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 天
  });

  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 天
  });
}

/**
 * 兼容旧调用：只设置 access_token
 */
export async function setSessionCookie(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/**
 * 清除 session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  cookieStore.set(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export { COOKIE_NAME, REFRESH_COOKIE_NAME };

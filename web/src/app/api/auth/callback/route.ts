import { NextResponse } from "next/server";
import { getServiceRoleClient, setSessionCookies } from "@/lib/auth";
import { notifyTelegram } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const { accessToken, refreshToken } = await request.json();

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();

    // Verify the access token
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = data.user;

    // Set httpOnly session cookies
    await setSessionCookies(accessToken, refreshToken);

    // Check if this is a new user by looking up user_profiles
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile) {
      try {
        await notifyTelegram(`📮 新用户注册: ${user.email} (via GitHub)`);
      } catch (err) {
        console.error("[auth/callback] Telegram 通知失败:", err);
      }
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

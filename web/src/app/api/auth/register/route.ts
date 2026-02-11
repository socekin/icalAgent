import { NextResponse } from "next/server";
import { getServiceRoleClient, setSessionCookies } from "@/lib/auth";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { notifyTelegram } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, turnstileToken } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "请提供邮箱和密码" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "密码至少需要 6 个字符" }, { status: 400 });
    }

    // 人机验证
    if (!turnstileToken || !(await verifyTurnstileToken(turnstileToken))) {
      return NextResponse.json({ error: "人机验证失败，请刷新页面重试" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes("already")) {
        return NextResponse.json({ error: "该邮箱已注册" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    try {
      await notifyTelegram(`📮 新用户注册: ${email}`);
    } catch (err) {
      // 通知失败不影响注册主流程
      console.error("[register] Telegram 通知失败:", err);
    }

    // 注册成功后自动登录
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      return NextResponse.json({ error: "注册成功但自动登录失败，请手动登录" }, { status: 201 });
    }

    await setSessionCookies(signInData.session.access_token, signInData.session.refresh_token);

    return NextResponse.json({
      user: { id: data.user.id, email: data.user.email },
    }, { status: 201 });
  } catch (err) {
    console.error("[register] 注册异常:", err);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

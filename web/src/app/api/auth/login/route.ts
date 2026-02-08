import { NextResponse } from "next/server";
import { getServiceRoleClient, setSessionCookies } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "请提供邮箱和密码" }, { status: 400 });
    }

    const supabase = getServiceRoleClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: "邮箱或密码错误" }, { status: 401 });
    }

    if (!data.session) {
      return NextResponse.json({ error: "登录失败" }, { status: 500 });
    }

    // 同时保存 access_token 和 refresh_token
    await setSessionCookies(data.session.access_token, data.session.refresh_token);

    return NextResponse.json({
      user: { id: data.user.id, email: data.user.email },
    });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-keys";
import { buildFeedUrl } from "@/lib/subscription-service";
import { getAuthenticatedUser, getServiceRoleClient } from "@/lib/auth";

// 获取订阅详情 + 事件
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const supabase = getServiceRoleClient();

  // 查询订阅（确保属于当前用户）
  const { data: subscription, error: subError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .maybeSingle();

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 });
  }
  if (!subscription) {
    return NextResponse.json({ error: "订阅不存在" }, { status: 404 });
  }

  // 查询事件
  const { data: events, error: evError } = await supabase
    .from("events")
    .select("*")
    .eq("subscription_id", id)
    .order("start_at", { ascending: true });

  if (evError) {
    return NextResponse.json({ error: evError.message }, { status: 500 });
  }

  return NextResponse.json({
    subscription: {
      id: subscription.id,
      subscription_key: subscription.subscription_key,
      display_name: subscription.display_name,
      timezone: subscription.timezone,
      feed_url: buildFeedUrl(subscription.feed_token),
      updated_at: subscription.updated_at,
    },
    events: events ?? [],
  });
}

// 更新订阅 enabled 状态（Dashboard Cookie session 认证）
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;

  let body: { enabled?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "无效的请求体" }, { status: 400 });
  }

  if (typeof body.enabled !== "boolean") {
    return NextResponse.json({ error: "enabled 字段必须为布尔值" }, { status: 400 });
  }

  const supabase = getServiceRoleClient();

  // 验证订阅归属当前用户
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!subscription) {
    return NextResponse.json({ error: "订阅不存在" }, { status: 404 });
  }

  const { error } = await supabase
    .from("subscriptions")
    .update({ enabled: body.enabled })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// 删除订阅
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  // 优先尝试 cookie session 认证，失败则 fallback 到 API key 认证
  let userId: string;
  const user = await getAuthenticatedUser();
  if (user) {
    userId = user.id;
  } else {
    const auth = await authenticateRequest(request);
    if ("error" in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    userId = auth.userId;
  }

  const { id } = await params;
  const supabase = getServiceRoleClient();

  // 确保属于当前用户
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (!subscription) {
    return NextResponse.json({ error: "订阅不存在" }, { status: 404 });
  }

  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-keys";
import { createSubscriptionSchema } from "@/lib/api-schemas";
import { upsertSubscription, upsertEvents, buildFeedUrl, createSyncRun, completeSyncRun } from "@/lib/subscription-service";
import { getServiceRoleClient } from "@/lib/auth";

// 创建/更新订阅 + 写入事件
export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const raw = await request.json();
    const parsed = createSubscriptionSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "请求参数错误", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const body = parsed.data;
    const traceId = crypto.randomUUID();

    // 1. upsert 订阅
    const subscription = await upsertSubscription({
      subscriptionKey: body.subscription_key,
      displayName: body.display_name,
      domain: body.domain,
      timezone: body.timezone,
      userId: auth.userId,
    });

    // 2. 写入事件
    let eventCount = 0;
    const syncRunId = await createSyncRun(subscription.id, traceId);

    try {
      eventCount = await upsertEvents(subscription.id, body.events);
      await completeSyncRun({
        syncRunId,
        status: "success",
        insertedCount: eventCount,
      });
    } catch (err) {
      await completeSyncRun({
        syncRunId,
        status: "failed",
        errorMessage: err instanceof Error ? err.message : "未知错误",
      });
      throw err;
    }

    return NextResponse.json({
      subscription_id: subscription.id,
      feed_token: subscription.feed_token,
      feed_url: buildFeedUrl(subscription.feed_token),
      event_count: eventCount,
    }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "服务器错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// 列出当前用户的订阅
export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("id, subscription_key, display_name, domain, timezone, feed_token, updated_at")
      .eq("user_id", auth.userId)
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const subscriptions = (data ?? []).map((row: {
      id: string;
      subscription_key: string;
      display_name: string;
      domain: string | null;
      timezone: string;
      feed_token: string;
      updated_at: string;
    }) => ({
      id: row.id,
      subscription_key: row.subscription_key,
      display_name: row.display_name,
      domain: row.domain,
      timezone: row.timezone,
      feed_url: buildFeedUrl(row.feed_token),
      updated_at: row.updated_at,
    }));

    return NextResponse.json({ subscriptions });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

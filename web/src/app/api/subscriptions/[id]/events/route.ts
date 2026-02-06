import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-keys";
import { addEventsSchema } from "@/lib/api-schemas";
import { upsertEvents, createSyncRun, completeSyncRun } from "@/lib/subscription-service";
import { getServiceRoleClient } from "@/lib/auth";

// 为已有订阅追加/更新事件
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const supabase = getServiceRoleClient();

  // 确保订阅属于当前用户
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, user_id")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .maybeSingle();

  if (!subscription) {
    return NextResponse.json({ error: "订阅不存在" }, { status: 404 });
  }

  try {
    const raw = await request.json();
    const parsed = addEventsSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "请求参数错误", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const traceId = crypto.randomUUID();
    const syncRunId = await createSyncRun(id, traceId);

    try {
      const count = await upsertEvents(id, parsed.data.events);
      await completeSyncRun({
        syncRunId,
        status: "success",
        insertedCount: count,
      });

      return NextResponse.json({ event_count: count }, { status: 201 });
    } catch (err) {
      await completeSyncRun({
        syncRunId,
        status: "failed",
        errorMessage: err instanceof Error ? err.message : "未知错误",
      });
      throw err;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "服务器错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

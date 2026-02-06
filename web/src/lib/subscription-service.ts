import { createHash, randomUUID } from "node:crypto";
import { getServiceRoleClient } from "@/lib/auth";

type ToolEvent = {
  external_id: string;
  title: string;
  description?: string | null;
  start_at: string;
  end_at?: string | null;
  timezone: string;
  location?: string | null;
  status?: string;
  source_url?: string;
  confidence?: number;
  labels?: string[];
};

type DbSubscription = {
  id: string;
  subscription_key: string;
  display_name: string;
  domain: string | null;
  timezone: string;
  feed_token: string;
  user_id: string;
  sync_policy_json: Record<string, unknown>;
  updated_at: string;
};

function generateFeedToken(): string {
  return `feed_${randomUUID().replaceAll("-", "").slice(0, 24)}`;
}

export function createSourceHash(event: ToolEvent): string {
  const raw = JSON.stringify({
    title: event.title,
    start_at: event.start_at,
    end_at: event.end_at,
    timezone: event.timezone,
    location: event.location,
    source_url: event.source_url,
    confidence: event.confidence,
    labels: event.labels,
  });
  return createHash("sha256").update(raw).digest("hex");
}

export function buildFeedUrl(feedToken: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/cal/${feedToken}.ics`;
}

/**
 * 创建或更新订阅，绑定 userId
 */
export async function upsertSubscription(params: {
  subscriptionKey: string;
  displayName: string;
  domain?: string;
  timezone?: string;
  userId: string;
}): Promise<DbSubscription> {
  const supabase = getServiceRoleClient();
  const now = new Date().toISOString();

  // 查找用户已有的同 key 订阅
  const { data: existing, error: selectError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("subscription_key", params.subscriptionKey)
    .eq("user_id", params.userId)
    .maybeSingle<DbSubscription>();

  if (selectError) {
    throw new Error(`查询订阅失败: ${selectError.message}`);
  }

  const payload = {
    subscription_key: params.subscriptionKey,
    display_name: params.displayName,
    domain: params.domain?.trim().toLowerCase() || null,
    timezone: params.timezone ?? existing?.timezone ?? "UTC",
    feed_token: existing?.feed_token ?? generateFeedToken(),
    user_id: params.userId,
    sync_policy_json: existing?.sync_policy_json ?? {},
    updated_at: now,
  };

  if (!existing) {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert(payload)
      .select("*")
      .single<DbSubscription>();
    if (error || !data) {
      throw new Error(`创建订阅失败: ${error?.message ?? "未知错误"}`);
    }
    return data;
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .update(payload)
    .eq("id", existing.id)
    .select("*")
    .single<DbSubscription>();
  if (error || !data) {
    throw new Error(`更新订阅失败: ${error?.message ?? "未知错误"}`);
  }
  return data;
}

/**
 * 批量写入事件（upsert）
 */
export async function upsertEvents(subscriptionId: string, events: ToolEvent[]): Promise<number> {
  if (!events.length) {
    return 0;
  }
  const supabase = getServiceRoleClient();
  const rows = events.map((event) => ({
    subscription_id: subscriptionId,
    external_id: event.external_id,
    title: event.title,
    description: event.description || null,
    start_at: new Date(event.start_at).toISOString(),
    end_at: event.end_at ? new Date(event.end_at).toISOString() : null,
    timezone: event.timezone,
    location: event.location || null,
    status: event.status || "scheduled",
    source_url: event.source_url || "",
    source_hash: createSourceHash(event),
    confidence: event.confidence ?? 0.8,
    labels_json: event.labels ?? [],
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("events")
    .upsert(rows, { onConflict: "subscription_id,external_id" });

  if (error) {
    throw new Error(`写入事件失败: ${error.message}`);
  }
  return rows.length;
}

/**
 * 创建同步记录
 */
export async function createSyncRun(subscriptionId: string, traceId: string): Promise<string> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("sync_runs")
    .insert({
      subscription_id: subscriptionId,
      trace_id: traceId,
      run_status: "running",
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single<{ id: string }>();
  if (error || !data) {
    throw new Error(`创建同步记录失败: ${error?.message ?? "未知错误"}`);
  }
  return data.id;
}

/**
 * 完成同步记录
 */
export async function completeSyncRun(params: {
  syncRunId: string;
  status: "success" | "failed";
  insertedCount?: number;
  updatedCount?: number;
  skippedCount?: number;
  errorMessage?: string;
}): Promise<void> {
  const supabase = getServiceRoleClient();
  const { error } = await supabase
    .from("sync_runs")
    .update({
      run_status: params.status,
      inserted_count: params.insertedCount ?? 0,
      updated_count: params.updatedCount ?? 0,
      skipped_count: params.skippedCount ?? 0,
      error_message: params.errorMessage ?? null,
      finished_at: new Date().toISOString(),
    })
    .eq("id", params.syncRunId);

  if (error) {
    throw new Error(`更新同步记录失败: ${error.message}`);
  }
}

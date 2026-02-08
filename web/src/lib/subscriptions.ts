import {
  demoSubscriptions,
  demoEventsBySubscription,
  getEventsBySubscriptionId as getMockEventsBySubscriptionId,
  getSubscriptionByFeedToken as getMockSubscriptionByFeedToken,
  getSubscriptionById as getMockSubscriptionById,
} from "@/lib/mock-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import type { CalendarDomain, CalendarEvent, CalendarEventWithSub, Subscription } from "@/lib/types";

type DbSubscriptionRow = {
  id: string;
  subscription_key: string;
  display_name: string;
  domain: string | null;
  timezone: string;
  feed_token: string;
  updated_at: string;
};

type DbEventRow = {
  id: string;
  subscription_id: string;
  external_id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  timezone: string;
  location: string | null;
  status: "scheduled" | "cancelled" | "postponed";
  source_url: string;
  confidence: number;
  labels_json: unknown;
};

function normalizeDomain(domain: string | null): CalendarDomain {
  const normalized = domain?.trim();
  if (!normalized) {
    return "general";
  }
  return normalized.toLowerCase();
}

function toSubscription(row: DbSubscriptionRow): Subscription {
  return {
    id: row.id,
    subscriptionKey: row.subscription_key,
    displayName: row.display_name,
    domain: normalizeDomain(row.domain),
    timezone: row.timezone,
    feedToken: row.feed_token,
    updatedAt: row.updated_at,
  };
}

function toCalendarEvent(row: DbEventRow): CalendarEvent {
  const labels = Array.isArray(row.labels_json)
    ? row.labels_json.filter((item): item is string => typeof item === "string")
    : [];

  return {
    id: row.id,
    subscriptionId: row.subscription_id,
    externalId: row.external_id,
    title: row.title,
    description: row.description ?? undefined,
    startAt: row.start_at,
    endAt: row.end_at ?? undefined,
    timezone: row.timezone,
    location: row.location ?? undefined,
    status: row.status,
    sourceUrl: row.source_url,
    confidence: Number(row.confidence),
    labels,
  };
}

function shouldUseMockFallback() {
  return getSupabaseServerClient() === null;
}

export async function listSubscriptions(userId?: string): Promise<Subscription[]> {
  if (shouldUseMockFallback()) {
    return demoSubscriptions;
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return demoSubscriptions;
  }

  let query = supabase
    .from("subscriptions")
    .select("id,subscription_key,display_name,domain,timezone,feed_token,updated_at")
    .order("updated_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.returns<DbSubscriptionRow[]>();

  if (error) {
    throw new Error(`读取订阅列表失败: ${error.message}`);
  }
  return (data ?? []).map(toSubscription);
}

export async function getSubscriptionById(
  id: string,
  userId?: string,
): Promise<Subscription | undefined> {
  if (shouldUseMockFallback()) {
    return getMockSubscriptionById(id);
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return getMockSubscriptionById(id);
  }

  let query = supabase
    .from("subscriptions")
    .select("id,subscription_key,display_name,domain,timezone,feed_token,updated_at")
    .eq("id", id);

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query.maybeSingle<DbSubscriptionRow>();

  if (error) {
    throw new Error(`读取订阅失败: ${error.message}`);
  }
  return data ? toSubscription(data) : undefined;
}

export async function getSubscriptionByFeedToken(
  feedToken: string,
): Promise<Subscription | undefined> {
  if (shouldUseMockFallback()) {
    return getMockSubscriptionByFeedToken(feedToken);
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return getMockSubscriptionByFeedToken(feedToken);
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("id,subscription_key,display_name,domain,timezone,feed_token,updated_at")
    .eq("feed_token", feedToken)
    .maybeSingle<DbSubscriptionRow>();

  if (error) {
    throw new Error(`读取订阅失败: ${error.message}`);
  }
  return data ? toSubscription(data) : undefined;
}

export async function getEventsBySubscriptionId(
  subscriptionId: string,
): Promise<CalendarEvent[]> {
  if (shouldUseMockFallback()) {
    return getMockEventsBySubscriptionId(subscriptionId);
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return getMockEventsBySubscriptionId(subscriptionId);
  }

  const { data, error } = await supabase
    .from("events")
    .select(
      "id,subscription_id,external_id,title,description,start_at,end_at,timezone,location,status,source_url,confidence,labels_json",
    )
    .eq("subscription_id", subscriptionId)
    .order("start_at", { ascending: true })
    .returns<DbEventRow[]>();

  if (error) {
    throw new Error(`读取事件失败: ${error.message}`);
  }
  return (data ?? []).map(toCalendarEvent);
}

// --- Master Feed (总体订阅) ---

function generateMasterToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "mf_";
  for (let i = 0; i < 24; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * 获取或创建用户的 master feed token
 * 如果 user_profiles 表不存在则返回 null（优雅降级）
 */
export async function getOrCreateMasterFeedToken(userId: string): Promise<string | null> {
  if (shouldUseMockFallback()) {
    return "mock_master_feed_token";
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return "mock_master_feed_token";
  }

  // 先查询已有记录
  const { data: existing, error: selectError } = await supabase
    .from("user_profiles")
    .select("master_feed_token")
    .eq("user_id", userId)
    .maybeSingle<{ master_feed_token: string }>();

  // 表不存在等情况，优雅降级
  if (selectError) {
    console.warn("[master-feed] 查询 user_profiles 失败，跳过:", selectError.message);
    return null;
  }

  if (existing) {
    return existing.master_feed_token;
  }

  // 不存在则创建
  const token = generateMasterToken();
  const { error } = await supabase
    .from("user_profiles")
    .insert({ user_id: userId, master_feed_token: token });

  if (error) {
    console.warn("[master-feed] 创建 master feed token 失败，跳过:", error.message);
    return null;
  }
  return token;
}

/**
 * 通过 master feed token 反查 user_id
 */
export async function getUserIdByMasterFeedToken(token: string): Promise<string | null> {
  if (shouldUseMockFallback()) {
    return null;
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("user_id")
    .eq("master_feed_token", token)
    .maybeSingle<{ user_id: string }>();

  if (error) {
    console.warn("[master-feed] 查询 master feed token 失败:", error.message);
    return null;
  }
  return data?.user_id ?? null;
}

/**
 * 获取用户所有订阅的全部事件（带订阅信息）
 */
export async function getAllEventsForUser(userId: string): Promise<{
  subscriptions: Subscription[];
  events: CalendarEventWithSub[];
}> {
  const subscriptions = await listSubscriptions(userId);
  if (subscriptions.length === 0) {
    return { subscriptions, events: [] };
  }

  // Mock fallback
  if (shouldUseMockFallback()) {
    const allEvents: CalendarEventWithSub[] = [];
    for (const sub of subscriptions) {
      const subEvents = demoEventsBySubscription[sub.id] ?? [];
      for (const evt of subEvents) {
        allEvents.push({
          ...evt,
          subscriptionName: sub.displayName,
          subscriptionDomain: sub.domain,
        });
      }
    }
    allEvents.sort((a, b) => a.startAt.localeCompare(b.startAt));
    return { subscriptions, events: allEvents };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { subscriptions, events: [] };
  }

  const subIds = subscriptions.map((s) => s.id);
  const subMap = new Map(subscriptions.map((s) => [s.id, s]));

  const { data, error } = await supabase
    .from("events")
    .select(
      "id,subscription_id,external_id,title,description,start_at,end_at,timezone,location,status,source_url,confidence,labels_json",
    )
    .in("subscription_id", subIds)
    .order("start_at", { ascending: true })
    .returns<DbEventRow[]>();

  if (error) {
    throw new Error(`读取用户全部事件失败: ${error.message}`);
  }

  const events: CalendarEventWithSub[] = (data ?? []).map((row) => {
    const base = toCalendarEvent(row);
    const sub = subMap.get(row.subscription_id);
    return {
      ...base,
      subscriptionName: sub?.displayName ?? "未知订阅",
      subscriptionDomain: sub?.domain ?? "general",
    };
  });

  return { subscriptions, events };
}

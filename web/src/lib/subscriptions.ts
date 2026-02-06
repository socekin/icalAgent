import {
  demoSubscriptions,
  getEventsBySubscriptionId as getMockEventsBySubscriptionId,
  getSubscriptionByFeedToken as getMockSubscriptionByFeedToken,
  getSubscriptionById as getMockSubscriptionById,
} from "@/lib/mock-data";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import type { CalendarDomain, CalendarEvent, Subscription } from "@/lib/types";

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

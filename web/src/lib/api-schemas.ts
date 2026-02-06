import { z } from "zod";

export const eventSchema = z.object({
  external_id: z.string().min(1, "external_id 不能为空"),
  title: z.string().min(1, "title 不能为空"),
  description: z.string().nullish(),
  start_at: z.string().min(1, "start_at 不能为空"),
  end_at: z.string().nullish(),
  timezone: z.string().default("UTC"),
  location: z.string().nullish(),
  status: z.enum(["scheduled", "cancelled", "postponed"]).default("scheduled"),
  source_url: z.string().default(""),
  confidence: z.number().min(0).max(1).default(0.8),
  labels: z.array(z.string()).default([]),
});

export const createSubscriptionSchema = z.object({
  subscription_key: z.string().min(1, "subscription_key 不能为空"),
  display_name: z.string().min(1, "display_name 不能为空"),
  domain: z.string().optional(),
  timezone: z.string().default("UTC"),
  events: z.array(eventSchema).default([]),
});

export const addEventsSchema = z.object({
  events: z.array(eventSchema).min(1, "至少需要一个事件"),
});

export type Subscription = {
  id: string;
  subscriptionKey: string;
  displayName: string;
  timezone: string;
  feedToken: string;
  updatedAt: string;
  enabled: boolean;
};

export type CalendarEvent = {
  id: string;
  subscriptionId: string;
  externalId: string;
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  timezone: string;
  location?: string;
  status: "scheduled" | "cancelled" | "postponed";
  sourceUrl: string;
  labels: string[];
};

export type User = {
  id: string;
  email: string;
};

export type ApiKey = {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

export type ApiKeyCreateResponse = {
  id: string;
  name: string;
  key: string;
  keyPrefix: string;
  createdAt: string;
};

// 事件 + 所属订阅信息（用于合并日历视图）
export type CalendarEventWithSub = CalendarEvent & {
  subscriptionName: string;
};

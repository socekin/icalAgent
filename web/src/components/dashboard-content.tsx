"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

import { CalendarView } from "@/components/calendar-view";
import { MasterFeedCard } from "@/components/master-feed-card";
import { SubscriptionCard } from "@/components/subscription-card";
import { SubscriptionFilter } from "@/components/subscription-filter";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CalendarEventWithSub, Subscription } from "@/lib/types";

type DashboardContentProps = {
  subscriptions: Subscription[];
  allEvents: CalendarEventWithSub[];
  masterFeedUrl: string | null;
};

export function DashboardContent({
  subscriptions,
  allEvents,
  masterFeedUrl,
}: DashboardContentProps) {
  // 过滤器状态：默认全选
  const [selectedSubIds, setSelectedSubIds] = useState<Set<string>>(
    () => new Set(subscriptions.map((s) => s.id)),
  );

  // 搜索状态
  const [searchQuery, setSearchQuery] = useState("");

  // 按选中订阅过滤事件
  const filteredEvents = useMemo(
    () => allEvents.filter((e) => selectedSubIds.has(e.subscriptionId)),
    [allEvents, selectedSubIds],
  );

  // 按搜索词过滤订阅卡片
  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery.trim()) return subscriptions;
    const q = searchQuery.toLowerCase();
    return subscriptions.filter(
      (s) =>
        s.displayName.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q) ||
        s.subscriptionKey.toLowerCase().includes(q),
    );
  }, [subscriptions, searchQuery]);

  return (
    <Tabs defaultValue="calendar">
      <TabsList variant="line">
        <TabsTrigger value="calendar">日历预览</TabsTrigger>
        <TabsTrigger value="subscriptions">
          我的订阅({subscriptions.length})
        </TabsTrigger>
      </TabsList>

      {/* Tab 1: 日历预览 */}
      <TabsContent value="calendar" className="space-y-4 pt-4">
        {masterFeedUrl && <MasterFeedCard feedUrl={masterFeedUrl} />}

        <SubscriptionFilter
          subscriptions={subscriptions}
          selected={selectedSubIds}
          onSelectionChange={setSelectedSubIds}
        />

        <CalendarView events={filteredEvents} />
      </TabsContent>

      {/* Tab 2: 我的订阅 */}
      <TabsContent value="subscriptions" className="space-y-4 pt-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="搜索订阅..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {filteredSubscriptions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center">
            <p className="text-sm text-zinc-500">没有匹配的订阅</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

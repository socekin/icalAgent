"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { CalendarView } from "@/components/calendar-view";
import { MasterFeedCard } from "@/components/master-feed-card";
import { SubscriptionCard } from "@/components/subscription-card";
import { SubscriptionFilter } from "@/components/subscription-filter";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { CalendarEventWithSub, Subscription } from "@/lib/types";
import type { Locale } from "@/i18n/types";
import { t } from "@/i18n";


type DashboardContentProps = {
  subscriptions: Subscription[];
  allEvents: CalendarEventWithSub[];
  masterFeedUrl: string | null;
  locale: Locale;
};

export function DashboardContent({
  subscriptions,
  allEvents,
  masterFeedUrl,
  locale,
}: DashboardContentProps) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    () => searchParams.get("tab") === "subscriptions" ? "subscriptions" : "calendar",
  );

  const [selectedSubIds, setSelectedSubIds] = useState<Set<string>>(
    () => new Set(subscriptions.filter((s) => s.enabled).map((s) => s.id)),
  );

  const handleToggle = useCallback((id: string, enabled: boolean) => {
    setSelectedSubIds((prev) => {
      const next = new Set(prev);
      if (enabled) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const filteredEvents = useMemo(
    () => allEvents.filter((e) => selectedSubIds.has(e.subscriptionId)),
    [allEvents, selectedSubIds],
  );

  const filteredSubscriptions = useMemo(() => {
    if (!searchQuery.trim()) return subscriptions;
    const q = searchQuery.toLowerCase();
    return subscriptions.filter(
      (s) =>
        s.displayName.toLowerCase().includes(q) ||
        s.subscriptionKey.toLowerCase().includes(q),
    );
  }, [subscriptions, searchQuery]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex items-center gap-3 pb-0 h-10">
        <TabsList className="h-9 rounded-full bg-zinc-100 p-1">
          <TabsTrigger
            value="calendar"
            className="rounded-full px-4 py-1 text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            {t(locale, "dashboard.tab.calendar")}
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="rounded-full px-4 py-1 text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            {t(locale, "dashboard.tab.subscriptions")} ({subscriptions.length})
          </TabsTrigger>
        </TabsList>

        {activeTab === "subscriptions" && (
          <div
            className={cn(
              "relative flex items-center transition-all duration-300 ease-in-out",
              isSearchExpanded ? "w-48 sm:w-64" : "w-8"
            )}
          >
            <div
              className={cn(
                "absolute left-0 flex items-center overflow-hidden rounded-full bg-zinc-100 transition-all duration-300",
                isSearchExpanded ? "w-full border border-zinc-200" : "w-8 h-8 justify-center bg-transparent hover:bg-zinc-100"
              )}
            >
              {!isSearchExpanded ? (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  className="flex h-8 w-8 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900"
                >
                  <Search className="h-4 w-4" />
                </button>
              ) : (
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <Input
                    autoFocus
                    placeholder={t(locale, "dashboard.search.placeholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      if (!searchQuery) setIsSearchExpanded(false);
                    }}
                    className="h-8 w-full border-none bg-transparent pl-9 pr-8 text-xs focus-visible:ring-0"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      <span className="sr-only">Clear</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <TabsContent value="calendar" className="mt-4 space-y-4 animate-in fade-in duration-500">
        {masterFeedUrl && <MasterFeedCard feedUrl={masterFeedUrl} locale={locale} />}

        <div className="mt-0">
          <CalendarView
            events={filteredEvents}
            locale={locale}
            actions={
              <div className="w-full sm:w-auto">
                <SubscriptionFilter
                  subscriptions={subscriptions}
                  selected={selectedSubIds}
                  onToggle={handleToggle}
                  locale={locale}
                />
              </div>
            }
          />
        </div>
      </TabsContent>

      <TabsContent value="subscriptions" className="mt-4 space-y-4 animate-in fade-in duration-500">
        {filteredSubscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 py-20">
            <p className="text-sm font-medium text-zinc-500">
              {searchQuery ? t(locale, "dashboard.search.noMatch") : t(locale, "dashboard.search.empty")}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                locale={locale}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

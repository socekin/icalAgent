import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Link2 } from "lucide-react";

import { CalendarView } from "@/components/calendar-view";
import { EventTable } from "@/components/event-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getEventsBySubscriptionId,
  getSubscriptionById,
} from "@/lib/subscriptions";

type SubscriptionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function SubscriptionDetailPage({
  params,
}: SubscriptionDetailPageProps) {
  const { id } = await params;
  const subscription = await getSubscriptionById(id);

  if (!subscription) {
    notFound();
  }

  const events = await getEventsBySubscriptionId(subscription.id);
  const feedUrl = `/cal/${subscription.feedToken}.ics`;

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-6">
      {/* 头部：返回 + 标题 + 简要信息 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-zinc-500">
            <Button asChild variant="ghost" size="icon" className="h-6 w-6 -ml-1 text-zinc-500 hover:text-zinc-900">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <span className="text-xs font-medium">子日历详情</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 ml-7">{subscription.displayName}</h1>
        </div>

        {/* 紧凑的统计信息 */}
        <div className="flex items-center gap-4 ml-7 sm:ml-0 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium text-zinc-700">{subscription.timezone}</span>
          </div>
          <div className="h-3 w-px bg-zinc-200" />
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-zinc-700">{events.length}</span>
            <span>Events</span>
          </div>
          <div className="h-3 w-px bg-zinc-200" />
          <div className="flex items-center gap-1.5">
            <span>Updated</span>
            <span className="font-medium text-zinc-700">{new Date(subscription.updatedAt).toLocaleDateString("zh-CN")}</span>
          </div>
        </div>
      </div>

      {/* Feed URL Banner */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between mx-1">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-100">
            <Link2 className="h-4 w-4 text-zinc-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">订阅链接</h3>
            <p className="text-[10px] text-zinc-500">
              iCal Feed URL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-medium text-zinc-600 shadow-sm ring-1 ring-zinc-100 sm:w-64 sm:flex-none">
            {feedUrl}
          </code>
          <Button asChild size="sm" variant="outline" className="h-7 shrink-0 rounded-lg px-2.5 text-xs shadow-sm hover:bg-white hover:text-zinc-900">
            <a href={feedUrl} target="_blank" rel="noreferrer">
              打开
            </a>
          </Button>
        </div>
      </div>

      {/* 日历预览 */}
      {events.length > 0 && (
        <section className="space-y-3">
          <h2 className="ml-1 text-sm font-semibold text-zinc-900">日历预览</h2>
          <CalendarView
            events={events}
            singleDomain={subscription.domain}
            subscriptionName={subscription.displayName}
          />
        </section>
      )}

      {/* 事件列表 */}
      <section className="space-y-3">
        <h2 className="ml-1 text-sm font-semibold text-zinc-900">事件列表 ({events.length})</h2>
        <EventTable events={events} />
      </section>
    </div>
  );
}

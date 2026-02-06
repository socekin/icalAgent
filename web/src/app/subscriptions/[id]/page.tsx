import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Link2 } from "lucide-react";

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
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button asChild variant="ghost" className="pl-0 text-zinc-600 hover:bg-transparent">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            返回订阅列表
          </Link>
        </Button>
      </div>

      <Card className="border-zinc-300 shadow-none">
        <CardHeader className="gap-2">
          <CardTitle className="text-2xl">{subscription.displayName}</CardTitle>
          <p className="text-sm text-zinc-600">该页面展示当前订阅在数据库中的真实事件。</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 rounded-xl border border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-700 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-zinc-500">Timezone</p>
              <p className="font-medium">{subscription.timezone}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-500">Events</p>
              <p className="font-medium">{events.length}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-zinc-500">Last Update</p>
              <p className="font-medium">
                {new Date(subscription.updatedAt).toLocaleString("zh-CN")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-300 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">iCal Feed URL</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <code className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700">
                {feedUrl}
              </code>
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <a href={feedUrl} target="_blank" rel="noreferrer">
                  <Link2 className="h-4 w-4" />
                  打开 .ics
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="mt-6">
        <EventTable events={events} />
      </section>
    </main>
  );
}

import Link from "next/link";
import { CalendarDays, ChevronRight, Rss } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Subscription } from "@/lib/types";

const domainLabelMap: Record<string, string> = {
  sports: "体育",
  entertainment: "影视",
  weather: "天气",
  general: "通用",
};

function getDomainLabel(domain: string): string {
  const normalized = domain.trim().toLowerCase();
  if (!normalized) {
    return "通用";
  }
  return domainLabelMap[normalized] ?? normalized.toUpperCase();
}

export function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  return (
    <Card className="h-full border-zinc-300/80 shadow-none transition hover:border-zinc-900">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="font-medium tracking-wide text-zinc-700">
            {getDomainLabel(subscription.domain)}
          </Badge>
          <div className="inline-flex items-center gap-1 text-xs text-zinc-500">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(subscription.updatedAt).toLocaleString("zh-CN")}
          </div>
        </div>
        <CardTitle className="pt-2 text-xl">{subscription.displayName}</CardTitle>
        <CardDescription className="text-zinc-500">
          key: <span className="font-mono">{subscription.subscriptionKey}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-600">时区：{subscription.timezone}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-sm text-zinc-500">
          <Rss className="h-4 w-4" />
          /cal/{subscription.feedToken}.ics
        </div>
        <Button asChild size="sm" className="rounded-full">
          <Link href={`/subscriptions/${subscription.id}`}>
            查看详情
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

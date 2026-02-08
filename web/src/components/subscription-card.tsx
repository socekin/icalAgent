import Link from "next/link";
import { CalendarDays, ChevronRight, Globe2, Rss } from "lucide-react";

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
    <Card className="h-full border-border shadow-xs transition-all hover:border-black">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="px-2 py-0.5 font-medium tracking-wide text-zinc-900 bg-zinc-100">
            {getDomainLabel(subscription.domain)}
          </Badge>
          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400">
            <CalendarDays className="h-3 w-3" />
            {new Date(subscription.updatedAt).toLocaleDateString("zh-CN")}
          </div>
        </div>
        <CardTitle className="pt-2 text-lg font-semibold tracking-tight">{subscription.displayName}</CardTitle>
        <CardDescription className="text-zinc-500 text-xs">
          key: <span className="font-mono bg-zinc-50 px-1 rounded">{subscription.subscriptionKey}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <Globe2 className="h-3.5 w-3.5 text-zinc-400" />
          <span>时区：{subscription.timezone}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-border pt-4">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500">
          <Rss className="h-3.5 w-3.5" />
          <span className="truncate max-w-[120px]">/cal/{subscription.feedToken}.ics</span>
        </div>
        <Button asChild size="sm" className="rounded-md">
          <Link href={`/dashboard/subscriptions/${subscription.id}`}>
            查看详情
            <ChevronRight className="h-3 w-3 ml-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

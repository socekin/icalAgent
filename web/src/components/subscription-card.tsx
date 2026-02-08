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

import { cn } from "@/lib/utils";

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
    <Card className="group relative overflow-hidden rounded-2xl border-zinc-100 bg-white transition-all duration-300 hover:border-zinc-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="rounded-md bg-zinc-100 px-2 py-0 text-[10px] font-bold tracking-tight text-zinc-900">
            {subscription.domain.toUpperCase()}
          </Badge>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
        <CardTitle className="mt-2 text-base font-bold tracking-tight text-zinc-950 truncate">
          {subscription.displayName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 px-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center text-[11px] text-zinc-500">
            <span className="w-14 shrink-0 font-medium text-zinc-400">Key</span>
            <code className="font-mono text-zinc-700 truncate">{subscription.subscriptionKey}</code>
          </div>
          <div className="flex items-center text-[11px] text-zinc-500">
            <span className="w-14 shrink-0 font-medium text-zinc-400">Timezone</span>
            <span className="truncate">{subscription.timezone}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t border-zinc-50 bg-zinc-50/50 px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
          <div className="h-1 w-1 rounded-full bg-zinc-300" />
          <span>Sync 2m ago</span>
        </div>
        <Link
          href={`/dashboard/subscriptions/${subscription.id}`}
          className="flex items-center gap-0.5 text-[10px] font-bold text-zinc-900 transition-colors hover:text-zinc-600"
        >
          详情
          <ChevronRight className="h-2.5 w-2.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}

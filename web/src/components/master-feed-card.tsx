"use client";

import { useState } from "react";
import { Check, Copy, Rss } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MasterFeedCard({ feedUrl }: { feedUrl: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const fullUrl = `${window.location.origin}${feedUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-100">
          <Rss className="h-4 w-4 text-zinc-500" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">所有日历</h3>
          <p className="text-[10px] text-zinc-500">
            在日历应用中添加此链接即可查看所有事件
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-medium text-zinc-600 shadow-sm ring-1 ring-zinc-100 sm:w-64 sm:flex-none">
          {feedUrl}
        </code>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="h-7 shrink-0 rounded-lg px-2.5 text-xs shadow-sm hover:bg-white hover:text-zinc-900"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              复制
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

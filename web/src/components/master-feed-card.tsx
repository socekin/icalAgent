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
    <Card className="border-zinc-300 shadow-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Rss className="h-4 w-4 text-zinc-500" />
          <CardTitle className="text-base">总体订阅</CardTitle>
        </div>
        <CardDescription>
          一个链接订阅全部日历，在 Apple Calendar / Google Calendar 中添加即可看到所有事件
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 truncate rounded-md bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700">
            {feedUrl}
          </code>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="shrink-0 rounded-full"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                已复制
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                复制链接
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

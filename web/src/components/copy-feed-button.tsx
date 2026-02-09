"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyFeedButton({ feedUrl }: { feedUrl: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const fullUrl = `${window.location.origin}${feedUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
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
  );
}

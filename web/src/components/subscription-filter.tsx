"use client";

import { useState } from "react";
import { Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getSubscriptionColor } from "@/components/calendar-view";
import { cn } from "@/lib/utils";
import type { Subscription } from "@/lib/types";

type SubscriptionFilterProps = {
  subscriptions: Subscription[];
  selected: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
};

export function SubscriptionFilter({
  subscriptions,
  selected,
  onSelectionChange,
}: SubscriptionFilterProps) {
  const [search, setSearch] = useState("");

  const allSelected = selected.size === subscriptions.length;
  const noneSelected = selected.size === 0;

  const filtered = subscriptions.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.displayName.toLowerCase().includes(q);
  });

  function toggleAll() {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(subscriptions.map((s) => s.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  }

  // 触发按钮的标签文案
  const label = noneSelected
    ? "筛选日历"
    : allSelected
      ? "全部日历"
      : `已选 ${selected.size}/${subscriptions.length}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          <Filter className="h-3.5 w-3.5" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-0">
        {/* 搜索栏 */}
        <div className="border-b border-zinc-200 p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="搜索日历..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>

        {/* 全选/取消 */}
        {!search.trim() && (
          <button
            type="button"
            onClick={toggleAll}
            className="flex w-full items-center gap-2.5 border-b border-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <Checkbox
              checked={allSelected}
              onCheckedChange={toggleAll}
              className="pointer-events-none"
            />
            全部
          </button>
        )}

        {/* 订阅列表 */}
        <div className="max-h-60 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs text-zinc-400">
              无匹配结果
            </p>
          ) : (
            filtered.map((sub) => {
              const active = selected.has(sub.id);
              const color = getSubscriptionColor(sub.displayName);

              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => toggleOne(sub.id)}
                  className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs hover:bg-zinc-50"
                >
                  <Checkbox
                    checked={active}
                    onCheckedChange={() => toggleOne(sub.id)}
                    className="pointer-events-none"
                  />
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      active ? color.dot : "bg-zinc-300",
                    )}
                  />
                  <span
                    className={cn(
                      "truncate",
                      active ? "text-zinc-900" : "text-zinc-400",
                    )}
                  >
                    {sub.displayName}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

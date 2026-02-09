"use client";

import { useState, useCallback, useRef } from "react";
import { Filter, Search, Check } from "lucide-react";

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
  onToggle: (id: string, enabled: boolean) => void;
};

export function SubscriptionFilter({
  subscriptions,
  selected,
  onToggle,
}: SubscriptionFilterProps) {
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const allSelected = selected.size === subscriptions.length;
  const noneSelected = selected.size === 0;

  const filtered = subscriptions.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.displayName.toLowerCase().includes(q);
  });

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }, []);

  async function persistToggle(id: string, enabled: boolean) {
    setSavingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) {
        // 失败回滚
        onToggle(id, !enabled);
        showToast("保存失败，请重试");
        return;
      }
      showToast("已保存，订阅将即时生效");
    } catch {
      onToggle(id, !enabled);
      showToast("网络错误，请重试");
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  function toggleOne(id: string) {
    const newEnabled = !selected.has(id);
    onToggle(id, newEnabled);
    persistToggle(id, newEnabled);
  }

  async function toggleAll() {
    if (allSelected) {
      // 全部取消
      for (const sub of subscriptions) {
        if (selected.has(sub.id)) {
          onToggle(sub.id, false);
          persistToggle(sub.id, false);
        }
      }
    } else {
      // 全选
      for (const sub of subscriptions) {
        if (!selected.has(sub.id)) {
          onToggle(sub.id, true);
          persistToggle(sub.id, true);
        }
      }
    }
  }

  // 触发按钮的标签文案
  const label = noneSelected
    ? "筛选日历"
    : allSelected
      ? "全部日历"
      : `已选 ${selected.size}/${subscriptions.length}`;

  return (
    <>
      {/* 浮动提示 */}
      {toast && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs text-white shadow-lg">
            <Check className="h-3.5 w-3.5" />
            {toast}
          </div>
        </div>
      )}

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
            <div
              role="option"
              aria-selected={allSelected}
              onClick={toggleAll}
              className="flex w-full cursor-pointer items-center gap-2.5 border-b border-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <Checkbox
                checked={allSelected}
                onCheckedChange={toggleAll}
              />
              全部
            </div>
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
                const saving = savingIds.has(sub.id);
                const color = getSubscriptionColor(sub.displayName);

                return (
                  <div
                    key={sub.id}
                    role="option"
                    aria-selected={active}
                    onClick={() => !saving && toggleOne(sub.id)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2.5 px-3 py-1.5 text-xs hover:bg-zinc-50",
                      saving && "pointer-events-none opacity-50",
                    )}
                  >
                    <Checkbox
                      checked={active}
                      onCheckedChange={() => toggleOne(sub.id)}
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
                  </div>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

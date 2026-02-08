"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalendarEvent, CalendarEventWithSub } from "@/lib/types";

// 订阅颜色调色板（按名称哈希分配）
const colorPalette = [
  { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  { bg: "bg-pink-50", text: "text-pink-700", dot: "bg-pink-500" },
  { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500" },
  { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
];

const defaultColor = { bg: "bg-zinc-100", text: "text-zinc-700", dot: "bg-zinc-400" };

export function getSubscriptionColor(name: string) {
  if (!name) return defaultColor;
  let hash = 0;
  for (const ch of name) {
    hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  }
  return colorPalette[Math.abs(hash) % colorPalette.length];
}

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

// 获取某月的天数
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// 获取某月第一天是周几（周一=0, 周日=6）
function getStartDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

// 将日期转为 YYYY-MM-DD 格式的 key
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

type EventItem = (CalendarEvent | CalendarEventWithSub) & {
  subscriptionName?: string;
};

type CalendarViewProps = {
  events: EventItem[];
  subscriptionName?: string;
  actions?: React.ReactNode;
};

export function CalendarView({ events, subscriptionName, actions }: CalendarViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 按日期分组事件（跨天事件会出现在每一天）
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();

    function addToDate(key: string, event: EventItem) {
      const existing = map.get(key);
      if (existing) {
        existing.push(event);
      } else {
        map.set(key, [event]);
      }
    }

    for (const event of events) {
      const start = new Date(event.startAt);
      const startKey = toDateKey(start);
      addToDate(startKey, event);

      // 如果有 endAt 且跨天，在中间每一天也加入该事件
      if (event.endAt) {
        const end = new Date(event.endAt);
        // 从 startAt 次日 00:00 开始逐日检查
        const cursor = new Date(start);
        cursor.setHours(0, 0, 0, 0);
        cursor.setDate(cursor.getDate() + 1);
        while (cursor <= end) {
          const key = toDateKey(cursor);
          if (key !== startKey) {
            addToDate(key, event);
          }
          cursor.setDate(cursor.getDate() + 1);
        }
      }
    }
    return map;
  }, [events]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDay = getStartDayOfMonth(currentYear, currentMonth);
  const todayKey = toDateKey(today);

  function goPrevMonth() {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  }

  function goNextMonth() {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  }

  function goToday() {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(null);
  }

  // 构建日历格子
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  // 选中日期的事件列表
  const selectedEvents = selectedDate ? (eventsByDate.get(selectedDate) ?? []) : [];

  const monthLabel = `${currentYear}年${currentMonth + 1}月`;

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm">
      {/* 头部：标题 + 导航 + 操作区 */}
      <div className="flex flex-col gap-3 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold tracking-tight text-zinc-950">{monthLabel}</h2>

          <div className="flex items-center gap-0.5 rounded-full border border-zinc-100 bg-zinc-50/50 p-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={goPrevMonth}
              className="h-6 w-6 rounded-full hover:bg-white hover:shadow-sm"
            >
              <ChevronLeft className="h-3.5 w-3.5 text-zinc-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goNextMonth}
              className="h-6 w-6 rounded-full hover:bg-white hover:shadow-sm"
            >
              <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
            </Button>
          </div>

          {(currentYear !== today.getFullYear() || currentMonth !== today.getMonth()) && (
            <Button
              variant="outline"
              size="sm"
              onClick={goToday}
              className="h-7 animate-in fade-in zoom-in-95 rounded-full border-zinc-200 px-3 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            >
              <RotateCcw className="mr-1 h-3 w-3" />
              回到今天
            </Button>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* 星期标题行 */}
      <div className="grid grid-cols-7 border-b border-zinc-100 bg-zinc-50/30">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2 text-center text-[10px] font-medium text-zinc-400">
            {day}
          </div>
        ))}
      </div>

      {/* 日期格子 */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="min-h-[64px] border-b border-r border-zinc-100 sm:min-h-[80px]" />;
          }

          const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayEvents = eventsByDate.get(dateKey) ?? [];
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedDate;
          const hasEvents = dayEvents.length > 0;

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
              className={cn(
                "min-h-[64px] border-b border-r border-zinc-100 p-1 text-left transition-colors hover:bg-zinc-50 sm:min-h-[80px] sm:p-1.5",
                isSelected && "bg-zinc-50 ring-1 ring-inset ring-zinc-900",
              )}
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                    isToday && "bg-zinc-900 font-semibold text-white",
                    !isToday && "text-zinc-600",
                  )}
                >
                  {day}
                </span>
                {hasEvents && dayEvents.length > 2 && (
                  <span className="text-[10px] text-zinc-400">+{dayEvents.length - 2}</span>
                )}
              </div>
              {/* 事件指示条（最多显示 2 条） */}
              <div className="mt-0.5 space-y-0.5">
                {dayEvents.slice(0, 2).map((evt) => {
                  const name = "subscriptionName" in evt && evt.subscriptionName
                    ? evt.subscriptionName
                    : subscriptionName ?? "";
                  const color = getSubscriptionColor(name);
                  return (
                    <div
                      key={evt.id}
                      className={cn(
                        "truncate rounded px-1 py-0.5 text-[10px] leading-tight sm:text-[11px]",
                        color.bg,
                        color.text,
                      )}
                    >
                      {evt.title}
                    </div>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>

      {/* 选中日期的事件详情 */}
      {selectedDate && (
        <div className="border-t border-zinc-200 p-4">
          <h3 className="mb-3 text-sm font-semibold text-zinc-900">
            {selectedDate} 的事件
          </h3>
          {selectedEvents.length === 0 ? (
            <p className="text-xs text-zinc-500">当天没有事件</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((evt) => {
                const name = "subscriptionName" in evt && evt.subscriptionName
                  ? evt.subscriptionName
                  : subscriptionName ?? "";
                const color = getSubscriptionColor(name);
                const subName = "subscriptionName" in evt && evt.subscriptionName
                  ? evt.subscriptionName
                  : subscriptionName;
                const time = new Date(evt.startAt).toLocaleTimeString("zh-CN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });

                return (
                  <div key={evt.id} className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3">
                    <div className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", color.dot)} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-900">{evt.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span>{time}</span>
                        {subName && (
                          <>
                            <span className="text-zinc-300">·</span>
                            <span>{subName}</span>
                          </>
                        )}
                        {evt.location && (
                          <>
                            <span className="text-zinc-300">·</span>
                            <span>{evt.location}</span>
                          </>
                        )}
                      </div>
                      {evt.description && (
                        <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-zinc-500">
                          {evt.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

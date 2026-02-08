"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalendarDomain, CalendarEvent, CalendarEventWithSub } from "@/lib/types";

// 域名颜色映射
export const domainColors: Record<string, { bg: string; text: string; dot: string }> = {
  sports: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  entertainment: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  weather: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  general: { bg: "bg-zinc-100", text: "text-zinc-700", dot: "bg-zinc-400" },
};

export function getDomainColor(domain: CalendarDomain) {
  const normalized = domain.trim().toLowerCase();
  return domainColors[normalized] ?? domainColors.general;
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
  subscriptionDomain?: CalendarDomain;
};

type CalendarViewProps = {
  events: EventItem[];
  // 单订阅模式：指定域名颜色
  singleDomain?: CalendarDomain;
  // 单订阅模式下的订阅名称
  subscriptionName?: string;
};

export function CalendarView({ events, singleDomain, subscriptionName }: CalendarViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 按日期分组事件
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const event of events) {
      const date = new Date(event.startAt);
      const key = toDateKey(date);
      const existing = map.get(key);
      if (existing) {
        existing.push(event);
      } else {
        map.set(key, [event]);
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
    <div className="rounded-xl border border-zinc-300 bg-white">
      {/* 月份导航 */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <Button variant="ghost" size="sm" onClick={goPrevMonth} className="h-8 w-8 p-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900">{monthLabel}</span>
          <Button variant="outline" size="sm" onClick={goToday} className="h-6 rounded-full px-2 text-xs">
            今天
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={goNextMonth} className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 星期标题行 */}
      <div className="grid grid-cols-7 border-b border-zinc-100">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-zinc-500">
            {day}
          </div>
        ))}
      </div>

      {/* 日期格子 */}
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="min-h-[72px] border-b border-r border-zinc-100 sm:min-h-[88px]" />;
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
                "min-h-[72px] border-b border-r border-zinc-100 p-1 text-left transition-colors hover:bg-zinc-50 sm:min-h-[88px] sm:p-1.5",
                isSelected && "bg-zinc-50 ring-1 ring-inset ring-zinc-900",
              )}
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                    isToday && "bg-zinc-900 font-semibold text-white",
                    !isToday && "text-zinc-700",
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
                  const domain = "subscriptionDomain" in evt && evt.subscriptionDomain
                    ? evt.subscriptionDomain
                    : singleDomain ?? "general";
                  const color = getDomainColor(domain);
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
                const domain = "subscriptionDomain" in evt && evt.subscriptionDomain
                  ? evt.subscriptionDomain
                  : singleDomain ?? "general";
                const color = getDomainColor(domain);
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

import Link from "next/link";
import { CalendarCheck2, Globe2, ShieldCheck, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-zinc-300 bg-white/90 p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
            AI Skill
          </Badge>
          <Badge variant="outline" className="rounded-full text-xs">
            通用日历订阅
          </Badge>
          <Badge variant="outline" className="rounded-full text-xs">
            REST API
          </Badge>
        </div>
        <div className="mt-6 space-y-4">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            iCalAgent — AI 日历订阅平台
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-zinc-600 sm:text-base">
            让 AI 代理帮你搜索信息并自动创建日历订阅。天气、赛程、会议、追剧 —— 任何你关心的事件，都能变成 iCal 订阅。
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link href="/register">立即注册</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">登录</Link>
            </Button>
          </div>
        </div>
        <Separator className="my-8 bg-zinc-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-300 bg-zinc-50/70 p-4">
            <div className="mb-2 inline-flex rounded-lg bg-white p-2">
              <Zap className="h-4 w-4 text-zinc-900" />
            </div>
            <h2 className="text-sm font-medium text-zinc-950">AI Skill 驱动</h2>
            <p className="mt-1 text-xs text-zinc-600">AI 代理自动搜索信息并写入日历，无需手动操作。</p>
          </div>
          <div className="rounded-xl border border-zinc-300 bg-zinc-50/70 p-4">
            <div className="mb-2 inline-flex rounded-lg bg-white p-2">
              <Globe2 className="h-4 w-4 text-zinc-900" />
            </div>
            <h2 className="text-sm font-medium text-zinc-950">通用领域建模</h2>
            <p className="mt-1 text-xs text-zinc-600">体育/影视/天气只是场景，协议层不绑垂类。</p>
          </div>
          <div className="rounded-xl border border-zinc-300 bg-zinc-50/70 p-4">
            <div className="mb-2 inline-flex rounded-lg bg-white p-2">
              <CalendarCheck2 className="h-4 w-4 text-zinc-900" />
            </div>
            <h2 className="text-sm font-medium text-zinc-950">iCal 稳定订阅</h2>
            <p className="mt-1 text-xs text-zinc-600">每个订阅绑定稳定 token，用于多端拉取。</p>
          </div>
          <div className="rounded-xl border border-zinc-300 bg-zinc-50/70 p-4">
            <div className="mb-2 inline-flex rounded-lg bg-white p-2">
              <ShieldCheck className="h-4 w-4 text-zinc-900" />
            </div>
            <h2 className="text-sm font-medium text-zinc-950">来源可追溯</h2>
            <p className="mt-1 text-xs text-zinc-600">每个事件都保留来源链接与置信度。</p>
          </div>
        </div>
      </section>
    </main>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarCheck2, Globe2, ShieldCheck, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 已登录用户直接跳转 dashboard
  const user = await getAuthenticatedUser();
  if (user) {
    redirect("/dashboard");
  }
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-border bg-white p-8 shadow-xs sm:p-12">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full bg-black px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase tracking-wider">
            iCalAgent v1.0
          </Badge>
          <Badge variant="outline" className="rounded-full text-[10px] font-medium text-zinc-500 border-zinc-200">
            AI-Powered
          </Badge>
        </div>

        <div className="mt-8 space-y-6">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-6xl">
            日历订阅，从未如此简单
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-500">
            让 AI 代理帮你搜索信息并自动维护日历。天气、赛程、会议、电影档期 —— 任何你关心的事件，都能一键变为稳定订阅。
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="px-8 font-semibold">
              <Link href="/register">立即开始</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 font-semibold">
              <Link href="/login">控制台登录</Link>
            </Button>
          </div>
        </div>

        <Separator className="my-16 bg-zinc-100" />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group space-y-3">
            <div className="mb-4 inline-flex rounded-lg border border-border bg-zinc-50 p-2.5 transition-colors group-hover:bg-white group-hover:shadow-sm">
              <Zap className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-base font-semibold text-black">AI Skill 驱动</h2>
            <p className="text-sm leading-relaxed text-zinc-500">AI 代理自动搜寻全球信息并同步至日历，解放双手。</p>
          </div>

          <div className="group space-y-3">
            <div className="mb-4 inline-flex rounded-lg border border-border bg-zinc-50 p-2.5 transition-colors group-hover:bg-white group-hover:shadow-sm">
              <Globe2 className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-base font-semibold text-black">全场景支持</h2>
            <p className="text-sm leading-relaxed text-zinc-500">体育、影视、个人日程，基于通用协议，服务广阔场景。</p>
          </div>

          <div className="group space-y-3">
            <div className="mb-4 inline-flex rounded-lg border border-border bg-zinc-50 p-2.5 transition-colors group-hover:bg-white group-hover:shadow-sm">
              <CalendarCheck2 className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-base font-semibold text-black">稳定 iCal 链接</h2>
            <p className="text-sm leading-relaxed text-zinc-500">支持 Apple/Google/Outlook 多端拉取，一次订阅，终身维护。</p>
          </div>

          <div className="group space-y-3">
            <div className="mb-4 inline-flex rounded-lg border border-border bg-zinc-50 p-2.5 transition-colors group-hover:bg-white group-hover:shadow-sm">
              <ShieldCheck className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-base font-semibold text-black">隐私与溯源</h2>
            <p className="text-sm leading-relaxed text-zinc-500">透明的事件来源追溯，安全隐私的订阅管理。 </p>
          </div>
        </div>
      </section>
    </main>
  );
}

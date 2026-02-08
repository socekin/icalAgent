import Link from "next/link";
import { CalendarCheck2, Globe2, ShieldCheck, Zap, ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getAuthenticatedUser();

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-zinc-200/20 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-zinc-200/20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 py-20 lg:px-8">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="mb-8 flex justify-center gap-3">
              <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs font-medium tracking-wide">
                iCalAgent v1.0
              </Badge>
              <Badge variant="outline" className="rounded-full border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-500">
                AI Native
              </Badge>
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-zinc-950 sm:text-7xl">
              日历订阅，<span className="text-zinc-400">从未如此简单</span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-zinc-500">
              让 AI 代理帮你搜索、过滤并自动维护日历。
              <br className="hidden sm:block" />
              任何你关心的事件，都能一键变为稳定、实时的极简订阅。
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {user ? (
                <Button asChild size="lg" className="h-14 rounded-full px-10 text-base font-semibold premium-hover">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    进入控制台 <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="h-14 rounded-full px-10 text-base font-semibold premium-hover">
                    <Link href="/register">立即开始</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-14 rounded-full border-zinc-200 px-10 text-base font-semibold hover:bg-zinc-50">
                    <Link href="/login">控制台登录</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="mt-32 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Zap,
              title: "AI Skill 驱动",
              desc: "AI 代理自动搜寻全球信息并同步至日历，解放双手。",
            },
            {
              icon: Globe2,
              title: "全场景支持",
              desc: "体育、影视、个人日程，基于通用协议，服务广阔场景。",
            },
            {
              icon: CalendarCheck2,
              title: "稳定 iCal 链接",
              desc: "支持 Apple/Google/Outlook 多端拉取，一次订阅，终身维护。",
            },
            {
              icon: ShieldCheck,
              title: "隐私与溯源",
              desc: "透明的事件来源追溯，安全隐私的订阅管理。",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl border border-zinc-100 bg-white p-8 transition-all hover:border-zinc-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-950 transition-colors group-hover:bg-zinc-950 group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-zinc-950">{feature.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* Footer info */}
        <section className="mt-32 border-t border-zinc-100 pt-16 text-center">
          <p className="text-sm font-medium text-zinc-400">
            © {new Date().getFullYear()} iCalAgent. Built for efficiency.
          </p>
        </section>
      </div>
    </main>
  );
}

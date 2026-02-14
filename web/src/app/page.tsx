import Link from "next/link";
import { CalendarCheck2, Globe2, ShieldCheck, Zap, ArrowRight, Github } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAuthenticatedUser } from "@/lib/auth";
import { AgentDemo } from "@/components/landing/agent-demo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getLocale, t } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getAuthenticatedUser();
  const locale = await getLocale();

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-background">
      {/* Language Switcher */}
      <div className="absolute right-6 top-6 z-20">
        <LanguageSwitcher locale={locale} />
      </div>

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
              <Link
                href="https://github.com/socekin/icalAgent"
                target="_blank"
                className="flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-50 transition-colors hover:bg-zinc-900/80"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </Link>
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-zinc-950 sm:text-7xl">
              {t(locale, "landing.hero.title")}<span className="text-zinc-400">{t(locale, "landing.hero.titleHighlight")}</span>
            </h1>

            <div className="mx-auto mt-10 w-full max-w-2xl">
              <AgentDemo locale={locale} />
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {user ? (
                <Button asChild size="lg" className="h-14 rounded-full px-10 text-base font-semibold premium-hover">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    {t(locale, "landing.cta.dashboard")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="h-14 rounded-full px-10 text-base font-semibold premium-hover">
                  <Link href="/login">{t(locale, "landing.cta.getStarted")}</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="mt-32 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Zap,
              title: t(locale, "landing.feature.aiAgent.title"),
              desc: t(locale, "landing.feature.aiAgent.desc"),
            },
            {
              icon: Globe2,
              title: t(locale, "landing.feature.allScenarios.title"),
              desc: t(locale, "landing.feature.allScenarios.desc"),
            },
            {
              icon: CalendarCheck2,
              title: t(locale, "landing.feature.liveCalendar.title"),
              desc: t(locale, "landing.feature.liveCalendar.desc"),
            },
            {
              icon: ShieldCheck,
              title: t(locale, "landing.feature.reliable.title"),
              desc: t(locale, "landing.feature.reliable.desc"),
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

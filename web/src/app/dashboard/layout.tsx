import Link from "next/link";
import { Github } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getLocale, t } from "@/i18n";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  const locale = await getLocale();

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-white sticky top-0 z-10">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm font-bold tracking-tight text-black">
              iCalAgent
            </Link>
            <nav className="flex items-center gap-5 text-[13px] font-medium">
              <Link href="/dashboard" className="text-zinc-500 hover:text-black transition-colors">
                {t(locale, "nav.mySubscriptions")}
              </Link>
              <Link href="/dashboard/keys" className="text-zinc-500 hover:text-black transition-colors">
                {t(locale, "nav.apiKeys")}
              </Link>
              <Link href="/dashboard/skill" className="text-zinc-500 hover:text-black transition-colors">
                {t(locale, "nav.skillDownload")}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher locale={locale} />
            <Link
              href="https://github.com/socekin/icalAgent"
              target="_blank"
              className="flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-50 transition-colors hover:bg-zinc-900/80"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </Link>
            <span className="text-[11px] font-medium text-zinc-400">{user?.email}</span>
            <LogoutButton locale={locale} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

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
                我的订阅
              </Link>
              <Link href="/dashboard/keys" className="text-zinc-500 hover:text-black transition-colors">
                API 密钥
              </Link>
              <Link href="/dashboard/skill" className="text-zinc-500 hover:text-black transition-colors">
                Skill 下载
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-medium text-zinc-400">{user?.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

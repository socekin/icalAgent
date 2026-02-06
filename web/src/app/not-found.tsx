import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-zinc-950">订阅不存在</h1>
      <p className="mt-3 text-sm text-zinc-600">
        该订阅可能尚未创建，或者链接 token 无效。
      </p>
      <Button asChild className="mt-6 rounded-full">
        <Link href="/">返回首页</Link>
      </Button>
    </main>
  );
}

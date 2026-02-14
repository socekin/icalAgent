import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getLocale, t } from "@/i18n";

export default async function NotFoundPage() {
  const locale = await getLocale();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-zinc-950">{t(locale, "notFound.title")}</h1>
      <p className="mt-3 text-sm text-zinc-600">
        {t(locale, "notFound.description")}
      </p>
      <Button asChild className="mt-6 rounded-full">
        <Link href="/">{t(locale, "notFound.backHome")}</Link>
      </Button>
    </main>
  );
}

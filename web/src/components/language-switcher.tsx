"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/types";
import { LOCALE_COOKIE } from "@/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();

  const toggle = () => {
    const next = locale === "zh-CN" ? "en" : "zh-CN";
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000`;
    document.documentElement.lang = next;
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
    >
      <span className="text-sm leading-none">{locale === "zh-CN" ? "🇺🇸" : "🇨🇳"}</span>
      {locale === "zh-CN" ? "EN" : "中文"}
    </button>
  );
}

import zhCN from "./locales/zh-CN";
import en from "./locales/en";
import type { Locale } from "./types";

const messages: Record<Locale, Record<string, string>> = { "zh-CN": zhCN, en };

export const DEFAULT_LOCALE: Locale = "zh-CN";
export const LOCALE_COOKIE = "icalagent-locale";

export function t(locale: Locale, key: string): string {
  return messages[locale]?.[key] ?? messages[DEFAULT_LOCALE]?.[key] ?? key;
}

/** Server Component: read cookie, fallback to Accept-Language header */
export async function getLocale(): Promise<Locale> {
  const { cookies, headers } = await import("next/headers");

  const cookieValue = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (cookieValue === "en" || cookieValue === "zh-CN") return cookieValue;

  // No cookie set — detect from Accept-Language (check primary language only)
  const acceptLang = (await headers()).get("accept-language") ?? "";
  const primary = acceptLang.split(",")[0]?.trim() ?? "";
  if (/^zh\b/i.test(primary)) {
    return "zh-CN";
  }
  return "en";
}

/** Client Component: read cookie, fallback to navigator.language */
export function getClientLocale(): Locale {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
    if (match?.[1] === "en") return "en";
    if (match?.[1] === "zh-CN") return "zh-CN";
  }
  // No cookie — detect from browser language
  if (typeof navigator !== "undefined") {
    const lang = navigator.language;
    if (lang.startsWith("zh")) return "zh-CN";
  }
  return "en";
}

export type { Locale };

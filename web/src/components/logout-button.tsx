"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/types";
import { t } from "@/i18n";

export function LogoutButton({ locale }: { locale: Locale }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-zinc-500 hover:text-zinc-900"
    >
      {t(locale, "nav.logout")}
    </button>
  );
}

import { Suspense } from "react";
import { DashboardContent } from "@/components/dashboard-content";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  getAllEventsForUser,
  getOrCreateMasterFeedToken,
  listSubscriptions,
} from "@/lib/subscriptions";
import { getLocale, t } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  const subscriptions = await listSubscriptions(user?.id);
  const locale = await getLocale();

  let masterFeedUrl: string | null = null;
  let allEvents: Awaited<ReturnType<typeof getAllEventsForUser>>["events"] = [];

  if (user) {
    const token = await getOrCreateMasterFeedToken(user.id);
    if (token) {
      masterFeedUrl = `/cal/all/${token}.ics`;
    }

    const result = await getAllEventsForUser(user.id);
    allEvents = result.events;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">{t(locale, "dashboard.title")}</h1>
        <p className="text-xs font-medium text-zinc-500">
          {t(locale, "dashboard.subtitle.prefix")}<span className="text-zinc-950">{subscriptions.length}</span>{t(locale, "dashboard.subtitle.suffix")}
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 py-24 text-center">
          <p className="text-base font-medium text-zinc-500">
            {t(locale, "dashboard.empty.title")}
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            {t(locale, "dashboard.empty.description")}
          </p>
        </div>
      ) : (
        <Suspense>
          <DashboardContent
            subscriptions={subscriptions}
            allEvents={allEvents}
            masterFeedUrl={masterFeedUrl}
            locale={locale}
          />
        </Suspense>
      )}
    </div>
  );
}

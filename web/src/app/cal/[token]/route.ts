import { NextResponse } from "next/server";

import { buildIcs } from "@/lib/ics";
import {
  getEventsBySubscriptionId,
  getSubscriptionByFeedToken,
} from "@/lib/subscriptions";

type CalendarRouteProps = {
  params: Promise<{ token: string }>;
};

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: CalendarRouteProps) {
  const { token: rawToken } = await params;
  const token = rawToken.replace(/\.ics$/i, "");
  const subscription = await getSubscriptionByFeedToken(token);

  if (!subscription) {
    return new NextResponse("Feed not found", { status: 404 });
  }

  const events = await getEventsBySubscriptionId(subscription.id);
  const ics = buildIcs(subscription, events);

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=300",
      "content-disposition": `inline; filename="${subscription.subscriptionKey}.ics"`,
    },
  });
}

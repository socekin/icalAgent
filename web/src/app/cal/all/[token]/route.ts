import { NextResponse } from "next/server";

import { buildMergedIcs } from "@/lib/ics";
import { getAllEventsForUser, getUserIdByMasterFeedToken } from "@/lib/subscriptions";

type MasterFeedRouteProps = {
  params: Promise<{ token: string }>;
};

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: MasterFeedRouteProps) {
  const { token: rawToken } = await params;
  const token = rawToken.replace(/\.ics$/i, "");

  const userId = await getUserIdByMasterFeedToken(token);
  if (!userId) {
    return new NextResponse("Feed not found", { status: 404 });
  }

  const { subscriptions, events } = await getAllEventsForUser(userId);
  const ics = buildMergedIcs(events, subscriptions);

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=300",
      "content-disposition": 'inline; filename="icalagent-all.ics"',
    },
  });
}

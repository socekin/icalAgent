import { DashboardContent } from "@/components/dashboard-content";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  getAllEventsForUser,
  getOrCreateMasterFeedToken,
  listSubscriptions,
} from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  const subscriptions = await listSubscriptions(user?.id);

  // 获取 master feed token 和全部事件
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">我的订阅</h1>
        <p className="mt-1 text-sm text-zinc-600">
          共 {subscriptions.length} 个日历订阅
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center">
          <p className="text-sm text-zinc-500">
            还没有任何订阅，使用 Skill 或 REST API 创建你的第一个日历订阅吧
          </p>
        </div>
      ) : (
        <DashboardContent
          subscriptions={subscriptions}
          allEvents={allEvents}
          masterFeedUrl={masterFeedUrl}
        />
      )}
    </div>
  );
}

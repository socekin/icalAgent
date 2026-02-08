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
    <div className="mx-auto max-w-6xl space-y-6 py-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">我的订阅</h1>
        <p className="text-xs font-medium text-zinc-500">
          目前共有 <span className="text-zinc-950">{subscriptions.length}</span> 个正在运行的日历订阅
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 py-24 text-center">
          <p className="text-base font-medium text-zinc-500">
            还没有任何订阅
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            使用 Skill 或 API 创建你的第一个日历订阅吧
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

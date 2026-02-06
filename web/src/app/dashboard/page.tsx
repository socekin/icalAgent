import { SubscriptionCard } from "@/components/subscription-card";
import { getAuthenticatedUser } from "@/lib/auth";
import { listSubscriptions } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  const subscriptions = await listSubscriptions(user?.id);

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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {subscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </div>
      )}
    </div>
  );
}

import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LegacySubscriptionPage({ params }: Props) {
  const { id } = await params;
  redirect(`/dashboard/subscriptions/${id}`);
}

import { NextResponse } from "next/server";
import { getAuthenticatedUser, getServiceRoleClient } from "@/lib/auth";

// 吊销 API Key
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getServiceRoleClient();

  // 确保只能吊销自己的 Key
  const { data: existing, error: selectError } = await supabase
    .from("api_keys")
    .select("id, user_id, revoked_at")
    .eq("id", id)
    .maybeSingle<{ id: string; user_id: string; revoked_at: string | null }>();

  if (selectError || !existing) {
    return NextResponse.json({ error: "API Key 不存在" }, { status: 404 });
  }

  if (existing.user_id !== user.id) {
    return NextResponse.json({ error: "无权操作" }, { status: 403 });
  }

  if (existing.revoked_at) {
    return NextResponse.json({ error: "该 Key 已被吊销" }, { status: 400 });
  }

  const { error } = await supabase
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "吊销失败" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

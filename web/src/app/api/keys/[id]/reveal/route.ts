import { NextResponse } from "next/server";
import { getAuthenticatedUser, getServiceRoleClient } from "@/lib/auth";
import { decrypt } from "@/lib/encryption";

// 获取完整密钥（解密）
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getServiceRoleClient();

  const { data, error } = await supabase
    .from("api_keys")
    .select("user_id, encrypted_key, revoked_at")
    .eq("id", id)
    .maybeSingle<{ user_id: string; encrypted_key: string | null; revoked_at: string | null }>();

  if (error || !data) {
    return NextResponse.json({ error: "API Key 不存在" }, { status: 404 });
  }

  if (data.user_id !== user.id) {
    return NextResponse.json({ error: "无权操作" }, { status: 403 });
  }

  if (data.revoked_at) {
    return NextResponse.json({ error: "该密钥已被吊销" }, { status: 400 });
  }

  if (!data.encrypted_key) {
    return NextResponse.json({ error: "该密钥创建于加密功能上线前，无法获取完整密钥" }, { status: 400 });
  }

  const key = decrypt(data.encrypted_key);
  return NextResponse.json({ key });
}

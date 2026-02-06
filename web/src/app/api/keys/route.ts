import { NextResponse } from "next/server";
import { getAuthenticatedUser, getServiceRoleClient } from "@/lib/auth";
import { generateApiKey } from "@/lib/api-keys";

// 创建 API Key
export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const name = (body as { name?: string }).name || "默认密钥";

    const { raw, prefix, hash } = generateApiKey();
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        user_id: user.id,
        key_prefix: prefix,
        key_hash: hash,
        name,
      })
      .select("id, name, key_prefix, created_at")
      .single<{ id: string; name: string; key_prefix: string; created_at: string }>();

    if (error || !data) {
      return NextResponse.json({ error: "创建 API Key 失败" }, { status: 500 });
    }

    // 返回完整的 key，仅此一次
    return NextResponse.json({
      id: data.id,
      name: data.name,
      key: raw,
      keyPrefix: data.key_prefix,
      createdAt: data.created_at,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

// 列出用户的 API Keys
export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, created_at, last_used_at, revoked_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "获取 API Keys 失败" }, { status: 500 });
  }

  const keys = (data ?? []).map((row: {
    id: string;
    name: string;
    key_prefix: string;
    created_at: string;
    last_used_at: string | null;
    revoked_at: string | null;
  }) => ({
    id: row.id,
    name: row.name,
    keyPrefix: row.key_prefix,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    revokedAt: row.revoked_at,
  }));

  return NextResponse.json({ keys });
}

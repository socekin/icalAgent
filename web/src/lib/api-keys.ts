import { createHash, randomBytes } from "node:crypto";
import { getServiceRoleClient } from "@/lib/auth";

const KEY_PREFIX_LABEL = "ical_";

/**
 * 生成新的 API Key
 * 格式: ical_ + 64位 hex（共 69 字符）
 */
export function generateApiKey(): { raw: string; prefix: string; hash: string } {
  const randomHex = randomBytes(32).toString("hex"); // 64 字符
  const raw = `${KEY_PREFIX_LABEL}${randomHex}`;
  const prefix = raw.slice(0, 12);
  const hash = createHash("sha256").update(raw).digest("hex");
  return { raw, prefix, hash };
}

/**
 * 通过 API Key 原文验证并返回 userId
 */
export async function validateApiKey(key: string): Promise<string | null> {
  if (!key.startsWith(KEY_PREFIX_LABEL)) {
    return null;
  }

  const hash = createHash("sha256").update(key).digest("hex");
  const supabase = getServiceRoleClient();

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, user_id, revoked_at")
    .eq("key_hash", hash)
    .maybeSingle<{ id: string; user_id: string; revoked_at: string | null }>();

  if (error || !data) {
    return null;
  }

  // 已吊销的 Key 不可用
  if (data.revoked_at) {
    return null;
  }

  // 更新最后使用时间（异步，不阻塞请求）
  supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id)
    .then(() => {});

  return data.user_id;
}

/**
 * 从 HTTP 请求的 Authorization header 中提取并验证 API Key
 */
export async function authenticateRequest(
  req: Request,
): Promise<{ userId: string } | { error: string; status: number }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "缺少 Authorization header", status: 401 };
  }

  const key = authHeader.slice(7);
  const userId = await validateApiKey(key);

  if (!userId) {
    return { error: "API Key 无效或已吊销", status: 401 };
  }

  return { userId };
}

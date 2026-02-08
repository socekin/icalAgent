import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getServiceRoleClient } from "@/lib/auth";
import { decrypt } from "@/lib/encryption";

async function resolveSkillPath(): Promise<string> {
  // Docker standalone: skill/ 在 cwd 内
  const primary = join(process.cwd(), "skill", "SKILL.md");
  try {
    await access(primary);
    return primary;
  } catch {
    // 开发环境: web/ 是 cwd，skill/ 在上级目录
    return join(process.cwd(), "..", "skill", "SKILL.md");
  }
}

export async function GET(request: NextRequest) {
  try {
    const keyId = request.nextUrl.searchParams.get("keyId");

    const skillPath = await resolveSkillPath();
    let content = await readFile(skillPath, "utf-8");

    // 有 keyId 时：验证登录 + 所有权，解密密钥并替换内容
    if (keyId) {
      const user = await getAuthenticatedUser();
      if (!user) {
        return NextResponse.json({ error: "未登录" }, { status: 401 });
      }

      const supabase = getServiceRoleClient();
      const { data: keyRow, error } = await supabase
        .from("api_keys")
        .select("id, user_id, encrypted_key, key_prefix, revoked_at")
        .eq("id", keyId)
        .single<{
          id: string;
          user_id: string;
          encrypted_key: string;
          key_prefix: string;
          revoked_at: string | null;
        }>();

      if (error || !keyRow) {
        return NextResponse.json({ error: "密钥不存在" }, { status: 404 });
      }
      if (keyRow.user_id !== user.id) {
        return NextResponse.json({ error: "无权访问此密钥" }, { status: 403 });
      }
      if (keyRow.revoked_at) {
        return NextResponse.json({ error: "密钥已吊销" }, { status: 400 });
      }

      const realKey = decrypt(keyRow.encrypted_key);
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-domain.com";

      // 替换「配置」section：从 "## 配置" 到下一个 "## " 开头
      content = content.replace(
        /## 配置\n[\s\S]*?(?=\n## )/,
        `## 配置\n\n> 已预配置，无需设置环境变量。\n\n- **API Key**: \`${realKey}\`\n- **Base URL**: \`${baseUrl}\`\n\n`,
      );

      // 替换认证 header 示例
      content = content.replace(
        "Authorization: Bearer <ICALAGENT_API_KEY>",
        `Authorization: Bearer ${realKey}`,
      );

      // 替换 curl 示例中的环境变量引用
      content = content.replaceAll("${ICALAGENT_API_KEY}", realKey);
      content = content.replaceAll("${ICALAGENT_BASE_URL}", baseUrl);

      // 替换响应示例中的占位域名
      content = content.replaceAll("https://your-domain.com", baseUrl);

      // 替换错误处理表格中的环境变量提示
      content = content.replace(
        "检查 ICALAGENT_API_KEY 是否正确配置",
        "检查 API Key 是否有效（未过期或吊销）",
      );
    }

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": 'attachment; filename="SKILL.md"',
      },
    });
  } catch {
    return NextResponse.json({ error: "Skill 文件未找到" }, { status: 404 });
  }
}

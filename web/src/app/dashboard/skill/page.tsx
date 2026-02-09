"use client";

import { useEffect, useState } from "react";
import { Download, Terminal, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import type { ApiKey } from "@/lib/types";

export default function SkillPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [selectedKeyId, setSelectedKeyId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/keys")
      .then((r) => r.json())
      .then((data: { keys?: ApiKey[] }) => {
        // 过滤掉已吊销的密钥
        const activeKeys = (data.keys ?? []).filter((k) => !k.revokedAt);
        setKeys(activeKeys);
        if (activeKeys.length > 0) {
          setSelectedKeyId(activeKeys[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const downloadUrl = selectedKeyId
    ? `/api/skill/download?keyId=${selectedKeyId}`
    : "/api/skill/download";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-zinc-950">Skill 下载</h1>
        <p className="mt-1 text-sm text-zinc-600">
          下载 Skill 文件并配置到你的 AI 客户端
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">iCalAgent Skill</CardTitle>
          <CardDescription>
            Skill 文件是 AI 代理的指导手册，告诉它如何搜索信息并调用 iCalAgent
            API 创建日历订阅。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-zinc-500">加载密钥列表...</p>
          ) : keys.length === 0 ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <p>
                你还没有可用的 API 密钥。请先
                <Link
                  href="/dashboard/keys"
                  className="font-medium underline underline-offset-2"
                >
                  创建一个 API 密钥
                </Link>
                ，然后回来下载已配置好的 Skill 文件。
              </p>
              <p className="mt-2">
                <a href="/api/skill/download" download>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                    下载原始 SKILL.md
                  </Button>
                </a>
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-zinc-500" />
                <label
                  htmlFor="key-select"
                  className="text-sm font-medium text-zinc-700"
                >
                  选择 API 密钥
                </label>
              </div>
              <select
                id="key-select"
                value={selectedKeyId}
                onChange={(e) => setSelectedKeyId(e.target.value)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              >
                {keys.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name} ({k.keyPrefix}...)
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500">
                选择后下载的 SKILL.md 将自动嵌入该密钥和服务地址，无需手动配置环境变量。
              </p>
              <a href={downloadUrl} download>
                <Button>
                  <Download className="h-4 w-4" />
                  下载 SKILL.md
                </Button>
              </a>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">安装指引</CardTitle>
          <CardDescription>
            下载的 SKILL.md 已包含 API 密钥和服务地址，放入对应目录即可使用。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-zinc-600" />
              <h3 className="text-sm font-medium">Claude Code</h3>
            </div>
            <div className="rounded-md bg-zinc-50 p-3 font-mono text-xs text-zinc-700">
              <p>mkdir -p ~/.claude/skills/icalagent</p>
              <p>mv ~/Downloads/SKILL.md ~/.claude/skills/icalagent/</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-zinc-600" />
              <h3 className="text-sm font-medium">Codex CLI</h3>
            </div>
            <div className="rounded-md bg-zinc-50 p-3 font-mono text-xs text-zinc-700">
              <p>mkdir -p ~/.codex/skills/icalagent</p>
              <p>mv ~/Downloads/SKILL.md ~/.codex/skills/icalagent/</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Download, Terminal, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SkillPage() {
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
            Skill 文件是 AI 代理的指导手册，告诉它如何搜索信息并调用 iCalAgent API 创建日历订阅。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <a href="/api/skill/download" download>
            <Button>
              <Download className="h-4 w-4" />
              下载 SKILL.md
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">安装指引</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-zinc-600" />
              <h3 className="text-sm font-medium">Claude Code</h3>
            </div>
            <div className="rounded-md bg-zinc-50 p-3 font-mono text-xs text-zinc-700">
              <p># 1. 创建 Skill 目录</p>
              <p>mkdir -p ~/.claude/skills/icalagent</p>
              <p className="mt-2"># 2. 将下载的 SKILL.md 放入该目录</p>
              <p>mv ~/Downloads/SKILL.md ~/.claude/skills/icalagent/</p>
              <p className="mt-2"># 3. 设置环境变量</p>
              <p>export ICALAGENT_API_KEY=&quot;你的API密钥&quot;</p>
              <p>export ICALAGENT_BASE_URL=&quot;https://your-domain.com&quot;</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-zinc-600" />
              <h3 className="text-sm font-medium">其他 AI 客户端</h3>
            </div>
            <p className="text-sm text-zinc-600">
              将 SKILL.md 的内容作为系统提示词（System Prompt）添加到你的 AI 客户端中，
              并确保客户端支持 WebSearch 和 HTTP 请求能力。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

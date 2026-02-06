# iCalAgent

AI 日历订阅平台 —— 让 AI 代理帮你搜索信息并自动创建 iCal 日历订阅。

## 工作原理

```
用户: "帮我订阅北京未来七天天气"
  ↓
AI Agent（搜索天气信息）
  ↓
POST /api/subscriptions（写入事件）
  ↓
iCal Feed URL → 添加到 Apple Calendar / Google Calendar
```

AI 代理通过 Skill 文件获取指令，使用自带的网络搜索能力获取信息，再通过 REST API 写入平台。平台负责存储和生成标准 iCal 订阅链接，可被任何日历客户端订阅。

## 技术栈

- **框架**: Next.js 16 + React 19
- **数据库**: Supabase (PostgreSQL + Auth)
- **UI**: Tailwind CSS 4 + Shadcn UI
- **验证**: Zod v4
- **部署**: Docker (standalone output)

## 快速开始

### 1. 环境准备

- Node.js 20+
- 一个 [Supabase](https://supabase.com) 项目

### 2. 安装依赖

```bash
cd web
npm install
```

### 3. 配置环境变量

```bash
cp web/.env.example web/.env.local
```

编辑 `web/.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. 初始化数据库

在 Supabase SQL Editor 中执行 `supabase/migrations/20260207000000_init.sql`。

### 5. 启动开发服务

```bash
cd web
npm run dev
```

访问 http://localhost:3000，注册账户并创建 API Key。

## 安装 Skill

将 `skill/SKILL.md` 复制到 AI 客户端的 Skill 目录。以 Claude Code 为例：

```bash
mkdir -p ~/.claude/skills/icalagent
cp skill/SKILL.md ~/.claude/skills/icalagent/SKILL.md
```

然后编辑 `~/.claude/skills/icalagent/SKILL.md`，在配置部分填入你的 API Key 和 Base URL。

## 项目结构

```
iCalAgent/
├── web/                        # Next.js 应用
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/         # 登录 / 注册页
│   │   │   ├── api/            # REST API
│   │   │   │   ├── auth/       #   认证接口
│   │   │   │   ├── keys/       #   API Key 管理
│   │   │   │   └── subscriptions/ # 订阅与事件
│   │   │   ├── cal/            # iCal feed 输出
│   │   │   └── dashboard/      # 用户控制台
│   │   └── lib/
│   │       ├── auth.ts         # 认证工具
│   │       ├── api-keys.ts     # API Key 生成与验证
│   │       ├── subscription-service.ts  # 订阅服务
│   │       ├── api-schemas.ts  # Zod 请求验证
│   │       └── ics.ts          # iCal 格式生成
├── skill/
│   └── SKILL.md                # AI Skill 文件
├── supabase/
│   └── migrations/             # 数据库迁移
├── Dockerfile
└── docker-compose.yml
```

## API 概览

所有 API 使用 Bearer Token 认证（API Key）。

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/subscriptions` | 创建/更新订阅并写入事件 |
| `GET` | `/api/subscriptions` | 列出我的订阅 |
| `GET` | `/api/subscriptions/:id` | 订阅详情 |
| `DELETE` | `/api/subscriptions/:id` | 删除订阅 |
| `POST` | `/api/subscriptions/:id/events` | 追加/更新事件 |

详细文档见 `skill/SKILL.md`。

## Docker 部署

```bash
cp .env.production.example .env
# 编辑 .env 填入实际配置
docker compose up --build -d
```

## License

MIT

[English](README.md) | **中文**

# iCalAgent

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

**AI 日历订阅助手** — 用一句话让 AI Agent 搜索信息并自动生成 iCal 日历订阅。

> 不想自己部署？可以直接访问作者的 Demo 实例：**[icalsub.url88.xyz](https://icalsub.url88.xyz)**
>
> **注意：Demo 实例仅供体验，不保证可用性，可能随时下线。请勿存放重要数据。**

## 工作原理

```
用户: "帮我订阅 NBA 湖人队赛程"
  ↓
AI Agent 自动搜索赛程信息
  ↓
通过 REST API 写入 iCalAgent
  ↓
生成 iCal 订阅链接 → Apple / Google / Outlook 日历自动同步
```

AI Agent 通过 **Skill 文件**获取指令，使用自带的网络搜索能力获取实时信息，再通过 REST API 写入平台。平台负责存储事件并生成标准 `.ics` 订阅链接，可被任何日历客户端订阅。

## 功能特性

- **AI Agent 驱动** — 一句话创建日历订阅，AI 自动搜索并结构化信息
- **全场景覆盖** — 体育赛事、天气预报、影视上映、演出展览……凡有时间属性的事件皆可订阅
- **标准 iCal 协议** — 兼容 Apple Calendar、Google Calendar、Outlook 等主流客户端
- **合并日历** — 多个订阅合并为一条 feed，一次添加即可
- **订阅过滤** — 灵活控制哪些订阅输出到 iCal feed
- **幂等设计** — 相同 subscription_key / external_id 自动更新而非重复创建
- **Turnstile 人机验证** — Cloudflare Turnstile 保护注册和登录

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 + React 19 |
| 数据库 | Supabase (PostgreSQL + Auth) |
| UI | Tailwind CSS 4 + Shadcn UI |
| 验证 | Zod v4 |
| 人机验证 | Cloudflare Turnstile |
| 部署 | Docker (standalone output) |

## 快速开始

### 环境要求

- Node.js 20+
- 一个 [Supabase](https://supabase.com) 项目（免费即可）
- 一个 [Cloudflare](https://dash.cloudflare.com) 账户（Turnstile 免费）

### 1. 克隆仓库

```bash
git clone https://github.com/socekin/icalAgent.git
cd icalAgent
```

### 2. 安装依赖

```bash
cd web
npm install
```

### 3. 配置 Supabase 数据库

登录 [Supabase Dashboard](https://supabase.com/dashboard)，进入你的项目，打开 **SQL Editor**，按顺序执行以下迁移文件：

```sql
-- 1. 初始化表结构（复制 supabase/migrations/20260207000000_init.sql 的内容）
-- 2. 添加加密字段（复制 supabase/migrations/20260207100000_add_encrypted_key.sql）
-- 3. 添加用户配置（复制 supabase/migrations/20260207110000_add_user_profiles.sql）
-- 4. 移除废弃字段（复制 supabase/migrations/20260208100000_remove_domain_and_confidence.sql）
-- 5. 添加订阅开关（复制 supabase/migrations/20260209_add_subscription_enabled.sql）
```

> 按文件名顺序依次执行即可，每个文件都是独立的 ALTER/CREATE 语句。

### 4. 配置 Cloudflare Turnstile

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com) → 左侧菜单 **Turnstile**
2. 点击 **添加站点**
3. 填写站点名称，添加主机名（你的域名 + `localhost`）
4. 小组件模式选择 **托管**（推荐）
5. 创建后获取 **Site Key** 和 **Secret Key**

> 开发阶段可跳过此步，使用 Cloudflare 测试密钥（见 `.env.example` 中的注释）。

### 5. 配置环境变量

```bash
cp web/.env.example web/.env.local
```

编辑 `web/.env.local`，填入你的 Supabase 和 Turnstile 密钥：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
API_KEY_ENCRYPTION_SECRET=your-random-string-at-least-32-chars

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key
```

> Supabase 密钥在项目 **Settings → API** 页面获取。`API_KEY_ENCRYPTION_SECRET` 可以用 `openssl rand -hex 16` 生成。

### 6. 启动开发服务

```bash
cd web
npm run dev
```

访问 http://localhost:3000，注册账户并在控制台创建 API Key。

## Docker 部署

### 1. 配置环境变量

在项目根目录创建 `.env` 文件（**不要**提交到 Git）：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
API_KEY_ENCRYPTION_SECRET=your-random-string

NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key

# 可选：新用户注册时发送 Telegram 通知
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

> `docker-compose.yml` 会自动从 `.env` 读取变量：运行时通过 `env_file` 注入容器，构建时通过 `args` 传入 `NEXT_PUBLIC_*` 变量（Next.js 要求这些变量在构建时内联到前端代码）。

### 2. 构建并启动

```bash
docker compose build --no-cache
docker compose up -d
```

服务默认监听 `9101` 端口。

## 安装 Skill

iCalAgent 通过 **Skill 文件** 赋予 AI Agent 创建日历订阅的能力。

### Claude Code

```bash
# 复制 Skill 文件
mkdir -p ~/.claude/skills/icalagent
cp skill/SKILL.md ~/.claude/skills/icalagent/SKILL.md
```

然后配置环境变量（添加到 `~/.claude/.env` 或 shell profile）：

```bash
export ICALAGENT_API_KEY="your-api-key"      # 在控制台 → API Keys 创建
export ICALAGENT_BASE_URL="https://your-domain.com"  # 你的部署地址
```

### 验证

安装完成后，对 AI 说：

```
帮我订阅上海未来七天天气
```

AI 会自动搜索天气信息，调用 API 创建订阅，并返回 iCal 订阅链接。

## 项目结构

```
iCalAgent/
├── web/                           # Next.js 应用
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/            # 登录 / 注册页
│   │   │   ├── api/               # REST API
│   │   │   │   ├── auth/          #   认证接口
│   │   │   │   ├── keys/          #   API Key 管理
│   │   │   │   └── subscriptions/ #   订阅与事件
│   │   │   ├── cal/               # iCal feed 输出
│   │   │   └── dashboard/         # 用户控制台
│   │   ├── components/            # UI 组件
│   │   └── lib/                   # 核心逻辑
│   │       ├── auth.ts            #   认证工具
│   │       ├── api-keys.ts        #   API Key 生成与验证
│   │       ├── subscription-service.ts  # 订阅服务
│   │       ├── api-schemas.ts     #   Zod 请求验证
│   │       ├── ics.ts             #   iCal 格式生成
│   │       ├── turnstile.ts       #   Turnstile 验证
│   │       └── telegram.ts        #   Telegram 通知（可选）
├── skill/
│   └── SKILL.md                   # AI Skill 指令文件
├── supabase/
│   └── migrations/                # 数据库迁移脚本
├── Dockerfile
├── docker-compose.yml
└── LICENSE
```

## API 概览

所有 API 使用 Bearer Token 认证（API Key）。

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/subscriptions` | 创建/更新订阅并写入事件 |
| `GET` | `/api/subscriptions` | 列出我的订阅 |
| `GET` | `/api/subscriptions/:id` | 订阅详情 |
| `PATCH` | `/api/subscriptions/:id` | 更新订阅状态 |
| `DELETE` | `/api/subscriptions/:id` | 删除订阅 |
| `POST` | `/api/subscriptions/:id/events` | 追加/更新事件 |

完整 API 文档见 [`skill/SKILL.md`](skill/SKILL.md)。

## License

本项目采用 [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) 许可证 — 允许自由使用和修改，**禁止商业用途**。

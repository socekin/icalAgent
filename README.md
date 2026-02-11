**English** | [中文](README.zh-CN.md)

# iCalAgent

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

**AI Calendar Subscription Assistant** — Tell the AI what you want to track, and it automatically searches for information and generates iCal calendar subscriptions.

> Don't want to self-host? Try the author's demo instance: **[icalsub.url88.xyz](https://icalsub.url88.xyz)**
>
> **Note: The demo is for evaluation only. No availability guarantee — it may go offline at any time. Do not store important data.**

## How It Works

```
User: "Subscribe me to the NBA Lakers schedule"
  ↓
AI Agent automatically searches for schedule info
  ↓
Writes events to iCalAgent via REST API
  ↓
Generates iCal subscription link → Apple / Google / Outlook calendars sync automatically
```

The AI Agent receives instructions through a **Skill file**, uses its built-in web search capability to gather real-time information, and writes data to the platform via REST API. The platform stores events and generates standard `.ics` subscription links that any calendar client can subscribe to.

## Features

- **AI Agent Powered** — Create calendar subscriptions with a single sentence; AI searches and structures the information automatically
- **Universal Coverage** — Sports schedules, weather forecasts, movie releases, concerts, exhibitions… anything with a time component can be subscribed to
- **Standard iCal Protocol** — Compatible with Apple Calendar, Google Calendar, Outlook, and other major clients
- **Merged Calendars** — Combine multiple subscriptions into a single feed, add once and done
- **Subscription Filters** — Flexibly control which subscriptions are included in the iCal feed
- **Idempotent Design** — Same subscription_key / external_id automatically updates instead of creating duplicates
- **Turnstile Verification** — Cloudflare Turnstile protects registration and login

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 + React 19 |
| Database | Supabase (PostgreSQL + Auth) |
| UI | Tailwind CSS 4 + Shadcn UI |
| Validation | Zod v4 |
| Bot Protection | Cloudflare Turnstile |
| Deployment | Docker (standalone output) |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Cloudflare](https://dash.cloudflare.com) account (Turnstile is free)

### 1. Clone the Repository

```bash
git clone https://github.com/socekin/icalAgent.git
cd icalAgent
```

### 2. Install Dependencies

```bash
cd web
npm install
```

### 3. Set Up Supabase Database

Log in to [Supabase Dashboard](https://supabase.com/dashboard), open your project, go to **SQL Editor**, and run the following migration files in order:

```sql
-- 1. Initialize tables (copy contents of supabase/migrations/20260207000000_init.sql)
-- 2. Add encrypted fields (copy supabase/migrations/20260207100000_add_encrypted_key.sql)
-- 3. Add user profiles (copy supabase/migrations/20260207110000_add_user_profiles.sql)
-- 4. Remove deprecated fields (copy supabase/migrations/20260208100000_remove_domain_and_confidence.sql)
-- 5. Add subscription toggle (copy supabase/migrations/20260209_add_subscription_enabled.sql)
```

> Execute files in order by filename. Each file contains independent ALTER/CREATE statements.

### 4. Configure Cloudflare Turnstile

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Turnstile** in the left menu
2. Click **Add site**
3. Enter your site name, add hostnames (your domain + `localhost`)
4. Select **Managed** widget mode (recommended)
5. Copy the **Site Key** and **Secret Key**

> For development, you can skip this step and use Cloudflare test keys (see comments in `.env.example`).

### 5. Configure Environment Variables

```bash
cp web/.env.example web/.env.local
```

Edit `web/.env.local` with your Supabase and Turnstile credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
API_KEY_ENCRYPTION_SECRET=your-random-string-at-least-32-chars

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key
```

> Supabase credentials are found in your project's **Settings → API** page. Generate `API_KEY_ENCRYPTION_SECRET` with `openssl rand -hex 16`.

### 6. Start Development Server

```bash
cd web
npm run dev
```

Visit http://localhost:3000, register an account, and create an API Key in the dashboard.

## Docker Deployment

### 1. Configure Environment Variables

Create a `.env` file in the project root (**do not** commit to Git):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
API_KEY_ENCRYPTION_SECRET=your-random-string

NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key

# Optional: Telegram notification on new user registration
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

> `docker-compose.yml` reads variables from `.env` automatically: runtime variables are injected via `env_file`, while `NEXT_PUBLIC_*` variables are passed as build `args` (Next.js requires these to be inlined at build time).

### 2. Build and Start

```bash
docker compose build --no-cache
docker compose up -d
```

The service listens on port `9101` by default.

## Install Skill

iCalAgent empowers AI Agents to create calendar subscriptions through a **Skill file**.

### Claude Code

```bash
# Copy the Skill file
mkdir -p ~/.claude/skills/icalagent
cp skill/SKILL.md ~/.claude/skills/icalagent/SKILL.md
```

Then configure environment variables (add to `~/.claude/.env` or your shell profile):

```bash
export ICALAGENT_API_KEY="your-api-key"      # Create in Dashboard → API Keys
export ICALAGENT_BASE_URL="https://your-domain.com"  # Your deployment URL
```

### Verify

After installation, tell the AI:

```
Subscribe me to the weather forecast for the next 7 days in New York
```

The AI will automatically search for weather data, call the API to create a subscription, and return an iCal subscription link.

## Project Structure

```
iCalAgent/
├── web/                           # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/            # Login / Register pages
│   │   │   ├── api/               # REST API
│   │   │   │   ├── auth/          #   Authentication
│   │   │   │   ├── keys/          #   API Key management
│   │   │   │   └── subscriptions/ #   Subscriptions & events
│   │   │   ├── cal/               # iCal feed output
│   │   │   └── dashboard/         # User dashboard
│   │   ├── components/            # UI components
│   │   └── lib/                   # Core logic
│   │       ├── auth.ts            #   Auth utilities
│   │       ├── api-keys.ts        #   API Key generation & validation
│   │       ├── subscription-service.ts  # Subscription service
│   │       ├── api-schemas.ts     #   Zod request validation
│   │       ├── ics.ts             #   iCal format generation
│   │       ├── turnstile.ts       #   Turnstile verification
│   │       └── telegram.ts        #   Telegram notification (optional)
├── skill/
│   └── SKILL.md                   # AI Skill instruction file
├── supabase/
│   └── migrations/                # Database migration scripts
├── Dockerfile
├── docker-compose.yml
└── LICENSE
```

## API Overview

All APIs use Bearer Token authentication (API Key).

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/subscriptions` | Create/update subscription with events |
| `GET` | `/api/subscriptions` | List my subscriptions |
| `GET` | `/api/subscriptions/:id` | Subscription details |
| `PATCH` | `/api/subscriptions/:id` | Update subscription status |
| `DELETE` | `/api/subscriptions/:id` | Delete subscription |
| `POST` | `/api/subscriptions/:id/events` | Add/update events |

Full API documentation: [`skill/SKILL.md`](skill/SKILL.md).

## License

This project is licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — free to use and modify, **no commercial use**.

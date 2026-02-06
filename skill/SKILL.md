---
name: icalagent
description: AI 日历订阅助手。当用户提到订阅、日历、iCal、赛程、天气预报、追剧、演出，或任何"帮我把 XX 加到日历"的意图时激活此 Skill。
---

# iCalAgent Skill — AI 日历订阅助手

## 触发条件

当用户提到以下关键词时激活此 Skill：
- 订阅、日历、iCal、ics
- 赛程、比赛日程
- 天气、天气预报
- 追剧、上映、演出
- 或任何"帮我把 XX 加到日历"的意图

## 工作流程

1. **理解需求**：解析用户想要订阅的内容（什么事件、什么地区、什么时间范围）
2. **搜索信息**：使用 WebSearch 搜索相关信息（天气预报、赛程、上映日期等）
3. **格式化事件**：将搜索结果整理为 iCalAgent 事件格式
4. **写入 API**：调用 `POST /api/subscriptions` 创建订阅并写入事件
5. **返回结果**：将 iCal 订阅链接返回给用户

## 配置

需要以下环境变量：

- `ICALAGENT_API_KEY` — API 密钥（在 iCalAgent 控制台创建）
- `ICALAGENT_BASE_URL` — 服务地址（如 `https://your-domain.com`）

## API 文档

### 认证方式

所有 API 请求需要在 Header 中携带 API Key：

```
Authorization: Bearer <ICALAGENT_API_KEY>
```

### POST /api/subscriptions

创建或更新日历订阅并写入事件。

**请求体：**

```json
{
  "subscription_key": "shanghai-weather-7d",
  "display_name": "上海7日天气",
  "domain": "weather",
  "timezone": "Asia/Shanghai",
  "events": [
    {
      "external_id": "weather_shanghai_2026-02-07",
      "title": "上海天气：晴 2°C~10°C",
      "start_at": "2026-02-07T00:00:00+08:00",
      "end_at": "2026-02-07T23:59:59+08:00",
      "timezone": "Asia/Shanghai",
      "location": "上海",
      "source_url": "https://weather.com",
      "confidence": 0.9,
      "labels": ["weather", "shanghai"]
    }
  ]
}
```

**字段说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| subscription_key | 是 | 订阅唯一标识（同一 key 会更新而非重复创建） |
| display_name | 是 | 显示名称 |
| domain | 否 | 领域分类（weather/sports/entertainment 等） |
| timezone | 否 | 时区，默认 UTC |
| events | 否 | 事件数组 |
| events[].external_id | 是 | 事件唯一标识（同 subscription 下相同 external_id 会更新） |
| events[].title | 是 | 事件标题 |
| events[].start_at | 是 | 开始时间（ISO 8601） |
| events[].end_at | 否 | 结束时间 |
| events[].timezone | 否 | 事件时区，默认 UTC |
| events[].location | 否 | 地点 |
| events[].source_url | 否 | 信息来源链接 |
| events[].confidence | 否 | 置信度 0-1，默认 0.8 |
| events[].labels | 否 | 标签数组 |

**响应（201）：**

```json
{
  "subscription_id": "uuid",
  "feed_token": "feed_xxx",
  "feed_url": "https://your-domain.com/cal/feed_xxx.ics",
  "event_count": 7
}
```

### GET /api/subscriptions

列出当前用户的所有订阅。

### GET /api/subscriptions/:id

获取订阅详情和事件列表。

### DELETE /api/subscriptions/:id

删除订阅及其所有事件。

### POST /api/subscriptions/:id/events

为已有订阅追加或更新事件。

**请求体：**

```json
{
  "events": [...]
}
```

## curl 示例

```bash
# 创建天气订阅
curl -X POST "${ICALAGENT_BASE_URL}/api/subscriptions" \
  -H "Authorization: Bearer ${ICALAGENT_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "subscription_key": "shanghai-weather-7d",
    "display_name": "上海7日天气",
    "domain": "weather",
    "timezone": "Asia/Shanghai",
    "events": [
      {
        "external_id": "weather_shanghai_2026-02-07",
        "title": "上海天气：晴 2°C~10°C",
        "start_at": "2026-02-07T00:00:00+08:00",
        "end_at": "2026-02-07T23:59:59+08:00",
        "timezone": "Asia/Shanghai",
        "location": "上海",
        "source_url": "https://weather.com",
        "confidence": 0.9,
        "labels": ["weather", "shanghai"]
      }
    ]
  }'
```

## 错误处理

| 状态码 | 含义 | 处理方式 |
|--------|------|----------|
| 401 | API Key 无效或缺失 | 检查 ICALAGENT_API_KEY 是否正确配置 |
| 400 | 请求参数格式错误 | 检查请求体是否符合 schema |
| 500 | 服务器内部错误 | 稍后重试 |

## 使用示例

### 天气订阅

用户说："帮我订阅上海未来七天天气"

1. WebSearch "上海 未来7天 天气预报 2026"
2. 从搜索结果提取每日天气信息
3. 构建 events 数组，每天一个事件：
   - external_id: `weather_shanghai_YYYY-MM-DD`
   - title: `上海天气：{天气描述} {最低温}°C~{最高温}°C`
   - start_at/end_at: 当天 00:00 ~ 23:59
   - labels: `["weather", "shanghai"]`
4. POST /api/subscriptions 写入
5. 返回 feed_url 给用户

### 赛程订阅

用户说："帮我订阅 NBA 湖人队赛程"

1. WebSearch "NBA Lakers schedule 2025-2026 season"
2. 从搜索结果提取赛程信息
3. 构建 events 数组：
   - external_id: `nba_lakers_YYYY-MM-DD_vs_{对手}`
   - title: `湖人 vs {对手}`
   - location: 比赛场馆
   - labels: `["sports", "nba", "lakers"]`
4. POST /api/subscriptions 写入
5. 返回 feed_url 给用户

## 幂等性设计

- `subscription_key` 相同时更新订阅而非重复创建
- `external_id` 相同时更新事件而非重复创建
- 可以安全地多次执行相同的订阅操作

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
  "timezone": "Asia/Shanghai",
  "events": [
    {
      "external_id": "weather_shanghai_2026-02-07",
      "title": "上海天气：晴 2°C~10°C",
      "description": "风力：东南风 3-4 级\n湿度：65%\n空气质量：良\n来源：weather.com",
      "start_at": "2026-02-07T00:00:00+08:00",
      "end_at": "2026-02-07T23:59:59+08:00",
      "timezone": "Asia/Shanghai",
      "location": "上海",
      "source_url": "https://weather.com",
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
| timezone | 否 | 时区，默认 UTC |
| events | 否 | 事件数组 |
| events[].external_id | 是 | 事件唯一标识（同 subscription 下相同 external_id 会更新） |
| events[].title | 是 | 事件标题（简短，< 30 字，用于日历格子一览） |
| events[].description | 否 | 事件备注（补充详情，显示在日历 App 的备注区域，见下方填写指南） |
| events[].start_at | 是 | 开始时间（ISO 8601） |
| events[].end_at | 否 | 结束时间 |
| events[].timezone | 否 | 事件时区，默认 UTC |
| events[].location | 否 | 地点 |
| events[].source_url | 否 | 信息来源链接 |
| events[].labels | 否 | 标签数组 |

**description 填写指南：**

title 保持简短（一眼可扫），description 放补充上下文。不同场景的推荐格式：

- **体育赛事**：`"常规赛 | 2025-26 赛季\n场馆：Crypto.com Arena, Los Angeles\n转播：ESPN / 腾讯体育\n来源：nba.com"`
- **电影上映**：`"导演：Christopher McQuarrie\n主演：Tom Cruise, Hayley Atwell\n类型：动作 / 冒险 | 片长：163 分钟\n来源：imdb.com"`
- **天气预报**：`"风力：东南风 3-4 级\n湿度：65%\n空气质量：良\n来源：weather.com"`
- **演出/展览**：`"演出：周杰伦嘉年华世界巡回演唱会\n场馆：上海体育场\n票价：380-1880 元\n来源：damai.cn"`

原则：最后一行始终写 `来源：{域名}`，确保用户能溯源。

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
    "timezone": "Asia/Shanghai",
    "events": [
      {
        "external_id": "weather_shanghai_2026-02-07",
        "title": "上海天气：晴 2°C~10°C",
        "description": "风力：东南风 3-4 级\n湿度：65%\n空气质量：良\n来源：weather.com",
        "start_at": "2026-02-07T00:00:00+08:00",
        "end_at": "2026-02-07T23:59:59+08:00",
        "timezone": "Asia/Shanghai",
        "location": "上海",
        "source_url": "https://weather.com",
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
   - description: `"风力：{风向} {风力等级}\n湿度：{湿度}\n空气质量：{AQI}\n来源：weather.com"`
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
   - description: `"{赛事类型} | {赛季}\n场馆：{场馆名}, {城市}\n转播：{转播频道}\n来源：nba.com"`
   - location: 比赛场馆
   - labels: `["sports", "nba", "lakers"]`
4. POST /api/subscriptions 写入
5. 返回 feed_url 给用户

## 幂等性设计

- `subscription_key` 相同时更新订阅而非重复创建
- `external_id` 相同时更新事件而非重复创建
- 可以安全地多次执行相同的订阅操作

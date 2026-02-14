const zhCN = {
  // metadata
  "meta.title": "iCalAgent | AI 日历订阅",
  "meta.description": "通用 AI 日历订阅平台",

  // nav
  "nav.mySubscriptions": "我的订阅",
  "nav.apiKeys": "API 密钥",
  "nav.skillDownload": "Skill 下载",
  "nav.logout": "退出",

  // landing
  "landing.hero.title": "日历订阅，",
  "landing.hero.titleHighlight": "从未如此简单",
  "landing.cta.dashboard": "进入控制台",
  "landing.cta.getStarted": "立即开始",
  "landing.cta.login": "控制台登录",
  "landing.feature.aiAgent.title": "AI Agent 驱动",
  "landing.feature.aiAgent.desc": "自动搜寻全球信息并同步至日历，覆盖全面，一句话就能订阅。",
  "landing.feature.allScenarios.title": "全场景支持",
  "landing.feature.allScenarios.desc": "涵盖体育赛事、影视追剧、金融财报等，凡有时间属性的事件皆可订阅。",
  "landing.feature.liveCalendar.title": "实时在线日历",
  "landing.feature.liveCalendar.desc": "支持 Apple/Google/Outlook 多端自动拉取，一次订阅，动态更新。",
  "landing.feature.reliable.title": "真实可靠",
  "landing.feature.reliable.desc": "事件来源透明可追溯，信息置信度一目了然，幻觉问题轻松辨认。",

  // agent demo
  "demo.scenario1.query": "帮我订阅 NBA 湖人队的赛程 🏀",
  "demo.scenario1.title": "NBA 湖人队 2024-25 赛季赛程",
  "demo.scenario2.query": "订阅诺兰的新电影上映日程 🎬",
  "demo.scenario2.title": "Christopher Nolan Movies Release Dates",
  "demo.scenario3.query": "订阅 SpaceX 下一次发射事件 🚀",
  "demo.scenario3.title": "SpaceX Launch Manifest",
  "demo.state.thinking": "AI 正在分析意图...",
  "demo.state.searching": "正在全网检索赛程...",
  "demo.state.working": "生成日历订阅源...",
  "demo.badge.active": "活跃",
  "demo.result.description": "已自动过滤无关信息，仅保留核心日程。",

  // dashboard
  "dashboard.title": "我的订阅",
  "dashboard.subtitle.prefix": "目前共有 ",
  "dashboard.subtitle.suffix": " 个正在运行的日历订阅",
  "dashboard.empty.title": "还没有任何订阅",
  "dashboard.empty.description": "使用 Skill 或 API 创建你的第一个日历订阅吧",
  "dashboard.tab.calendar": "日历预览",
  "dashboard.tab.subscriptions": "我的订阅",
  "dashboard.search.placeholder": "搜索订阅...",
  "dashboard.search.noMatch": "没有匹配的订阅",
  "dashboard.search.empty": "还没有任何订阅",

  // subscription card
  "subscription.details": "详情",

  // subscription detail
  "subscriptionDetail.backLabel": "子日历详情",
  "subscriptionDetail.events": "Events",
  "subscriptionDetail.updated": "Updated",
  "subscriptionDetail.feedLink": "订阅链接",
  "subscriptionDetail.feedUrlLabel": "iCal Feed URL",
  "subscriptionDetail.calendarPreview": "日历预览",
  "subscriptionDetail.eventList": "事件列表",

  // calendar view
  "calendar.monthLabel": "{year}年{month}月",
  "calendar.backToToday": "回到今天",
  "calendar.eventsOfDate": " 的事件",
  "calendar.noEvents": "当天没有事件",
  "calendar.weekdays": "一,二,三,四,五,六,日",

  // event table
  "eventTable.empty": "当前订阅还没有可展示的事件。",
  "eventTable.colTitle": "事件标题",
  "eventTable.colTime": "时间",
  "eventTable.colStatus": "状态",
  "eventTable.colSource": "来源",
  "eventTable.viewSource": "查看",
  "eventTable.status.scheduled": "已排期",
  "eventTable.status.cancelled": "已取消",
  "eventTable.status.postponed": "已延期",

  // master feed card
  "masterFeed.title": "所有日历",
  "masterFeed.description": "在日历应用中添加此链接即可查看所有事件",

  // copy
  "copy": "复制",

  // delete subscription
  "delete.confirmTitle": "确认删除",
  "delete.confirmDescription": "确定要删除子日历「{name}」吗？关联的所有事件和同步记录将被一并删除，此操作不可撤销。",
  "delete.cancel": "取消",
  "delete.confirm": "删除",
  "delete.deleting": "删除中…",

  // subscription filter
  "filter.filterCalendars": "筛选日历",
  "filter.allCalendars": "全部日历",
  "filter.selected": "已选 {selected}/{total}",
  "filter.searchPlaceholder": "搜索日历...",
  "filter.noMatch": "无匹配结果",
  "filter.all": "全部",
  "filter.saveFailed": "保存失败，请重试",
  "filter.saved": "已保存，订阅将即时生效",
  "filter.networkError": "网络错误，请重试",

  // API keys
  "keys.title": "API 密钥",
  "keys.description": "管理用于 Skill 和 REST API 调用的密钥",
  "keys.create": "创建密钥",
  "keys.createDialog.title": "创建 API 密钥",
  "keys.createDialog.description": "为密钥设置一个名称以便识别",
  "keys.createDialog.placeholder": "密钥名称（可选）",
  "keys.createDialog.creating": "创建中...",
  "keys.createDialog.submit": "创建",
  "keys.createDialog.defaultName": "默认密钥",
  "keys.createdDialog.title": "密钥已创建",
  "keys.createdDialog.description": "请立即复制密钥，关闭后将无法再次查看完整密钥。",
  "keys.createdDialog.copied": "已复制",
  "keys.createdDialog.copy": "复制密钥",
  "keys.createdDialog.close": "关闭",
  "keys.list.title": "已创建的密钥",
  "keys.list.description": "密钥用于通过 REST API 调用 iCalAgent 服务",
  "keys.list.loading": "加载中...",
  "keys.list.empty": "还没有创建任何密钥",
  "keys.list.revoked": "已吊销",
  "keys.list.createdAt": "创建于",
  "keys.list.copyTitle": "复制密钥",
  "keys.list.copied": "已复制",
  "keys.list.revokeTitle": "吊销密钥",
  "keys.revoke.title": "确认吊销密钥",
  "keys.revoke.description": "密钥「{name}」（{prefix}...）吊销后将立即失效，使用该密钥的所有服务将无法继续访问。此操作不可撤销。",
  "keys.revoke.cancel": "取消",
  "keys.revoke.confirm": "确认吊销",
  "keys.error.cannotReveal": "无法获取密钥",
  "keys.error.network": "网络错误",

  // skill download
  "skill.title": "Skill 下载",
  "skill.description": "下载 Skill 文件并配置到你的 AI 客户端",
  "skill.card.title": "iCalAgent Skill",
  "skill.card.description": "Skill 文件是 AI 代理的指导手册，告诉它如何搜索信息并调用 iCalAgent API 创建日历订阅。",
  "skill.loadingKeys": "加载密钥列表...",
  "skill.noKeys.prefix": "你还没有可用的 API 密钥。请先",
  "skill.noKeys.createLink": "创建一个 API 密钥",
  "skill.noKeys.suffix": "，然后回来下载已配置好的 Skill 文件。",
  "skill.downloadRaw": "下载原始 SKILL.md",
  "skill.selectKey": "选择 API 密钥",
  "skill.selectKeyHint": "选择后下载的 SKILL.md 将自动嵌入该密钥和服务地址，无需手动配置环境变量。",
  "skill.download": "下载 SKILL.md",
  "skill.install.title": "安装指引",
  "skill.install.description": "下载的 SKILL.md 已包含 API 密钥和服务地址，放入对应目录即可使用。",

  // auth
  "auth.login.title": "登录 iCalAgent",
  "auth.login.description": "使用邮箱和密码登录你的账户",
  "auth.login.email": "邮箱",
  "auth.login.password": "密码",
  "auth.login.passwordPlaceholder": "至少 6 个字符",
  "auth.login.submitting": "登录中...",
  "auth.login.submit": "登录",
  "auth.login.noAccount": "还没有账户？ ",
  "auth.login.register": "注册",
  "auth.login.backHome": "返回首页",
  "auth.login.failed": "登录失败",
  "auth.login.networkError": "网络错误，请重试",

  "auth.register.title": "注册 iCalAgent",
  "auth.register.description": "创建账户以管理你的日历订阅",
  "auth.register.email": "邮箱",
  "auth.register.password": "密码",
  "auth.register.passwordPlaceholder": "至少 6 个字符",
  "auth.register.confirmPassword": "确认密码",
  "auth.register.confirmPlaceholder": "再次输入密码",
  "auth.register.submitting": "注册中...",
  "auth.register.submit": "注册",
  "auth.register.passwordMismatch": "两次输入的密码不一致",
  "auth.register.passwordTooShort": "密码至少需要 6 个字符",
  "auth.register.hasAccount": "已有账户？ ",
  "auth.register.login": "登录",
  "auth.register.failed": "注册失败",
  "auth.register.networkError": "网络错误，请重试",

  // not found
  "notFound.title": "订阅不存在",
  "notFound.description": "该订阅可能尚未创建，或者链接 token 无效。",
  "notFound.backHome": "返回首页",
} as const;

export default zhCN;

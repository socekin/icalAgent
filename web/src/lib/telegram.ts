let warned = false;

/**
 * Fire-and-forget Telegram 通知，不阻塞调用方
 */
export function notifyTelegram(message: string): void {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    if (!warned) {
      console.warn("[telegram] TELEGRAM_BOT_TOKEN 或 TELEGRAM_CHAT_ID 未配置，跳过通知");
      warned = true;
    }
    return;
  }

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  }).then((res) => {
    if (!res.ok) {
      res.text().then((body) => console.error(`[telegram] API 错误 ${res.status}:`, body));
    }
  }).catch((err) => {
    console.error("[telegram] 发送失败:", err);
  });
}

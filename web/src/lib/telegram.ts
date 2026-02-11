let warned = false;

/**
 * 发送 Telegram 通知；失败时抛错，由调用方决定是否降级处理
 */
export async function notifyTelegram(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    if (!warned) {
      console.warn("[telegram] TELEGRAM_BOT_TOKEN 或 TELEGRAM_CHAT_ID 未配置，跳过通知");
      warned = true;
    }
    return;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[telegram] API 错误 ${res.status}: ${body}`);
  }
}

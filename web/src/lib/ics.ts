import type { CalendarEvent, CalendarEventWithSub, Subscription } from "@/lib/types";

function escapeIcsText(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

function formatUtcDateTime(iso: string): string {
  const value = new Date(iso);
  return value
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(".000", "")
    .replace("Z", "");
}

function formatDateTimeWithTimezone(iso: string): string {
  const value = new Date(iso);
  const year = value.getUTCFullYear();
  const month = `${value.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${value.getUTCDate()}`.padStart(2, "0");
  const hour = `${value.getUTCHours()}`.padStart(2, "0");
  const minute = `${value.getUTCMinutes()}`.padStart(2, "0");
  const second = `${value.getUTCSeconds()}`.padStart(2, "0");
  return `${year}${month}${day}T${hour}${minute}${second}Z`;
}

function statusToIcs(status: CalendarEvent["status"]): string {
  if (status === "cancelled") {
    return "CANCELLED";
  }
  return "CONFIRMED";
}

export function buildIcs(subscription: Subscription, events: CalendarEvent[]): string {
  const nowStamp = formatUtcDateTime(new Date().toISOString());

  const body = events
    .toSorted((a, b) => a.startAt.localeCompare(b.startAt))
    .map((event) => {
      const uid = `${subscription.id}_${event.externalId}@icalagent.local`;
      const dtStart = formatDateTimeWithTimezone(event.startAt);
      const dtEnd = event.endAt ? `DTEND:${formatDateTimeWithTimezone(event.endAt)}\r\n` : "";
      const lines = [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${nowStamp}Z`,
        `DTSTART:${dtStart}`,
        `${dtEnd}`.trimEnd(),
        `SUMMARY:${escapeIcsText(event.title)}`,
        `STATUS:${statusToIcs(event.status)}`,
        event.description ? `DESCRIPTION:${escapeIcsText(event.description)}` : "",
        event.location ? `LOCATION:${escapeIcsText(event.location)}` : "",
        `URL:${escapeIcsText(event.sourceUrl)}`,
        "END:VEVENT",
      ].filter(Boolean);

      return lines.join("\r\n");
    })
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//iCalAgent//AI Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText(subscription.displayName)}`,
    `X-WR-TIMEZONE:${subscription.timezone}`,
    body,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

/**
 * 合并多个订阅的事件到一个 VCALENDAR
 */
export function buildMergedIcs(
  events: CalendarEventWithSub[],
  subscriptions: Subscription[],
): string {
  const nowStamp = formatUtcDateTime(new Date().toISOString());
  const subMap = new Map(subscriptions.map((s) => [s.id, s]));

  const body = events
    .toSorted((a, b) => a.startAt.localeCompare(b.startAt))
    .map((event) => {
      const sub = subMap.get(event.subscriptionId);
      const uid = `${event.subscriptionId}_${event.externalId}@icalagent.local`;
      const dtStart = formatDateTimeWithTimezone(event.startAt);
      const dtEnd = event.endAt ? `DTEND:${formatDateTimeWithTimezone(event.endAt)}\r\n` : "";
      const lines = [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${nowStamp}Z`,
        `DTSTART:${dtStart}`,
        `${dtEnd}`.trimEnd(),
        `SUMMARY:${escapeIcsText(event.title)}`,
        `STATUS:${statusToIcs(event.status)}`,
        event.description ? `DESCRIPTION:${escapeIcsText(event.description)}` : "",
        event.location ? `LOCATION:${escapeIcsText(event.location)}` : "",
        `URL:${escapeIcsText(event.sourceUrl)}`,
        sub ? `CATEGORIES:${escapeIcsText(sub.displayName)}` : "",
        "END:VEVENT",
      ].filter(Boolean);

      return lines.join("\r\n");
    })
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//iCalAgent//AI Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:iCalAgent - 全部日历",
    "X-WR-TIMEZONE:Asia/Shanghai",
    body,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

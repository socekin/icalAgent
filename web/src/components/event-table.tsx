import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CalendarEvent } from "@/lib/types";
import type { Locale } from "@/i18n/types";
import { t } from "@/i18n";

export function EventTable({ events, locale }: { events: CalendarEvent[]; locale: Locale }) {
  const statusLabelMap: Record<CalendarEvent["status"], string> = {
    scheduled: t(locale, "eventTable.status.scheduled"),
    cancelled: t(locale, "eventTable.status.cancelled"),
    postponed: t(locale, "eventTable.status.postponed"),
  };

  if (!events.length) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center text-sm text-zinc-500">
        {t(locale, "eventTable.empty")}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b-zinc-100 hover:bg-transparent">
            <TableHead className="h-9 text-xs font-medium text-zinc-500">{t(locale, "eventTable.colTitle")}</TableHead>
            <TableHead className="h-9 text-xs font-medium text-zinc-500">{t(locale, "eventTable.colTime")}</TableHead>
            <TableHead className="h-9 text-xs font-medium text-zinc-500">{t(locale, "eventTable.colStatus")}</TableHead>
            <TableHead className="h-9 text-right text-xs font-medium text-zinc-500">{t(locale, "eventTable.colSource")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id} className="border-b-zinc-50 hover:bg-zinc-50/50">
              <TableCell className="py-2.5 font-medium text-sm text-zinc-700">{event.title}</TableCell>
              <TableCell className="py-2.5 font-mono text-xs text-zinc-500">
                {new Date(event.startAt).toLocaleString(locale, {
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: false,
                  timeZone: event.timezone,
                })}
                {event.endAt && (
                  <span className="text-zinc-400">
                    {" – "}
                    {new Date(event.endAt).toLocaleString(locale, {
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                      timeZone: event.timezone,
                    })}
                  </span>
                )}
              </TableCell>
              <TableCell className="py-2.5">
                <Badge variant="outline" className="rounded-md border-zinc-200 px-1.5 py-0 text-[10px] font-normal text-zinc-600">
                  {statusLabelMap[event.status]}
                </Badge>
              </TableCell>
              <TableCell className="py-2.5 text-right">
                <a
                  className="text-xs text-zinc-400 decoration-zinc-200 underline-offset-2 hover:text-zinc-900 hover:underline"
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t(locale, "eventTable.viewSource")}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

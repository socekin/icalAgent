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

const statusLabelMap: Record<CalendarEvent["status"], string> = {
  scheduled: "已排期",
  cancelled: "已取消",
  postponed: "已延期",
};

export function EventTable({ events }: { events: CalendarEvent[] }) {
  if (!events.length) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 p-8 text-center text-sm text-zinc-500">
        当前订阅还没有可展示的事件。
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>事件标题</TableHead>
            <TableHead>开始时间</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>置信度</TableHead>
            <TableHead>来源</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell className="font-mono text-xs">
                {new Date(event.startAt).toLocaleString("zh-CN", {
                  hour12: false,
                })}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{statusLabelMap[event.status]}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">
                {(event.confidence * 100).toFixed(0)}%
              </TableCell>
              <TableCell>
                <a
                  className="text-sm text-zinc-700 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-950"
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  查看来源
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

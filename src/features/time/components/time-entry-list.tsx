// Completed time entries grouped by day, with per-day totals and delete. Each
// delete is a form bound to a server action, so it works without client JS.

import { Trash2 } from "lucide-react";

import { timeEntries } from "@/features/time/schema";
import { deleteEntryAction } from "@/features/time/actions";
import { formatDuration } from "@/features/time/format";

type Entry = typeof timeEntries.$inferSelect;

function dayKey(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function durationSeconds(entry: Entry): number {
  if (!entry.endedAt) return 0;
  return Math.max(
    0,
    Math.floor((entry.endedAt.getTime() - entry.startedAt.getTime()) / 1000),
  );
}

// Groups entries by day (newest first), with each day's total seconds.
function groupByDay(entries: Entry[]) {
  const order: string[] = [];
  const byDay = new Map<string, Entry[]>();
  for (const entry of entries) {
    const key = dayKey(entry.startedAt);
    if (!byDay.has(key)) {
      byDay.set(key, []);
      order.push(key);
    }
    byDay.get(key)!.push(entry);
  }
  return order.map((day) => {
    const items = byDay.get(day)!;
    const total = items.reduce((sum, entry) => sum + durationSeconds(entry), 0);
    return { day, items, total };
  });
}

export function TimeEntryList({ items }: { items: Entry[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No time logged yet. Start a timer above.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {groupByDay(items).map((group) => (
        <div key={group.day} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group.day}
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {formatDuration(group.total)}
            </span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {group.items.map((entry) => (
              <li
                key={entry.id}
                className="group flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5"
              >
                <span className="text-sm">{entry.activity}</span>
                <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                  <span className="tabular-nums">
                    {formatDuration(durationSeconds(entry))}
                  </span>
                  <form action={deleteEntryAction.bind(null, entry.id)}>
                    <button
                      type="submit"
                      aria-label="Delete entry"
                      className="flex text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Server-rendered water day view: a date header with prev/next navigation, the
// day's total against the goal as a progress bar, the quick-add and custom
// controls, and the day's entries with delete.

import Link from "next/link";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

import { addDays, formatDay } from "@/lib/iso-date";
import { removeWaterAction } from "@/features/water/actions";
import { WaterControls } from "@/features/water/components/water-forms";

type EntryRow = { id: string; amountOz: number };

type WaterViewProps = {
  date: string;
  total: number;
  goal: number;
  entries: EntryRow[];
};

const navLinkClass =
  "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

export function WaterView({ date, total, goal, entries }: WaterViewProps) {
  const percent = Math.min(100, Math.round((total / goal) * 100));
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between gap-3">
        <Link href={`/water?date=${addDays(date, -1)}`} aria-label="Previous day" className={navLinkClass}>
          <ChevronLeft className="size-5" />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-semibold tracking-tight">{formatDay(date)}</h1>
          <span className="text-xs text-muted-foreground tabular-nums">
            {total} / {goal} oz
          </span>
        </div>
        <Link href={`/water?date=${addDays(date, 1)}`} aria-label="Next day" className={navLinkClass}>
          <ChevronRight className="size-5" />
        </Link>
      </header>

      <section className="flex flex-col gap-2">
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{percent}% of goal</span>
      </section>

      <WaterControls date={date} />

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No water logged yet.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="group flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5"
            >
              <span className="text-sm tabular-nums">{entry.amountOz} oz</span>
              <form action={removeWaterAction.bind(null, entry.id)}>
                <button
                  type="submit"
                  aria-label="Delete entry"
                  className="flex opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

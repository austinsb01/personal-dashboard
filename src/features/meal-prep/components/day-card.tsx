// One day's card in the weekly view: the weekday, its calories, and the recipes
// or foods logged that day. A day link jumps to that day's nutrition view.

import Link from "next/link";

import { formatDayShort } from "@/lib/iso-date";
import type { DaySummary } from "@/features/meal-prep/week";

export function DayCard({ day, names }: { day: DaySummary; names: string[] }) {
  return (
    <Link
      href={`/nutrition?date=${day.day}`}
      className="flex flex-col gap-1 rounded-lg border bg-card px-3 py-2.5 transition-colors hover:bg-accent"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{formatDayShort(day.day)}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {day.total.calories > 0 ? `${day.total.calories} cal` : "-"}
        </span>
      </div>
      <span className="line-clamp-2 text-xs text-muted-foreground">
        {names.length > 0 ? names.join(" · ") : "nothing logged yet"}
      </span>
    </Link>
  );
}

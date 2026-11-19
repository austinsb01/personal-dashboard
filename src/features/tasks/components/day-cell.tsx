// One day in the calendar grid. The fill deepens with how much got done that
// day, and a dot marks a day that still has open to-dos.

import { formatDayLong } from "@/lib/iso-date";
import { cn } from "@/lib/utils";
import { intensityLevel, type DaySummary } from "@/features/tasks/day-summary";
import { INTENSITY_CLASSES } from "@/features/tasks/components/intensity-styles";

const DAY_OF_MONTH_START = 8;

// Spoken label for a day, e.g. "Tuesday, November 10, 1 of 2 done".
function dayLabel(day: string, summary: DaySummary): string {
  const status =
    summary.total === 0 ? "no to-dos" : `${summary.done} of ${summary.total} done`;
  return `${formatDayLong(day)}, ${status}`;
}

export function DayCell({
  day,
  summary,
  isToday,
  isSelected,
  isOutsideMonth,
  onSelect,
}: {
  day: string;
  summary: DaySummary;
  isToday: boolean;
  isSelected: boolean;
  isOutsideMonth: boolean;
  onSelect: (day: string) => void;
}) {
  const level = intensityLevel(summary.done);
  const hasOpen = summary.total > summary.done;
  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      aria-label={dayLabel(day, summary)}
      aria-pressed={isSelected}
      aria-current={isToday ? "date" : undefined}
      className={cn(
        "flex h-11 flex-col items-center justify-center rounded-lg text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-14",
        INTENSITY_CLASSES[level],
        level === 0 && "hover:bg-accent",
        isOutsideMonth && "opacity-40",
        isToday && "font-semibold inset-ring inset-ring-foreground/40",
        isSelected && "ring-2 ring-ring ring-offset-2 ring-offset-background",
      )}
    >
      <span>{Number(day.slice(DAY_OF_MONTH_START))}</span>
      <span
        aria-hidden
        className={cn("mt-0.5 size-1 rounded-full bg-current", !hasOpen && "invisible")}
      />
    </button>
  );
}

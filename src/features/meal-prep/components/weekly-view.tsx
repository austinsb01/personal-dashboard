// Server-rendered weekly meal-prep view: week navigation, average-per-day macros
// against daily targets, the seven day cards, and the ingredient rollup. All
// aggregation comes from the pure week helpers.

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { addDays, formatDayShort } from "@/lib/iso-date";
import { TargetsProgress } from "@/features/nutrition/components/targets-progress";
import type { Targets } from "@/features/settings/repo";
import {
  weekRange,
  summarizeWeekDays,
  rollUpIngredients,
  weekTotals,
  type RangeEntry,
} from "@/features/meal-prep/week";
import { DayCard } from "@/features/meal-prep/components/day-card";
import { IngredientRollupList } from "@/features/meal-prep/components/ingredient-rollup";

const navLinkClass =
  "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

// Distinct recipe-or-food names logged on a given day, in first-seen order.
function namesForDay(entries: RangeEntry[], day: string): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  for (const entry of entries) {
    if (entry.day !== day) continue;
    const name = entry.recipeName ?? entry.foodName;
    if (seen.has(name)) continue;
    seen.add(name);
    names.push(name);
  }
  return names;
}

export function WeeklyView({
  anchorDate,
  entries,
  targets,
}: {
  anchorDate: string;
  entries: RangeEntry[];
  targets: Targets;
}) {
  const range = weekRange(anchorDate);
  const days = summarizeWeekDays(range, entries);
  const { perDay } = weekTotals(days);
  const rollups = rollUpIngredients(entries);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between gap-3">
        <Link href={`/meal-prep?week=${addDays(range.from, -7)}`} aria-label="Previous week" className={navLinkClass}>
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-semibold tracking-tight">
          Week of {formatDayShort(range.from)} - {formatDayShort(range.to)}
        </h1>
        <Link href={`/meal-prep?week=${addDays(range.from, 7)}`} aria-label="Next week" className={navLinkClass}>
          <ChevronRight className="size-5" />
        </Link>
      </header>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Average per day</h2>
        <TargetsProgress total={perDay} targets={targets} />
      </section>

      <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {days.map((day) => (
          <DayCard key={day.day} day={day} names={namesForDay(entries, day.day)} />
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Ingredients this week</h2>
        <IngredientRollupList rollups={rollups} />
      </section>
    </div>
  );
}

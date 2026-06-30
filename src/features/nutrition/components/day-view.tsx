// Server-rendered nutrition day view: a date header with prev/next navigation,
// a log form, and the day's foods grouped by meal with per-meal and day totals.
// All nutrition math comes from the pure totals helper.

import Link from "next/link";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

import { addDays, formatDay } from "@/lib/iso-date";
import { removeEntryAction } from "@/features/nutrition/actions";
import {
  LogFoodForm,
  type FoodOption,
} from "@/features/nutrition/components/nutrition-forms";
import {
  summarizeDay,
  entryTotals,
  type DayEntry,
  type Totals,
} from "@/features/nutrition/totals";
import { TargetsProgress } from "@/features/nutrition/components/targets-progress";
import type { Targets } from "@/features/settings/repo";

type DayViewProps = {
  date: string;
  foods: FoodOption[];
  targets: Targets;
  entries: DayEntry[];
};

const navLinkClass =
  "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

function label(mealType: string): string {
  return mealType[0].toUpperCase() + mealType.slice(1);
}

function macroLine(totals: Totals): string {
  return `${totals.calories} cal · ${totals.proteinG}p · ${totals.carbsG}c · ${totals.fatG}f`;
}

export function DayView({ date, foods, targets, entries }: DayViewProps) {
  const summary = summarizeDay(entries);
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between gap-3">
        <Link
          href={`/nutrition?date=${addDays(date, -1)}`}
          aria-label="Previous day"
          className={navLinkClass}
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-semibold tracking-tight">
            {formatDay(date)}
          </h1>
        </div>
        <Link
          href={`/nutrition?date=${addDays(date, 1)}`}
          aria-label="Next day"
          className={navLinkClass}
        >
          <ChevronRight className="size-5" />
        </Link>
      </header>

      <TargetsProgress total={summary.total} targets={targets} />

      <LogFoodForm date={date} foods={foods} />

      {summary.meals.length === 0 ? (
        <p className="text-sm text-muted-foreground">No food logged yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {summary.meals.map((meal) => (
            <section key={meal.mealType} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {label(meal.mealType)}
                </h2>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {macroLine(meal.totals)}
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {meal.entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="group flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm">{entry.foodName}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {entry.quantity} × {entry.servingLabel}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                      <span className="tabular-nums">{macroLine(entryTotals(entry))}</span>
                      <form action={removeEntryAction.bind(null, entry.id)}>
                        <button
                          type="submit"
                          aria-label="Delete entry"
                          className="flex opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

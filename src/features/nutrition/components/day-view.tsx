// Server-rendered nutrition day view: a date header with prev/next navigation,
// log forms, and the day's foods grouped by meal with per-meal and day totals.
// Entries sharing a source recipe collapse under the recipe name. All nutrition
// math comes from the pure totals helper.

import Link from "next/link";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

import { addDays, formatDay } from "@/lib/iso-date";
import { removeEntryAction } from "@/features/nutrition/actions";
import {
  LogFoodForm,
  type FoodOption,
} from "@/features/nutrition/components/nutrition-forms";
import { LogRecipeForm } from "@/features/nutrition/components/log-recipe-form";
import {
  summarizeDay,
  entryTotals,
  groupMealEntries,
  type DayEntry,
  type Totals,
  type MealGroup,
} from "@/features/nutrition/totals";
import { TargetsProgress } from "@/features/nutrition/components/targets-progress";
import type { Targets } from "@/features/settings/repo";
import type { RecipeListItem } from "@/features/recipes/repo";

type DayViewProps = {
  date: string;
  foods: FoodOption[];
  recipes: RecipeListItem[];
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

// Flattens meal groups into display rows: a recipe group renders as one labeled
// row (no per-row delete in v1); a single food keeps its own delete action.
function groupRows(groups: MealGroup[]) {
  return groups.map((group) =>
    group.kind === "food"
      ? {
          key: group.entry.id,
          name: group.entry.foodName,
          sub: `${group.entry.quantity} × ${group.entry.servingLabel}`,
          totals: entryTotals(group.entry),
          entryId: group.entry.id,
          recipe: false,
        }
      : {
          key: group.recipeId,
          name: group.recipeName,
          sub: `${group.entries.length} ingredients`,
          totals: group.totals,
          entryId: null,
          recipe: true,
        },
  );
}

export function DayView({ date, foods, recipes, targets, entries }: DayViewProps) {
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
      <LogRecipeForm date={date} recipes={recipes} />

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
                {groupRows(groupMealEntries(meal.entries)).map((row) => (
                  <li
                    key={row.key}
                    className="group flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {row.name}
                        {row.recipe && (
                          <span className="ml-2 text-xs text-muted-foreground">recipe</span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {row.sub}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                      <span className="tabular-nums">{macroLine(row.totals)}</span>
                      {row.entryId && (
                        <form action={removeEntryAction.bind(null, row.entryId)}>
                          <button
                            type="submit"
                            aria-label="Delete entry"
                            className="flex opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </form>
                      )}
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

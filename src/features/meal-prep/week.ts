// Pure helpers for the weekly meal-prep view: the Mon-Sun range for a date, the
// per-day macro summaries, and the ingredient rollup (grouped by food across the
// whole week). No database access here; the page passes in range entries.

import { addDays } from "@/lib/iso-date";
import { summarizeDay, type DayEntry, type Totals } from "@/features/nutrition/totals";
import type { MealType } from "@/features/nutrition/validation";

export type RangeEntry = {
  id: string;
  day: string;
  mealType: MealType;
  quantity: number;
  foodName: string;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sourceRecipeId: string | null;
  recipeName: string | null;
};

export type WeekRange = { from: string; to: string; days: string[] };

export type DaySummary = { day: string; total: Totals };

export type IngredientRollup = {
  foodName: string;
  servingLabel: string;
  totalQuantity: number;
  totals: Totals;
  usedIn: { label: string; day: string }[];
};

// Monday as day 0. JS getUTCDay: Sunday=0..Saturday=6.
function mondayOffset(isoDate: string): number {
  const dow = new Date(`${isoDate}T00:00:00Z`).getUTCDay();
  return (dow + 6) % 7;
}

// The Mon-Sun window (and its seven day strings) containing the given date.
export function weekRange(isoDate: string): WeekRange {
  const from = addDays(isoDate, -mondayOffset(isoDate));
  const days = Array.from({ length: 7 }, (_, i) => addDays(from, i));
  return { from, to: days[6], days };
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

// Adapts a range entry to the nutrition DayEntry shape for reuse of summarizeDay.
function asDayEntry(entry: RangeEntry): DayEntry {
  return {
    id: entry.id,
    mealType: entry.mealType,
    quantity: entry.quantity,
    foodName: entry.foodName,
    servingLabel: entry.servingLabel,
    calories: entry.calories,
    proteinG: entry.proteinG,
    carbsG: entry.carbsG,
    fatG: entry.fatG,
    sourceRecipeId: entry.sourceRecipeId,
    recipeName: entry.recipeName,
  };
}

// One macro summary per day in the range, in order, empty days included.
export function summarizeWeekDays(range: WeekRange, entries: RangeEntry[]): DaySummary[] {
  return range.days.map((day) => {
    const forDay = entries.filter((entry) => entry.day === day).map(asDayEntry);
    return { day, total: summarizeDay(forDay).total };
  });
}

// Groups every entry in the week by food, summing servings and macros, and
// records the recipes (or "Direct") and days that used it. Sorted by calories.
export function rollUpIngredients(entries: RangeEntry[]): IngredientRollup[] {
  const byFood = new Map<string, IngredientRollup>();
  const seenUse = new Set<string>();
  for (const entry of entries) {
    const existing =
      byFood.get(entry.foodName) ??
      {
        foodName: entry.foodName,
        servingLabel: entry.servingLabel,
        totalQuantity: 0,
        totals: { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
        usedIn: [],
      };
    existing.totalQuantity = round1(existing.totalQuantity + entry.quantity);
    existing.totals = {
      calories: existing.totals.calories + entry.calories * entry.quantity,
      proteinG: existing.totals.proteinG + entry.proteinG * entry.quantity,
      carbsG: existing.totals.carbsG + entry.carbsG * entry.quantity,
      fatG: existing.totals.fatG + entry.fatG * entry.quantity,
    };
    const label = entry.recipeName ?? "Direct";
    const useKey = `${entry.foodName}|${label}|${entry.day}`;
    if (!seenUse.has(useKey)) {
      seenUse.add(useKey);
      existing.usedIn.push({ label, day: entry.day });
    }
    byFood.set(entry.foodName, existing);
  }
  const rollups = [...byFood.values()].map((r) => ({
    ...r,
    totals: {
      calories: Math.round(r.totals.calories),
      proteinG: round1(r.totals.proteinG),
      carbsG: round1(r.totals.carbsG),
      fatG: round1(r.totals.fatG),
    },
  }));
  return rollups.sort((a, b) => b.totals.calories - a.totals.calories);
}

// Whole-week totals and the average per day, for the header.
export function weekTotals(days: DaySummary[]): { total: Totals; perDay: Totals } {
  const total = days.reduce(
    (acc, d) => ({
      calories: acc.calories + d.total.calories,
      proteinG: acc.proteinG + d.total.proteinG,
      carbsG: acc.carbsG + d.total.carbsG,
      fatG: acc.fatG + d.total.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
  const perDay = {
    calories: Math.round(total.calories / 7),
    proteinG: round1(total.proteinG / 7),
    carbsG: round1(total.carbsG / 7),
    fatG: round1(total.fatG / 7),
  };
  return { total, perDay };
}

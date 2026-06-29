// Pure day-summary helper for nutrition: turns a day's raw entries (each with
// per-serving macros and a quantity) into per-meal groups and totals plus a day
// total. Kept pure so the day-view component stays presentational.

import { MEAL_TYPES, type MealType } from "./validation";

export type DayEntry = {
  id: string;
  mealType: MealType;
  quantity: number;
  foodName: string;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type Totals = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type MealSummary = {
  mealType: MealType;
  entries: DayEntry[];
  totals: Totals;
};

export type DaySummary = {
  meals: MealSummary[];
  total: Totals;
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

// Sums raw quantity-scaled nutrition, rounding once at the end.
function sumTotals(entries: DayEntry[]): Totals {
  const raw = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories * e.quantity,
      proteinG: acc.proteinG + e.proteinG * e.quantity,
      carbsG: acc.carbsG + e.carbsG * e.quantity,
      fatG: acc.fatG + e.fatG * e.quantity,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
  return {
    calories: Math.round(raw.calories),
    proteinG: round1(raw.proteinG),
    carbsG: round1(raw.carbsG),
    fatG: round1(raw.fatG),
  };
}

// Per-entry contribution (quantity x per-serving nutrition).
export function entryTotals(entry: DayEntry): Totals {
  return sumTotals([entry]);
}

// Groups a day's entries by meal in canonical order (non-empty meals only),
// with per-meal totals and a day total.
export function summarizeDay(entries: DayEntry[]): DaySummary {
  const meals = MEAL_TYPES.flatMap((mealType) => {
    const forMeal = entries.filter((entry) => entry.mealType === mealType);
    if (forMeal.length === 0) return [];
    return [{ mealType, entries: forMeal, totals: sumTotals(forMeal) }];
  });
  return { meals, total: sumTotals(entries) };
}

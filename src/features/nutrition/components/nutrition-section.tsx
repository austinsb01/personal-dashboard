// Server section for the nutrition analytics card: loads daily totals for the
// window, rounds and gap-fills them, and renders the trend chart in a ChartCard.

import { ChartCard } from "@/components/charts/chart-card";
import { fillDays } from "@/lib/analytics/series";
import { nutritionRepo } from "@/features/nutrition/repo";
import {
  NutritionTrendChart,
  type NutritionTrendPoint,
} from "@/features/nutrition/components/nutrition-trend-chart";

const EMPTY = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };

function round1(value: number): number {
  return Math.round(Number(value) * 10) / 10;
}

export async function NutritionSection({
  from,
  to,
  days,
}: {
  from: string;
  to: string;
  days: string[];
}) {
  const rows = await nutritionRepo.dailyTotals(from, to);
  const data: NutritionTrendPoint[] = fillDays(
    days,
    rows.map((row) => ({
      day: row.day,
      calories: Math.round(Number(row.calories)),
      proteinG: round1(row.proteinG),
      carbsG: round1(row.carbsG),
      fatG: round1(row.fatG),
    })),
    EMPTY,
  );
  return (
    <ChartCard title="Nutrition" description="Daily calories and macros">
      <NutritionTrendChart data={data} />
    </ChartCard>
  );
}

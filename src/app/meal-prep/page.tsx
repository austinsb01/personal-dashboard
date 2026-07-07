import { nutritionRepo } from "@/features/nutrition/repo";
import { settingsRepo } from "@/features/settings/repo";
import { WeeklyView } from "@/features/meal-prep/components/weekly-view";
import { weekRange } from "@/features/meal-prep/week";
import { isIsoDate, todayIso } from "@/lib/iso-date";

export const dynamic = "force-dynamic";

export default async function MealPrepPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const params = await searchParams;
  const anchor = params.week && isIsoDate(params.week) ? params.week : todayIso();
  const range = weekRange(anchor);

  const [entries, targets] = await Promise.all([
    nutritionRepo.listEntriesForRange(range.from, range.to),
    settingsRepo.getTargets(),
  ]);

  return <WeeklyView anchorDate={anchor} entries={entries} targets={targets} />;
}

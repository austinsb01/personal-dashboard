import { nutritionRepo } from "@/features/nutrition/repo";
import { recipesRepo } from "@/features/recipes/repo";
import { DayView } from "@/features/nutrition/components/day-view";
import { settingsRepo } from "@/features/settings/repo";
import { isIsoDate, todayIso } from "@/lib/iso-date";

export const dynamic = "force-dynamic";

export default async function NutritionPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = params.date && isIsoDate(params.date) ? params.date : todayIso();

  const [foods, recipes, entries, targets] = await Promise.all([
    nutritionRepo.listFoods(),
    recipesRepo.listRecipes(),
    nutritionRepo.listEntriesForDay(date),
    settingsRepo.getTargets(),
  ]);

  return (
    <DayView date={date} foods={foods} recipes={recipes} targets={targets} entries={entries} />
  );
}

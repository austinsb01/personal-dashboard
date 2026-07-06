// The week's ingredient rollup: every food used, with total servings and macros,
// each expandable to the recipes/days that used it. This is the batch/shopping
// list. Uses native details/summary so it stays a server component.

import type { IngredientRollup } from "@/features/meal-prep/week";

export function IngredientRollupList({ rollups }: { rollups: IngredientRollup[] }) {
  if (rollups.length === 0) {
    return <p className="text-sm text-muted-foreground">Nothing logged this week yet.</p>;
  }
  return (
    <div className="flex flex-col gap-1.5">
      {rollups.map((row) => (
        <details key={row.foodName} className="rounded-lg border bg-card px-3 py-2.5">
          <summary className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-sm">{row.foodName}</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {row.totalQuantity} × {row.servingLabel} · {row.totals.calories} cal · {row.totals.proteinG}p
            </span>
          </summary>
          <ul className="mt-2 flex flex-col gap-1 border-l-2 border-primary/40 pl-3">
            {row.usedIn.map((use) => (
              <li key={`${use.label}-${use.day}`} className="text-xs text-muted-foreground">
                {use.label} · {use.day}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}

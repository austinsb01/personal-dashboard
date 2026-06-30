// Presentational progress block for the nutrition day view: the day's calories
// and macros against their daily targets, each as a labeled progress bar.

import type { Totals } from "@/features/nutrition/totals";
import type { Targets } from "@/features/settings/repo";

const ROWS = [
  { key: "calories", label: "Calories", unit: "cal" },
  { key: "proteinG", label: "Protein", unit: "g" },
  { key: "carbsG", label: "Carbs", unit: "g" },
  { key: "fatG", label: "Fat", unit: "g" },
] as const;

export function TargetsProgress({
  total,
  targets,
}: {
  total: Totals;
  targets: Targets;
}) {
  return (
    <section className="flex flex-col gap-3">
      {ROWS.map((row) => {
        const value = total[row.key];
        const goal = targets[row.key];
        const percent = goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 0;
        return (
          <div key={row.key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground tabular-nums">
              <span>{row.label}</span>
              <span>{value} / {goal} {row.unit}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </section>
  );
}

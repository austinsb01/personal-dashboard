// Presentational list of goals: title, description, a progress bar, a
// set-progress control, and delete. Controls are forms bound to server
// actions, so they work without client JS.

import { Trash2 } from "lucide-react";

import { goals } from "@/features/goals/schema";
import { setGoalProgressAction, deleteGoalAction } from "@/features/goals/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Goal = typeof goals.$inferSelect;

function formatTargetDate(date: Date): string {
  return `Target ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export function GoalList({ items }: { items: Goal[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No goals yet. Add your first one above.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((goal) => (
        <li
          key={goal.id}
          className="group flex flex-col gap-2 rounded-lg border bg-card px-3 py-2.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{goal.title}</span>
              {goal.description && (
                <span className="text-xs text-muted-foreground">
                  {goal.description}
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {goal.targetDate && (
                <span className="text-xs text-muted-foreground">
                  {formatTargetDate(goal.targetDate)}
                </span>
              )}
              <form action={deleteGoalAction.bind(null, goal.id)}>
                <button
                  type="submit"
                  aria-label="Delete goal"
                  className="flex text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {goal.progress}%
            </span>
          </div>

          <form
            action={setGoalProgressAction.bind(null, goal.id)}
            className="flex items-center gap-2"
          >
            <Input
              name="progress"
              type="number"
              min={0}
              max={100}
              defaultValue={goal.progress}
              aria-label="Progress percent"
              className="h-8 w-20"
            />
            <Button type="submit" variant="outline" size="sm">
              Set
            </Button>
          </form>
        </li>
      ))}
    </ul>
  );
}

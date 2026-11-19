// One to-do row: tap the row to check it off or reopen it, and a delete button
// that is always visible so it works on touch screens.

import { CheckCircle2, Circle, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { isPendingTask } from "@/features/tasks/optimistic";
import type { DayTask } from "@/features/tasks/schema";

export function TaskItem({
  task,
  onToggle,
  onRemove,
}: {
  task: DayTask;
  onToggle: (task: DayTask) => void;
  onRemove: (task: DayTask) => void;
}) {
  const isPending = isPendingTask(task);
  return (
    <li
      className={cn(
        "flex items-center rounded-lg border bg-card transition-opacity",
        isPending && "opacity-60",
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(task)}
        disabled={isPending}
        aria-pressed={task.isCompleted}
        className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {task.isCompleted ? (
          <CheckCircle2 className="size-5 shrink-0 text-primary" />
        ) : (
          <Circle className="size-5 shrink-0 text-muted-foreground" />
        )}
        <span
          className={cn(
            "min-w-0 wrap-anywhere",
            task.isCompleted && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onRemove(task)}
        disabled={isPending}
        aria-label={`Delete ${task.title}`}
        className="flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-destructive focus-visible:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}

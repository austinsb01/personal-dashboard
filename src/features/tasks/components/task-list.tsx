// Presentational list of tasks. Renders title, priority, due date, and
// completion state. Receives rows from the server; holds no state.

import { tasks } from "@/features/tasks/schema";
import { cn } from "@/lib/utils";

type Task = typeof tasks.$inferSelect;

function formatDueDate(date: Date): string {
  return `Due ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export function TaskList({ items }: { items: Task[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No tasks yet. Add your first one above.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5"
        >
          <span
            className={cn(
              "text-sm",
              task.isCompleted && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </span>
          <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
            <span className="capitalize">{task.priority}</span>
            {task.dueDate && <span>{formatDueDate(task.dueDate)}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}

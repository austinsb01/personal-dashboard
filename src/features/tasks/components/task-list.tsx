// Presentational list of tasks with complete-toggle and delete controls. Each
// control is a form bound to a server action, so it works without client JS.

import { Circle, CheckCircle2, Trash2 } from "lucide-react";

import { tasks } from "@/features/tasks/schema";
import { toggleTaskAction, deleteTaskAction } from "@/features/tasks/actions";
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
          className="group flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5"
        >
          <form action={toggleTaskAction.bind(null, task.id, !task.isCompleted)}>
            <button
              type="submit"
              aria-label={task.isCompleted ? "Mark as not done" : "Mark as done"}
              className="flex text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
            >
              {task.isCompleted ? (
                <CheckCircle2 className="size-4 text-primary" />
              ) : (
                <Circle className="size-4" />
              )}
            </button>
          </form>

          <span
            className={cn(
              "flex-1 text-sm",
              task.isCompleted && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </span>

          <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
            <span className="capitalize">{task.priority}</span>
            {task.dueDate && <span>{formatDueDate(task.dueDate)}</span>}
          </div>

          <form action={deleteTaskAction.bind(null, task.id)}>
            <button
              type="submit"
              aria-label="Delete task"
              className="flex text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
            >
              <Trash2 className="size-4" />
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}

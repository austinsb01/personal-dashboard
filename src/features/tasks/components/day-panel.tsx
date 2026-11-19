// The selected day: its date, how much is done, the add field, and the day's
// to-dos with open ones first. Past days read as a log of what was done.

import { ProgressBar } from "@/components/ui/progress-bar";
import { formatDayLong } from "@/lib/iso-date";
import { isPastDay } from "@/features/tasks/day-summary";
import type { DayTask } from "@/features/tasks/schema";
import { QuickAddForm } from "@/features/tasks/components/quick-add-form";
import { TaskItem } from "@/features/tasks/components/task-item";

const COPY = {
  past: { placeholder: "Add something you did...", empty: "Nothing logged for this day." },
  upcoming: { placeholder: "Add a to-do...", empty: "Nothing on the list yet." },
} as const;

export function DayPanel({
  day,
  today,
  tasks,
  error,
  onAdd,
  onToggle,
  onRemove,
}: {
  day: string;
  today: string;
  tasks: readonly DayTask[];
  error: string | null;
  onAdd: (title: string) => void;
  onToggle: (task: DayTask) => void;
  onRemove: (task: DayTask) => void;
}) {
  const copy = isPastDay(day, today) ? COPY.past : COPY.upcoming;
  const openTasks = tasks.filter((task) => !task.isCompleted);
  const doneTasks = tasks.filter((task) => task.isCompleted);
  const progressLabel = `${doneTasks.length} of ${tasks.length} done`;

  return (
    <section aria-label="Selected day" className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex flex-col">
            {day === today && (
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Today
              </span>
            )}
            <h2 className="text-lg font-semibold tracking-tight">{formatDayLong(day)}</h2>
          </div>
          {tasks.length > 0 && (
            <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
              {progressLabel}
            </span>
          )}
        </div>
        {tasks.length > 0 && (
          <ProgressBar fraction={doneTasks.length / tasks.length} label={progressLabel} />
        )}
      </header>
      <QuickAddForm placeholder={copy.placeholder} onAdd={onAdd} />
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">{copy.empty}</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {[...openTasks, ...doneTasks].map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </section>
  );
}

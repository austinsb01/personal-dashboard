// Optimistic updates for the to-do board: a pure reducer that applies a
// pending change to the task list so the UI responds before the server does.

import type { DayTask } from "./schema";

const PENDING_ID_PREFIX = "pending-";

export type TaskChange =
  | { readonly type: "add"; readonly task: DayTask }
  | {
      readonly type: "toggle";
      readonly id: string;
      readonly isCompleted: boolean;
      readonly day: string;
    }
  | { readonly type: "remove"; readonly id: string };

// Placeholder id for a task that has not been saved yet.
export function pendingTaskId(sequence: number): string {
  return `${PENDING_ID_PREFIX}${sequence}`;
}

// True while a task only exists optimistically and has no server id.
export function isPendingTask(task: Pick<DayTask, "id">): boolean {
  return task.id.startsWith(PENDING_ID_PREFIX);
}

// Returns a new task list with the change applied.
export function applyTaskChange(
  tasks: readonly DayTask[],
  change: TaskChange,
): DayTask[] {
  switch (change.type) {
    case "add":
      return [...tasks, change.task];
    case "toggle":
      return tasks.map((task) =>
        task.id === change.id
          ? { ...task, isCompleted: change.isCompleted, day: change.day }
          : task,
      );
    case "remove":
      return tasks.filter((task) => task.id !== change.id);
  }
}

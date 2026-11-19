// Per-day task rules for the to-do calendar. Unfinished tasks from past days
// carry over to today; finished tasks stay on the day they were done. Pure
// functions shared by the server actions and the UI.

import { INTENSITY_THRESHOLDS } from "./constants";
import type { DayTask } from "./schema";

export type DaySummary = { readonly done: number; readonly total: number };

const EMPTY_SUMMARY: DaySummary = { done: 0, total: 0 };

// True for days before today.
export function isPastDay(day: string, today: string): boolean {
  return day < today;
}

// The day a task is shown on: today for unfinished past tasks, else its own.
export function effectiveDay(
  task: Pick<DayTask, "day" | "isCompleted">,
  today: string,
): string {
  return !task.isCompleted && isPastDay(task.day, today) ? today : task.day;
}

// The tasks shown on a given day, in their original order.
export function tasksForDay<T extends Pick<DayTask, "day" | "isCompleted">>(
  tasks: readonly T[],
  day: string,
  today: string,
): T[] {
  return tasks.filter((task) => effectiveDay(task, today) === day);
}

// Done and total counts keyed by the day each task is shown on.
export function summarizeDays(
  tasks: readonly Pick<DayTask, "day" | "isCompleted">[],
  today: string,
): ReadonlyMap<string, DaySummary> {
  return tasks.reduce((summaries, task) => {
    const day = effectiveDay(task, today);
    const current = summaries.get(day) ?? EMPTY_SUMMARY;
    return new Map(summaries).set(day, {
      done: current.done + (task.isCompleted ? 1 : 0),
      total: current.total + 1,
    });
  }, new Map<string, DaySummary>());
}

// Heat level for a day, from 0 (nothing done) up to the number of thresholds.
export function intensityLevel(done: number): number {
  return INTENSITY_THRESHOLDS.filter((threshold) => done >= threshold).length;
}

"use server";

// Server actions for tasks. Each validates its input at the boundary, delegates
// to the repository, and returns a result the board can show on failure.

import { revalidatePath } from "next/cache";

import { env } from "@/lib/env";
import { todayIso } from "@/lib/iso-date";
import { TASKS_PATH } from "./constants";
import { isPastDay } from "./day-summary";
import { tasksRepo } from "./repo";
import { createTaskSchema, taskIdSchema, toggleTaskSchema } from "./validation";

export type TaskActionResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly error: string };

const INVALID_INPUT = {
  ok: false,
  error: "That did not look right. Please try again.",
} as const satisfies TaskActionResult;

// Runs a repository write, logs any failure, and refreshes the tasks page.
async function runMutation(
  failureMessage: string,
  mutate: () => Promise<void>,
): Promise<TaskActionResult> {
  try {
    await mutate();
  } catch (error) {
    console.error(failureMessage, error);
    return { ok: false, error: failureMessage };
  }
  revalidatePath(TASKS_PATH);
  return { ok: true };
}

// Adds a task to a day. Tasks added to a past day are logged as already done.
export async function createTaskAction(input: unknown): Promise<TaskActionResult> {
  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? INVALID_INPUT.error };
  }
  const isCompleted = isPastDay(parsed.data.day, todayIso(env.APP_TIME_ZONE));
  return runMutation("Could not add the to-do. Please try again.", () =>
    tasksRepo.create(parsed.data, isCompleted),
  );
}

// Marks a task done or not done on the day it is shown.
export async function toggleTaskAction(input: unknown): Promise<TaskActionResult> {
  const parsed = toggleTaskSchema.safeParse(input);
  if (!parsed.success) return INVALID_INPUT;
  return runMutation("Could not update the to-do. Please try again.", () =>
    tasksRepo.setCompleted(parsed.data),
  );
}

// Deletes a task.
export async function deleteTaskAction(id: unknown): Promise<TaskActionResult> {
  const parsed = taskIdSchema.safeParse(id);
  if (!parsed.success) return INVALID_INPUT;
  return runMutation("Could not delete the to-do. Please try again.", () =>
    tasksRepo.remove(parsed.data),
  );
}

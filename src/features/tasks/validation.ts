// Zod validation for task input, applied at the server-action boundary.

import { z } from "zod";

import { TASK_TITLE_MAX_LENGTH } from "./constants";

export const taskIdSchema = z.uuid();

export const taskDaySchema = z.iso.date();

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(
      TASK_TITLE_MAX_LENGTH,
      `Title must be ${TASK_TITLE_MAX_LENGTH} characters or fewer`,
    ),
  day: taskDaySchema,
});

export const toggleTaskSchema = z.object({
  id: taskIdSchema,
  isCompleted: z.boolean(),
  day: taskDaySchema,
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type ToggleTaskInput = z.infer<typeof toggleTaskSchema>;

// Zod validation for task input. Priority values are derived from the shared
// constants so there is a single source of truth.

import { z } from "zod";

import { TASK_PRIORITIES } from "./constants";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  priority: z.enum(TASK_PRIORITIES).default("medium"),
  dueDate: z.coerce.date().nullable().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

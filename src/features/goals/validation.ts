// Zod validation for goal input. Progress is a 0-100 integer percent.

import { z } from "zod";

export const createGoalSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer")
    .nullable()
    .optional(),
  targetDate: z.coerce.date().nullable().optional(),
});

export const goalProgressSchema = z.coerce
  .number()
  .int("Progress must be a whole number")
  .min(0, "Progress cannot be below 0")
  .max(100, "Progress cannot exceed 100");

export type CreateGoalInput = z.infer<typeof createGoalSchema>;

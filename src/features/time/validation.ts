// Zod validation for time-tracking input.

import { z } from "zod";

export const startTimerSchema = z.object({
  activity: z
    .string()
    .trim()
    .min(1, "Activity is required")
    .max(120, "Activity must be 120 characters or fewer"),
});

export type StartTimerInput = z.infer<typeof startTimerSchema>;

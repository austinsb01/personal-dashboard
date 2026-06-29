// Task priority values. Single source of truth shared by the schema (DB enum),
// validation, and the UI so the options never drift.

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

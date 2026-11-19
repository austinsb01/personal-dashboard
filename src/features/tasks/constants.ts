// Task constants. Single source of truth shared by the schema (DB enum),
// validation, and the UI so the values never drift.

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_TITLE_MAX_LENGTH = 200;

export const TASKS_PATH = "/tasks";

// Completed-task counts at which a calendar day steps up one heat level.
export const INTENSITY_THRESHOLDS = [1, 3, 5, 7] as const;

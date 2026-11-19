// Drizzle table definition for to-do tasks. One row per task. `day` is the
// calendar day the task sits on: the day it is planned for while open, and the
// day it was done once completed.

import { pgTable, uuid, text, boolean, date, timestamp, index, pgEnum } from "drizzle-orm/pg-core";

import { TASK_PRIORITIES } from "./constants";

export const taskPriority = pgEnum("task_priority", TASK_PRIORITIES);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    day: date("day", { mode: "string" }).notNull(),
    isCompleted: boolean("is_completed").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    priority: taskPriority("priority").notNull().default("medium"),
    dueDate: timestamp("due_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("tasks_day_idx").on(table.day),
    index("tasks_due_date_idx").on(table.dueDate),
    index("tasks_created_at_idx").on(table.createdAt),
  ],
);

export type Task = typeof tasks.$inferSelect;

export type DayTask = Pick<Task, "id" | "title" | "day" | "isCompleted">;

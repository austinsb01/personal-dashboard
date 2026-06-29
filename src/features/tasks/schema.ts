// Drizzle table definition for to-do tasks. One row per task.

import { pgTable, uuid, text, boolean, timestamp, index, pgEnum } from "drizzle-orm/pg-core";

export const taskPriority = pgEnum("task_priority", ["low", "medium", "high"]);

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    isCompleted: boolean("is_completed").notNull().default(false),
    priority: taskPriority("priority").notNull().default("medium"),
    dueDate: timestamp("due_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("tasks_due_date_idx").on(table.dueDate),
    index("tasks_created_at_idx").on(table.createdAt),
  ],
);

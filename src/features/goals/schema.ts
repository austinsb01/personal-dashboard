// Drizzle table definition for longer-term goals. One row per goal.

import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";

export const goals = pgTable(
  "goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    progress: integer("progress").notNull().default(0),
    targetDate: timestamp("target_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("goals_target_date_idx").on(table.targetDate),
    index("goals_created_at_idx").on(table.createdAt),
  ],
);

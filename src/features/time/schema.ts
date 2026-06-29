// Drizzle table definition for time-tracking entries. One row per timed
// session of an activity; ended_at is null while the timer is running.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

export const timeEntries = pgTable(
  "time_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    activity: text("activity").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("time_entries_started_at_idx").on(table.startedAt),
    index("time_entries_ended_at_idx").on(table.endedAt),
  ],
);

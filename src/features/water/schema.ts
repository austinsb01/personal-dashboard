// Drizzle table for the water feature: one row per logged amount of water on a
// calendar date, in fluid ounces. The daily total is the sum for the date.

import { pgTable, uuid, real, date, timestamp, index } from "drizzle-orm/pg-core";

export const waterEntries = pgTable(
  "water_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    loggedOn: date("logged_on", { mode: "string" }).notNull(),
    amountOz: real("amount_oz").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("water_entries_logged_on_idx").on(table.loggedOn)],
);

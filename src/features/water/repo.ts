// Typed data access for the water feature. The only place its rows are read or
// written. Amounts are fluid ounces; a day's total is the sum for the date.

import { asc, between, eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { waterEntries } from "./schema";
import type { AddWaterInput } from "./validation";

export const waterRepo = {
  // Entries for a date, oldest first.
  listForDay(loggedOn: string) {
    return db
      .select({ id: waterEntries.id, amountOz: waterEntries.amountOz })
      .from(waterEntries)
      .where(eq(waterEntries.loggedOn, loggedOn))
      .orderBy(asc(waterEntries.createdAt));
  },

  // Total ounces logged for a date.
  async dailyTotalForDay(loggedOn: string) {
    const [row] = await db
      .select({ total: sql<number>`coalesce(sum(${waterEntries.amountOz}), 0)` })
      .from(waterEntries)
      .where(eq(waterEntries.loggedOn, loggedOn));
    return Number(row?.total ?? 0);
  },

  // Adds an amount of water for a date.
  async addEntry(loggedOn: string, input: AddWaterInput) {
    await db.insert(waterEntries).values({ loggedOn, amountOz: input.amountOz });
  },

  async removeEntry(id: string) {
    await db.delete(waterEntries).where(eq(waterEntries.id, id));
  },

  // Per-day total ounces over a window, days with entries only (for analytics).
  dailyTotals(from: string, to: string) {
    return db
      .select({
        day: waterEntries.loggedOn,
        oz: sql<number>`coalesce(sum(${waterEntries.amountOz}), 0)`,
      })
      .from(waterEntries)
      .where(between(waterEntries.loggedOn, from, to))
      .groupBy(waterEntries.loggedOn)
      .orderBy(asc(waterEntries.loggedOn));
  },
};

// Typed data access for time entries. The only place rows are read or written.

import { and, desc, eq, gte, isNull, isNotNull, lt, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { timeEntries } from "./schema";
import type { StartTimerInput } from "./validation";

export const timeRepo = {
  // The currently running entry (ended_at is null), or null.
  async findRunning() {
    const [entry] = await db
      .select()
      .from(timeEntries)
      .where(isNull(timeEntries.endedAt))
      .orderBy(desc(timeEntries.startedAt))
      .limit(1);
    return entry ?? null;
  },

  // All finished entries, newest first.
  async findCompleted() {
    return db
      .select()
      .from(timeEntries)
      .where(isNotNull(timeEntries.endedAt))
      .orderBy(desc(timeEntries.startedAt));
  },

  // Daily hours per activity over a window, for finished entries only.
  dailyByActivity(from: string, to: string) {
    const startBound = new Date(`${from}T00:00:00Z`);
    const endBound = new Date(`${to}T00:00:00Z`);
    endBound.setUTCDate(endBound.getUTCDate() + 1);
    const day = sql<string>`to_char(${timeEntries.startedAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`;
    return db
      .select({
        day,
        activity: timeEntries.activity,
        hours: sql<number>`sum(extract(epoch from (${timeEntries.endedAt} - ${timeEntries.startedAt}))) / 3600`,
      })
      .from(timeEntries)
      .where(
        and(
          isNotNull(timeEntries.endedAt),
          gte(timeEntries.startedAt, startBound),
          lt(timeEntries.startedAt, endBound),
        ),
      )
      .groupBy(day, timeEntries.activity)
      .orderBy(day);
  },

  // Stops any running entry, then opens a new one. Guarantees one timer runs.
  async start(input: StartTimerInput) {
    await db
      .update(timeEntries)
      .set({ endedAt: new Date(), updatedAt: new Date() })
      .where(isNull(timeEntries.endedAt));
    const [entry] = await db
      .insert(timeEntries)
      .values({ activity: input.activity })
      .returning();
    return entry;
  },

  // Stops a running entry (no-op if already stopped).
  async stop(id: string) {
    await db
      .update(timeEntries)
      .set({ endedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(timeEntries.id, id), isNull(timeEntries.endedAt)));
  },

  // Deletes an entry.
  async remove(id: string) {
    await db.delete(timeEntries).where(eq(timeEntries.id, id));
  },
};

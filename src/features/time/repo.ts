// Typed data access for time entries. The only place rows are read or written.

import { and, desc, eq, isNull, isNotNull } from "drizzle-orm";

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

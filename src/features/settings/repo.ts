// Typed data access for daily targets. A single config row: getTargets returns
// the stored row or the defaults, and updateTargets upserts the singleton.

import { db } from "@/db/client";
import { dailyTargets } from "./schema";
import { DEFAULT_TARGETS } from "./constants";
import type { TargetsInput } from "./validation";

export type Targets = TargetsInput;

export const settingsRepo = {
  // The stored targets, or the defaults if none have been set.
  async getTargets(): Promise<Targets> {
    const [row] = await db.select().from(dailyTargets).limit(1);
    if (!row) return { ...DEFAULT_TARGETS };
    return {
      waterOz: row.waterOz,
      calories: row.calories,
      proteinG: row.proteinG,
      carbsG: row.carbsG,
      fatG: row.fatG,
    };
  },

  // Upserts the singleton targets row.
  async updateTargets(input: TargetsInput) {
    await db
      .insert(dailyTargets)
      .values({ id: 1, ...input })
      .onConflictDoUpdate({
        target: dailyTargets.id,
        set: { ...input, updatedAt: new Date() },
      });
  },
};

// Typed data access for goals. The only place goal rows are read or written.

import { desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { goals } from "./schema";
import type { CreateGoalInput } from "./validation";

export const goalsRepo = {
  // Returns all goals, newest first.
  async findAll() {
    return db.select().from(goals).orderBy(desc(goals.createdAt));
  },

  // Inserts a goal and returns the created row.
  async create(input: CreateGoalInput) {
    const [goal] = await db
      .insert(goals)
      .values({
        title: input.title,
        description: input.description ?? null,
        targetDate: input.targetDate ?? null,
      })
      .returning();
    return goal;
  },

  // Sets a goal's progress (0-100) and bumps updatedAt.
  async setProgress(id: string, progress: number) {
    await db
      .update(goals)
      .set({ progress, updatedAt: new Date() })
      .where(eq(goals.id, id));
  },

  // Deletes a goal.
  async remove(id: string) {
    await db.delete(goals).where(eq(goals.id, id));
  },
};

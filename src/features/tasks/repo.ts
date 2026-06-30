// Typed data access for tasks. The only place task rows are read or written.

import { and, desc, eq, gte, isNotNull, lt, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { tasks } from "./schema";
import type { CreateTaskInput } from "./validation";

export const tasksRepo = {
  // Returns all tasks, newest first.
  async findAll() {
    return db.select().from(tasks).orderBy(desc(tasks.createdAt));
  },

  // Count of tasks completed per week (Monday-aligned) within a window.
  completedByWeek(from: string, to: string) {
    const startBound = new Date(`${from}T00:00:00Z`);
    const endBound = new Date(`${to}T00:00:00Z`);
    endBound.setUTCDate(endBound.getUTCDate() + 1);
    const week = sql<string>`to_char(date_trunc('week', ${tasks.completedAt} AT TIME ZONE 'UTC'), 'YYYY-MM-DD')`;
    return db
      .select({ day: week, count: sql<number>`count(*)` })
      .from(tasks)
      .where(
        and(
          isNotNull(tasks.completedAt),
          gte(tasks.completedAt, startBound),
          lt(tasks.completedAt, endBound),
        ),
      )
      .groupBy(week)
      .orderBy(week);
  },

  // Inserts a task and returns the created row.
  async create(input: CreateTaskInput) {
    const [task] = await db
      .insert(tasks)
      .values({
        title: input.title,
        priority: input.priority,
        dueDate: input.dueDate ?? null,
      })
      .returning();
    return task;
  },

  // Sets a task's completion state, stamps completed_at, and bumps updatedAt.
  async setCompleted(id: string, isCompleted: boolean) {
    await db
      .update(tasks)
      .set({
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, id));
  },

  // Deletes a task.
  async remove(id: string) {
    await db.delete(tasks).where(eq(tasks.id, id));
  },
};

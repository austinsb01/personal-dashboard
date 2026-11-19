// Typed data access for tasks. The only place task rows are read or written.

import { and, asc, between, eq, gte, isNotNull, lt, or, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { tasks, type DayTask } from "./schema";
import type { CreateTaskInput, ToggleTaskInput } from "./validation";

const DAY_TASK_COLUMNS = {
  id: tasks.id,
  title: tasks.title,
  day: tasks.day,
  isCompleted: tasks.isCompleted,
};

export const tasksRepo = {
  // Tasks on days in the range, plus unfinished ones from before today (they
  // carry over to today), oldest first.
  async findForCalendar(from: string, to: string, today: string): Promise<DayTask[]> {
    return db
      .select(DAY_TASK_COLUMNS)
      .from(tasks)
      .where(
        or(
          between(tasks.day, from, to),
          and(eq(tasks.isCompleted, false), lt(tasks.day, today)),
        ),
      )
      .orderBy(asc(tasks.createdAt));
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

  // Inserts a task on a day, optionally already done.
  async create(input: CreateTaskInput, isCompleted: boolean) {
    await db.insert(tasks).values({
      title: input.title,
      day: input.day,
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    });
  },

  // Sets a task's completion state and the day it sits on.
  async setCompleted(input: ToggleTaskInput) {
    await db
      .update(tasks)
      .set({
        isCompleted: input.isCompleted,
        day: input.day,
        completedAt: input.isCompleted ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id, input.id));
  },

  // Deletes a task.
  async remove(id: string) {
    await db.delete(tasks).where(eq(tasks.id, id));
  },
};

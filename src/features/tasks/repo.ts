// Typed data access for tasks. The only place task rows are read or written.

import { desc } from "drizzle-orm";

import { db } from "@/db/client";
import { tasks } from "./schema";
import type { CreateTaskInput } from "./validation";

export const tasksRepo = {
  // Returns all tasks, newest first.
  async findAll() {
    return db.select().from(tasks).orderBy(desc(tasks.createdAt));
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
};

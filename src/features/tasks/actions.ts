"use server";

// Server actions for tasks. Validates input at the boundary, then delegates to
// the repository. Shaped for React's useActionState.

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { createTaskSchema } from "./validation";
import { tasksRepo } from "./repo";

export type CreateTaskState = {
  ok: boolean;
  errors?: Record<string, string[] | undefined>;
};

export async function createTaskAction(
  _prevState: CreateTaskState,
  formData: FormData,
): Promise<CreateTaskState> {
  const parsed = createTaskSchema.safeParse({
    title: formData.get("title"),
    priority: formData.get("priority") ?? undefined,
    dueDate: formData.get("dueDate") || null,
  });

  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await tasksRepo.create(parsed.data);
  } catch (error) {
    console.error("Failed to create task:", error);
    return {
      ok: false,
      errors: { form: ["Could not create the task. Please try again."] },
    };
  }

  revalidatePath("/tasks");
  return { ok: true };
}

"use server";

// Server actions for goals. Validates input at the boundary, then delegates to
// the repository. createGoalAction is shaped for React's useActionState.

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { createGoalSchema, goalProgressSchema } from "./validation";
import { goalsRepo } from "./repo";

export type CreateGoalState = {
  ok: boolean;
  errors?: Record<string, string[] | undefined>;
};

export async function createGoalAction(
  _prevState: CreateGoalState,
  formData: FormData,
): Promise<CreateGoalState> {
  const parsed = createGoalSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    targetDate: formData.get("targetDate") || null,
  });

  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await goalsRepo.create(parsed.data);
  } catch (error) {
    console.error("Failed to create goal:", error);
    return {
      ok: false,
      errors: { form: ["Could not create the goal. Please try again."] },
    };
  }

  revalidatePath("/goals");
  return { ok: true };
}

export async function setGoalProgressAction(id: string, formData: FormData) {
  if (!z.uuid().safeParse(id).success) return;
  const parsed = goalProgressSchema.safeParse(formData.get("progress"));
  if (!parsed.success) return;
  await goalsRepo.setProgress(id, parsed.data);
  revalidatePath("/goals");
}

export async function deleteGoalAction(id: string) {
  if (!z.uuid().safeParse(id).success) return;
  await goalsRepo.remove(id);
  revalidatePath("/goals");
}

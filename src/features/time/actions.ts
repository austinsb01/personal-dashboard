"use server";

// Server actions for time tracking. Validates input at the boundary, then
// delegates to the repository. startTimerAction is shaped for useActionState.

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { startTimerSchema } from "./validation";
import { timeRepo } from "./repo";

export type StartTimerState = {
  ok: boolean;
  errors?: Record<string, string[] | undefined>;
};

export async function startTimerAction(
  _prevState: StartTimerState,
  formData: FormData,
): Promise<StartTimerState> {
  const parsed = startTimerSchema.safeParse({
    activity: formData.get("activity"),
  });

  if (!parsed.success) {
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await timeRepo.start(parsed.data);
  } catch (error) {
    console.error("Failed to start timer:", error);
    return {
      ok: false,
      errors: { form: ["Could not start the timer. Please try again."] },
    };
  }

  revalidatePath("/time");
  return { ok: true };
}

export async function stopTimerAction(id: string) {
  if (!z.uuid().safeParse(id).success) return;
  await timeRepo.stop(id);
  revalidatePath("/time");
}

export async function deleteEntryAction(id: string) {
  if (!z.uuid().safeParse(id).success) return;
  await timeRepo.remove(id);
  revalidatePath("/time");
}

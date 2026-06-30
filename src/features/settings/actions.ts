"use server";

// Server action for daily targets: validates the form and upserts the targets,
// then revalidates the pages that display them.

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { targetsSchema } from "./validation";
import { settingsRepo } from "./repo";

export type TargetsFormState = {
  ok: boolean;
  errors?: Record<string, string[] | undefined>;
};

export async function updateTargetsAction(
  _prev: TargetsFormState,
  formData: FormData,
): Promise<TargetsFormState> {
  const parsed = targetsSchema.safeParse({
    waterOz: formData.get("waterOz"),
    calories: formData.get("calories"),
    proteinG: formData.get("proteinG"),
    carbsG: formData.get("carbsG"),
    fatG: formData.get("fatG"),
  });
  if (!parsed.success) return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  try {
    await settingsRepo.updateTargets(parsed.data);
  } catch (error) {
    console.error("Failed to update targets:", error);
    return { ok: false, errors: { form: ["Could not save targets."] } };
  }
  revalidatePath("/settings");
  revalidatePath("/water");
  revalidatePath("/nutrition");
  return { ok: true };
}

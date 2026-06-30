"use server";

// Server actions for the water feature. Quick-add uses a bound preset amount;
// the custom form is useActionState-shaped with field errors. Both validate at
// the boundary and revalidate.

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { isIsoDate } from "@/lib/iso-date";
import { addWaterSchema } from "./validation";
import { waterRepo } from "./repo";

const idSchema = z.uuid();

export type WaterFormState = {
  ok: boolean;
  errors?: Record<string, string[] | undefined>;
};

export async function quickAddWaterAction(date: string, amountOz: number) {
  if (!isIsoDate(date)) return;
  const parsed = addWaterSchema.safeParse({ amountOz });
  if (!parsed.success) return;
  try {
    await waterRepo.addEntry(date, parsed.data);
  } catch (error) {
    console.error("Failed to quick-add water:", error);
    return;
  }
  revalidatePath("/water");
}

export async function addWaterAction(
  date: string,
  _prev: WaterFormState,
  formData: FormData,
): Promise<WaterFormState> {
  if (!isIsoDate(date)) return { ok: false, errors: { form: ["Invalid date."] } };
  const parsed = addWaterSchema.safeParse({ amountOz: formData.get("amountOz") });
  if (!parsed.success) return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  try {
    await waterRepo.addEntry(date, parsed.data);
  } catch (error) {
    console.error("Failed to add water:", error);
    return { ok: false, errors: { form: ["Could not log water."] } };
  }
  revalidatePath("/water");
  return { ok: true };
}

export async function removeWaterAction(id: string) {
  if (!idSchema.safeParse(id).success) return;
  await waterRepo.removeEntry(id);
  revalidatePath("/water");
}

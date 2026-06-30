// Zod validation for water input: adding an amount in fluid ounces. The amount
// is coerced from a FormData string.

import { z } from "zod";

import { MAX_WATER_ENTRY_OZ } from "./constants";

export const addWaterSchema = z.object({
  amountOz: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(MAX_WATER_ENTRY_OZ, `Amount must be ${MAX_WATER_ENTRY_OZ} oz or less`),
});

export type AddWaterInput = z.infer<typeof addWaterSchema>;

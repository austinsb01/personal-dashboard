// Constants for the water feature, all in fluid ounces. Single source of truth
// for the quick-add amounts and the per-entry maximum. The daily goal now lives
// in the settings feature's DEFAULT_TARGETS (user-editable).

export const QUICK_ADD_OZ = [8, 12, 16] as const;

export const MAX_WATER_ENTRY_OZ = 500;

// Constants for daily targets: the default values used until the user sets their
// own, plus per-field maximums for validation. Single source of truth.

export const DEFAULT_TARGETS = {
  waterOz: 64,
  calories: 2000,
  proteinG: 150,
  carbsG: 200,
  fatG: 60,
} as const;

export const MAX_TARGET = {
  waterOz: 1000,
  calories: 20000,
  proteinG: 2000,
  carbsG: 2000,
  fatG: 2000,
} as const;

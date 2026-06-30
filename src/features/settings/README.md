# settings

Editable daily targets, set on the `/settings` page and used across the app: the
water goal (oz) and the nutrition goals (calories, protein, carbs, fat). Stored
as a single config row so there is one source of truth.

## Contents

- `constants.ts` - the default targets (used until the user sets their own) and
  per-field maximums for validation. Single source of truth, including the water
  goal default that the water feature used to hold.
- `schema.ts` - the singleton `daily_targets` table (a fixed id keeps one row).
- `validation.ts` - Zod validation for the targets form (water goal and calories
  positive, macros may be zero, all bounded).
- `repo.ts` - `getTargets` (the stored row or the defaults) and `updateTargets`
  (upserts the singleton). Exports the `Targets` type used by water and nutrition.
- `actions.ts` - the server action that validates and saves the targets, then
  revalidates the pages that show them.
- `components/` - the targets form.

The water and nutrition day views show progress against these targets, and the
analytics charts draw goal reference lines from them.

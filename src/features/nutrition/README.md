# nutrition

Food and nutrition, viewed per calendar date. A reusable catalog of foods
(each with a serving label and per-serving macros) is created on the fly and
reused: typing a known food name auto-fills its macros. Each meal entry logs a
food under a meal type (breakfast, lunch, dinner, snack) with a quantity in
servings. The day view groups entries by meal with per-meal and day totals.

## Contents

- `schema.ts` - the Drizzle tables (`foods`, `meal_entries`) and the `meal_type`
  enum. The single source of truth for the feature's types.
- `validation.ts` - Zod validation for logging a food (macros plus meal type and
  quantity); `MEAL_TYPES` is derived from the schema enum.
- `repo.ts` - typed data access: find-or-create food by name, the food catalog,
  a day's entries joined to food macros, and log/remove.
- `actions.ts` - server actions that validate at the boundary and revalidate.
- `totals.ts` - pure day-summary helper: scales per-serving macros by quantity
  and groups entries by meal with per-meal and day totals.
- `components/` - the day view and the food log form.

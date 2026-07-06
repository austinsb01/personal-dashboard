# recipes

Reusable recipes: a named meal built from catalog foods, so a whole meal can be
logged to a day in one action instead of entering each food. Recipes reuse the
nutrition domain's `foods` catalog as their ingredients.

## What it holds

- `schema.ts` - two tables. `recipes` (id, unique name, optional note) and
  `recipe_items` (a recipe's ingredients: a `food_id` and a `quantity` in
  servings, cascading on recipe delete). `recipe_items.food_id` references the
  nutrition `foods` catalog.
- `validation.ts` - Zod schemas. `recipeSchema` (name, optional note, one or more
  items) and `logRecipeSchema` (recipe id, meal slot, whole multiplier). The
  item food-macro fields and the meal-type list are shared from
  `nutrition/validation.ts` (single source of truth).
- `repo.ts` - `recipesRepo`: list, find-with-items, create, update, delete.
  Item foods are find-or-create by name via the shared `nutrition/foods.ts`
  helper. Foods are resolved before any recipe row is written and item rows
  insert in one statement (the neon-http driver has no transactions, so create
  compensates by removing its recipe row if the item insert fails).
- `actions.ts` - recipe CRUD server actions, Zod-validated at the boundary.
- `components/recipe-editor.tsx` - client form to build or edit a recipe, with a
  dynamic ingredient list, food-name autocomplete and macro autofill, and a live
  per-serving macro total.
- `components/recipe-list.tsx` - server-rendered list of saved recipes with a
  delete action.

## How logging a recipe works

Logging a recipe does not add a new kind of log row. It expands into ordinary
nutrition `meal_entries` (one per ingredient), each tagged with its
`source_recipe_id`. That keeps every existing nutrition total, chart, and query
working unchanged, while the tag lets the day view group the entries under the
recipe name and lets the weekly meal-prep view attribute ingredients to the
recipes that used them. The `logRecipeAction` and the write live in the
nutrition feature (which owns `meal_entries`); this feature owns the recipe
definition.

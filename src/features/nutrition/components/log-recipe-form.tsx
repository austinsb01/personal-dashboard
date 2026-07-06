"use client";

// Client form to log a saved recipe into a day's meal. Picks a recipe, a meal
// slot, and a whole multiplier; on success the entries appear grouped in the
// day view. Uncontrolled; resets natively on success.

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { logRecipeAction, type NutritionFormState } from "@/features/nutrition/actions";
import { MEAL_TYPES } from "@/features/nutrition/validation";
import type { RecipeListItem } from "@/features/recipes/repo";

const initialState: NutritionFormState = { ok: false };

function label(mealType: string): string {
  return mealType[0].toUpperCase() + mealType.slice(1);
}

export function LogRecipeForm({
  date,
  recipes,
}: {
  date: string;
  recipes: RecipeListItem[];
}) {
  const [state, formAction, pending] = useActionState(
    logRecipeAction.bind(null, date),
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  if (recipes.length === 0) return null;

  const error = state.errors ? Object.values(state.errors).flat().filter(Boolean)[0] : undefined;

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
      <Select name="recipeId" aria-label="Recipe" className="min-w-40 flex-1" required>
        {recipes.map((recipe) => (
          <option key={recipe.id} value={recipe.id}>
            {recipe.name}
          </option>
        ))}
      </Select>
      <Select name="mealType" defaultValue="lunch" aria-label="Meal" className="w-32">
        {MEAL_TYPES.map((mealType) => (
          <option key={mealType} value={mealType}>
            {label(mealType)}
          </option>
        ))}
      </Select>
      <Input name="multiplier" type="number" min={1} step="1" defaultValue="1" aria-label="Servings" className="w-20" />
      <Button type="submit" disabled={pending}>
        {pending ? "Logging..." : "Log recipe"}
      </Button>
      {error && <p className="w-full text-sm text-destructive">{error}</p>}
    </form>
  );
}

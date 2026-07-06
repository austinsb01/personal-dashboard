"use client";

// Client form to build or edit a recipe: a name, optional note, and a dynamic
// list of ingredient rows. Typing a food name that matches the catalog auto-
// fills its serving and macros; a live per-serving macro total is shown. The
// same component powers create (no recipeId) and edit (recipeId + initial data).

import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { summarizeDay, type DayEntry } from "@/features/nutrition/totals";
import type { FoodOption } from "@/features/nutrition/components/nutrition-forms";
import { FoodSuggestionsDatalist } from "@/features/nutrition/components/food-suggestions-datalist";
import {
  createRecipeAction,
  updateRecipeAction,
  type RecipeFormState,
} from "@/features/recipes/actions";

export type RecipeItemDraft = {
  name: string;
  servingLabel: string;
  calories: string;
  proteinG: string;
  carbsG: string;
  fatG: string;
  quantity: string;
};

const EMPTY_ROW: RecipeItemDraft = {
  name: "",
  servingLabel: "",
  calories: "",
  proteinG: "",
  carbsG: "",
  fatG: "",
  quantity: "1",
};

const initialState: RecipeFormState = { ok: false };

function toDayEntry(row: RecipeItemDraft, index: number): DayEntry {
  return {
    id: String(index),
    mealType: "breakfast",
    quantity: Number(row.quantity) || 0,
    foodName: row.name,
    servingLabel: row.servingLabel,
    calories: Number(row.calories) || 0,
    proteinG: Number(row.proteinG) || 0,
    carbsG: Number(row.carbsG) || 0,
    fatG: Number(row.fatG) || 0,
    sourceRecipeId: null,
    recipeName: null,
  };
}

export function RecipeEditor({
  foods,
  recipeId,
  initialName = "",
  initialNote = "",
  initialItems,
}: {
  foods: FoodOption[];
  recipeId?: string;
  initialName?: string;
  initialNote?: string;
  initialItems?: RecipeItemDraft[];
}) {
  const action = recipeId
    ? updateRecipeAction.bind(null, recipeId)
    : createRecipeAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [rows, setRows] = useState<RecipeItemDraft[]>(
    initialItems && initialItems.length > 0 ? initialItems : [EMPTY_ROW],
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [seenState, setSeenState] = useState(initialState);
  if (state !== seenState) {
    setSeenState(state);
    if (state.ok && !recipeId) setRows([EMPTY_ROW]);
  }

  useEffect(() => {
    if (state.ok && !recipeId) formRef.current?.reset();
  }, [state, recipeId]);

  const total = useMemo(
    () => summarizeDay(rows.map(toDayEntry)).total,
    [rows],
  );

  function updateRow(index: number, patch: Partial<RecipeItemDraft>) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function onNameChange(index: number, name: string) {
    const match = foods.find((f) => f.name.toLowerCase() === name.trim().toLowerCase());
    if (!match) return updateRow(index, { name });
    updateRow(index, {
      name,
      servingLabel: match.servingLabel,
      calories: String(match.calories),
      proteinG: String(match.proteinG),
      carbsG: String(match.carbsG),
      fatG: String(match.fatG),
    });
  }

  const error = state.errors ? Object.values(state.errors).flat().filter(Boolean)[0] : undefined;

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <Input name="recipeName" defaultValue={initialName} placeholder="Recipe name" aria-label="Recipe name" required />
      <Input name="note" defaultValue={initialNote} placeholder="Note (optional)" aria-label="Note" />

      <FoodSuggestionsDatalist id="recipe-food-suggestions" foods={foods} />

      <div className="flex flex-col gap-2">
        {rows.map((row, index) => (
          <div key={index} className="flex flex-wrap items-center gap-2">
            <Input
              name="name"
              list="recipe-food-suggestions"
              value={row.name}
              onChange={(e) => onNameChange(index, e.target.value)}
              placeholder="Food"
              aria-label="Food"
              className="min-w-40 flex-1"
              required
            />
            <Input name="servingLabel" value={row.servingLabel} onChange={(e) => updateRow(index, { servingLabel: e.target.value })} placeholder="Serving" aria-label="Serving" className="w-28" required />
            <Input name="calories" type="number" min={0} value={row.calories} onChange={(e) => updateRow(index, { calories: e.target.value })} placeholder="Cal" aria-label="Calories" className="w-20" required />
            <Input name="proteinG" type="number" min={0} step="0.1" value={row.proteinG} onChange={(e) => updateRow(index, { proteinG: e.target.value })} placeholder="P" aria-label="Protein grams" className="w-16" required />
            <Input name="carbsG" type="number" min={0} step="0.1" value={row.carbsG} onChange={(e) => updateRow(index, { carbsG: e.target.value })} placeholder="C" aria-label="Carbs grams" className="w-16" required />
            <Input name="fatG" type="number" min={0} step="0.1" value={row.fatG} onChange={(e) => updateRow(index, { fatG: e.target.value })} placeholder="F" aria-label="Fat grams" className="w-16" required />
            <Input name="quantity" type="number" min={0} step="0.25" value={row.quantity} onChange={(e) => updateRow(index, { quantity: e.target.value })} aria-label="Servings" className="w-20" required />
            <button
              type="button"
              onClick={() => setRows((c) => (c.length > 1 ? c.filter((_, i) => i !== index) : c))}
              aria-label="Remove ingredient"
              className="text-sm text-muted-foreground hover:text-destructive"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => setRows((c) => [...c, EMPTY_ROW])} className="text-sm text-primary">
          + add ingredient
        </button>
        <span className="text-xs text-muted-foreground tabular-nums">
          {total.calories} cal · {total.proteinG}p · {total.carbsG}c · {total.fatG}f per serving
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : recipeId ? "Save recipe" : "Create recipe"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </form>
  );
}

"use client";

// Client form for logging a food into a day's meal. Typing a food name that
// matches the catalog auto-fills its serving and macros into the sibling
// fields; a new food is entered once and reused thereafter. The form is
// uncontrolled and resets natively on a successful log.

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  logEntryAction,
  type NutritionFormState,
} from "@/features/nutrition/actions";
import { MEAL_TYPES } from "@/features/nutrition/validation";

export type FoodOption = {
  name: string;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

const initialState: NutritionFormState = { ok: false };

const ERROR_KEYS = [
  "name",
  "servingLabel",
  "calories",
  "proteinG",
  "carbsG",
  "fatG",
  "mealType",
  "quantity",
  "form",
];

function label(mealType: string): string {
  return mealType[0].toUpperCase() + mealType.slice(1);
}

function firstError(state: NutritionFormState, keys: string[]): string | undefined {
  for (const key of keys) {
    const message = state.errors?.[key]?.[0];
    if (message) return message;
  }
  return undefined;
}

export function LogFoodForm({
  date,
  foods,
}: {
  date: string;
  foods: FoodOption[];
}) {
  const [state, formAction, pending] = useActionState(
    logEntryAction.bind(null, date),
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  // Auto-fill serving and macros when the typed name matches a known food.
  function onNameChange(name: string) {
    const form = formRef.current;
    const match = foods.find(
      (food) => food.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (!form || !match) return;
    const set = (field: string, value: string) => {
      const el = form.elements.namedItem(field);
      if (el instanceof HTMLInputElement) el.value = value;
    };
    set("servingLabel", match.servingLabel);
    set("calories", String(match.calories));
    set("proteinG", String(match.proteinG));
    set("carbsG", String(match.carbsG));
    set("fatG", String(match.fatG));
  }

  const error = firstError(state, ERROR_KEYS);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-2 rounded-lg border bg-card p-3"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Select name="mealType" defaultValue="breakfast" aria-label="Meal" className="w-32">
          {MEAL_TYPES.map((mealType) => (
            <option key={mealType} value={mealType}>
              {label(mealType)}
            </option>
          ))}
        </Select>
        <Input
          name="name"
          list="food-suggestions"
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Food"
          aria-label="Food"
          className="min-w-40 flex-1"
          required
        />
        <datalist id="food-suggestions">
          {foods.map((food) => (
            <option key={food.name} value={food.name} />
          ))}
        </datalist>
        <Input name="quantity" type="number" min={0} step="0.25" defaultValue="1" aria-label="Servings" className="w-20" required />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Input name="servingLabel" placeholder="Serving (e.g. 1 cup)" aria-label="Serving" className="min-w-32 flex-1" required />
        <Input name="calories" type="number" min={0} placeholder="Cal" aria-label="Calories" className="w-20" required />
        <Input name="proteinG" type="number" min={0} step="0.1" placeholder="P (g)" aria-label="Protein grams" className="w-20" required />
        <Input name="carbsG" type="number" min={0} step="0.1" placeholder="C (g)" aria-label="Carbs grams" className="w-20" required />
        <Input name="fatG" type="number" min={0} step="0.1" placeholder="F (g)" aria-label="Fat grams" className="w-20" required />
        <Button type="submit" disabled={pending}>
          {pending ? "Logging..." : "Log food"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}

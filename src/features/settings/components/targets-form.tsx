"use client";

// Settings form for daily targets: water goal (oz) and nutrition goals
// (calories and macros). Pre-filled with the current targets; useActionState
// surfaces validation errors and a saved confirmation.

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  updateTargetsAction,
  type TargetsFormState,
} from "@/features/settings/actions";
import type { Targets } from "@/features/settings/repo";

const initialState: TargetsFormState = { ok: false };

const FIELDS = [
  { name: "waterOz", label: "Water goal (oz)" },
  { name: "calories", label: "Calories" },
  { name: "proteinG", label: "Protein (g)" },
  { name: "carbsG", label: "Carbs (g)" },
  { name: "fatG", label: "Fat (g)" },
] as const;

const ERROR_KEYS = ["waterOz", "calories", "proteinG", "carbsG", "fatG", "form"];

function firstError(state: TargetsFormState): string | undefined {
  for (const key of ERROR_KEYS) {
    const message = state.errors?.[key]?.[0];
    if (message) return message;
  }
  return undefined;
}

export function TargetsForm({ targets }: { targets: Targets }) {
  const [state, formAction, pending] = useActionState(
    updateTargetsAction,
    initialState,
  );
  const error = firstError(state);
  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-3">
        {FIELDS.map((field) => (
          <label key={field.name} className="flex items-center justify-between gap-3">
            <span className="text-sm">{field.label}</span>
            <Input
              name={field.name}
              type="number"
              min={0}
              step="1"
              defaultValue={targets[field.name]}
              aria-label={field.label}
              className="w-28"
              required
            />
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save targets"}
        </Button>
        {state.ok && <span className="text-sm text-muted-foreground">Saved.</span>}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}

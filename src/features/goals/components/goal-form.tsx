"use client";

// Add-goal form. Submits to the createGoal server action via useActionState,
// shows inline validation errors, and clears on success.

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGoalAction, type CreateGoalState } from "@/features/goals/actions";

const initialState: CreateGoalState = { ok: false };

export function GoalForm() {
  const [state, formAction, pending] = useActionState(
    createGoalAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <div className="flex flex-col gap-1.5">
        <Input
          name="title"
          placeholder="Add a goal..."
          aria-label="Goal title"
          required
        />
        {state.errors?.title?.[0] && (
          <p className="text-sm text-destructive">{state.errors.title[0]}</p>
        )}
      </div>
      <Input
        name="description"
        placeholder="Description (optional)"
        aria-label="Goal description"
      />
      <div className="flex flex-wrap items-center gap-2">
        <Input
          name="targetDate"
          type="date"
          aria-label="Target date"
          className="w-auto"
        />
        <Button type="submit" disabled={pending} className="ml-auto">
          {pending ? "Adding..." : "Add goal"}
        </Button>
      </div>
      {(state.errors?.description?.[0] || state.errors?.form?.[0]) && (
        <p className="text-sm text-destructive">
          {state.errors.description?.[0] ?? state.errors.form?.[0]}
        </p>
      )}
    </form>
  );
}

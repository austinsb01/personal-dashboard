"use client";

// Add-task form. Submits to the createTask server action via useActionState,
// shows inline validation errors, and clears on success.

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTaskAction, type CreateTaskState } from "@/features/tasks/actions";

const initialState: CreateTaskState = { ok: false };

export function TaskForm() {
  const [state, formAction, pending] = useActionState(
    createTaskAction,
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
      <div className="flex items-start gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <Input
            name="title"
            placeholder="Add a task..."
            aria-label="Task title"
            required
          />
          {state.errors?.title?.[0] && (
            <p className="text-sm text-destructive">{state.errors.title[0]}</p>
          )}
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Adding..." : "Add task"}
        </Button>
      </div>
      {state.errors?.form?.[0] && (
        <p className="text-sm text-destructive">{state.errors.form[0]}</p>
      )}
    </form>
  );
}

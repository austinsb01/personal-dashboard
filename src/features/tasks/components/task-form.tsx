"use client";

// Add-task form. Submits to the createTask server action via useActionState,
// shows inline validation errors, and clears on success.

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TASK_PRIORITIES } from "@/features/tasks/constants";
import { createTaskAction, type CreateTaskState } from "@/features/tasks/actions";

const initialState: CreateTaskState = { ok: false };

// Title-cases a priority value for display.
function capitalize(value: string): string {
  return value[0].toUpperCase() + value.slice(1);
}

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
      <div className="flex flex-col gap-1.5">
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
      <div className="flex flex-wrap items-center gap-2">
        <select
          name="priority"
          defaultValue="medium"
          aria-label="Priority"
          className="h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-sm transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {capitalize(priority)}
            </option>
          ))}
        </select>
        <Input
          name="dueDate"
          type="date"
          aria-label="Due date"
          className="w-auto"
        />
        <Button type="submit" disabled={pending} className="ml-auto">
          {pending ? "Adding..." : "Add task"}
        </Button>
      </div>
      {state.errors?.form?.[0] && (
        <p className="text-sm text-destructive">{state.errors.form[0]}</p>
      )}
    </form>
  );
}

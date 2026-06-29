"use client";

// Time-tracking control. When a timer is running, shows the activity with a
// live-ticking elapsed clock and a Stop button; otherwise shows the start form.

import { useActionState, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  startTimerAction,
  stopTimerAction,
  type StartTimerState,
} from "@/features/time/actions";
import { formatClock } from "@/features/time/format";

const initialState: StartTimerState = { ok: false };

type RunningEntry = { id: string; activity: string; startedAtMs: number };

export function Timer({ running }: { running: RunningEntry | null }) {
  return running ? <RunningTimer running={running} /> : <StartForm />;
}

function RunningTimer({ running }: { running: RunningEntry }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const tick = () =>
      setElapsed(Math.floor((Date.now() - running.startedAtMs) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [running.startedAtMs]);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
      <div className="flex flex-col">
        <span className="text-sm font-medium">{running.activity}</span>
        <span className="text-2xl font-semibold tabular-nums">
          {formatClock(elapsed)}
        </span>
      </div>
      <form action={stopTimerAction.bind(null, running.id)}>
        <Button type="submit" variant="outline">
          Stop
        </Button>
      </form>
    </div>
  );
}

function StartForm() {
  const [state, formAction, pending] = useActionState(
    startTimerAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Input
          name="activity"
          placeholder="What are you working on?"
          aria-label="Activity"
          required
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Starting..." : "Start"}
        </Button>
      </div>
      {(state.errors?.activity?.[0] || state.errors?.form?.[0]) && (
        <p className="text-sm text-destructive">
          {state.errors.activity?.[0] ?? state.errors.form?.[0]}
        </p>
      )}
    </form>
  );
}

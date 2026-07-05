"use client";

// Password form for the access gate. Submits to loginAction; on success the
// action sets the session cookie and redirects to `next`.

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction, type LoginState } from "@/features/auth/actions";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-3">
      <input type="hidden" name="next" value={next} />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        aria-label="Password"
        autoComplete="current-password"
        autoFocus
        required
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}

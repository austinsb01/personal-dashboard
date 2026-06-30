"use client";

// Water input controls: preset quick-add buttons and a custom-amount form.
// Quick-add posts a bound preset; the custom form uses useActionState for
// validation errors and resets on success.

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addWaterAction,
  quickAddWaterAction,
  type WaterFormState,
} from "@/features/water/actions";
import { QUICK_ADD_OZ } from "@/features/water/constants";

const initialState: WaterFormState = { ok: false };

export function WaterControls({ date }: { date: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {QUICK_ADD_OZ.map((amount) => (
          <form key={amount} action={quickAddWaterAction.bind(null, date, amount)}>
            <Button type="submit" variant="outline">
              +{amount} oz
            </Button>
          </form>
        ))}
      </div>
      <CustomAmountForm date={date} />
    </div>
  );
}

function CustomAmountForm({ date }: { date: string }) {
  const [state, formAction, pending] = useActionState(
    addWaterAction.bind(null, date),
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);
  const error = state.errors?.amountOz?.[0] ?? state.errors?.form?.[0];
  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Input
          name="amountOz"
          type="number"
          min={1}
          step="1"
          placeholder="Custom oz"
          aria-label="Custom amount in ounces"
          className="w-32"
          required
        />
        <Button type="submit" variant="outline" disabled={pending}>
          {pending ? "Adding..." : "Add"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}

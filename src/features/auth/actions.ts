"use server";

// Login/logout server actions for the access gate. loginAction verifies the
// shared password, sets a signed session cookie, and redirects; logoutAction
// clears it.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/lib/env";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./constants";
import { createSessionToken, verifyPassword } from "./session";

export type LoginState = { error?: string };

// Only allow relative, same-origin redirect targets.
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const ok = await verifyPassword(password, env.APP_PASSWORD, env.AUTH_SECRET);
  if (!ok) return { error: "Incorrect password." };

  const token = await createSessionToken(
    env.AUTH_SECRET,
    Date.now() + SESSION_MAX_AGE * 1000,
  );
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect(safeNext(formData.get("next")));
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}

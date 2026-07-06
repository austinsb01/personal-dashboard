// Top-level dashboard layout. Delegates to the responsive AppShell, which is a
// static sidebar on large screens and a drawer on mobile.

import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";

export function DashboardShell({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}

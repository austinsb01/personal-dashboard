// Top-level dashboard layout. Places the primary sidebar beside the main
// content region and wraps every route through the root layout.

import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}

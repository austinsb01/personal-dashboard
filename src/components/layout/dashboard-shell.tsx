// Top-level dashboard layout. Places the primary sidebar beside the main
// content region and wraps every route through the root layout.

import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-6 py-8 md:px-10">{children}</div>
      </main>
    </div>
  );
}

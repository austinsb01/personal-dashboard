"use client";

// Responsive app shell. On large screens the sidebar is a static panel; below
// lg it becomes a slide-in drawer opened from a top-bar hamburger (with a dimmed
// backdrop), and the content is full width. Tapping a nav link or the backdrop
// closes the drawer.

import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="flex h-dvh">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={close}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 pt-[env(safe-area-inset-top)] transition-transform duration-200 motion-reduce:transition-none lg:static lg:z-auto lg:translate-x-0 lg:pt-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar onNavigate={close} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] lg:pt-0">
        <header className="flex items-center gap-2 border-b px-3 py-2 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="size-5" />
          </button>
          <span className="text-sm font-semibold">Personal Dashboard</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-5xl px-6 py-8 md:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

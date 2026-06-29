"use client";

// Primary sidebar navigation. Renders the Overview link plus collapsible
// dropdown groups from the nav model, highlighting the active route.

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  NAV_OVERVIEW,
  NAV_GROUPS,
  type NavGroup,
  type NavLeaf,
} from "@/lib/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Returns true when a nav href is the active route. The overview route ("/")
// matches only an exact path; other routes also match their nested paths.
function isActiveRoute(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Renders one nav row. Active rows use a filled, slightly elevated pill so
// they read distinctly from the lighter hover state on inactive rows.
function NavRow({ item, pathname }: { item: NavLeaf; pathname: string }) {
  const Icon = item.icon;
  const active = isActiveRoute(item.href, pathname);
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        active
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-sm"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {item.label}
    </Link>
  );
}

// A collapsible group: an uppercase header with a chevron that toggles its
// child rows. Starts open; collapses smoothly via a grid-rows transition.
function CollapsibleGroup({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
      >
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
            open ? "" : "-rotate-90",
          )}
        />
        {group.label}
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 pt-1 pl-4">
            {group.items.map((item) => (
              <NavRow key={item.href} item={item} pathname={pathname} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="flex h-full w-64 shrink-0 flex-col gap-1 border-r bg-sidebar p-3 text-sidebar-foreground"
    >
      <div className="mb-2 flex items-center gap-2.5 px-1.5 py-1.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
          PD
        </span>
        <span className="text-sm font-semibold">Personal Dashboard</span>
      </div>
      <NavRow item={NAV_OVERVIEW} pathname={pathname} />
      <div className="mt-2 flex flex-col gap-2">
        {NAV_GROUPS.map((group) => (
          <CollapsibleGroup key={group.label} group={group} pathname={pathname} />
        ))}
      </div>
      <div className="mt-auto border-t pt-2">
        <ThemeToggle />
      </div>
    </nav>
  );
}

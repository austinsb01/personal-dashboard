"use client";

// Primary sidebar navigation. Renders links from NAV_ITEMS and highlights
// the active route based on the current pathname.

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/navigation";

// Returns true when a nav href is the active route. The overview route ("/")
// matches only an exact path; section routes also match their nested paths.
function isActiveRoute(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="flex h-full w-60 shrink-0 flex-col gap-1 border-r bg-sidebar p-3 text-sidebar-foreground"
    >
      <div className="px-2 py-3 text-sm font-semibold">Personal Dashboard</div>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActiveRoute(item.href, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

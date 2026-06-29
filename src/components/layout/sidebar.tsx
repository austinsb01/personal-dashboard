"use client";

// Primary sidebar navigation. Renders NAV_ITEMS grouped by section and
// highlights the active route based on the current pathname.

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Returns true when a nav href is the active route. The overview route ("/")
// matches only an exact path; section routes also match their nested paths.
function isActiveRoute(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Groups nav items by section, preserving first-seen order. Ungrouped items
// are skipped here and rendered separately above the sections.
function groupBySection(items: readonly NavItem[]) {
  const order: string[] = [];
  const bySection = new Map<string, NavItem[]>();
  for (const item of items) {
    if (!item.section) continue;
    if (!bySection.has(item.section)) {
      bySection.set(item.section, []);
      order.push(item.section);
    }
    bySection.get(item.section)!.push(item);
  }
  return order.map((section) => ({ section, items: bySection.get(section)! }));
}

// Renders one nav row with active and hover styling.
function NavRow({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon;
  const active = isActiveRoute(item.href, pathname);
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
        active
          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const ungrouped = NAV_ITEMS.filter((item) => !item.section);
  const sections = groupBySection(NAV_ITEMS);

  return (
    <nav
      aria-label="Primary"
      className="flex h-full w-60 shrink-0 flex-col gap-0.5 border-r bg-sidebar p-3 text-sidebar-foreground"
    >
      <div className="mb-2 px-2 py-1.5 text-sm font-semibold">Personal Dashboard</div>
      {ungrouped.map((item) => (
        <NavRow key={item.href} item={item} pathname={pathname} />
      ))}
      {sections.map((group) => (
        <div key={group.section} className="mt-4 flex flex-col gap-0.5">
          <div className="px-2 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {group.section}
          </div>
          {group.items.map((item) => (
            <NavRow key={item.href} item={item} pathname={pathname} />
          ))}
        </div>
      ))}
      <div className="mt-auto pt-2">
        <ThemeToggle />
      </div>
    </nav>
  );
}

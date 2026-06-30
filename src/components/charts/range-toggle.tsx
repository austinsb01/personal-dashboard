// Shared range selector for the analytics charts: 7 / 30 / 90 day links that set
// the ?range param while preserving the other query params. Server-rendered, so
// changing the range re-renders the page with fresh server data.

import Link from "next/link";

import { RANGE_OPTIONS, type RangeKey } from "@/lib/analytics/range";

const baseClass =
  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors";
const activeClass = "bg-accent text-foreground";
const inactiveClass = "text-muted-foreground hover:text-foreground";

export function RangeToggle({
  basePath,
  active,
  params,
}: {
  basePath: string;
  active: RangeKey;
  params?: Record<string, string | undefined>;
}) {
  return (
    <div className="inline-flex gap-0.5 rounded-lg border p-0.5">
      {RANGE_OPTIONS.map((range) => {
        const query = new URLSearchParams();
        for (const [key, value] of Object.entries(params ?? {})) {
          if (value) query.set(key, value);
        }
        query.set("range", range);
        const isActive = range === active;
        return (
          <Link
            key={range}
            href={`${basePath}?${query.toString()}`}
            aria-current={isActive ? "true" : undefined}
            className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
          >
            {range}d
          </Link>
        );
      })}
    </div>
  );
}

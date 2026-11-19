// Thin horizontal progress bar. Fills to the given fraction (0 to 1) and exposes
// the value to assistive tech.

import { cn } from "@/lib/utils";

const PERCENT_MAX = 100;

function ProgressBar({
  fraction,
  label,
  className,
}: {
  fraction: number;
  label: string;
  className?: string;
}) {
  const percent = Math.round(Math.min(1, Math.max(0, fraction)) * PERCENT_MAX);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={PERCENT_MAX}
      aria-valuenow={percent}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export { ProgressBar };

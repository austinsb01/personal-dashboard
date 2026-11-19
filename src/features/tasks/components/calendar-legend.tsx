// Key for the calendar: the heat scale from less to more done, and the dot
// that marks open to-dos.

import { cn } from "@/lib/utils";
import { INTENSITY_CLASSES } from "@/features/tasks/components/intensity-styles";

export function CalendarLegend() {
  return (
    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span aria-hidden className="size-1 rounded-full bg-current" />
        Still open
      </span>
      <span className="flex items-center gap-1.5">
        Less done
        <span aria-hidden className="flex items-center gap-1">
          {INTENSITY_CLASSES.map((intensityClass) => (
            <span
              key={intensityClass}
              className={cn("size-3 rounded-sm border", intensityClass)}
            />
          ))}
        </span>
        More
      </span>
    </div>
  );
}

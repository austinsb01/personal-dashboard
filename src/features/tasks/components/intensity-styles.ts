// Heat-level styles for the calendar, indexed by intensity level (0 = nothing
// done). Shared by the day cells and the legend so they never drift.

export const INTENSITY_CLASSES = [
  "bg-transparent",
  "bg-primary/15",
  "bg-primary/30",
  "bg-primary/45",
  "bg-primary text-primary-foreground",
] as const;

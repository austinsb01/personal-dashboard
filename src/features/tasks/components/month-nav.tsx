// Calendar header: the month title, a jump back to today, and previous/next
// month links. Changing month is a navigation so the server loads that month.

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addMonths, formatMonth, isSameMonth } from "@/features/tasks/calendar";
import { TASKS_PATH } from "@/features/tasks/constants";

const arrowLinkClass = cn(buttonVariants({ variant: "ghost" }), "size-10");

// Link to a month. The current month is the bare tasks path, which opens today.
function monthHref(month: string, today: string): string {
  return isSameMonth(month, today) ? TASKS_PATH : `${TASKS_PATH}?date=${month}`;
}

export function MonthNav({
  month,
  today,
  isTodaySelected,
  onSelectToday,
}: {
  month: string;
  today: string;
  isTodaySelected: boolean;
  onSelectToday: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-2">
      <h1 className="text-xl font-semibold tracking-tight">{formatMonth(month)}</h1>
      <div className="flex items-center gap-1">
        {isSameMonth(month, today) ? (
          <Button
            variant="outline"
            size="lg"
            onClick={onSelectToday}
            disabled={isTodaySelected}
          >
            Today
          </Button>
        ) : (
          <Link href={TASKS_PATH} className={buttonVariants({ variant: "outline", size: "lg" })}>
            Today
          </Link>
        )}
        <Link
          href={monthHref(addMonths(month, -1), today)}
          aria-label="Previous month"
          className={arrowLinkClass}
        >
          <ChevronLeft className="size-5" />
        </Link>
        <Link
          href={monthHref(addMonths(month, 1), today)}
          aria-label="Next month"
          className={arrowLinkClass}
        >
          <ChevronRight className="size-5" />
        </Link>
      </div>
    </header>
  );
}

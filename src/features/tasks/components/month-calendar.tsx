// The month calendar: navigation, a weekday header, a grid of day cells tinted
// by how much got done, and a legend. Picking a day is handled by the parent.

import { isSameMonth, monthGrid, WEEKDAY_LABELS } from "@/features/tasks/calendar";
import type { DaySummary } from "@/features/tasks/day-summary";
import { CalendarLegend } from "@/features/tasks/components/calendar-legend";
import { DayCell } from "@/features/tasks/components/day-cell";
import { MonthNav } from "@/features/tasks/components/month-nav";

const NO_TASKS: DaySummary = { done: 0, total: 0 };

export function MonthCalendar({
  month,
  today,
  selectedDay,
  summaries,
  onSelectDay,
}: {
  month: string;
  today: string;
  selectedDay: string;
  summaries: ReadonlyMap<string, DaySummary>;
  onSelectDay: (day: string) => void;
}) {
  return (
    <section aria-label="Calendar" className="flex flex-col gap-3">
      <MonthNav
        month={month}
        today={today}
        isTodaySelected={selectedDay === today}
        onSelectToday={() => onSelectDay(today)}
      />
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {monthGrid(month)
          .flat()
          .map((day) => (
            <DayCell
              key={day}
              day={day}
              summary={summaries.get(day) ?? NO_TASKS}
              isToday={day === today}
              isSelected={day === selectedDay}
              isOutsideMonth={!isSameMonth(day, month)}
              onSelect={onSelectDay}
            />
          ))}
      </div>
      <CalendarLegend />
    </section>
  );
}

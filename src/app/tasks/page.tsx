// To-do page: a month calendar with the selected day's list below. Loads the
// visible month's tasks (plus carried-over open ones) fresh on every request.

import { env } from "@/lib/env";
import { todayIso } from "@/lib/iso-date";
import { monthGrid, monthStart } from "@/features/tasks/calendar";
import { TaskBoard } from "@/features/tasks/components/task-board";
import { tasksRepo } from "@/features/tasks/repo";
import { taskDaySchema } from "@/features/tasks/validation";

export const dynamic = "force-dynamic";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const params = await searchParams;
  const today = todayIso(env.APP_TIME_ZONE);
  const requested = taskDaySchema.safeParse(params.date);
  const selectedDay = requested.success ? requested.data : today;
  const month = monthStart(selectedDay);
  const gridDays = monthGrid(month).flat();
  const tasks = await tasksRepo.findForCalendar(gridDays[0], gridDays[gridDays.length - 1], today);

  return (
    <TaskBoard
      key={month}
      tasks={tasks}
      today={today}
      month={month}
      initialDay={selectedDay}
    />
  );
}

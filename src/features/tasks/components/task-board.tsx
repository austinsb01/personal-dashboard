"use client";

// The to-do board: the month calendar on top and the selected day below. Owns
// the selected day and applies changes optimistically, so picking a day and
// checking things off respond instantly while the server catches up.

import { useOptimistic, useRef, useState, useTransition } from "react";

import {
  createTaskAction,
  deleteTaskAction,
  toggleTaskAction,
  type TaskActionResult,
} from "@/features/tasks/actions";
import { isPastDay, summarizeDays, tasksForDay } from "@/features/tasks/day-summary";
import {
  applyTaskChange,
  pendingTaskId,
  type TaskChange,
} from "@/features/tasks/optimistic";
import type { DayTask } from "@/features/tasks/schema";
import { DayPanel } from "@/features/tasks/components/day-panel";
import { MonthCalendar } from "@/features/tasks/components/month-calendar";

const UNREACHABLE_MESSAGE = "Could not reach the server. Check your connection and try again.";

export function TaskBoard({
  tasks,
  today,
  month,
  initialDay,
}: {
  tasks: DayTask[];
  today: string;
  month: string;
  initialDay: string;
}) {
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [error, setError] = useState<string | null>(null);
  const [optimisticTasks, applyOptimistic] = useOptimistic(tasks, applyTaskChange);
  const [, startTransition] = useTransition();
  const pendingCount = useRef(0);

  // Shows a change immediately, then saves it; a failure reverts and reports.
  function runChange(change: TaskChange, save: () => Promise<TaskActionResult>) {
    setError(null);
    startTransition(async () => {
      applyOptimistic(change);
      try {
        const result = await save();
        if (!result.ok) setError(result.error);
      } catch {
        setError(UNREACHABLE_MESSAGE);
      }
    });
  }

  // Adds a to-do to the selected day; on a past day it is logged as done.
  function handleAdd(title: string) {
    pendingCount.current += 1;
    const task: DayTask = {
      id: pendingTaskId(pendingCount.current),
      title,
      day: selectedDay,
      isCompleted: isPastDay(selectedDay, today),
    };
    runChange({ type: "add", task }, () => createTaskAction({ title, day: selectedDay }));
  }

  // Flips a to-do between done and open on the selected day.
  function handleToggle(task: DayTask) {
    const next = { id: task.id, isCompleted: !task.isCompleted, day: selectedDay };
    runChange({ type: "toggle", ...next }, () => toggleTaskAction(next));
  }

  // Deletes a to-do.
  function handleRemove(task: DayTask) {
    runChange({ type: "remove", id: task.id }, () => deleteTaskAction(task.id));
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <MonthCalendar
        month={month}
        today={today}
        selectedDay={selectedDay}
        summaries={summarizeDays(optimisticTasks, today)}
        onSelectDay={setSelectedDay}
      />
      <DayPanel
        day={selectedDay}
        today={today}
        tasks={tasksForDay(optimisticTasks, selectedDay, today)}
        error={error}
        onAdd={handleAdd}
        onToggle={handleToggle}
        onRemove={handleRemove}
      />
    </div>
  );
}

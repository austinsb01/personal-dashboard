import { timeRepo } from "@/features/time/repo";
import { Timer } from "@/features/time/components/timer";
import { TimeEntryList } from "@/features/time/components/time-entry-list";

export const dynamic = "force-dynamic";

export default async function TimePage() {
  const running = await timeRepo.findRunning();
  const completed = await timeRepo.findCompleted();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">Time</h1>
        <p className="text-sm text-muted-foreground">
          Start a timer for an activity; see daily totals below.
        </p>
      </header>
      <Timer
        running={
          running
            ? {
                id: running.id,
                activity: running.activity,
                startedAtMs: running.startedAt.getTime(),
              }
            : null
        }
      />
      <TimeEntryList items={completed} />
    </div>
  );
}

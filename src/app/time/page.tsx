import { timeRepo } from "@/features/time/repo";
import { Timer } from "@/features/time/components/timer";
import { TimeEntryList } from "@/features/time/components/time-entry-list";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function TimePage() {
  const running = await timeRepo.findRunning();
  const completed = await timeRepo.findCompleted();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Time"
        description="Start a timer for an activity; see daily totals below."
      />
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

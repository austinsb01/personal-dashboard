import { goalsRepo } from "@/features/goals/repo";
import { GoalForm } from "@/features/goals/components/goal-form";
import { GoalList } from "@/features/goals/components/goal-list";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const items = await goalsRepo.findAll();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">Goals</h1>
        <p className="text-sm text-muted-foreground">
          Longer-term goals and their progress.
        </p>
      </header>
      <GoalForm />
      <GoalList items={items} />
    </div>
  );
}

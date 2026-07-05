import { goalsRepo } from "@/features/goals/repo";
import { GoalForm } from "@/features/goals/components/goal-form";
import { GoalList } from "@/features/goals/components/goal-list";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const items = await goalsRepo.findAll();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Goals"
        description="Longer-term goals and their progress."
      />
      <GoalForm />
      <GoalList items={items} />
    </div>
  );
}

import { tasksRepo } from "@/features/tasks/repo";
import { TaskForm } from "@/features/tasks/components/task-form";
import { TaskList } from "@/features/tasks/components/task-list";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const items = await tasksRepo.findAll();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="To-do"
        description="Tasks with priorities and due dates."
      />
      <TaskForm />
      <TaskList items={items} />
    </div>
  );
}

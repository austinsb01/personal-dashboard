import { tasksRepo } from "@/features/tasks/repo";
import { TaskForm } from "@/features/tasks/components/task-form";
import { TaskList } from "@/features/tasks/components/task-list";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const items = await tasksRepo.findAll();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">To-do</h1>
        <p className="text-sm text-muted-foreground">
          Tasks with priorities and due dates.
        </p>
      </header>
      <TaskForm />
      <TaskList items={items} />
    </div>
  );
}

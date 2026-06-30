import { settingsRepo } from "@/features/settings/repo";
import { TargetsForm } from "@/features/settings/components/targets-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const targets = await settingsRepo.getTargets();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Daily targets for water and nutrition.
        </p>
      </header>
      <TargetsForm targets={targets} />
    </div>
  );
}

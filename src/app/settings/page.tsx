import { settingsRepo } from "@/features/settings/repo";
import { TargetsForm } from "@/features/settings/components/targets-form";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const targets = await settingsRepo.getTargets();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Settings"
        description="Daily targets for water and nutrition."
      />
      <TargetsForm targets={targets} />
    </div>
  );
}

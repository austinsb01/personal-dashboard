// Dashboard overview (home). Placeholder that lists each feature area; it will
// surface real summaries once those features are built.

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { NAV_GROUPS } from "@/lib/navigation";

export default function OverviewPage() {
  const pages = NAV_GROUPS.flatMap((group) => group.items);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Your dashboard home. Feature summaries will appear here as they are
          built.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.href}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {item.label}
                </CardTitle>
                <CardDescription>Coming soon.</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Dashboard overview (home). Placeholder that lists each feature area; it will
// surface real summaries once those features are built.

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { NAV_ITEMS } from "@/lib/navigation";

export default function OverviewPage() {
  const sections = NAV_ITEMS.filter((item) => item.href !== "/");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Your dashboard home. Feature summaries will appear here as they are
          built.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((item) => {
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

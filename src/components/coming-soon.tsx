// Shared placeholder for feature areas that are not built yet. Keeps section
// routes navigable while the dashboard is under construction, and avoids
// duplicating the same layout across every unbuilt page.

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            This area is under construction and will be available shortly.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

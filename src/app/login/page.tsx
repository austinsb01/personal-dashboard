import { LoginForm } from "@/features/auth/components/login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next =
    typeof params.next === "string" && params.next.startsWith("/")
      ? params.next
      : "/";

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Personal Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your password to continue.
          </p>
        </div>
        <LoginForm next={next} />
      </div>
    </div>
  );
}

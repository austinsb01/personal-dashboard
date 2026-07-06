// Sign-out control for the sidebar footer. Posts to logoutAction, which clears
// the session cookie and redirects to /login. Styled to match the theme toggle.

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2.5 px-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <LogOut className="size-4" />
        <span>Sign out</span>
      </Button>
    </form>
  );
}

// Home route. The app is focused on the to-do calendar for now, so the root
// sends straight there instead of rendering a separate overview.

import { redirect } from "next/navigation";

import { HOME_HREF } from "@/lib/navigation";

export default function HomePage() {
  redirect(HOME_HREF);
}

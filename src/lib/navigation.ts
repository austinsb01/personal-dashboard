// Single source of truth for the dashboard's primary navigation.
// Add, remove, or reorder a section here and every consumer (sidebar,
// overview grid) updates automatically.

import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  Dumbbell,
  Apple,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "To-do and goals", href: "/tasks", icon: CheckSquare },
  { label: "Time", href: "/time", icon: Clock },
  { label: "Workouts", href: "/workouts", icon: Dumbbell },
  { label: "Nutrition", href: "/nutrition", icon: Apple },
];

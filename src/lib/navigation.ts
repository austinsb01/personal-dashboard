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
  readonly section?: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "To-do and goals", href: "/tasks", icon: CheckSquare, section: "Tracking" },
  { label: "Time", href: "/time", icon: Clock, section: "Tracking" },
  { label: "Workouts", href: "/workouts", icon: Dumbbell, section: "Tracking" },
  { label: "Nutrition", href: "/nutrition", icon: Apple, section: "Tracking" },
];

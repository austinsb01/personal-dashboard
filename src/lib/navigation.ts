// Single source of truth for the dashboard's primary navigation. The Overview
// link sits on its own; everything else is organized into collapsible groups.
// Add, remove, or reorder a page here and the sidebar and overview update.

import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Clock,
  Apple,
  Dumbbell,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export type NavLeaf = {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
};

export type NavGroup = {
  readonly label: string;
  readonly items: readonly NavLeaf[];
};

export const NAV_OVERVIEW: NavLeaf = {
  label: "Overview",
  href: "/",
  icon: LayoutDashboard,
};

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: "General",
    items: [
      { label: "To-do", href: "/tasks", icon: CheckSquare },
      { label: "Goals", href: "/goals", icon: Target },
      { label: "Time", href: "/time", icon: Clock },
    ],
  },
  {
    label: "Nutrition",
    items: [{ label: "Nutrition", href: "/nutrition", icon: Apple }],
  },
  {
    label: "Gym",
    items: [{ label: "Workouts", href: "/workouts", icon: Dumbbell }],
  },
  {
    label: "Analytics",
    items: [{ label: "Analytics", href: "/analytics", icon: BarChart3 }],
  },
];

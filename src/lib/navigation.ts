// Single source of truth for the dashboard's primary navigation. Every page the
// app has is listed here; `isEnabled` decides whether it shows in the sidebar.
// Flip a flag to bring a hidden page back. Hidden pages keep their routes.

import {
  CheckSquare,
  Target,
  Clock,
  Apple,
  CalendarRange,
  ChefHat,
  Droplet,
  Dumbbell,
  BarChart3,
  Settings,
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

type NavEntry = NavLeaf & { readonly isEnabled: boolean };

type NavEntryGroup = {
  readonly label: string;
  readonly items: readonly NavEntry[];
};

export const HOME_HREF = "/tasks";

const ALL_NAV_GROUPS: readonly NavEntryGroup[] = [
  {
    label: "General",
    items: [
      { label: "To-do", href: HOME_HREF, icon: CheckSquare, isEnabled: true },
      { label: "Goals", href: "/goals", icon: Target, isEnabled: false },
      { label: "Time", href: "/time", icon: Clock, isEnabled: false },
    ],
  },
  {
    label: "Nutrition",
    items: [
      { label: "Nutrition", href: "/nutrition", icon: Apple, isEnabled: false },
      { label: "Recipes", href: "/recipes", icon: ChefHat, isEnabled: false },
      { label: "Meal prep", href: "/meal-prep", icon: CalendarRange, isEnabled: false },
      { label: "Water", href: "/water", icon: Droplet, isEnabled: false },
    ],
  },
  {
    label: "Gym",
    items: [{ label: "Workouts", href: "/workouts", icon: Dumbbell, isEnabled: false }],
  },
  {
    label: "Analytics",
    items: [{ label: "Analytics", href: "/analytics", icon: BarChart3, isEnabled: false }],
  },
  {
    label: "Settings",
    items: [{ label: "Settings", href: "/settings", icon: Settings, isEnabled: false }],
  },
];

// Drops the visibility flag so consumers only see the public leaf shape.
function toLeaf({ label, href, icon }: NavEntry): NavLeaf {
  return { label, href, icon };
}

export const NAV_GROUPS: readonly NavGroup[] = ALL_NAV_GROUPS.map((group) => ({
  label: group.label,
  items: group.items.filter((item) => item.isEnabled).map(toLeaf),
})).filter((group) => group.items.length > 0);

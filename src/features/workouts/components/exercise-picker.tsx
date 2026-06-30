"use client";

// Exercise picker for the workout progression chart. Selecting an exercise
// navigates with ?exercise set (preserving range), so the server reloads the
// chart for that exercise.

import { useRouter } from "next/navigation";

import { Select } from "@/components/ui/select";

export function ExercisePicker({
  exercises,
  selected,
  range,
}: {
  exercises: string[];
  selected: string;
  range: string;
}) {
  const router = useRouter();
  return (
    <Select
      aria-label="Exercise"
      value={selected}
      onChange={(event) =>
        router.push(
          `/analytics?range=${range}&exercise=${encodeURIComponent(event.target.value)}`,
          { scroll: false },
        )
      }
      className="w-40"
    >
      {exercises.map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </Select>
  );
}

// Drizzle tables for the gym/workouts feature: reusable workout-day types and
// exercises, one workout session per calendar date, its strength sets, and
// cardio sessions for a date.

import {
  pgTable,
  uuid,
  text,
  integer,
  real,
  date,
  timestamp,
  index,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";

export const exerciseKind = pgEnum("exercise_kind", ["strength", "cardio"]);

// Catalog of reusable workout-day types, e.g. "Chest day".
export const workoutDays = pgTable("workout_days", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Catalog of reusable exercises, e.g. "Bench Press" (strength) or "Running" (cardio).
export const exercises = pgTable(
  "exercises",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    kind: exerciseKind("kind").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique("exercises_name_kind_unq").on(table.name, table.kind)],
);

// One strength session per calendar date, tagged with a day type.
export const workouts = pgTable(
  "workouts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    performedOn: date("performed_on", { mode: "string" }).notNull().unique(),
    workoutDayId: uuid("workout_day_id")
      .notNull()
      .references(() => workoutDays.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("workouts_performed_on_idx").on(table.performedOn)],
);

// Sets within a workout for a given exercise.
export const strengthSets = pgTable(
  "strength_sets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workoutId: uuid("workout_id")
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id),
    reps: integer("reps").notNull(),
    weight: real("weight").notNull(),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("strength_sets_workout_id_idx").on(table.workoutId)],
);

// Cardio bouts for a calendar date (independent of the strength workout).
export const cardioSessions = pgTable(
  "cardio_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    performedOn: date("performed_on", { mode: "string" }).notNull(),
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id),
    durationMinutes: integer("duration_minutes").notNull(),
    distance: real("distance"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("cardio_sessions_performed_on_idx").on(table.performedOn)],
);

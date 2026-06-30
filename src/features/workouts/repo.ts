// Typed data access for the workouts feature. The only place its rows are read
// or written. Day types and exercises are find-or-create (reused or created).

import { and, asc, between, eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import {
  workoutDays,
  exercises,
  workouts,
  strengthSets,
  cardioSessions,
} from "./schema";
import type { AddSetInput, AddCardioInput } from "./validation";

// Returns the workout-day row for a name (case-insensitive), creating it if needed.
async function findOrCreateWorkoutDay(name: string) {
  const [existing] = await db
    .select()
    .from(workoutDays)
    .where(sql`lower(${workoutDays.name}) = lower(${name})`)
    .limit(1);
  if (existing) return existing;
  const [created] = await db
    .insert(workoutDays)
    .values({ name })
    .onConflictDoNothing()
    .returning();
  if (created) return created;
  const [row] = await db
    .select()
    .from(workoutDays)
    .where(sql`lower(${workoutDays.name}) = lower(${name})`)
    .limit(1);
  return row;
}

// Returns the exercise row for a name+kind (case-insensitive), creating it if needed.
async function findOrCreateExercise(name: string, kind: "strength" | "cardio") {
  const [existing] = await db
    .select()
    .from(exercises)
    .where(and(sql`lower(${exercises.name}) = lower(${name})`, eq(exercises.kind, kind)))
    .limit(1);
  if (existing) return existing;
  const [created] = await db
    .insert(exercises)
    .values({ name, kind })
    .onConflictDoNothing()
    .returning();
  if (created) return created;
  const [row] = await db
    .select()
    .from(exercises)
    .where(and(sql`lower(${exercises.name}) = lower(${name})`, eq(exercises.kind, kind)))
    .limit(1);
  return row;
}

export const workoutsRepo = {
  // All workout-day names, for the start-workout suggestions.
  listWorkoutDays() {
    return db.select().from(workoutDays).orderBy(asc(workoutDays.name));
  },

  // The workout for a date (with its day-type name), or null.
  async findByDate(performedOn: string) {
    const [workout] = await db
      .select({
        id: workouts.id,
        workoutDayId: workouts.workoutDayId,
        dayName: workoutDays.name,
      })
      .from(workouts)
      .innerJoin(workoutDays, eq(workouts.workoutDayId, workoutDays.id))
      .where(eq(workouts.performedOn, performedOn))
      .limit(1);
    return workout ?? null;
  },

  // Creates the workout for a date, tagged with a day type. No-op if one exists.
  async startWorkout(performedOn: string, workoutDayName: string) {
    const day = await findOrCreateWorkoutDay(workoutDayName);
    await db
      .insert(workouts)
      .values({ performedOn, workoutDayId: day.id })
      .onConflictDoNothing();
  },

  // Sets for a workout, with exercise names, oldest first.
  listSets(workoutId: string) {
    return db
      .select({
        id: strengthSets.id,
        reps: strengthSets.reps,
        weight: strengthSets.weight,
        exerciseName: exercises.name,
      })
      .from(strengthSets)
      .innerJoin(exercises, eq(strengthSets.exerciseId, exercises.id))
      .where(eq(strengthSets.workoutId, workoutId))
      .orderBy(asc(strengthSets.createdAt));
  },

  // Distinct strength-exercise names used before for a day type (suggestions).
  exercisesForWorkoutDay(workoutDayId: string) {
    return db
      .selectDistinct({ name: exercises.name })
      .from(strengthSets)
      .innerJoin(workouts, eq(strengthSets.workoutId, workouts.id))
      .innerJoin(exercises, eq(strengthSets.exerciseId, exercises.id))
      .where(eq(workouts.workoutDayId, workoutDayId))
      .orderBy(asc(exercises.name));
  },

  // Adds a strength set to a workout (find-or-creates the exercise).
  async addSet(workoutId: string, input: AddSetInput) {
    const exercise = await findOrCreateExercise(input.exercise, "strength");
    await db.insert(strengthSets).values({
      workoutId,
      exerciseId: exercise.id,
      reps: input.reps,
      weight: input.weight,
    });
  },

  async removeSet(id: string) {
    await db.delete(strengthSets).where(eq(strengthSets.id, id));
  },

  // Cardio sessions for a date, with exercise names, oldest first.
  listCardio(performedOn: string) {
    return db
      .select({
        id: cardioSessions.id,
        durationMinutes: cardioSessions.durationMinutes,
        distance: cardioSessions.distance,
        exerciseName: exercises.name,
      })
      .from(cardioSessions)
      .innerJoin(exercises, eq(cardioSessions.exerciseId, exercises.id))
      .where(eq(cardioSessions.performedOn, performedOn))
      .orderBy(asc(cardioSessions.createdAt));
  },

  // All cardio-exercise names, for cardio suggestions.
  listCardioExercises() {
    return db
      .select({ name: exercises.name })
      .from(exercises)
      .where(eq(exercises.kind, "cardio"))
      .orderBy(asc(exercises.name));
  },

  // Adds a cardio session for a date (find-or-creates the exercise).
  async addCardio(performedOn: string, input: AddCardioInput) {
    const exercise = await findOrCreateExercise(input.exercise, "cardio");
    await db.insert(cardioSessions).values({
      performedOn,
      exerciseId: exercise.id,
      durationMinutes: input.durationMinutes,
      distance: input.distance ?? null,
    });
  },

  async removeCardio(id: string) {
    await db.delete(cardioSessions).where(eq(cardioSessions.id, id));
  },
};

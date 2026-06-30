# workouts

Gym and workouts, viewed per calendar date. Reusable workout-day types
("Chest day") and exercises (strength or cardio) are created on the fly and
reused. Each date has at most one strength workout (tagged with a day type)
holding sets, plus any cardio sessions for that date.

## Contents

- `schema.ts` - the Drizzle tables (`workout_days`, `exercises`, `workouts`,
  `strength_sets`, `cardio_sessions`) and the `exercise_kind` enum. The single
  source of truth for the feature's types.
- Analytics: `workoutsRepo.listExercisesWithSets` and `exerciseVolumeByDate`
  plus `components/` (a workout section, an exercise picker, and a per-session
  volume chart) feed the analytics page.

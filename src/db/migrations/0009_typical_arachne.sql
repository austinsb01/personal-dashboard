-- Adds tasks.day. Existing rows are backfilled before the NOT NULL constraint:
-- finished tasks land on the day they were completed, open ones on their due
-- date when set, otherwise on the day they were created.
ALTER TABLE "tasks" ADD COLUMN "day" date;--> statement-breakpoint
UPDATE "tasks" SET "day" = (COALESCE("completed_at", "due_date", "created_at") AT TIME ZONE 'UTC')::date;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "day" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "tasks_day_idx" ON "tasks" USING btree ("day");

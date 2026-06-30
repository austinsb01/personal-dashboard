CREATE TABLE "water_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"logged_on" date NOT NULL,
	"amount_oz" real NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "water_entries_logged_on_idx" ON "water_entries" USING btree ("logged_on");
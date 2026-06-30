CREATE TABLE "daily_targets" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"water_oz" real NOT NULL,
	"calories" integer NOT NULL,
	"protein_g" real NOT NULL,
	"carbs_g" real NOT NULL,
	"fat_g" real NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

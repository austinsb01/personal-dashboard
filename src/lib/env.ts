// Validates required environment variables once at module load and exports a
// typed, immutable env object. Throws a clear error when validation fails.

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  APP_PASSWORD: z.string().min(8, "APP_PASSWORD must be at least 8 characters"),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
});

// Parses process.env against the schema; fails fast with readable errors.
function loadEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${issues}`);
  }

  return Object.freeze(parsed.data);
}

export const env = loadEnv();

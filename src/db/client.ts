// Creates the single Drizzle database client backed by the Neon serverless
// HTTP driver. This is the one source of truth for database access.

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/lib/env";

const sql = neon(env.DATABASE_URL);

export const db = drizzle({ client: sql });

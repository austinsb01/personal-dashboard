# db

Database access layer. Holds the Drizzle client, schema definitions, and the
generated migrations for the Neon Postgres database.

## Contents

- `client.ts` - the single Drizzle `db` instance, backed by the Neon serverless
  HTTP driver. All repositories import `db` from here; nothing else opens a
  connection.

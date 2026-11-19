# Personal Dashboard

A self-hosted personal dashboard, currently focused on one thing I use every day: a to-do
list organized by day, with a calendar that shows what got done. Accessible from any device.

> Current focus: the app is stripped back to the to-do calendar. Goals, time, nutrition,
> recipes, meal prep, water, workouts, analytics, and settings are hidden from the sidebar
> but fully intact (routes, code, and tables); each comes back by flipping its `isEnabled`
> flag in `src/lib/navigation.ts` when it is needed again.

> Status: Installable PWA with a Notion-style design language. A collapsible blue-grey sidebar,
> light and dark themes with a toggle, a polished app shell, and a web manifest, app icons,
> iOS meta tags, and a service worker (offline) sit on top of the data-layer foundation (Neon
> Postgres, Drizzle, env validation, migration tooling). Live features: to-do tasks (priority,
> due date, complete, delete), goals (progress, target date), time tracking (start/stop timer
> with daily totals), gym workouts (per-day strength sets and cardio, reusable day types
> and exercises), food and nutrition (per-day meal log over a reusable food catalog, grouped
> by meal with daily macro totals), reusable recipes logged to a day in one tap and a
weekly meal-prep view that rolls up a week's ingredients with macros against targets,
water intake (per-day quick-add against a daily goal),
> analytics (Recharts trends for nutrition, water, time, workout volume, and task/goal completion
> over a selectable window), and editable daily targets (a settings page driving progress bars and
> goal reference lines across water and nutrition). Polish and deploy is in progress. See the
> [Roadmap](#roadmap).

## Goals

- One home for my day-to-day tracking instead of scattered apps and notes.
- A UI I actually like and want to open every day.
- Accessible anywhere: log a workout or meal from my phone, review trends on my laptop.
- My data, private: single-user, kept private behind deployment-level access protection.

## Features

| Area | What it does |
| --- | --- |
| To-do calendar | A month calendar tinted by how much got done each day; pick a day to see or add its to-dos. Unfinished items carry over to today. |
| Goals (hidden) | Longer-term goals with progress. |
| Time tracking (hidden) | Log time spent on activities; see daily totals and trends. |
| Gym and workouts (hidden) | Log exercises, sets, reps, and weights; track progression over time. |
| Food and nutrition (hidden) | Log meals with calories and macros; daily summaries against targets. |
| Meal prep (hidden) | Reusable recipes logged in one tap; a weekly ingredient rollup with macros against targets. |
| Water (hidden) | Quick-add water intake against a daily goal, with a progress bar. |
| Analytics (hidden) | Recharts trends across every area over a selectable 7/30/90-day window. |
| Daily targets (hidden) | A settings page to set water and nutrition goals, shown as progress bars and chart goal lines. |

## Tech Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + React 19 | UI and API routes/server actions in one codebase. |
| Language | [TypeScript](https://www.typescriptlang.org/) | Type safety across the stack. |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Fast, polished, fully-owned components. |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) | Light and dark blue-grey themes with a toggle, no flash. |
| Database | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) | Serverless Postgres that pairs cleanly with Vercel. |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) | TypeScript-first, lightweight, immutable-friendly. |
| Access control | [Vercel Deployment Protection](https://vercel.com/docs/deployment-protection) | Keeps the deployed app private without an in-app login (single-user). |
| Validation | [Zod](https://zod.dev/) | Schema validation at every system boundary. |
| Charts | [Recharts](https://recharts.org/) | Trends across every tracked area on the analytics page. |
| Testing | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + [Playwright](https://playwright.dev/) | Unit, integration, and E2E coverage. |
| Hosting | [Vercel](https://vercel.com/) | First-class Next.js deployment. |
| Package manager | [pnpm](https://pnpm.io/) | Fast, disk-efficient installs. |

## Getting Started

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Installing as an app (PWA)

The app is a PWA, so it installs to a phone home screen and runs standalone (no
browser chrome). On iPhone: open the deployed URL in Safari, then Share, then
"Add to Home Screen."

The service worker (offline support) is intentionally **disabled in `next dev`**:
`@serwist/next` needs webpack, while `next dev` runs Turbopack, and a live worker
during development causes confusing stale-cache behavior. So `pnpm dev` never
serves the worker.

To exercise the full PWA (service worker, offline, install) locally:

```bash
pnpm build   # runs `next build --webpack`, generates public/sw.js
pnpm start   # serve the production build at http://localhost:3000
```

The worker is also generated on every Vercel production deploy, which is where
the installable app actually lives.

## Deploying (Vercel)

The app deploys on Vercel with a Neon Postgres database, and is kept private with
Vercel Deployment Protection (no in-app login).

1. **Create the database.** In Neon, create a project and copy the pooled
   connection string (Connect, then Connection string).
2. **Import the repo into Vercel.** New Project, then import this GitHub repo.
   Vercel auto-detects Next.js; no build configuration is needed.
3. **Set the environment variable.** In the Vercel project settings, add
   `DATABASE_URL` (the Neon pooled string) for Production (and Preview if used).
   Optionally add `APP_TIME_ZONE` (an IANA zone such as `America/New_York`) so the
   to-do calendar's "today" matches your local day; it defaults to UTC.
   It is validated at startup by `src/lib/env.ts`, so a missing or malformed
   value fails the boot with a clear error.
4. **Apply migrations.** The build does not touch the database (it stays
   decoupled), so apply migrations yourself. With your `.env` `DATABASE_URL`
   pointing at the target database, run `pnpm db:migrate`. For a single-user
   setup the dev and production database can be the same Neon project; otherwise
   point `.env` at the production database and run it again. Re-run whenever new
   migrations ship.
5. **Deploy.** Push to the default branch (or trigger a deploy from the Vercel
   dashboard). The production build also generates the service worker.
6. **Lock it down.** In the Vercel project: Settings, then Deployment Protection,
   then enable Vercel Authentication (or a password). This is the app's access
   control; there is no in-app login.

## Roadmap

- [x] Phase 0, Foundation: stack decision, README, `.gitignore`, project conventions.
- [x] Phase 1, Scaffold: Next.js + TypeScript + Tailwind + shadcn/ui, base layout, dashboard shell.
- [x] Phase 2, Data layer foundation: Neon Postgres connection, Drizzle ORM client, Zod env validation, and drizzle-kit migration tooling. (The first migration ships with the first feature in Phase 5.)
- [x] Phase 3, Design language and UI foundation: blue-grey design tokens (oklch, light and dark) as a single source of truth, Geist typography, a Notion-style collapsible sidebar with grouped dropdowns, a light/dark theme toggle (next-themes), and a polished full-height app shell. Every later feature is built on top of it.
- [x] Phase 4, PWA and installable iOS app: web app manifest, code-generated app icons and iOS meta tags, standalone display with no browser chrome, safe-area handling, and a Serwist service worker (offline support; built via webpack, disabled in `next dev`). Installs to the home screen. PWA finalization (testing, install polish) lands in the deploy phase.
- [x] Phase 5, To-do and goals: to-do tasks (title, priority, due date, complete, delete) and goals (title, description, 0-100 progress, target date) as full vertical slices (schema, migration, repo, Zod validation, server actions, UI). Input validation is unit-tested; DB-level integration tests are deferred.
- [x] Phase 6, Time tracking: a start/stop timer over free-text activities (`time_entries` schema, migration, repo, validation, server actions) with a live-ticking clock and entries grouped by day with daily totals.
- [x] Phase 7, Gym and workouts: a per-day view (date navigation) with a normalized model (reusable workout-day types and exercises, find-or-create and case-insensitive) covering strength sets (reps, weight) grouped by exercise and cardio sessions (duration, distance). Five tables, datalist autocomplete, daily nav via the URL.
- [x] Phase 8, Food and nutrition: a per-day view (date navigation) over a normalized model (a reusable `foods` catalog with per-serving macros and dated `meal_entries`). Logging a known food auto-fills its serving and macros; entries are grouped by meal type (breakfast/lunch/dinner/snack) with per-meal and daily calorie and macro totals.
- [x] Phase 9, Analytics: charts and trends across the tracked data (Recharts) on the analytics page over a selectable 7/30/90-day window: daily calories and macros, hours stacked by activity, workout volume per session (with an exercise picker), tasks completed per week, and goal progress. Server-side SQL aggregation feeds presentational client charts; shared range and series helpers are unit-tested.
- [x] Phase 10, Water: a per-day water tracker under the Nutrition area (its own `water_entries` slice and `/water` page) with quick-add buttons (8/12/16 oz) and a custom amount, a daily total against a goal shown as a progress bar, and a deletable entries list. Adds a daily water-intake chart (with a goal reference line) to the analytics page.
- [x] Phase 11, Daily targets: a `/settings` page to set daily targets (the water goal in oz, and calorie/protein/carbs/fat goals for nutrition), stored in a singleton `daily_targets` table. The water and nutrition day views show progress against these targets, and the nutrition analytics chart gains goal reference lines.
- [x] Phase 12, Meal prep and ingredient grouping: reusable recipes (a named meal built from catalog foods) that log to a day in one action and appear grouped in the day view, plus a weekly `/meal-prep` view that rolls up a week's ingredients with total macros against daily targets and links each ingredient to the recipes and days that use it. Logging a recipe flattens into tagged `meal_entries`, so existing daily totals and analytics are unchanged. New `recipes` and `recipe_items` tables and a nullable `meal_entries.source_recipe_id`.
- [x] Phase 14, To-do calendar focus: the app is narrowed to a day-based to-do list. A month calendar (heat-tinted by completed count, with a dot for open items) sits above the selected day's list and quick-add field; unfinished items carry over to today, past days read as a log of what was done, and changes apply optimistically. Adds `tasks.day` (migration `0009`), an optional `APP_TIME_ZONE` env var so "today" is correct outside UTC, and hides every other feature from the sidebar without removing it.
- [ ] Phase 13, Polish and deploy (current): global UI consistency pass, PWA finalization, Vercel deploy, and Vercel deployment protection (password/SSO gate) to keep the app private without an in-app login.

## License

Personal project, all rights reserved (for now).

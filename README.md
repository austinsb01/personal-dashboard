# Personal Dashboard

A self-hosted personal dashboard to organize and track the things I care about: tasks,
goals, time, workouts, and nutrition, in one place, accessible from any device.

> Status: Installable PWA with a Notion-style design language. A collapsible blue-grey sidebar,
> light and dark themes with a toggle, a polished app shell, and a web manifest, app icons,
> iOS meta tags, and a service worker (offline) sit on top of the data-layer foundation (Neon
> Postgres, Drizzle, env validation, migration tooling). Feature work (to-do and goals) is
> next. See the [Roadmap](#roadmap).

## Goals

- One home for my day-to-day tracking instead of scattered apps and notes.
- A UI I actually like and want to open every day.
- Accessible anywhere: log a workout or meal from my phone, review trends on my laptop.
- My data, private: single-user, kept private behind deployment-level access protection.

## Planned Features

| Area | What it does |
| --- | --- |
| To-do and goals | Tasks with priorities and due dates; longer-term goals with progress. |
| Time tracking | Log time spent on activities; see daily and weekly totals and trends. |
| Gym and workouts | Log exercises, sets, reps, and weights; track progression over time. |
| Food and nutrition | Log meals with calories and macros; daily summaries and trends. |

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
| Charts | [Recharts](https://recharts.org/) | Trends for time and nutrition. |
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

## Roadmap

- [x] Phase 0, Foundation: stack decision, README, `.gitignore`, project conventions.
- [x] Phase 1, Scaffold: Next.js + TypeScript + Tailwind + shadcn/ui, base layout, dashboard shell.
- [x] Phase 2, Data layer foundation: Neon Postgres connection, Drizzle ORM client, Zod env validation, and drizzle-kit migration tooling. (The first migration ships with the first feature in Phase 5.)
- [x] Phase 3, Design language and UI foundation: blue-grey design tokens (oklch, light and dark) as a single source of truth, Geist typography, a Notion-style collapsible sidebar with grouped dropdowns, a light/dark theme toggle (next-themes), and a polished full-height app shell. Every later feature is built on top of it.
- [x] Phase 4, PWA and installable iOS app: web app manifest, code-generated app icons and iOS meta tags, standalone display with no browser chrome, safe-area handling, and a Serwist service worker (offline support; built via webpack, disabled in `next dev`). Installs to the home screen. PWA finalization (testing, install polish) lands in the deploy phase.
- [ ] Phase 5, To-do and goals (current): first feature vertical slice end-to-end (includes the first migration).
- [ ] Phase 6, Time tracking.
- [ ] Phase 7, Gym and workouts.
- [ ] Phase 8, Food and nutrition.
- [ ] Phase 9, Polish and deploy: trends and charts, global UI consistency pass, PWA finalization, Vercel deploy, and Vercel deployment protection (password/SSO gate) to keep the app private without an in-app login.

## License

Personal project, all rights reserved (for now).

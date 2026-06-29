# Personal Dashboard

A self-hosted personal dashboard to organize and track the things I care about: tasks,
goals, time, workouts, and nutrition, in one place, accessible from any device.

> Status: Data layer foundation in place. The Next.js 16 app, dashboard shell, and section
> navigation are built, and the Neon Postgres connection, Drizzle ORM client, env validation,
> and migration tooling are wired up and verified. Feature work (to-do and goals) is next.
> See the [Roadmap](#roadmap).

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

## Roadmap

- [x] Phase 0, Foundation: stack decision, README, `.gitignore`, project conventions.
- [x] Phase 1, Scaffold: Next.js + TypeScript + Tailwind + shadcn/ui, base layout, dashboard shell.
- [x] Phase 2, Data layer foundation: Neon Postgres connection, Drizzle ORM client, Zod env validation, and drizzle-kit migration tooling. (The first migration ships with the first feature in Phase 5.)
- [ ] Phase 3, Design language and UI foundation (current): establish the visual direction before feature work. Design tokens (color, typography, spacing, radii, shadows) as a single source of truth, the app shell look, reusable UI primitives, and the iOS-native feel (iOS-style transitions, large tap targets, momentum scroll). Iterative: we refine the look together, and every later feature is built on top of it.
- [ ] Phase 4, PWA and installable iOS app: web app manifest, service worker, app icons and iOS meta tags, standalone display with no browser chrome, and safe-area handling, so it installs to the home screen and the iOS-native feel can be validated on-device while building features.
- [ ] Phase 5, To-do and goals: first feature vertical slice end-to-end (includes the first migration).
- [ ] Phase 6, Time tracking.
- [ ] Phase 7, Gym and workouts.
- [ ] Phase 8, Food and nutrition.
- [ ] Phase 9, Polish and deploy: trends and charts, global UI consistency pass, PWA finalization, Vercel deploy, and Vercel deployment protection (password/SSO gate) to keep the app private without an in-app login.

## License

Personal project, all rights reserved (for now).

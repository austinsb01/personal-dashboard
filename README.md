# Personal Dashboard

A self-hosted personal dashboard to organize and track the things I care about: tasks,
goals, time, workouts, and nutrition, in one place, accessible from any device.

> Status: Early setup. Stack and project conventions are decided; app scaffolding
> is the next step. See the [Roadmap](#roadmap).

## Goals

- One home for my day-to-day tracking instead of scattered apps and notes.
- A UI I actually like and want to open every day.
- Accessible anywhere: log a workout or meal from my phone, review trends on my laptop.
- My data, private: single-user, behind auth.

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
| Framework | [Next.js 15](https://nextjs.org/) (App Router) + React 19 | UI and API routes/server actions in one codebase. |
| Language | [TypeScript](https://www.typescriptlang.org/) | Type safety across the stack. |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Fast, polished, fully-owned components. |
| Database | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) | Serverless Postgres that pairs cleanly with Vercel. |
| ORM | [Drizzle ORM](https://orm.drizzle.team/) | TypeScript-first, lightweight, immutable-friendly. |
| Auth | [Auth.js v5](https://authjs.dev/) | Single-user login so data stays private across devices. |
| Validation | [Zod](https://zod.dev/) | Schema validation at every system boundary. |
| Charts | [Recharts](https://recharts.org/) | Trends for time and nutrition. |
| Testing | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) + [Playwright](https://playwright.dev/) | Unit, integration, and E2E coverage. |
| Hosting | [Vercel](https://vercel.com/) | First-class Next.js deployment. |
| Package manager | [pnpm](https://pnpm.io/) | Fast, disk-efficient installs. |

## Getting Started

> Not yet scaffolded. These steps will be filled in once the Next.js app is created.

```bash
# Coming soon
pnpm install
pnpm dev
```

## Roadmap

- [ ] Phase 0, Foundation (in progress): stack decision, README, `.gitignore`, project conventions.
- [ ] Phase 1, Scaffold: Next.js + TypeScript + Tailwind + shadcn/ui, base layout, dashboard shell.
- [ ] Phase 2, Data layer: Neon Postgres, Drizzle schema and migrations, Auth.js single-user login.
- [ ] Phase 3, To-do and goals: first vertical slice end-to-end.
- [ ] Phase 4, Time tracking.
- [ ] Phase 5, Gym and workouts.
- [ ] Phase 6, Food and nutrition.
- [ ] Phase 7, Polish and deploy: trends/charts, responsive mobile pass, Vercel deploy.

## License

Personal project, all rights reserved (for now).

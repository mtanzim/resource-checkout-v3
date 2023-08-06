# resource-checkout

## Demo

- Create shared resources, and share with team members with a simple check out and return system

## Why

- Experiment with React server components and server actions with NextJS v13
- Experiment with edge serverless databases and deploys

## Getting started

To start the dev server:

`npm run dev`

A single database is currently hosted on the cloud, and is configured through environment variables.

See the following for an example env config:

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
DIRECT_URL=
DATABASE_URL=
```

## Tech Stack

- Database: [Supabase Postgres](https://supabase.com/)
- Hosting: [Vercel](https://vercel.com/docs)
- Authentication: [Clerk](https://clerk.com/docs)
- ORM: [Prisma](https://www.prisma.io/) with `Data Proxy` for edge deploys
- [Typescript](https://www.typescriptlang.org/)
- [NextJS](https://nextjs.org/)
- [Tailwind](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/)

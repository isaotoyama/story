# Progressive Story Platform

Next.js + React + Tailwind + Clerk + Supabase MVP.

## Features

- Clerk login/signup
- Create story topics
- Browse topics
- Topic detail page
- Add next paragraph/scene
- Ordered progressive story contributions
- User profile with my topics and contributions
- Basic moderation page: approve/delete contributions

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Clerk

1. Create an app in Clerk Dashboard.
2. Copy keys into `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

The project uses Clerk middleware and Clerk UI components for login/signup.

## Supabase

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Copy Supabase URL, anon key, and service role key into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Important: `SUPABASE_SERVICE_ROLE_KEY` must only be used server-side.

## Development notes

- User rows are created/updated automatically from Clerk when a signed-in user creates content.
- Contributions are approved by default for MVP speed.
- To require admin approval first, change `approved: true` to `approved: false` in `app/api/topics/[id]/contributions/route.ts`.
- The admin page currently has no admin-role restriction beyond login. Add a Clerk metadata role check before production.

## Production improvements

- Add admin role check using Clerk public/private metadata.
- Add rate limiting to contribution API.
- Add content moderation.
- Add notifications.
- Add comments/likes/search/categories.
- Add branching stories.

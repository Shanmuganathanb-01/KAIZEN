# KAIZEN

KAIZEN is a cyberpunk-themed Life RPG that turns daily tasks and habits into gamified progression. Complete missions to earn XP, level up, gain gold, and build real-life attributes. Set personal goals with custom real-world rewards, stay accountable, and level up your life. Built with Next.js, Supabase, and a futuristic neon aesthetic.

![Neural Quest](https://img.shields.io/badge/Stack-Next.js%2014%20%2B%20Supabase-00ff9f?style=for-the-badge)

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Backend**: Next.js API Routes (no separate server)
- **Database + Auth**: Supabase (Postgres + Auth + RLS)
- **Icons**: lucide-react

## Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd neural-quest
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Database schema

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor:
1. Go to your Supabase project ? SQL Editor ? New Query
2. Paste the contents of `supabase/schema.sql`
3. Click Run

This creates all tables, RLS policies, triggers, and stored procedures.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Anti-Cheat Architecture

All XP/gold/level progression is computed **server-side only**:

- `POST /api/missions/[id]/complete` — verifies ownership, calls `complete_task` Postgres RPC
- The RPC runs in a single transaction: marks task complete, computes rewards, updates profile
- A `BEFORE UPDATE` trigger on `profiles` blocks client-side writes to `xp`, `gold`, `level`, `streak_count`, `attributes`
- The API route uses the `service_role` key (server-only) to bypass RLS and call the RPC

## Features

- ?? **Missions (Tasks)** — Create, complete, delete with optimistic UI
- ?? **Character Sheet** — Level, Neural XP bar, Credits, streak, 4 skill attributes
- ?? **Black Market (Shop)** — Buy cosmetics with earned Credits
- ?? **Level-Up Modal** — Framer Motion particle burst celebration
- ?? **Anti-cheat** — Server-side progression, RLS + DB triggers
- ?? **Responsive** — Mobile bottom nav, desktop sidebar
- ? **Accessible** — Semantic HTML, ARIA roles, keyboard navigation

## Security

- RLS enabled on all tables
- Service role key never exposed to client (server-side API routes only)
- Progression fields protected by Postgres trigger
- Input validated both client and server-side

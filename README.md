# Nexus Workspace

A bilingual (Bengali/English) Notion-inspired workspace starter for web and mobile.

## Monorepo
- `apps/web`: Next.js web application
- `apps/mobile`: Expo / React Native mobile starter
- `packages/shared`: shared types and locale dictionaries
- `supabase/migrations`: PostgreSQL schema, RLS policies and starter tables

## Prerequisites
- Node.js 20+
- pnpm 9+
- Supabase project (URL + anon key)

## Setup
```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
pnpm dev:web
```

Web app: http://localhost:3000

Mobile:
```bash
pnpm dev:mobile
```
Then use Expo Go or an emulator. Configure `EXPO_PUBLIC_SUPABASE_URL` and
`EXPO_PUBLIC_SUPABASE_ANON_KEY` in `apps/mobile/.env`.

## Database
Run `supabase/migrations/0001_initial.sql` in the Supabase SQL Editor.

## Current starter scope
This is a foundation, not a finished Notion clone. It includes a workspace shell,
bilingual UI, starter page editor, mobile shell, shared types, and a secured
initial database schema. Collaboration, rich block editing, database views,
uploads, notifications and AI are planned modules.

## Important production work still required
Before public launch: add tests, rate limits, audit logging, backups, email flows,
secure invitation flows, robust editor persistence, file validation, accessibility
review, privacy policy, and production monitoring. Never expose a Supabase service
role key in client apps.

# CodeQuest - Agent Notes

## Commands

```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Database

- Supabase PostgreSQL via Prisma
- `npx prisma generate` - Regenerate Prisma client after schema changes
- Use `node scripts/push-schema.js` to push schema changes to DB (Prisma v7 adapter)
- Use `node scripts/enable-rls.js` to enable RLS + policies on all tables (silences Supabase dashboard warnings)

## Stack

- Next.js (App Router)
- Prisma ORM + @prisma/adapter-pg
- Supabase (Auth, Storage)

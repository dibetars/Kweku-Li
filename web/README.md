## Kweku Li portfolio — Next.js rebuild

Rebuild of the site + admin CMS in Next.js (App Router), replacing the old Express/SQLite app in `../server`, `../admin`, and the static `../index.html`. See `/Users/dibelaba/.claude/plans/purrfect-dreaming-boole.md` for the full migration plan and rationale.

The old site keeps running untouched until this app is verified and cut over.

### Stack

- Next.js (App Router, TypeScript, Tailwind)
- Turso (libSQL) via Drizzle ORM — same schema as the old SQLite app, but works correctly on Vercel serverless (the old app lost all data on every cold start; this is the bug this rebuild fixes)
- iron-session for stateless, signed-cookie sessions
- Server Actions for all admin mutations (built-in CSRF protection, no separate library needed)
- Vercel Blob for image uploads

### Local setup

```bash
cp .env.local.example .env.local
# fill in SESSION_SECRET (openssl rand -base64 32) and ADMIN_PASSWORD
npm install
npm run db:generate   # only needed after changing lib/db/schema.ts
npm run db:migrate     # creates tables in local.db (a local libSQL file)
npm run db:seed        # seeds the admin user + all site content
npm run dev
```

Visit `http://localhost:3000` for the public site and `/admin/login` for the dashboard (username `admin`, password whatever you set as `ADMIN_PASSWORD`).

### Deploying

1. Create a Turso database and set `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` in Vercel project env vars.
2. Create a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN`.
3. Set `SESSION_SECRET` (32+ random chars) and `ADMIN_PASSWORD` (used only for the one-time seed).
4. Run `npm run db:migrate && npm run db:seed` once against the production Turso DB (e.g. via `vercel env pull` locally, or a one-off script).
5. Deploy. Confirm content survives a cold start (idle a few minutes, reload) — this is the concrete test that the old data-loss bug is fixed.

### What's carried over vs. changed

- All content keys, seed copy, and the admin's content-editing model are ported 1:1 from the old app (see `lib/db/seed-content.ts`).
- Live updates: the old app used Server-Sent Events; this app uses `revalidatePath` from Server Actions instead (simpler, and SSE doesn't scale across serverless instances). Admin saves still reflect on the public page immediately.
- Media library: the old admin's "list uploaded images" endpoint never existed (stubbed no-op). This app adds a working one (`listImagesAction`).
- No hardcoded fallback secrets or admin password — the app requires `SESSION_SECRET` and `ADMIN_PASSWORD` (seed-only) to be set explicitly.

### Known gaps (tracked, not blocking)

- Visual redesign is a separate, later pass — this app currently ports the existing look, not a new design.

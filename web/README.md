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

### Editorial redesign (September 2026)

- The public page now uses the editorial layout (hero portrait, Latest Works, filterable portfolio, Experiences, promo banner, About, Insights, testimonials, contact, dark footer). Styles live in `app/site.css`, scoped under `.site` so they never affect the admin. Sections are in `components/site/`.
- Photos live in `public/img/` and are served through `next/image`. Lists saved before the `image` fields existed fall back to the photo for that title (`lib/site-defaults.ts`).
- New content keys: `hero.image`, `hero.stats`, `services.description`, `experience.list`, `promo.banner`, `insights.list`. `npm run db:seed` adds missing keys to an existing database without overwriting anything. `layout.order` and `theme.config` are no longer read.

### Contact form and inbox

- The form posts to a Server Action (`app/contact-actions.ts`): zod validation, honeypot field, best-effort per-IP throttle, then a row in the `submissions` table and an email through Resend (`lib/contact.ts`).
- Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` (a sender on a domain verified in Resend). Without them the message is still stored and the admin Inbox shows "Email not sent".
- The admin dashboard's **Inbox** lists submissions with filters, status (new/read/replied/archived), reply-by-email, and delete (admins only).
- Adding the table to an existing database: `npm run db:migrate` against that database (migration `0001`).

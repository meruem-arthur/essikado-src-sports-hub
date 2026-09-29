# UMaT Essikado SRC Sports

Next.js 15 (App Router) · TypeScript · Tailwind 4 · Drizzle · Neon Postgres · Cloudinary · Vercel. One app: public site at `/`, CMS at `/admin`.

## Local setup
1. `cp .env.example .env.local` and fill in: `DATABASE_URL` (Neon pooled string), `AUTH_SECRET` (`openssl rand -base64 32`),
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_SITE_URL`,
   `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (12+ chars).
2. `npm install` then `npx tsc --noEmit` (fix any type errors — this code was written without a compile check).
3. `npm run db:generate && npm run db:migrate` (creates ./drizzle migrations, applies to Neon).
4. `npm run db:seed` (roles + first Super Admin). `npm run dev`. Log in at `/admin/login`.

## Deploy (GitHub → Vercel)
1. Push to GitHub (never commit `.env.local`). 2. Import the repo in Vercel. 3. Add every variable from `.env.example` in Project → Settings → Environment Variables
(set `NEXT_PUBLIC_SITE_URL` to the production URL). 4. Run `db:migrate` and `db:seed` once against the production Neon DB
(from your machine with production `DATABASE_URL`). 5. Deploy. Migrations must exist before `next build`, because public pages query the DB.

## Admin notes
- Content types are defined in `src/features/admin/resources.ts` (one entry = list + form + validation + permission).
- Roles live in the `roles` table; permissions are strings (`news:write`, `*`). Only Super Admin sees Hero, Page Heroes, Sponsors, Committee, Settings.
- Standings: Admin → Standings → Recalculate (from results + Competition Teams). Scoring override: set `sports.config` to `{"pointsWin":2,"pointsDraw":0,"pointsLoss":1}`.
- Page heroes match a page by its title (e.g. "Fixtures").

## Not built yet
Contact form, favicon setting, manual standings editing, sport-specific match-event UI, toasts (a saved/deleted banner is shown instead), automated tests.

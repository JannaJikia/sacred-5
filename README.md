# Sacred 5

Daily practice tracker (walk, cold shower, journal, meditation, custom habits) — **Next.js (App Router)**, **Prisma 7**, **Postgres**. Session auth, timezone-aware days, atomic tracker rules, themes, coins, stats.

- **Repository:** [github.com/JannaJikia/sacred-5](https://github.com/JannaJikia/sacred-5)
- **Live demo (Vercel):** [https://sacred-5.vercel.app](https://sacred-5.vercel.app) — open `/welcome`, then sign in or register. *(If your Vercel project uses another hostname, update this link in the README.)*

## Screenshots

| Marketing (`/welcome`) | Sign in (`/login`) |
| --- | --- |
| ![Marketing landing](docs/screenshots/marketing.png) | ![Login](docs/screenshots/login.png) |

| Register (`/register`) | Stats (`/stats`) |
| --- | --- |
| ![Register](docs/screenshots/register.png) | ![Stats](docs/screenshots/stats.png) |

Regenerate images: [`docs/screenshots/README.md`](docs/screenshots/README.md).

---

## Branches & deploy

- **`staging`** — integrate new work first; point **Vercel Preview** (and a staging DB) here.
- **`main`** — production; merge `staging → main` when ready. **Production** `DATABASE_URL` should only ever hit the prod database.

```bash
# Ship to staging
git checkout staging && git merge main && git push origin staging

# Release to production
git checkout main && git merge staging && git push origin main
```

CI: `.github/workflows/ci.yml` on PRs and pushes to `main` and `staging`.

---

## Stack

Next.js 16 · React 19 · TypeScript · Postgres · Prisma 7 (`prisma.config.ts`) · Zod · bcrypt · Luxon (`APP_TZ`) · Tailwind v4 · Radix · lucide-react · Vitest (Postgres integration tests)

---

## Data model (short)

- **User** — `email` (unique, login id, stored lowercased), `passwordHash`, `coins`
- **Practice** / **UserPractice** — built-in + custom practices; selection drives Done/Undo
- **DailyPracticeCompletion** — per user, practice, `dayKey` (`YYYY-MM-DD` in `APP_TZ`)
- **Session** — `tokenHash` only, `expiresAt`
- **DailyRewardClaim** — idempotent daily reward bookkeeping

---

## Security (short)

- Register/login use **email** + password; weak passwords rejected on register; login accepts `password` min length in the route so older accounts still work.
- Session cookie is **httpOnly**; token stored hashed. No in-app rate limiting — use Vercel / WAF / Upstash for brute-force protection in production.

---

## API

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/register` | `{ email, password, passwordConfirm }` → session cookie |
| POST | `/api/login` | `{ email, password }` → session cookie |
| POST | `/api/logout` | Clears session |
| GET | `/api/me` | Current user or 401 |
| GET/POST | `/api/practices`, `/api/practices/custom` | List / create custom |
| GET/POST | `/api/onboarding`, `/api/onboarding/save` | Selection (max 10) |
| GET | `/api/completions?dayKey=` | Day grid |
| POST | `/api/done`, `/api/undo` | Increment / decrement (max per day) |
| GET | `/api/stats?...` | Aggregates |

Errors: JSON `{ "error": { "code", "message", "details?" } }` (e.g. `VALIDATION_ERROR`, `EMAIL_TAKEN`, `INVALID_CREDENTIALS`).

---

## Local development

**Requirements:** Node 20+, pnpm 9+, Docker (for Postgres).

```bash
pnpm install
docker compose up -d
```

`.env` (root):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/isha_practice?schema=public"
APP_TZ="Asia/Tbilisi"
BCRYPT_COST="10"
SESSION_TTL_DAYS="30"
```

Then:

```bash
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Useful routes: `/welcome`, `/login`, `/register` → onboarding, `/` tracker, `/stats`, `/practices`.

If Prisma complains about host `"base"`, you likely have a bad `DATABASE_URL` in the shell — `unset DATABASE_URL` and rely on `.env`.

---

## Tests

Integration tests need a **test DB** (e.g. `isha_practice_test`) and `.env.test` with `DATABASE_URL` pointing at it. `pnpm test` runs migrate deploy + seed + Vitest (see `package.json`).

- `pnpm test` loads `.env.test` via `dotenv-cli`, runs `pnpm db:deploy` + `pnpm db:seed` before Vitest, and asserts `DATABASE_URL` contains `isha_practice_test`.

Husky: `pre-commit` → `pnpm check`; **`pre-push` → `pnpm check` only** (lint + typecheck, no DB). Run **`pnpm test`** locally when Docker is up and `.env.test` points at **`localhost`** / `isha_practice_test`. **GitHub Actions** still runs **`pnpm test`** on every push to `main` / `staging`.

Use `git commit --no-verify` / `git push --no-verify` only if you must bypass hooks.

---

## CI (GitHub Actions)

`.github/workflows/ci.yml` — PRs and pushes to `main` / `staging`: `pnpm install --frozen-lockfile`, `pnpm check`, Postgres service, `pnpm db:deploy`, `pnpm test`.

---

## Deploy (Vercel)

**Demo:** [sacred-5.vercel.app](https://sacred-5.vercel.app)

Point **Preview** at branch **`staging`** and use a **staging** `DATABASE_URL`; **Production** (from `main`) should use the production database only.

### Environment variables

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | **Yes** | Use different URLs for **Production** vs **Preview** when using separate databases. |
| `APP_TZ` | No | Default `Asia/Tbilisi` in code. |
| `BCRYPT_COST` | No | Default `10` (clamped in code). |
| `SESSION_TTL_DAYS` | No | Default `30`. |

Build is driven by **`vercel.json`**: `pnpm run vercel-build` → `prisma generate` + `prisma migrate deploy` + `next build`.

If a migration fails in production, use [Prisma’s production troubleshooting](https://www.prisma.io/docs/guides/migrate/production-troubleshooting) (`migrate resolve`, inspect `_prisma_migrations`) before redeploying — do not guess `--rolled-back` if later migrations already applied.

---

## Scripts

`pnpm dev` · `pnpm build` / `pnpm start` · `pnpm check` (lint + typecheck) · `pnpm test` · `pnpm db:*` (Prisma helpers)

---

## Layout (where to look)

```
prisma/          schema, migrations, seed
src/app/api/     Route handlers (thin)
src/server/      Domain logic (tracker, stats, auth)
src/lib/         db, auth, cookies, time, HTTP helpers
src/config/      practices, strings, UI copy
```

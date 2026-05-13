# Sacred 5

A full-stack **daily practice tracker** (walk, cold shower, journal, meditation, and custom habits) built with **Next.js (App Router)**, **Prisma**, and **Postgres**. The app emphasizes **backend correctness** and a polished product UI (themes, coins, weekly stats, onboarding).

Repository: [github.com/JannaJikia/sacred-5](https://github.com/JannaJikia/sacred-5)

## Screenshots

| Marketing (`/welcome`) | Sign in (`/login`) |
| --- | --- |
| ![Marketing landing](docs/screenshots/marketing.png) | ![Login](docs/screenshots/login.png) |

| Register (`/register`) | Stats (`/stats`, auth required — shows sign-in when logged out) |
| --- | --- |
| ![Register](docs/screenshots/register.png) | ![Stats](docs/screenshots/stats.png) |

To regenerate images, see [`docs/screenshots/README.md`](docs/screenshots/README.md).

## Live demo

- **Production**: deploy this repo to Vercel (or your host) and set the env vars under [Deploy (Vercel)](#deploy-vercel).
- **Legacy demo** (older deployment name): [isha-practice-tracker on Vercel](https://isha-practice-tracker.vercel.app/login) — may or may not match this branch; prefer your own Preview URL after connecting the repo.

## Staging branch

**Integration flow: `staging` first, then `staging` → `main`.**

- **`staging`** is where new work lands first (feature branches should merge here, or commit directly if that is your team norm). Point **Vercel Preview** (and your staging database) at this branch.
- **`main`** is the production line. Update it only by merging **`staging` → `main`** (pull request or merge after Preview / QA).

Suggested commands when your latest commits are on local `main` but you want them on **`staging`** before touching `main`:

```bash
git fetch origin
git checkout staging
git merge origin/main        # optional: start from latest remote main if needed
git merge main               # bring your local main commits onto staging
git push origin staging
git checkout main
```

Release to production when ready:

```bash
git checkout main
git merge staging            # or open a PR: base main ← compare staging
git push origin main
```

If a **hotfix** ships straight to `main`, merge **`main` → `staging`** once afterward so `staging` does not fall behind production.

GitHub Actions CI runs on **pull requests** and on pushes to **`main`** and **`staging`** (see `.github/workflows/ci.yml`).

---

## What this project demonstrates

- **Session auth** (httpOnly cookies, token hashing)
- **Atomic business rules** (max-per-day, undo) enforced via DB transactions
- **Timezone-safe day keys** and aggregation for stats
- **Predictable API errors** (standardized error payloads; Zod `treeifyError`)
- **Quality gates** (integration tests + CI + Git hooks)
- **Clean boundaries**: Next.js Route Handlers are thin; domain logic lives in `src/server/**`
- **Concurrency safety**: the “done/undo” logic uses conditional `updateMany` + transactions to remain correct under concurrent requests
- **Operational realism**: migrations in CI, real Postgres integration tests, and deploy-ready env var strategy

---

## Architecture

**Flow** (happy path):

1. UI calls `src/lib/http/api.ts` (typed client wrappers)
2. Route Handler validates input with Zod (`z.treeifyError(...)` for consistent details)
3. Route Handler calls domain logic in `src/server/**`
4. Domain logic uses Prisma (transactions where needed)
5. Response returns either a success payload or standardized error payload

**Standard error shape**:

```json
{
  "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": { "field": ["msg"] } }
}
```

---

## Tech Stack

### Runtime

- **Next.js 16** (App Router, Route Handlers)
- **React 19**
- **TypeScript**
- **Postgres 16**
- **Prisma 7** (config-based datasource via `prisma.config.ts`)

### Backend / domain

- **Zod**: request/query validation, `z.treeifyError` for structured error details
- **bcrypt**: password hashing (cost clamped in code)
- **crypto**: session token generation + token hashing
- **Luxon**: timezone-aware day keys (`APP_TZ`)

### Frontend/UI (minimal on purpose)

- **Tailwind CSS v4** + `tailwind-merge` + `clsx`
- **Radix UI** (Separator)
- **lucide-react** (icons)
- **sonner** (toasts)
- **next-themes**
- **tw-animate-css**

### Tooling / quality

- **Vitest**: integration tests (Node env)
- **dotenv-cli**: load `.env.test` for `pnpm test`
- **ESLint** + **Next.js ESLint config**
- **Husky**: pre-commit / pre-push hooks
- **GitHub Actions**: CI on PRs + pushes to `main` and `staging`

---

## Data Model (Prisma)

- **User**
  - `username` unique
  - `passwordHash`
  - `coins` (integer; optional gamification balance)
- **DailyRewardClaim**
  - Composite primary key `(userId, dayKey, rewardKey)` — idempotent “claimed this reward for this local day” (e.g. daily completion goal)
  - Cascades when the user is deleted
- **Practice**
  - Built-in and user-created practices live in the database
  - `points`, `maxPerDay` drive scoring + button disabling
  - Custom practices are `isCustom=true` and `ownerId=user.id`
- **UserPractice**
  - Join table for the user’s selected practices
  - Used to enforce “you can only Done/Undo what you selected”
- **Session**
  - Stores **only `tokenHash`** (raw token never stored)
  - Has `expiresAt` + indexes for cleanup/lookup
- **DailyPracticeCompletion**
  - `(userId, practiceId, dayKey)` unique
  - `dayKey` is `"YYYY-MM-DD"` computed in `APP_TZ`
  - `count`, `lastCompletedAt`, `updatedAt`

---

## Security notes

- **Password policy** is enforced both in `POST /api/register` (Zod) and in `src/server/auth/register.ts` (`parseRegisterPassword`) so domain code cannot accidentally persist a weak password if a new caller bypasses the route.
- **Login** still accepts passwords from `min(8)` in the route schema so existing accounts (e.g. seeded demos) are not locked out; new accounts must meet the stronger register policy (12+ chars, upper, digit, symbol).
- **Rate limiting** is not implemented in-app. For production, add edge/WAF rules, Vercel firewall, or a shared store (e.g. Redis / Upstash) for `POST /api/login` and `POST /api/register` to throttle brute force and credential stuffing.

---

## Business Rules (core logic)

### “Done” (increment)

Domain entrypoint: `src/server/tracker/done.ts`  
Atomic core: `src/server/tracker/applyCompletion.ts`

- Enforces \(count + delta \le maxPerDay\)
- After a successful increment, aggregates **total completions for that user and `dayKey`** across all practices; when the total first reaches the configured daily goal, records a **`DailyRewardClaim`** and increments **`User.coins`** once (idempotent for that day and reward key).
- Concurrency-safe approach:
  - Conditional increment via `updateMany(where count <= maxPerDay - delta)`
  - If missing row, `createMany({ skipDuplicates: true })` to avoid transaction abort due to unique violations (Postgres aborts a transaction on *any* statement error)
  - Retry increment; otherwise return `max_reached`

### “Undo” (decrement)

Domain entrypoint: `src/server/tracker/undo.ts`  
Atomic core: `src/server/completions/undoCompletion.ts`

- If count stays \(\ge 1\), decrements via conditional `updateMany(where count > delta)`
- If undo would drop to \(\le 0\), deletes row
- If row doesn’t exist, returns noop

---

## API (Route Handlers)

### Auth

- `POST /api/register` → `{ username, password, passwordConfirm }` (policy + match validated in Zod and again in `register()`); create user + set session cookie
- `POST /api/login` → validate credentials + set session cookie
- `POST /api/logout` → delete session + clear cookie
- `GET /api/me` → current user (401 if not logged in)

### Tracker / Stats

- `GET /api/practices` → list practices from DB (built-in + your custom)
- `POST /api/practices/custom` → create a custom practice (also auto-selects it)
- `GET /api/onboarding` → current selected practice IDs
- `POST /api/onboarding/save` → replace selected practices (**max 10**)
- `GET /api/completions?dayKey=YYYY-MM-DD` → day completions (defaults to today in `APP_TZ`)
- `POST /api/done` `{ practiceId, delta? }` → increment (max-per-day enforced)
- `POST /api/undo` `{ practiceId, delta? }` → decrement (deletes row at 0)
- `GET /api/stats?range=today|week|month|all&dayKey=YYYY-MM-DD&days=7..365` → aggregated stats

---

## Project Structure (high signal)

```
.
├─ docker-compose.yml
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  └─ seed.ts
├─ prisma.config.ts
├─ src/
│  ├─ app/
│  │  └─ api/                 # Next.js Route Handlers (thin)
│  ├─ config/                 # Practices config + UI text
│  ├─ lib/                    # DB, auth helpers, time helpers, HTTP client
│  └─ server/                 # Domain logic (transactions, invariants)
│     ├─ auth/
│     ├─ stats/
│     ├─ tracker/
│     └─ __tests__/           # Integration tests (real Postgres)
└─ README.md
```

---

## Local Development

### Requirements

- Node.js **20+**
- pnpm **9+**
- Docker (for Postgres)

### 1) Install

```bash
pnpm install
```

### 2) Start Postgres (Docker)

```bash
docker compose up -d
```

### 3) Configure env

Create `.env` in the repo root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/isha_practice?schema=public"
APP_TZ="Asia/Tbilisi"
BCRYPT_COST="10"
SESSION_TTL_DAYS="30"
SESSION_COOKIE_NAME="isha_session"
```

Notes:

- `DATABASE_URL` must be a valid URL. If you see errors referencing host `"base"`, you likely exported `DATABASE_URL` in your shell; run `unset DATABASE_URL` and restart.

### 4) Migrate + seed

This project stores practice definitions in the database (`Practice` table). Seeding creates the built-in practices.

```bash
pnpm db:migrate
pnpm db:seed
```

### 5) Run

```bash
pnpm dev
```

Open:

- `/login` to register/login
- `/` for the tracker UI
- `/practices` to manage your selected practices later
- `/onboarding` is used for first-time setup (new registrations redirect here)

---

## Testing (integration)

Tests run against a **real Postgres test database** via Prisma transactions.

### 1) Create the test database

With the Docker DB running:

```bash
docker exec -it isha_tracker_db psql -U postgres -c "CREATE DATABASE isha_practice_test;"
```

### 2) Create `.env.test`

Create `.env.test` in the repo root:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/isha_practice_test?schema=public"
```

### 3) Apply migrations + seed to the test DB

```bash
pnpm db:deploy
pnpm db:seed
```

### 4) Run tests

```bash
pnpm test
```

Notes:

- `pnpm test` loads `.env.test` via `dotenv-cli`.
- `pnpm test` also runs `pnpm db:deploy` + `pnpm db:seed` before Vitest, so your test DB stays up to date.
- The integration suite asserts `DATABASE_URL` contains `isha_practice_test` as a safety check.

---

## Quality Gates (local)

This repo uses **Husky** to run checks automatically:

- `pre-commit` → `pnpm check` (eslint + typecheck)
- `pre-push` → `pnpm test` (integration tests)

If you need to bypass hooks temporarily (not recommended), you can use `git commit --no-verify` / `git push --no-verify`.

---

## CI (GitHub Actions)

Workflow: `.github/workflows/ci.yml`

- Runs on PRs and pushes to `main` and `staging`
- Steps:
  - `pnpm install --frozen-lockfile`
  - `pnpm check`
  - Postgres service
  - `pnpm db:deploy`
  - `pnpm test`

---

## Deploy (Vercel)

### Required env vars

Set these in **Vercel → Project → Settings → Environment Variables**:

- `DATABASE_URL` (Production + Preview)
- `APP_TZ`
- `BCRYPT_COST`
- `SESSION_TTL_DAYS`
- `SESSION_COOKIE_NAME`

### Staging / Preview

Use the **`staging`** workflow above: Preview should track **`staging`**, not `main`. In Vercel, set **Preview** `DATABASE_URL` (and other vars) to a **staging Postgres** instance; keep **Production** (from `main`) pointed at production only.

No code changes are required beyond env configuration and running migrations on deploy (`pnpm db:deploy && pnpm build` or your `vercel-build` script).

### Migrations on deploy

Set **Build Command** to:

```bash
pnpm db:deploy && pnpm build
```

---

## Scripts

- `pnpm dev` – start dev server
- `pnpm build` / `pnpm start` – production build/run
- `pnpm lint` – eslint
- `pnpm typecheck` – tsc --noEmit
- `pnpm check` – lint + typecheck
- `pnpm test` – run tests (Vitest, loads `.env.test`)
- `pnpm test:watch` – watch mode
- `pnpm db:*` – Prisma helpers (`generate`, `migrate`, `deploy`, `seed`, etc.)

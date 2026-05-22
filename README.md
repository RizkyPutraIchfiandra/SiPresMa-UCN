# Dashboard Absensi (Face Recognition)

A face-recognition attendance dashboard built with Next.js 14 (App Router), TypeScript, Prisma + PostgreSQL, and face-api.js.

Faces are recognised entirely client-side; only the 128-dimensional descriptor (no photo) is stored in the database, which keeps things privacy-friendly and cheap.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui-style primitives
- **Database**: PostgreSQL via Prisma (Neon / Supabase / Vercel Postgres compatible)
- **Face Recognition**: face-api.js (`SsdMobilenetv1` + `FaceLandmark68` + `FaceRecognitionNet`)
- **Auth (admin)**: NextAuth.js Credentials provider
- **Validation**: Zod
- **Data fetching (admin)**: TanStack Query
- **Charts**: Recharts
- **Testing**: Vitest

## Design Patterns Used

Each pattern is annotated in the source so it's easy to find during review.

| Pattern | Where |
| --- | --- |
| Repository Pattern | `src/core/repositories/*` (interfaces) + `src/infrastructure/repositories/*` (Prisma impls) |
| Service Layer | `src/core/services/*` (UserService, AttendanceService, FaceRecognitionService) |
| DTO Pattern | `src/lib/validators/schemas.ts` (Zod schemas, `z.infer` types) |
| Factory / DI | `src/infrastructure/container.ts` |
| Strategy Pattern | `src/core/services/face-matching-strategy.ts` + `src/infrastructure/strategies/*` |
| Singleton Pattern | `src/infrastructure/database/prisma.ts` (Prisma client) |
| Observer Pattern | `src/core/services/attendance-events.ts` (`AttendanceEventBus`) |
| Value Object | `src/core/domain/face-descriptor.ts` |

## Project Structure

```
src/
  app/
    (admin)/dashboard/        # admin pages (overview, users, attendance)
    (public)/scan/            # face scan attendance
    (public)/register/        # face registration
    api/
      users/                  # POST register, GET list, DELETE :id
      attendance/             # POST scan, GET list
      dashboard/stats/        # admin stats
      auth/[...nextauth]/     # NextAuth handler
  core/
    domain/                   # entities, value objects, errors
    repositories/             # repo interfaces
    services/                 # business logic + event bus + strategy interface
  infrastructure/
    database/                 # Prisma singleton
    repositories/             # Prisma-backed repo implementations
    strategies/               # Euclidean + Cosine distance strategies
    container.ts              # service factory / DI
  lib/
    face-api/                 # face-api.js loader & detection helper
    validators/               # Zod schemas (DTOs)
    auth.ts                   # NextAuth options
    api-error.ts              # DomainError -> HTTP translator
    utils.ts                  # cn(), formatters
  components/
    ui/                       # button, input, card, table, badge, label
    face-scanner/             # webcam + face detection component
    dashboard/                # stat cards, chart, logout
prisma/
  schema.prisma               # User / Attendance / AdminUser
  seed.ts                     # seeds default admin
scripts/
  download-face-models.mjs    # one-shot weights downloader
public/
  models/                     # face-api.js weights live here
```

## Setup

### 1. Install dependencies

```bash
npm install
```

`postinstall` runs `prisma generate` automatically.

### 2. Environment variables

Create a `.env` file in the project root with these keys:

```
# Pooled connection used by the app at runtime (Neon/Supabase/Vercel pooler URL)
DATABASE_URL="postgresql://user:password@host/db?pgbouncer=true&connection_limit=1"

# Direct (non-pooled) connection used by `prisma migrate`
DIRECT_URL="postgresql://user:password@host/db"

# NextAuth
NEXTAUTH_SECRET="replace-with-a-strong-random-string"
NEXTAUTH_URL="http://localhost:3000"

# Default admin credentials (used by db:seed)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"

# Matching config
FACE_MATCH_THRESHOLD="0.6"
FACE_MATCH_STRATEGY="euclidean"   # or "cosine"
```

Notes:

- Use a **pooled** `DATABASE_URL` for serverless deployments (PgBouncer / Neon pooler). Without it you'll exhaust connections on Vercel.
- `DIRECT_URL` is only used by `prisma migrate` and `prisma db push`.

### 3. Download face-api.js model weights

The models are not committed. Run the included script to fetch them into `public/models`:

```bash
node scripts/download-face-models.mjs
```

This grabs `ssd_mobilenetv1`, `face_landmark_68`, and `face_recognition` weights from the upstream face-api.js repo.

### 4. Run database migrations and seed the admin

```bash
npm run db:migrate     # creates tables (development)
npm run db:seed        # creates the default admin user
```

For deployments use `npm run db:deploy` instead of `db:migrate`.

### 5. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000.

- `/register` — register a new face
- `/scan` — scan to check in
- `/login` — admin login (uses the seeded credentials)
- `/dashboard` — admin overview, user list, attendance log

## Tests

A unit test for the face-matching service is included.

```bash
npm test
```

It covers: closest-match selection, threshold rejection, empty enrollment, the cosine strategy, and descriptor validation.

## Deploying to Vercel

1. Push the repo to GitHub and import it in Vercel.
2. Provision Postgres (Neon / Vercel Postgres / Supabase) and grab both the **pooled** and **direct** connection strings.
3. Add these env vars in the Vercel project settings:
   - `DATABASE_URL` (pooled)
   - `DIRECT_URL` (direct)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL, e.g. `https://yourapp.vercel.app`)
   - `ADMIN_USERNAME`, `ADMIN_PASSWORD`
   - `FACE_MATCH_THRESHOLD` (optional; defaults to 0.6)
4. The included `vercel.json` runs `prisma generate && next build`.
5. After the first deploy, run the migration and seed once:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
   You can do this from your local machine pointed at the production `DIRECT_URL`, or via a Vercel CLI shell.
6. Make sure the `public/models` folder is committed to git (or downloaded as part of the build) so the static weights are served from your deployment. The simplest path: run `node scripts/download-face-models.mjs` locally and commit the resulting files.

All API routes that touch Prisma are pinned to the Node.js runtime via `export const runtime = "nodejs"`.

## API

| Method | Path | Auth | Body / Query | Description |
| --- | --- | --- | --- | --- |
| POST | `/api/users/register` | public | `{ nim, name, email, descriptors: number[][] }` | Register a new user with N face descriptors (averaged server-side) |
| GET | `/api/users` | admin | — | List enrolled users |
| DELETE | `/api/users/:id` | admin | — | Delete user + their attendance |
| POST | `/api/attendance/scan` | public | `{ descriptor: number[128] }` | Match face and record attendance |
| GET | `/api/attendance` | admin | `from`, `to`, `search`, `limit`, `offset` | List attendance entries |
| GET | `/api/dashboard/stats` | admin | — | Total users, today count, 7-day series |
| `*`  | `/api/auth/*` | — | — | NextAuth handler |

Errors are returned as:

```json
{ "error": { "code": "NOT_FOUND", "message": "User not found" } }
```

with codes: `VALIDATION_ERROR`, `NOT_FOUND`, `CONFLICT`, `UNAUTHORIZED`, `FACE_NOT_RECOGNIZED`, `INTERNAL_ERROR`.

## Notes & Trade-offs

- Matching is a linear scan over all enrolled descriptors. For thousands of users you'd swap the in-memory loop for a vector DB (pgvector, Pinecone). The `FaceMatchingStrategy` interface and the repository abstraction make that change local.
- "One attendance per day per user" is enforced in the service. Tweak `LATE_HOUR_24` in `src/core/services/attendance-service.ts` to change when entries get marked `LATE`.
- The face scanner cleans up the camera stream on unmount via the `useEffect` cleanup, as required for camera-using SPAs.
- No photo is ever uploaded. Detection happens in the browser; only the 128-d float vector is sent to the server.
# VETRI KALAM Sports & Events

Professional website and event-registration system for **VETRI KALAM Sports & Events** —
a sports events organiser based in Salem, Tamil Nadu, India.

- **Tagline:** Where Champions Meet
- **Secondary:** Compete. Conquer. Celebrate.
- **Founder / Event Organizer:** Loganathan
- **Phone / WhatsApp:** +91 88386 76284
- **Email:** sloganathan0105@gmail.com

Built on a Create React App template, extended with a serverless registration API,
a PostgreSQL database, an organiser dashboard and Excel export.

---

## 1. Architecture

```
Visitor ──▶ React SPA (CRA) ──▶ /api/*  ──▶ Vercel serverless functions ──▶ PostgreSQL (Neon)
                                    │
Organiser ──▶ /admin/login ──▶ JWT ──┘         Excel export generated in memory (.xlsx)
```

| Layer | Location | Notes |
|---|---|---|
| Frontend | `src/` | Create React App, React 18, React Router 6, Swiper |
| API | `api/*.js` | Vercel serverless functions (Node.js) |
| Shared server code | `lib/` | db pool, auth, validation, SQL, Excel builder |
| Schema + seed | `db/schema.sql`, `scripts/` | applied by `npm run db:setup` |
| Local API server | `server/dev.js` | serves the same handlers during development |
| Config | `vercel.json`, `.env.example` | rewrites, function sizing, variable list |

**Nothing under `src/` imports anything from `lib/`.** Database credentials and
signing secrets therefore never enter the browser bundle.

---

## 2. Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/homeV2` | Alternate home |
| `/homeV3` | Events & registration home |
| `/about` | About |
| `/event` | Events list |
| `/event-details` | Event details |
| `/blog`, `/blog-single` | News |
| `/contact` | Contact |
| `/register` | **Event registration form** |
| `/admin/login` | **Organiser sign in** |
| `/admin/dashboard` | **Organiser dashboard** |

---

## 3. Local development

```bash
npm install
npm run pg:start     # start the throwaway local PostgreSQL (development only)
npm run db:setup     # create schema + seed the demo events
npm run api          # local API on http://localhost:5000
npm start            # React dev server on http://localhost:3000
```

CRA's `proxy` field forwards `/api/*` from :3000 to :5000, so development
behaves exactly as production does.

> `npm run pg:start` is **development only**. It downloads and runs a real
> PostgreSQL cluster in `.pgdata/` (git-ignored). Production always uses
> `DATABASE_URL`.

### Run the API test suite

With `pg:start`, `db:setup` and `api` running:

```bash
node scripts/test-api.mjs
```

80 assertions covering validation, authorisation, CRUD, duplicate handling,
filtering, direct SQL verification and the Excel export.

---

## 4. Environment variables

Copy `.env.example` to `.env` for local work, and set the same keys in
**Vercel → Project → Settings → Environment Variables** for production.

| Key | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string (Neon pooled URL, SSL) |
| `ADMIN_EMAIL` | yes | Organiser sign-in email |
| `ADMIN_PASSWORD` | yes | Organiser sign-in password |
| `JWT_SECRET` | yes | Signs admin sessions (32+ random characters) |
| `ALLOWED_ORIGIN` | no | Browser origin allowed to call the API (defaults to same-origin) |
| `PG_POOL_MAX` | no | Max connections per warm function instance |
| `API_PORT` | no | Local dev API port (default 5000) |

`.env` is git-ignored. **No real credentials exist anywhere in this repository.**

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

---

## 5. Database

PostgreSQL (Neon recommended). Apply with:

```bash
npm run db:setup
```

Idempotent — safe to re-run. It applies `db/schema.sql` (`CREATE TABLE IF NOT
EXISTS`) and upserts every event from `lib/catalogue.js`.

### Tables

**`events`** — event_id (unique), event_name, description, event_date,
event_time, location, category, registration_fee, max_participants,
registration_open, event_image, timestamps.

**`registrations`** — registration_id (unique), event_id, event_name,
participant_name, date_of_birth, age, gender, phone, email, address, city,
state, emergency_contact_name, emergency_contact_phone, category,
race_category, tshirt_size, registration_date, payment_status, payment_utr,
registration_status, timestamps.

Integrity is enforced in the database:

- `uq_reg_registration_id` — no duplicate registration codes
- `uq_reg_event_email` — one entry per person per event (blocks double submits)
- `CHECK` constraints on `payment_status`, `registration_status`, `gender`,
  `tshirt_size` and `age`
- Indexes for every dashboard search, filter and sort combination, plus a
  composite `(event_id, payment_status)` index
- `updated_at` maintained by trigger

---

## 6. API

| Method | Route | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/events` | public | Event catalogue and option lists |
| `POST` | `/api/auth` | public | Organiser sign in → JWT |
| `POST` | `/api/registrations` | public | Submit an entry |
| `GET` | `/api/registrations` | admin | Search / filter / page entries |
| `GET` | `/api/registrations/:id` | admin | One entry (by id or `VK-…` code) |
| `PATCH` | `/api/registrations/:id` | admin | Update statuses / details |
| `DELETE` | `/api/registrations/:id` | admin | Remove an entry |
| `GET` | `/api/export` | admin | Download `.xlsx` |

### Payment safety

A form submission can **never** mark a payment as Paid or a registration as
Confirmed — both are written as `Pending`. Only the organiser, through the
dashboard, changes them. `payment_utr` becomes mandatory only when an event
has a fee greater than zero; the demo events are all free, so no price is
published.

---

## 7. Organiser dashboard

1. Go to `/admin/login` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
2. `/admin/dashboard` shows total, paid, pending-payment, confirmed and
   cancelled counts, plus the registration table.
3. Filter by event, category, payment status, registration status and date
   range; search by name, ID, phone, email or city.
4. **View** opens a record; from there you can edit details, change payment or
   registration status, add a payment/UTR reference, or delete the entry.
5. **Export to Excel** downloads `VETRI-KALAM-Registrations-YYYYMMDD.xlsx`
   containing all columns required by the organiser, filtered exactly as the
   table is showing.

Sessions last 8 hours. Sign out clears the stored token.

---

## 8. Deploying to Vercel

1. Push this repository to GitHub / GitLab / Bitbucket.
2. In Neon, create a project and copy the **pooled** connection string
   (`…-pooler`), which requires SSL.
3. Run the schema against it once:
   ```bash
   DATABASE_URL="<neon-pooled-url>" npm run db:setup
   ```
4. In Vercel: **Add New → Project → Import** this repository.
   `vercel.json` already sets `buildCommand`, `outputDirectory` and the SPA
   rewrite, so no framework preset is needed.
5. In **Settings → Environment Variables**, add `DATABASE_URL`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET` for *Production* and
   *Preview*.
6. **Deploy.**
7. Verify after the first deployment:
   - `https://<your-domain>/api/events` returns the event list
   - `/register` submits and shows a `VK-…` registration ID
   - `/admin/login` accepts your credentials
   - **Export to Excel** downloads a workbook

> The SPA rewrite is `/((?!api/).*) → /index.html`, which deliberately excludes
> `/api/*` so function routes are never shadowed.

---

## 9. Images

`VETRI-KALAM-IMAGE-MANIFEST.md` — exact filename, destination path and pixel
size for every image the site expects.

`VETRI-KALAM-IMAGE-PROMPTS.md` — one ready-to-paste generation prompt per
filename (90 prompts, 1:1 with the manifest).

Files go in `public\images\` (JSX `<img>` tags) or `src\images\` (CSS
`background-image` references). Never rename a file — the code points at the
exact names in the manifest.

### Regenerating the artwork

Every manifest slot currently holds generated brand artwork — deep navy /
blue / white compositions with athlete pictograms, deliberately free of any
photography, text, third-party marks or invented sponsor boards. Two scripts
reproduce the whole set from scratch:

| Command | Description |
|---|---|
| `node scripts/gen-images.mjs` | Render every slot at its exact manifest pixel size with headless Chrome |
| `powershell -ExecutionPolicy Bypass -File scripts\image-commit.ps1` | Convert the staged renders into `public\images\` as `.jpg` (quality 85) / `.png`, then re-check each file's dimensions |

Useful flags: `--list` prints every slot, `--only <substring>` and
`--limit N` render a subset, `--verify` confirms every target file exists.

To replace an illustration with real photography later, drop a file over the
same path at the size given in the manifest — no code change is needed.
`src\images\` is used only by the four CSS backgrounds and is left untouched;
if you replace those, update both trees.

---

## 10. Scripts

| Command | Description |
|---|---|
| `npm start` | React dev server |
| `npm run build` | Production build |
| `npm run api` | Local API server on :5000 |
| `npm run db:setup` | Apply schema and seed events |
| `npm run pg:start` / `pg:stop` / `pg:reset` | Local PostgreSQL (development) |
| `node scripts/test-api.mjs` | API integration tests |
| `npm run preview` | Serve `build/` on :4173 with an `/api` proxy to :5000 |
| `npm run test:responsive` | Horizontal-overflow check for all 12 routes at 1440/1366/768/375/390px. Animations are neutralised inside the frame before measuring, because `--virtual-time-budget` advances timers but freezes CSS animations on their first frame — otherwise every `fadeInRight` entrance (`0% { transform: translateX(20px) }`) would be scored as permanent overflow. |
| `node scripts/gen-images.mjs` | Render brand artwork for every manifest image slot |
| `scripts\image-commit.ps1` | Commit staged renders into `public\images\` |

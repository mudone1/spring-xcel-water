# Spring Xcel Water — Operations Portal (Next.js 15+ PWA)

Phase 1 of the migration from `A-lect_water.html`. This phase ports the
foundation: **Firebase connection, login, geofenced sign-in, permissions
system, PWA shell, and real push notifications.** Every subsequent module
(Sales, Production, Inventory, Expenses, Attendance, Staff, Dashboard) plugs
into this shell in later phases — same Firebase project, so all existing
historical data is already there.

## Run it

```bash
npm install
cp .env.example .env.local   # fill in VAPID keys (see below)
npm run dev
```

Open http://localhost:3000 — log in with any existing username/PIN from the
original app (same `users` collection, same Firebase project).

## Push notifications setup

Push requires a VAPID keypair (one-time):

```bash
npx web-push generate-vapid-keys
```

Put the public key in `.env.local` as `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and the
private key as `VAPID_PRIVATE_KEY` (server-only, never exposed to the
browser). Once a user clicks "Enable alerts" in the topbar, their device
subscribes and is stored in the `pushSubscriptions` Firestore collection.
Send a push from any server code via `POST /api/push/send`:

```json
{ "userId": 12, "title": "New sale recorded", "body": "₦12,000 — walk-in", "url": "/sales" }
```

Omit `userId` to broadcast to every subscribed device (e.g. "store closing
in after-hours mode").

## What's ported and working right now

- Firebase connection (same project — zero data migration)
- Login (username + PIN, matches `users` collection)
- Geofence check on sign-in (haversine distance, configurable radius,
  admin/manager bypass, after-hours bypass — logic ported 1:1 from
  `doLogin()` / `geoCheck()`)
- "Already completed shift today" block for staff
- Five-role permission system (Supervisor, Manager, Driver, Operator, Sales
  Personnel) — `ALL_PAGES`, `ALL_ACTIONS`, `JOB_ROLE_DEFAULTS` ported exactly
- Sidebar nav filtered live by the signed-in user's permissions
- Attendance sign-in record created on login (duplicate-safe)
- PWA: installable, offline app-shell caching, real icons generated from
  your logo, real Web Push (not a stub)

## Architecture

- Next.js 15 App Router + TypeScript
- Zustand for auth/session state (`src/lib/authStore.ts`)
- Firebase JS SDK (client), same config as the original app
  (`src/lib/firebase.ts`)
- Tailwind, configured with your exact color tokens from the original
  `:root` CSS variables (`tailwind.config.ts`)
- `src/components/AppShell.tsx` — the post-login shell (sidebar + topbar).
  Each nav item currently shows a placeholder; this is where Sales,
  Production, etc. get built next.

## Roadmap (next phases)

1. ~~Auth / Login / Geofence (this phase)~~
2. Sales — walk-in + driver two-step supply flow, split payments, receipt
   printing, barcode
3. Production + Production Calculator + reconciliation / batch locking
4. Raw Material Inventory
5. Expenses
6. Attendance (staff + admin views, CSV export)
7. Staff/Permissions editor + Dashboard/Reports + charts
8. PWA polish — deeper offline support for in-progress sales/production
   forms, background sync

Say which module to build next and I'll continue straight into it.

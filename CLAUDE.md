# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # ESLint
```

Requires `.env.local` with:
```
MONGODB_URI=...
MONGODB_DB=pulse-social-app
JWT_SECRET=...
```

## Architecture

Next.js 16 App Router, MongoDB via Mongoose, JWT auth, Tailwind CSS v4.

**Auth flow:** JWT is issued on login and stored in two places simultaneously — an `httpOnly` cookie (for server-side verification in API routes) and `localStorage` (for client-side reads). `Proxy.js` is a Next.js middleware that redirects unauthenticated users away from protected pages. Public routes are whitelisted in `publicPages`.

**API layer (`app/api/`):** All routes call `makeSureDbIsReady()` before any DB access — this handles the singleton Mongoose connection cached on `global.mongoose`. Auth is verified via `verifyToken()` from `lib/auth.js`, which accepts either `Authorization: Bearer <token>` header or the `token` cookie.

**Data layer (`lib/`):**
- `lib/db/database.js` — Mongoose connection singleton
- `lib/auth.js` — JWT verify helpers (`verifyToken` for requests, `verifyJwtToken` for raw tokens)
- `lib/tweets.js` / `lib/email.js` / `lib/passwordReset.js` — domain logic kept out of route handlers

**Models (`models/`):** `User`, `Tweet`, `PasswordResetToken` — standard Mongoose schemas.

**Components (`components/`):** Client components only. `HeaderVisibility` conditionally renders `Header` based on route (hides on auth pages). `Sidebar` is the main nav.

## Design System (Granola)

CSS variables are defined in `app/globals.css`. Use these instead of hardcoded colors:
- `var(--accent)` — terracotta `#b45837` (primary actions)
- `var(--background)` — warm cream `#faf8f2`
- `var(--surface)` — frosted warm white (for cards)
- `var(--text-muted)` — `#6a5f52`
- `var(--border)` — subtle warm-tinted border

Utility classes available globally: `.card`, `.surface`, `.btn-primary`, `.btn-secondary`, `.input`, `.container-reading` (680px), `.container-app` (1000px).

Display text uses serif (`var(--font-display)`), body uses Inter (`var(--font-body)`). Max font weight is 600.
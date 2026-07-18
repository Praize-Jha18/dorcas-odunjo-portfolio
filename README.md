# Digital Atelier — Portfolio

A React + TypeScript portfolio ("Technician by day, Artist by soul") with a full admin panel:
every page is a stack of **sections** stored in MongoDB that you can edit, reorder, add and
delete — including the art gallery, which also supports image uploads.

## Stack

- **client/** — Vite + React + TypeScript, React Router. Public site + admin panel (`/admin`).
- **server/** — Express + TypeScript + Mongoose. REST API, JWT admin auth, image uploads (multer).

## Run it

```bash
npm install            # root (concurrently)
npm run dev            # starts API on :4000 and site on :5173
```

Open http://localhost:5173 — the admin desk is at http://localhost:5173/admin.

Default admin login (change in `server/.env`):

- Email: `admin@digitalatelier.com`
- Password: `change-me`

## Connect your MongoDB

Copy `server/.env.example` to `server/.env` and set:

```
MONGODB_URI=mongodb+srv://…your connection string…
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=a-strong-password
JWT_SECRET=a-long-random-string
```

Without `MONGODB_URI` the server runs an **in-memory MongoDB** seeded with the design's
content — great for trying things out, but data resets on every restart. With a real
connection string, the seed runs once into your database and everything persists.

## How content works

- `Page` documents hold `slug`, nav settings and an ordered `sections` array
  (`{ uid, type, data }`). The client renders each section through a registry
  (`client/src/sections/registry.tsx`), which also defines the admin edit form and default
  data for each type.
- Section types: splitHero, pageHero, cardGrid, intersection, ctaBanner, dualIdentity,
  contact, pillars, caseStudies, testimonials, galleryHero, galleryGrid, newsletter,
  richText (free-form block).
- Titles support `|pipes|` around words to render the italic terracotta accent,
  e.g. `Technician by day, |Artist by soul.|`
- `Artwork` documents power the gallery grid; categories become the public filter chips
  automatically. Manage them in **Admin → Art Gallery** (upload, publish/hide, reorder).
- Site-wide brand/footer/socials live in **Admin → Site Settings**.

## Deploying to Vercel

The repo is Vercel-ready: the client builds to static files, and the whole Express API runs
as one serverless function ([api/index.ts](api/index.ts), routed by [vercel.json](vercel.json)).
Images are stored **in MongoDB** (not on disk), so they survive serverless deploys; large
photos are compressed in the browser before upload to fit Vercel's request-size limit.

1. Push this repo to GitHub (or install the CLI: `npm i -g vercel`).
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
   The build settings are read from `vercel.json` automatically.
3. In **Project → Settings → Environment Variables**, add:
   - `MONGODB_URI` — your Atlas connection string
   - `DB_NAME` — e.g. `DorcasOdunjo`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your admin login
   - `JWT_SECRET` — a long random string
4. In Atlas → **Network Access**, allow `0.0.0.0/0` (Vercel functions have no fixed IP).
5. Deploy. The site is served statically; `/api/*` and `/uploads/*` hit the function.

CLI alternative: `vercel` from the repo root, answer the prompts, add the env vars with
`vercel env add`, then `vercel --prod`.

## Production build (self-hosted alternative)

```bash
npm run build          # builds server (tsc) and client (vite)
```

Serve `client/dist` from any static host and run the server (`server/dist/index.js`) with the
env vars above; proxy `/api` and `/uploads` to it.

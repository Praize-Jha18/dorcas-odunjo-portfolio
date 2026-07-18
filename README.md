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

## Production build

```bash
npm run build          # builds server (tsc) and client (vite)
```

Serve `client/dist` from any static host and run the server (`server/dist/index.js`) with the
env vars above; point the client at the API with a reverse proxy for `/api` and `/uploads`.

# The Peterson Group — Marketing Homepage

A single-page marketing site for The Peterson Group (TPG), built with Next.js
(App Router), TypeScript, and Tailwind CSS v4. Implements the **HomeComp v8**
reference design.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

Other scripts:

```bash
npm run build         # production build (type-checks + prerenders every page)
npm run start         # run the production Node server on :3000
npm run lint          # ESLint
npm run format        # Prettier — writes formatting fixes
npm run format:check  # Prettier — checks formatting without writing
```

## Structure

- `src/app/` — root layout, global styles, and the single page route.
- `src/components/sections/` — one component per homepage section (Nav, Hero,
  OpeningQuestion, Problem, Formats, Ste, Headcount, Proof, Commit, Faq,
  Footer), assembled in `src/app/page.tsx`.
- `src/components/ui/` — shared primitives (Button, Kicker, SectionContainer)
  reused across sections.
- `src/content/` — typed copy/data for each section, kept separate from
  markup so copy changes don't require touching component code.
- `src/app/globals.css` — brand design tokens as CSS custom properties
  (`--tpg-primary`, `--tpg-deep`, `--tpg-cta`, `--tpg-accent`, etc.),
  re-exposed to Tailwind via `@theme inline` so they're usable as utility
  classes (`bg-tpg-primary`, `text-tpg-cta`, ...). The multi-stop gradient
  bands (`.bg-hero`, `.bg-ste`, `.bg-commit`) live here too.

This is a single long-scroll homepage, not a multi-route app — the nav links
are same-page anchors (`#formats`, `#proof`, `#faq`, `#commit`) with smooth
scrolling handled by `html { scroll-behavior: smooth }` and a
`scroll-margin-top` on each anchored section to clear the sticky nav.

## Deployment

Production runs on a **Bluehost Standard VPS** (Ubuntu 24.04, `129.121.101.124`)
orchestrated by **Dokploy**. The app is a Node server in a Docker container;
**Traefik** terminates TLS in front of it.

> An earlier version of this section documented an nginx setup with a
> `/var/www/go4tpg` document root. That infrastructure never existed on this
> box — there is no nginx, no Caddy, no PM2, and no systemd unit for this app.
> Do not follow it; the topology below is what actually runs.

### Topology

| Layer             | What runs it                                                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| DNS               | `go4tpg.com` A record → `129.121.101.124`; `www` is a CNAME to the apex. Nameservers are Bluehost's; GoDaddy is registrar only.               |
| TLS + routing     | Traefik v3.6.7 (container `dokploy-traefik`) owns :80 and :443, terminates TLS, issues the 308 http→https redirect, advertises `Alt-Svc: h3`. |
| Orchestration     | Dokploy v0.29.13.                                                                                                                             |
| App container     | `go4tpg-website-main-website-9bg4og`, listening on **port 3000**.                                                                             |
| Build             | nixpacks (Dokploy default), auto-detected from `package.json`.                                                                                |
| Source on the box | `/etc/dokploy/applications/go4tpg-website-main-website-9bg4og/code/`                                                                          |

### How a deploy works

Dokploy rebuilds the image from source on every deploy, then runs:

```bash
npm run build     # next build — prerenders every marketing page
npm run start     # next start -p 3000
```

Traefik already routes the domain to container port 3000, so **no proxy or DNS
change is needed for a code deploy** — `next start` simply occupies the port.

### Runtime, not static export

The site was previously a static export (`output: "export"`) served by `serve
out -l 3000`. It now runs as a Node server because `output: "export"` disables
route handlers at build time, and `/api/berth` needs one.

Every marketing page is still **prerendered at build time** — check the `○
(Static)` markers in `next build` output. The Node process exists to serve the
API route, not to render pages on demand. Two things improved for free:

- `serve` exposed a public directory listing at `/_next/static/`, leaking the
  whole build tree and the internal `out/` directory name. `next start` does not.
- Hashed immutable assets shipped with no `Cache-Control`, so browsers
  revalidated every visit. `next start` sets
  `public, max-age=31536000, immutable` on `/_next/static/` automatically.

### Environment variables

Set them in the **Dokploy dashboard → application → Environment tab**. Dokploy
injects them into the container at runtime.

Do **not** write a `.env.local` on the server: the container is rebuilt from
source on every deploy, so anything on the container filesystem is discarded.
`.env.local` is for local development only and stays gitignored. See
`.env.example` for the full key list.

Never prefix a secret with `NEXT_PUBLIC_` — that inlines the value into the
client bundle, where anyone can read it.

### Serving under a sub-path

`basePath` is empty by default. To host under a sub-path (e.g.
`https://example.com/go4tpg` rather than the domain root), set the env var
**at build time** — it is inlined into the client bundle, so it cannot be
changed after building:

```bash
NEXT_PUBLIC_BASE_PATH=/go4tpg npm run build
```

Leaving it unset while serving from a sub-path is what produces an unstyled
page: the HTML loads but every `/_next/*` asset 404s.

## Notes

- Testimonials in `src/content/proof.ts` are placeholders — real client
  quotes to be collected following current engagements, per the reference
  design.
- The per-format "See the …" links and the footer LinkedIn link point to `#`
  pending destination pages/URLs from the client.

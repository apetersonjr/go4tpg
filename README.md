# The Peterson Group — Marketing Homepage

A single-page marketing site for The Peterson Group (TPG), built with Next.js
(App Router), TypeScript, and Tailwind CSS v4. Implements the **HomeComp v8**
reference design.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/go4tpg](http://localhost:3000/go4tpg) to view it
(the site is served under the `/go4tpg` base path for GitHub Pages).

Other scripts:

```bash
npm run build         # production build (type-checks + generates static output)
npm run start         # serve the production build
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

Pushes to `main` build and deploy to GitHub Pages via
`.github/workflows/deploy.yml` (static export to `./out`).

## Notes

- Testimonials in `src/content/proof.ts` are placeholders — real client
  quotes to be collected following current engagements, per the reference
  design.
- The per-format "See the …" links and the footer LinkedIn link point to `#`
  pending destination pages/URLs from the client.

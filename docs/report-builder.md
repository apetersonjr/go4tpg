# Report builder

`POST /api/report/build` assembles the visitor's personalized AI installation
plan and returns it as a PDF. n8n calls it and emails the result.

The assembly lives here rather than in n8n because n8n cannot merge PDFs: there
is no native node, and the Code node cannot import `pdf-lib` unless
`NODE_FUNCTION_ALLOW_EXTERNAL` is set on the instance. Running it here keeps the
n8n instance unmodified and puts the work next to the assets, fonts and brand
tokens it needs.

## Shape of the call

```
POST /api/report/build/
content-type: application/json
```

Responds `200 application/pdf`, or a JSON error. Never a partial document — a
missing asset is a `500` naming the file, so n8n routes it to a human rather
than mailing a prospect a plan with a page missing.

**No authentication.** There is no shared secret in either direction between
this site and n8n. Anyone who knows the path can post a payload and receive an
assembled PDF, bounded only by the body-size cap and the validation below.

What that does *not* expose is worth being precise about: a caller controls the
cover name, the summary paragraph and which one-pagers are bound in, but every
installation name, number and section is read from the catalog rather than the
payload, so the output is always a genuine TPG document. The realistic abuse is
someone burning CPU generating PDFs, not producing a forged one. Adding a
header check here is a small change if that stops being an acceptable trade.

**Note the trailing slash.** The site sets `trailingSlash: true`, so a POST to
`/api/report/build` answers `308` to `/api/report/build/`. Point
`TPG_REPORT_BUILDER_URL` at the slashed path, or make sure the caller follows
redirects while preserving the body. This is site-wide behavior and applies to
the scorecard endpoints too — it is not specific to this route.

### Fields

| Field | Notes |
| --- | --- |
| `session_id` | UUID. Rejected if malformed. |
| `first_name` | Optional. The cover degrades gracefully when absent. |
| `company_name` | Optional. Falls back to the name, then to a neutral line. |
| `summary` | Required. One paragraph, already written. |
| `recommendations[]` | 1–19 entries, each with `installation_id`, `problem`, `installs`, `produces`. |

`number`, `name` and `section` are accepted in the payload and then **discarded**.
They are read from `src/data/installation-menu.ts` instead, because that file is
the single place installation names are allowed to be defined. A payload that
disagrees is a stale n8n workflow, and honoring it would print a name the site no
longer uses beside a one-pager showing the current one.

Recommendations are sorted into catalog order regardless of the order they
arrive in, so the plan page and the one-pagers that follow always agree.

## Document structure

| Pages | Source |
| --- | --- |
| Cover | generated |
| Your situation | generated |
| What we would install | generated |
| One page per recommendation | copied from `public/assets/workflows/` |
| Closing | generated |

Four generated pages plus one per recommendation: a three-recommendation
request produces 7 pages, four produces 8, five produces 9.

**The full brochure is deliberately not appended.** An earlier version bound
all nineteen installations behind a divider page, which turned a plan for one
company into a catalog with a personalized preface — and ran 21 pages and 4MB
for three recommendations. The visitor now receives the installations they were
recommended and nothing else. The brochure PDF stays on disk as a marketing
download; this module no longer reads it.

## The static assets

```
public/assets/workflows/NN-{installation_id}.pdf   (19 files)
```

The filename pattern is a contract: n8n builds the same string from the same
catalog to resolve download URLs, so it must not drift.

> **These files arrived named `Complete automations-part-N.pdf`** and were
> renamed positionally — part-1 to installation 01, and so on — because that is
> the only mapping the files support. They carry no text layer to verify against
> (see below), so **the pairing of file to installation has not been machine
> verified.** If a one-pager ever shows up under the wrong heading, this is the
> first thing to check.

Assets are read from the filesystem, never over HTTP, and cached in module scope
because they change only on deploy. A consequence worth knowing while debugging:
once a file has been read successfully, deleting it from disk will not produce a
`500` until the process restarts.

## The one-pagers have no text layer

Every one-pager was exported with type converted to outlines. A page decodes to
roughly 13,000 curve operators and **zero** text-showing operators, with no
embedded fonts.

Two consequences:

1. **Copying them verbatim is the only faithful option.** There is nothing to
   re-flow. `embedPages` is used, and the pages are drawn at exactly 612×792 to
   match.

2. **Their copy cannot be audited or corrected from this repo.** The brief asks
   for an audit of all nineteen for British spellings (`-ise`, `-isation`,
   `-ised`). That audit cannot be performed with code here — there is no text to
   search, so grep and every text extractor return nothing. It was done instead
   by rasterizing all nineteen pages and reading them.

   The generated pages *are* checked programmatically, and are clean.

### Audit results — British spellings in the one-pagers

All nineteen were rendered and read. **Six defects across four pages**, none
fixable from this repo — each needs a re-export from the design source:

| Page | Where | Reads | Should read |
| --- | --- | --- | --- |
| 01 Company AI Brain | step 02 detail | vectori**s**ed | vectori**z**ed |
| 02 AI Inbox Manager | routing table | Summari**s**ed | Summari**z**ed |
| 02 AI Inbox Manager | routing table | acknowledge**me**nt | acknowledgment |
| 08 Stale Task Detector | step 06 heading | Summari**s**e weekly | Summari**z**e weekly |
| 13 AI Voice-of-the-Customer | step 02 heading | Normali**s**e the sources | Normali**z**e the sources |
| 17 AI Financial Close | intro + step 03 | categori**s**ing / Categori**s**e | categori**z**ing / Categori**z**e |
| 17 AI Financial Close | step 05 detail | unrecogni**s**ed | unrecogni**z**ed |

Three of these are step **headings**, set large — 08, 13 and 17 are the most
visible. Pages 03–07, 09–12, 14–16, 18 and 19 are clean.

Two further items for whoever does that re-export, flagged but not counted as
spelling defects:

- **19 AI Recruiting** uses "CVs" and "diaries", British business idiom for an
  American reader ("resumes", "calendars").
- **04 AI Calendar Guard** sets "8am" where **03** sets "6:30 AM".

## Fonts

Figtree and Newsreader, as TTFs committed under `src/lib/report/fonts/`. They
are not web assets and do not belong in `public/`.

The site loads these same families through `next/font/google`, which fetches
them at build time and emits woff2 subsets — those cannot be embedded in a PDF,
which is why the TTFs are committed separately. Both families are SIL Open Font
License, so redistribution in this repo is fine.

Faces are embedded with `subset: true`; five full faces would add roughly 400KB
to every emailed attachment.

## Color

`src/lib/report/tokens.ts` carries print tokens sampled from the one-pagers'
own content streams, **not** the web tokens from `globals.css`. The generated
pages sit directly beside the designed ones, and the web palette is visibly
different:

| Role | Print (used here) | Web (`globals.css`) |
| --- | --- | --- |
| Navy | `#103a54` | `#032a45` |
| Accent | `#e5701b` | `#e8651f` |
| Body | `#54697a` | `#3a4e5f` |
| Rule | `#dce5ec` | `#dfe8ef` |

The accent is **orange**, not blue. The blue on installation 01 belongs to its
workflow diagram, not to the page furniture — sampling that page alone gives the
wrong palette, which is a mistake worth not repeating.

If the assets are ever re-exported, re-sample rather than hand-editing. The
values are measurements.

## Environment

- `TPG_CALENDLY_URL` — optional. The destination behind the "Book a 20-minute
  call" button on the closing page. Unset, the button is not drawn at all and
  the page falls back to the email address alone — a button that looks
  pressable and does nothing is worse than no button.

The button is a filled rectangle plus a PDF **link annotation** covering the
same coordinates. The two are drawn independently and have to be kept in sync;
nothing about the painted rectangle makes it clickable on its own.

PDF has no equivalent of `target="_blank"` — a URI action cannot instruct the
reader where to open. In practice every mainstream viewer (Acrobat, Preview,
and the built-in readers in Chrome and Firefox) hands an external `http` link
to the default browser in a new tab rather than navigating the document away,
so a new tab is what a reader gets; it just is not something the file commands.

That is the only variable this endpoint reads. It takes no credential.

`src/instrumentation.ts` audits every asset at boot and logs anything missing.
It warns rather than refusing to start: a missing one-pager breaks one endpoint,
not the marketing site.

## Performance

Well under a second for a typical report against a 15s budget and n8n's
60s timeout. The route logs a warning if a build ever exceeds 15s, which would
mean the assets have grown.

# Vinotheca — Project State

> **Canonical source of truth for the Vinotheca family of sites.**
> When working on any site in the family — adding a leaf, changing a design
> rule, planning a redesign — read this file first. If anything proposed
> contradicts this file, this file wins until the file is updated.
>
> **Maintenance rule.** When a decision is made, a leaf is added or removed,
> or a design rule changes — update this file in the same commit, or the
> next commit. Append an entry to §8 (Document changelog) so the change
> is recorded.

Last meaningful update: 2026-05-09 (see §8 for full history)

---

## 1. Architecture

Vinotheca is a library of wine works. The parent page (`vinotheca/index.html`)
is the catalogue and the home; each "leaf" is a separate site that lives at
its own GitHub Pages URL.

The architecture is organised by **operational purpose** — what the visitor
is *doing* when they arrive at a section — rather than by what the artefact
technically is. Five sections, each a distinct mode of engagement:

| Section | Operational verb | What the visitor is doing |
|---------|------------------|---------------------------|
| **Maps** | Locate | Finding where wine is in the world |
| **Works** | Understand | Navigating the structure of wine and reading its argument |
| **Correspondence** | Converse | Speaking to a tool, receiving a response |
| **Reference** | Ground | Reaching the conceptual foundations beneath the wine work |
| **Personal Codex** | Record | Keeping a personal accumulating record |

**Part I — The Library** holds the first four sections (Maps, Works,
Correspondence, Reference). Reference works, tools, studies, and the
foundational documents that ground the methodology.

**Part II — The Personal Codex** holds the fifth (Codex Vini). The
instruments and works in Part I look at wine in general; the Codex is
different in kind — it looks at one person's experience of wine.

Everything in Vinotheca is connected; the section structure expresses
operational mode, not isolation.

---

## 2. The "Work" — paired tool + study

A **Work** is a single artefact with **two faces**:

- A **Tool face** — the interactive instrument, on its own page
- A **Study face** — the intellectual companion, on its own page, in
  the same documentation format as Soul of Wine (question, findings,
  why it matters, documents, method)

The two faces share the same set of supporting PDFs (Summary, Technical
Appendix, Methods Primer, Data Appendix, optionally a domain Reference).
The PDFs are linked from both faces. The Tool face surfaces them in its
Documentation dropdown; the Study face weaves them into the narrative.

A tool without its paired study is **incomplete** — the Work is half-built.
A tool can launch ahead of its study (this is the current state of Grape
Affinities) but the goal is paired completion.

The parent Vinotheca page presents each Work as a single entry showing
both faces, not as separate Tool and Study cards.

---

## 3. Leaves — current state

| Section | Site | Repo | Status | Wordmark | Eyebrow |
|---------|------|------|--------|----------|---------|
| Parent | Vinotheca | `vinotheca` | Live | Vinotheca | A LIBRARY OF WINE WORKS |
| Maps | The Estate Atlas | `estate-atlas` | Live | The Estate *Atlas* | An Atlas of Vinotheca |
| Maps | The Grand Cru Atlas | `grand-cru-atlas` | Live | The Grand Cru *Atlas* | An Atlas of Vinotheca |
| Works → Tool | Grape Affinities | `tasterank-explorer` | Live | Grape *Affinities* | A Tool of Vinotheca |
| Works → Study | The Body of Wine | `body-of-wine` | Live | The *Body* of Wine | A Study of Vinotheca |
| Works → Tool | Region Affinities | `region-affinities` | Live | Region *Affinities* | A Tool of Vinotheca |
| Works → Study | The Soul of Wine | `soul-of-wine` | Live | The *Soul* of Wine | A Study of Vinotheca |
| Works → Tool | Winemaker Affinities | *(tbd)* | Forthcoming 2026 | Winemaker *Affinities* | A Tool of Vinotheca |
| Works → Study | The Winemaker's Constellation | *(tbd)* | Forthcoming 2026 | The Winemaker's *Constellation* | A Study of Vinotheca |
| Correspondence | Region Resonances | `region-resonances` | Live | Region *Resonances* | A Correspondence of Vinotheca |
| Correspondence | Grape Resonances | `grape-resonances` (tbd) | Planned — see §6.4 | Grape *Resonances* | A Correspondence of Vinotheca |
| Reference | *(no leaves yet)* | `vinotheca-reference` | Repo to be created — empty for now | — | A Reference of Vinotheca |
| Personal Codex | Codex Vini | `codex-vini` | Live | Codex *Vini* | A Codex of Vinotheca |

All repos are public under `github.com/jskarabot18/`. Pages URLs follow
`https://jskarabot18.github.io/<repo>/`.

The repo `tasterank-explorer` is a working name; the user-facing wordmark
is "Grape Affinities". The repo name is preserved so external links and
bookmarks don't break — repo names are infrastructure, the wordmark is
what visitors see. TasteRank stays as the algorithm name (referenced in
the panel subtitle and the documentation).

### 3.1 Current Works pairings

| Work | Tool face | Study face |
|------|-----------|-----------|
| Grape similarity | Grape Affinities (live) | The Body of Wine (live) |
| Region kinship | Region Affinities (live) | The Soul of Wine (live) |
| Winemaker kinship | Winemaker Affinities (forthcoming) | The Winemaker's Constellation (forthcoming) |

---

## 4. Cross-cutting design decisions

These rules govern every leaf in the family. New leaves should follow them.

### 4.1 Wordmark — italic emphasis on the noun

`<roman first half> <em>italic noun</em>`. The Estate *Atlas*. Region
*Affinities*. The *Soul* of Wine. Codex *Vini*. The parent ("Vinotheca")
is the only exception — single word, no italicisation.

### 4.2 Eyebrow grammar — "X OF VINOTHECA"

Every leaf has an eyebrow declaring its category in the same grammar.
See §3 for the full table. The parent itself uses "A LIBRARY OF WINE
WORKS", establishing itself as the named container. Eyebrows render in
small caps, letter-spaced, in a muted accent colour.

### 4.3 Footer — canonical pattern

Every leaf footer contains, in order:

1. Centred motto: `❧ in vino, cognitio ❧` (fleurons, never em-dashes)
2. Link row: `GitHub · License · CC BY-NC 4.0 · Vinotheca · Correspondence`
3. Copyright: `© Jure Skarabot · MMXXVI`

"License · CC BY-NC 4.0" is a single link to the LICENSE file. The
"Vinotheca" link is omitted on the parent itself. The "Correspondence"
link goes to `mailto:hello@codexvini.com` — the **email contact**. Note
this is distinct from the `Correspondence` content section in Part I,
which is a content section (currently containing Region Resonances).
Codex Vini is the layout exception: its links live in the header rather
than the footer, but the motto and copyright still appear in the footer.

### 4.4 Documentation menu — one pattern per section

- **Tools** (Grape Affinities, Region Affinities, Winemaker Affinities):
  `Documentation ▾` dropdown in the masthead, single-line entries, one
  per PDF in the canonical framework.
- **Studies** (Soul of Wine, Winemaker's Constellation): in-page anchor
  menu and document cards. The study-class template will be properly
  defined when there are two live studies.
- **Maps** (Estate Atlas, Grand Cru Atlas): single `Download X Atlas PDF`
  button in the masthead. Atlases ship one consolidated PDF rather than
  the multi-document framework.
- **Correspondence** (Region Resonances): pattern tbd as Correspondence
  is moved into its own section. Likely the Tool dropdown pattern,
  since Region Resonances is a tool-class artefact.

### 4.5 Documents are aligned to a canonical framework

Each Work ships its documentation as a fixed set of PDFs:

- Summary (plain-language overview)
- Technical Appendix (algorithms and computation)
- Methods Primer (guide to the methods)
- Data Appendix (sources, edge tables)
- *Optional fifth: domain Reference* (e.g. "Grape Reference" on Grape Affinities)

The same PDFs are linked from **both faces** of a Work — the Tool face
surfaces them in its dropdown; the Study face weaves them into the
narrative or lists them as documents.

LaTeX sources for all documents are archived in each tool repo's
`docs-source/` folder. This means PDFs can be regenerated without losing
source material if amendments are needed.

### 4.6 Studies don't embed tools; tools don't appear inside studies

A **Study** presents an argument and supports it with documents. It does
not embed interactive tools.

A **Tool** is a standalone interactive instrument with its own page.

Cross-linking happens through the parent Vinotheca catalogue (which
shows pairings) and through prose ("Explore this interactively in
[Region Affinities]"), never through embedding a tool inside a study's
page. Soul of Wine previously had an "Interactive Tools" section that
violated this rule — it embedded four prototype tools (Cluster Explorer,
Cluster Map, Movement Map, D-Score Dashboard), all superseded by Region
Affinities. The section and the four prototype HTML files were removed
on 2026-05-08 (see §7).

### 4.7 The study-class template will be defined when there are two studies

Soul of Wine is currently the only live study. Its visual treatment was
designed before Vinotheca had a family pattern. The proper study-class
template should be defined against *two* studies (Soul of Wine + the
Grape Affinities study, or Soul of Wine + the Winemaker's Constellation)
so both can be designed together rather than retrofitting one to a
template-of-one.

This is why visual harmonisation work on Soul of Wine has been deferred
until at least the second study exists.

### 4.8 Visual systems — currently three subsystems, target one

The family currently has three visual subsystems:

- **The Library** (parent, Estate Atlas, Soul of Wine): warm parchment,
  EB Garamond + Cormorant Garamond
- **The Tools (React)** (Region Affinities, Region Resonances):
  parchment-warm, Tailwind-driven
- **The Atlases (static)** (Grape Affinities, Grand Cru Atlas):
  whiter ground, DM Sans body + Cormorant Garamond wordmark
- **Codex Vini**: own palette

Target is one canonical palette and one canonical font system across the
whole family, with permitted variation for Codex Vini. This is Pass 3 work,
deferred until the second study exists per §4.7.

The wordmarks have already been brought to a shared serif (Cormorant
Garamond). Body text systems still differ.

### 4.9 Reference — quietly signposted, not foregrounded

Reference is the deepest layer of the library. It contains intellectual
foundations (theoretical, technical, practical) that ground the
character-based analysis methodology underlying the wine work. Reference
documents are **not foregrounded** — a casual visitor came for wine, not
Bourdieu. But Reference must exist, be findable, and be linked, so
serious readers can find the conceptual scaffolding.

Reference items are written deliberately to be readable on their own
terms years later. They predate Vinotheca-the-implementation conceptually
and would survive if Vinotheca went away.

### 4.10 Operational independence between Reference and the wine domain

The Reference section's content describes the *general* methodology
(character-based analysis as a domain-neutral pattern). Vinotheca is the
*wine-specific instantiation*. A future application of the same methodology
to a different domain (film, architecture, music — see Technical
Foundations document) would draw on the same Reference content.

This is why Reference has its own repo (`vinotheca-reference`) rather than
living inside the wine-specific repos.

### 4.11 Correspondence is oracular, not search — design implications

Correspondence tools are not recommendation systems. They are **oracles in
the classical sense** — instruments of self-recognition where the user
brings a question and receives a compressed, considered offering against
which their own situation becomes legible. The success state is the
user's pause and recognition: *yes, that is exactly the wine I would
drink with that feeling*. The framework underneath (Soul of Wine's 59
region narratives) makes the recognition non-arbitrary; the compression
of the response is what makes the recognition possible.

This frame has direct design consequences for every Correspondence tool:

- **Compression over comprehensiveness.** Few results, tightly framed.
  Two to four grapes — not ten. Five regions — not twenty. The oracle's
  authority comes partly from its restraint.
- **One framing sentence carries the response.** The user reads the
  result and one sentence of context. Long explanation breaks the
  oracle frame and shifts authority from the user back to the tool.
- **The framework is traceable but not foregrounded.** A "see how the
  framework arrived at this" fold can exist for curious users, but it
  is collapsed by default. The user gets the answer, not the working.
- **Verification is invited, not measured.** A *Does this resonate?*
  prompt creates the moment of recognition without recording the
  response (privacy-first, per the existing ethos). The pause is the
  data; nothing is logged.
- **Graceful refusal of wrong-shaped queries.** Pairing questions,
  catalogue questions, and varietal-search questions are not in the
  oracle's domain. The tool detects them and redirects honestly. The
  refusal preserves the tool's character.
- **No personalization, no learning.** The tool's authority comes from
  the fixed framework, not from optimization against the user's
  history. Same query, same response, on the hundredth use as on the
  first.
- **Bullseye queries vs. prism queries.** Some queries land on a single
  coherent temperament (one cluster, one framing); some refract into
  multiple coherent facets (the user's word holds several registers at
  once). The tool detects which kind of query it received and frames
  accordingly. Forcing a prism query into bullseye framing flattens it;
  forcing a bullseye query into prism framing manufactures complexity
  that isn't there.

Region Resonances was the first Correspondence tool and established the
input-feeling-out-place pattern. Grape Resonances (planned, see §6.4)
extends the pattern to grape-as-output, completing the move from feeling
to wine via region as the temperament-mediator. Future Correspondence
tools, if any, should be designed to this character.

The deeper claim that grounds this section: Vinotheca is, structurally,
a small library of serious instruments for paying attention to wine and,
through wine, to oneself. Correspondence is the part of the library
where this second-order attention is most directly available — where the
analytical apparatus of the studies and tools meets the user's interior
life. *In vino, cognitio* describes both directions.

---

## 5. Process notes

These workflow patterns have been found to work reliably:

- **One repo at a time.** Don't download multiple file bundles into
  Downloads simultaneously — files with the same name (`README.md`,
  `Header.jsx`, `index.html`) get auto-renamed by browsers. Finish one
  repo's commit, move/delete its files from Downloads, then start the next.

- **Sanity checks before commit.** Use `grep` and `head -1` to confirm
  the right file is in the right place before staging. Catches typos like
  `README.m` (missing extension character) and wrong-repo file mixups.

- **`git status` before AND after `git add`.** Before catches stray files
  in the working tree; after confirms the staging is clean.

- **Static sites deploy in ~1 minute. React tools deploy in 1-3 minutes**
  via GitHub Actions. **Hard refresh (Cmd+Shift+R)** to bypass browser
  cache after deploys, especially when CSS changes.

- **Conversation context is not memory.** Decisions made in conversation
  must be written to this file or they will be lost when the conversation
  is summarised or the next conversation begins.

- **PROJECT.md is read first, every session.** Any new conversation about
  Vinotheca should begin with a fetch of this file. The fetch URL is
  `https://raw.githubusercontent.com/jskarabot18/vinotheca/main/PROJECT.md`.

---

## 6. Open questions and active tasks

### 6.1 To be built — `vinotheca-reference` repo

Per §1 and §4.9–§4.10, Reference is its own section with its own repo.
The repo `vinotheca-reference` is to be created. **No content yet** —
the foundation documents (Theoretical Foundations of Character-Based
Analysis, Technical Foundations of Character-Based Analysis, Practical
Foundations) will be added when ready. The repo will follow the same
family pattern (wordmark, eyebrow `A Reference of Vinotheca`, footer
matching §4.3).

**Pending:**
- Repo creation
- Page structure for the Reference site
- Decision on whether to include the foundation documents at launch or
  delay until they are ready for public release

### 6.2 To be built — Winemaker's Constellation (study) and Winemaker Affinities (tool)

Forthcoming 2026. A 32-winemaker corpus is in preparation; a companion
essay on method will follow. Until both exist, the third Work in the
Vinotheca catalogue is incomplete.

### 6.3 Pass 3 — visual harmonisation

Unblocked 2026-05-09 by the Body of Wine deploy (per §4.7 — two live
studies are now in place). The full specification, including harvest
results, locked-in decisions, deferred questions, and per-leaf execution
change list, lives in [`PASS3_SPEC.md`](./PASS3_SPEC.md) at the root of
this repository.

**Phase 2 spec (this session, 2026-05-09):** four decisions locked in
covering canonical wine red, canonical paper cream, universal
`--paper-raised` token, and Vinotheca's `--accent` rename. Three hard
questions deliberately deferred (body font, atlas distinctness, Codex
differentiation depth) plus PDF naming convention.

**Execution remaining:** seven leaves to edit (three Tier 1, two Tier 2,
two React) plus Tier 3 tokenisation for Wine Atlas and Tasterank Explorer
in dedicated future sessions. See `PASS3_SPEC.md` for the change list.

### 6.4 To be built — Grape Resonances (second Correspondence leaf)

Per §1 and §4.11, Correspondence is the section where the user provides
input and receives a compressed, oracular response. Region Resonances is
the founding member; **Grape Resonances** is the planned second member.

The tool maps user input (word, phrase, feeling, situation) to one to
four grapes, mediated through region-character matching against the
existing 59 region embeddings. The response is compressed by design — a
small number of grape names, one framing sentence, an optional verification
prompt — and the framework's reasoning is collapsed into a "see how the
framework arrived at this" fold for curious users. The tool is an oracle,
not a recommender (see §4.11).

**Architecture:** inherits from Region Resonances (same React + Vite
stack, same Cloudflare Worker, same `region_embeddings.json`). The new
work is curatorial and authorial, not technical.

**Pending:**
- Curate `region_grapes.json` — for each of 59 regions, four fields
  (signature, lesser_known, rare, temperament_seconds). ~10 hours of
  focused curation.
- Author `grape_narratives.json` — one or two sentences per grape in
  Soul of Wine voice, focused on character rather than tasting notes.
  ~10–15 hours of writing for ~100 canonical grapes.
- Author `cluster_framings.json` — six cluster intros + facet framing
  for prism queries. ~2 hours of writing.
- Build aggregator (region matches → grape lists) and coherence detector
  (bullseye vs. prism). Small JS work, ~half a day.
- Build React app — scaffold from Region Resonances, replace region-card
  UI with grape-name response, add verification prompt and trace fold.
  ~1 day.
- Test, deploy, link from parent under Correspondence (alongside Region
  Resonances).

**Total estimated build:** ~6 working days, of which ~4 are
curation/authoring and ~2 are engineering.

**Detailed planning:** `Grape_Resonances_PlanningDoc.md` (companion to
`Region_Resonances_PlanningDoc.md`). The planning doc documents the
worked examples (*brotherhood* → Grenache/Gamay/Shiraz; *falling deeply
in love* → Pinot Noir; *making a decision about the move across the
country* → Riesling/Chenin/Furmint) that validated the oracle frame in
conversation, and captures the architectural decision to use
region-mediation rather than direct grape matching or TasteRank-driven
matching.

---

## 7. Recently completed (reverse chronological)

### 2026-05-09

- **Pass 3 React execution** — the two React leaves (Region Affinities,
  Region Resonances) brought into family-canonical alignment for paper
  tokens. Both `tailwind.config.js` files updated: `parchment.DEFAULT`
  changed from `#FAF7F2` to `#FAF6F1` (one hex unit, family
  canonical); new `parchment.raised: #FFFDF8` added as the Tailwind
  equivalent of `--paper-raised`. Wine and ink palettes unchanged
  (already canonical). The two files differ only in the deliberate
  header comment block in `region-resonances/app/tailwind.config.js`
  noting that it tracks `region-affinities/tailwind.config.js`. Build
  pipeline: GitHub Actions (Vite); ~1–3 min deploy each. Seven of
  nine palette-bearing surfaces now aligned. Remaining: 2 Tier 3
  leaves (Wine Atlas, Tasterank Explorer) — gated on the hard-
  questions session per PASS3_SPEC.md.
- **Pass 3 Tier 2 executed** — the parent Vinotheca and Estate Atlas
  brought into family-canonical alignment. *Vinotheca*: token
  `--accent` (`#6a2430`) renamed to `--wine` (`#7B2D26`) with global
  find-replace across 25 uses; `--accent-soft` (`#8a3240`) renamed to
  `--wine-light` (`#A04038`) across 4 uses; `--paper` (`#f6f1e8`)
  changed to `#FAF6F1`; `--wine-dark` and `--paper-raised` added.
  *Estate Atlas*: `--wine` (`#6e1f2a`) → `#7B2D26`; `--paper`
  (`#f5efe6`) → `#FAF6F1`; `--wine-dark` and `--paper-raised` added.
  **Corrections from PASS3_SPEC.md original draft**: Estate Atlas had
  a `--wine-soft` token not documented in the spec, renamed to
  `--wine-light` with simultaneous value change (3 uses);
  `--pin-shadow` rgba updated to track the new wine value;
  Estate Atlas's "Cormorant" display font (17 deliberate uses, not
  a typo as originally assumed) deferred to a new Question D in the
  spec, alongside the existing three deferred hard questions. Both
  changes meaningfully visible — the parent's warm-yellow paper
  becomes the family-canonical neutral cream; Estate Atlas's
  slightly cooler wine becomes the canonical. Five of nine surfaces
  now aligned; remaining: 2 React leaves + 2 Tier 3 leaves.
- **Pass 3 Tier 1 executed** — three of nine palette-bearing surfaces
  brought into family-canonical alignment for paper tokens.
  *Body of Wine* (`f8e23b0`): renamed `--cream` → `--paper`, added
  `--paper-raised: #FFFDF8`, switched five raised-panel backgrounds
  from `var(--white)` to `var(--paper-raised)`. *Soul of Wine*
  (`c578109`): identical token-system changes, kept byte-identical to
  Body of Wine; differs only in number of raised-panel uses (seven,
  not five — Soul of Wine has more card sections). *Codex Vini*
  (`cbcd2d8`): single value swap `--paper: #FAF6EF` → `#FAF6F1`. The
  Studies' `--white` token preserved for one specific use each (the
  "Open PDF" button text — high-contrast white on wine-red,
  explicitly preserved per PASS3_SPEC.md Decision 3). Per
  PASS3_SPEC.md, six leaves remain (Tier 2: Vinotheca + Estate Atlas;
  React: Region Affinities + Region Resonances; Tier 3: Wine Atlas +
  Tasterank Explorer).
- **Pass 3 Phase 2 spec written** — the visual-harmonisation work
  unblocked by the Body of Wine deploy was scoped, harvested, and
  partially decided in a single session. All nine palette-bearing
  surfaces (eight leaves plus the parent) were inventoried for wine
  red, paper cream, raised-panel surfaces, and fonts. Four decisions
  were locked in (canonical wine `#7B2D26`; canonical paper `#FAF6F1`;
  universal `--paper-raised: #FFFDF8`; rename Vinotheca's `--accent`
  to `--wine`). Three hard questions deferred (body font, atlas
  distinctness, Codex differentiation depth) plus the PDF naming
  convention. The full spec lives in `PASS3_SPEC.md`; PROJECT.md §6.3
  now points at it. Execution remains for future sessions, scoped at
  three Tier 1 + two Tier 2 + two React + two Tier 3 + one hard-
  questions session + one PDF naming session.
- **`documents_old/` folders deleted** — the gitignored rollback safety
  nets in `tasterank-explorer/` (5 PDFs) and `region-resonances/`
  (2 PDFs) were `rm -rf`'d locally after confirming the live docs in
  both repos work end-to-end. PROJECT.md previously listed three repos
  with `documents_old/` folders; in fact `region-affinities/` never
  had one. Closes the cleanup task tracked as §6.4 in v0.5.
- **The Body of Wine deployed** — the Study face of the Grape similarity
  Work is now live at `https://jskarabot18.github.io/body-of-wine/`,
  completing the first Work in the family with both faces live (Grape
  Affinities Tool + Body of Wine Study). The Study is written in the
  voice of Soul of Wine: question, three findings, why this matters,
  documents, method. The page is a structural sibling to Soul of Wine
  but five body sections rather than six — Soul of Wine's "Beyond Wine"
  cross-disciplinary section was deliberately not replicated, since
  Body of Wine makes a single-system network claim rather than Soul of
  Wine's two-systems-disagree claim. Repo: `body-of-wine` at root of
  `~/Documents/jure/wine/`. Three files: `index.html`, `LICENSE` (CC
  BY-NC 4.0, copied from Soul of Wine), `README.md`. CSS character-for-
  character matches Soul of Wine, per §4.7's loose reading (don't
  redesign now, save the redesign for Pass 3 with both studies in view).
- **Parent catalogue updated** — the Body of Wine face card on the
  Works subsection went from "In preparation" placeholder to a live
  link, mirroring Soul of Wine's pattern. The Grape Work's body text
  was also rewritten so it describes the Study's actual claim (network
  reading, three findings) rather than the false-parallel framing the
  earlier draft carried over from the v0.4 session.
- **Tasterank Explorer PDFs reorganised** — the five PDFs were moved
  from the repo root into `tasterank-explorer/docs/` to match the
  family pattern (Soul of Wine ships PDFs in `docs/`). The five
  internal links in `tasterank-explorer/index.html`'s Documentation
  dropdown were updated in the same commit. This was prerequisite
  groundwork for Body of Wine, which links to those PDFs cross-repo.
- **Parent catalogue restructured to match §1 architecture** — the
  parent Vinotheca page's Tools and Studies subsections were merged
  into a single **Works** subsection, with three Work entries each
  showing both faces side by side: *The Body of Wine* (Grape Affinities
  live + study to be built), *The Soul of Wine* (Region Affinities live
  + Soul of Wine live), *The Winemaker's Constellation* (Winemaker
  Affinities and the Constellation, both forthcoming). New `.work`,
  `.work-faces`, and `.work-face` CSS classes implement the paired-card
  pattern; the existing `.instrument` pattern is retained for unpaired
  entries (Maps, Correspondence, Codex). Closes the active task that
  was tracked as §6.1 (move Region Resonances from Tools to
  Correspondence) by completing the deeper restructure that task
  pointed at.
- **Region Resonances moved from Tools to Correspondence** — eyebrow
  changed from `A Tool of Vinotheca` to `A Correspondence of Vinotheca`
  in `app/src/components/Header.jsx`. The repo name stays
  `region-resonances` (working name, per §3 — repo names are
  infrastructure). Region Resonances is now the founding member of
  the Correspondence subsection on the parent, sitting alongside
  Grape Resonances (forthcoming, §6.6).
- **"The Body of Wine" adopted as working title** for the unbuilt
  Grape Affinities study, completing the triptych of study titles
  (Body / Soul / Constellation) — each naming a way of seeing wine:
  through the senses, through cultural identity, through the character
  of those who make it. Title is open to revision until the Study is
  written.
- **Catalogue numerals renumbered i–viii** (was i–ix) — three pairs
  collapsed into three Works.
- **Introduction prose and Part I description rewritten** to enumerate
  the four-section architecture (atlases / works / correspondence /
  record) instead of the old Tools-and-Studies-and-Codex three.

### 2026-05-08

- **Soul of Wine brought into conformance with §4.6** — the "Interactive
  Tools" section was removed from Soul of Wine's `index.html`, along with
  the corresponding "Explore" entry in the in-page nav. The four
  superseded prototype HTML files (`cluster-explorer.html`,
  `cluster-map.html`, `movement-map.html`, `d-score-dashboard.html`) were
  deleted from `soul-of-wine/visualizations/`. A single contextual prose
  link to Region Affinities was added to the "Why This Matters" intro
  paragraph. Closes the active task that was tracked as §6.1.
- **PROJECT.md created** — canonical project state document, this file.
- **Documentation source archival** — `docs-source/` folder added to each
  of the three tool repos (region-affinities, region-resonances,
  tasterank-explorer) containing the `.tex` sources and shared preamble.

### 2026-05-07 to 2026-05-08

- **Pass 2 — naming and structural decisions**:
  - Step 1: TasteRank Explorer renamed to Grape Affinities (wordmark and
    page title; repo name unchanged)
  - Step 2: Soul of Wine "Source-available and free…" disclaimer removed;
    Documentation dropdown unified to single-line entries on Grape Affinities
  - Step 3: Eyebrow standardisation across all seven leaves to "X OF
    VINOTHECA" grammar
  - Step 4: Documentation menu placement on atlases — decided to keep
    single PDF button (atlases ship one consolidated PDF)
  - Step 5: Wordmark font alignment on Grand Cru Atlas (DM Serif Display
    → Cormorant Garamond, matching Estate Atlas and the Library)

### 2026-05-06 to 2026-05-07

- **Pass 1 — mechanical text consistency** across five repos:
  - License link fixed in Region Affinities and Region Resonances footers
  - *Atlas* italicised in Grand Cru Atlas wordmark
  - Soul of Wine motto fleurons + footer link reorder + "Region Profiles"
    renamed to "Region Reference"
  - Codex Vini motto fleurons in header and footer

### 2026-05-05 to 2026-05-06

- **Documentation alignment** across the three tools to canonical framework
  (Summary, Technical Appendix, Methods Primer, Data Appendix, optional
  Reference). 13 PDFs produced and deployed; `Header.jsx` updated for the
  React tools.

---

## 8. Document changelog

Append a new entry whenever PROJECT.md is updated. Newest at the top.

### 2026-05-09 — v0.10

- Pass 3 React execution shipped: Region Affinities and Region
  Resonances both updated to canonical paper colour and `--paper-raised`
  equivalent. Seven of nine palette-bearing surfaces now aligned.
- §6.3 (Pass 3 — visual harmonisation) remains open. Two leaves remain
  (Wine Atlas, Tasterank Explorer), both Tier 3 (hard-coded values, no
  token system) and gated on the hard-questions session for body-font
  and atlas-distinctness decisions.
- The change visible only on careful inspection: the parchment colour
  shift was one hex unit (`#FAF7F2` → `#FAF6F1`). The `parchment.raised`
  utility is now available via the `bg-parchment-raised` class for any
  components that want the warm off-white treatment matching the rest
  of the family.

### 2026-05-09 — v0.9

- Pass 3 Tier 2 executed across two repos. Five of nine palette-bearing
  surfaces now aligned (Tier 1: Body of Wine, Soul of Wine, Codex Vini;
  Tier 2: Vinotheca, Estate Atlas). PASS3_SPEC.md updated with shipped-
  status marks for these five, plus a Question D added to the deferred-
  decisions list (Estate Atlas display font: Cormorant vs. Cormorant
  Garamond — 17 deliberate uses of "Cormorant" make this a real
  question, not a typo as originally assumed).
- §6.3 (Pass 3 — visual harmonisation) remains open. Remaining work:
  React leaves (Region Affinities + Region Resonances), Tier 3 leaves
  (Wine Atlas + Tasterank Explorer), the hard-questions session
  covering Questions A through D, and the PDF naming convention.
- The Tier 2 execution meaningfully visible: Vinotheca's warm-yellow
  paper becomes the canonical neutral cream; Estate Atlas's cooler wine
  becomes the canonical. The parent now reads chromatically the same
  as the eight live leaves it catalogues.

### 2026-05-09 — v0.8

- Pass 3 Tier 1 executed across three repos. No structural changes
  to PROJECT.md; §6.3 (Pass 3 — visual harmonisation) remains open
  with six of nine surfaces still to align. The work is recorded in §7.
- Per PASS3_SPEC.md's recommended sequence, the next execution
  session is Tier 2 (Vinotheca parent + Estate Atlas) — the leaves
  with non-canonical token names that need renaming alongside
  value swaps.

### 2026-05-09 — v0.7

- New file: `PASS3_SPEC.md` at the root of the `vinotheca` repo. Contains
  the full Phase 2 specification for Pass 3 — harvest results across
  all nine palette-bearing surfaces, four locked-in decisions, three
  deferred hard questions, and the per-leaf execution change list.
- §6.3 (Pass 3 — visual harmonisation): rewritten to point at
  `PASS3_SPEC.md` rather than holding the spec inline. The §6.3 prose
  in PROJECT.md is now a one-paragraph pointer; the substantive
  content lives in the spec document.
- Phase 2 decisions locked in this session:
  - Canonical wine red: `#7B2D26` (Codex Vini's `#5B1A2D` exempted as
    intentional Part-II differentiation per §1)
  - Canonical paper cream: `#FAF6F1`
  - Universal `--paper-raised` token at `#FFFDF8` (Codex's existing value)
  - Vinotheca's `--accent` → `--wine` token rename
- Phase 3 hard questions deferred: body font canonical, atlas distinctness
  policy, Codex differentiation depth.

### 2026-05-09 — v0.6

- §6.4 (Local cleanup — `documents_old/` folders) closed: the gitignored
  rollback folders in `tasterank-explorer/` and `region-resonances/`
  were deleted locally after confirming live docs work. Recorded in §7.
  Subsequent §6 subsection renumbered down by one (old §6.5 → §6.4).
  Four remaining open subsections.
- §3 leaves table and §4.11 cross-references for Grape Resonances
  updated from §6.5 to §6.4.
- Minor correction: PROJECT.md previously listed three repos with
  `documents_old/` folders (`tasterank-explorer`, `region-affinities`,
  `region-resonances`). In fact only two had them — `region-affinities`
  never had one. The §6.4 description carried this small inaccuracy
  forward through three versions; flagging here for the record.

### 2026-05-09 — v0.5

- §6.1 (To be built — The Body of Wine) closed: the Study is built and
  deployed in the same session. Recorded in §7. Subsequent §6
  subsections renumbered down by one (old §6.2 → §6.1, old §6.3 → §6.2,
  old §6.4 → §6.3, old §6.5 → §6.4, old §6.6 → §6.5). Five remaining
  open subsections.
- §3 leaves table: Body of Wine row updated from "Working title — to
  be built (§6.1)" to "Live"; repo column from `*(tbd)*` to
  `body-of-wine`.
- §3.1 Works pairings table: Body of Wine row updated from "(working
  title — to be built)" to "(live)". The Grape similarity Work is now
  the first Work in the family with both faces live.
- §6.3 (formerly §6.4, Pass 3 — visual harmonisation): gating language
  updated. Per §4.7, two live studies were the precondition for proper
  template design; that condition is now met. Section now reads
  "unblocked" rather than "deferred." Also added a new Pass 3 item:
  settle PDF naming convention across the family, currently divergent
  between Soul of Wine (`lowercase-with-hyphens.pdf`) and Tasterank
  Explorer (`TasteRank_Title_Case_With_Underscores.pdf`).

### 2026-05-09 — v0.4

- §6.1 (Active task — Move Region Resonances from Tools to
  Correspondence) closed: the work was completed in the same session and
  is now recorded in §7. The deploy went further than §6.1's stated
  scope by also restructuring the parent's Tools and Studies subsections
  into a single Works subsection per §2 (paired Tool+Study entries) —
  the original §6.1 had been written before §2's paired-Work model was
  fully thought through, so closing §6.1 properly required completing
  the §2-implied restructure as well. Subsequent §6 subsections
  renumbered down by one (old §6.2 → §6.1, old §6.3 → §6.2, …, old §6.7
  → §6.6).
- §3 leaves table: Region Resonances row updated from "Live, but
  currently filed in Tools — to be moved" to simply "Live"; the Grape
  Work's Study row updated from `*(paired study tbd)*` to **The Body
  of Wine** (working title) with wordmark The *Body* of Wine.
- §3.1 Works pairings table: Body of Wine (working title) inserted as
  the Study face for the grape similarity Work.
- §6.1 (formerly §6.2) — *To be built — The Body of Wine*: section
  retitled from "*The Grape Affinities study*" to "*The Body of Wine
  (paired study for Grape Affinities)*", expanded with a paragraph on
  the title's origin (the Body / Soul / Constellation triptych as three
  ways of seeing wine — through the senses, through cultural identity,
  through the character of those who make it), and pending items
  refined.

### 2026-05-09 — v0.3

- §3 leaves table: added **Grape Resonances** as a planned Correspondence
  leaf (sibling to Region Resonances). Repo name `grape-resonances` (tbd).
  Wordmark: Grape *Resonances*. Eyebrow: A Correspondence of Vinotheca.
- New **§4.11 — Correspondence is oracular, not search**: codifies the
  conceptual finding that Correspondence tools are instruments of
  self-recognition rather than recommendation systems, with concrete
  design implications (compression, single framing sentence, traceable
  but not foregrounded framework, verification invited but not measured,
  graceful refusal of wrong-shaped queries, no personalization or
  learning, bullseye vs. prism query handling). This frame applies to
  Region Resonances retrospectively and governs Grape Resonances by
  design.
- New **§6.7 active task — Grape Resonances build**: detailed pending
  items, with the build broken into curatorial work
  (`region_grapes.json`, `grape_narratives.json`,
  `cluster_framings.json`), engineering work (aggregator, coherence
  detector, React scaffold from Region Resonances), and deployment.
  Total estimated build: ~6 working days.
- Companion planning doc created: `Grape_Resonances_PlanningDoc.md`,
  sibling to `Region_Resonances_PlanningDoc.md`, documenting
  architecture decisions (region-mediation chosen over TasteRank-driven
  matching), worked examples that validated the oracle frame
  (*brotherhood*, *falling deeply in love*, *making a decision about the
  move across the country*), and open questions to resolve before build.

### 2026-05-08 — v0.2

- §6.1 (Active task — Bring Soul of Wine into conformance with §4.6)
  closed: the work was completed in the same session and is now recorded
  in §7. Subsequent §6 subsections renumbered down by one (old §6.2 → §6.1,
  old §6.3 → §6.2, …, old §6.7 → §6.6).
- §4.6 updated: the paragraph describing Soul of Wine's "Interactive
  Tools" section moved from present-tense ("currently has", "will be
  deleted") to past-tense, reflecting the completed cleanup, and
  cross-references §7 rather than the now-closed §6 entry.

### 2026-05-08 — v0.1 (initial)

- Initial draft of PROJECT.md.
- Architecture: established five-section model organised by operational
  purpose (Maps / Works / Correspondence / Reference / Personal Codex).
- Works model: defined "Work" as paired Tool + Study sharing supporting
  documents, replacing the previous separate-Tools/separate-Studies split
  on the parent page.
- Reference section established as the home for intellectual foundations;
  `vinotheca-reference` repo to be created (empty for now).
- Region Resonances reclassified from Tools to Correspondence.
- Soul of Wine: confirmed the four embedded prototype tools (Cluster
  Explorer, Cluster Map, Movement Map, D-Score Dashboard) will be deleted
  as superseded by Region Affinities.
- Eyebrow grammar extended to include "A Correspondence of Vinotheca"
  and "A Reference of Vinotheca".

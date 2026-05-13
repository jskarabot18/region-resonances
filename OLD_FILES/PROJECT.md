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

Last meaningful update: 2026-05-08 (see §8 for full history)

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
| Works → Study | *(paired study tbd)* | *(tbd)* | Not yet built — see §6 | — | A Study of Vinotheca |
| Works → Tool | Region Affinities | `region-affinities` | Live | Region *Affinities* | A Tool of Vinotheca |
| Works → Study | The Soul of Wine | `soul-of-wine` | Live | The *Soul* of Wine | A Study of Vinotheca |
| Works → Tool | Winemaker Affinities | *(tbd)* | Forthcoming 2026 | Winemaker *Affinities* | A Tool of Vinotheca |
| Works → Study | The Winemaker's Constellation | *(tbd)* | Forthcoming 2026 | The Winemaker's *Constellation* | A Study of Vinotheca |
| Correspondence | Region Resonances | `region-resonances` | Live, but currently filed in Tools — to be moved | Region *Resonances* | A Correspondence of Vinotheca |
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
| Grape similarity | Grape Affinities (live) | *(to be built — same format as Soul of Wine)* |
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
page. Soul of Wine currently has an "Interactive Tools" section that
violates this rule — it embeds four prototype tools (Cluster Explorer,
Cluster Map, Movement Map, D-Score Dashboard). These are superseded by
Region Affinities and will be deleted (see §6).

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

### 6.1 Active task — Bring Soul of Wine into conformance with §4.6

Per §4.6, studies don't embed tools. Soul of Wine currently has an
"Interactive Tools" section embedding four prototype tools.

**Decided:** All four prototypes (Cluster Explorer, Cluster Map, Movement
Map, D-Score Dashboard) will be **deleted**. Region Affinities supersedes
all four — it offers Dual Networks (replacing Cluster Map), Identity ↔
Terroir (replacing Movement Map), Comparison (replacing Cluster Explorer's
radar charts), and Region Atlas (replacing the per-region details from
the D-Score Dashboard). The full D-score matrix in sortable form is
already published in the Data Appendix PDF.

**Pending:** Implementation. The "Interactive Tools" section is removed
from Soul of Wine's page; the four prototype HTML files in
`soul-of-wine/visualizations/` are deleted; any inline link to Region
Affinities from Soul of Wine's body should remain or be added as a single
contextual prose link.

### 6.2 Active task — Move Region Resonances from Tools to Correspondence

Per §1, Correspondence is the section for tools where the user provides
input and receives a response. Region Resonances is the founding member.

**Pending:** Update the parent Vinotheca page to file Region Resonances
under Correspondence rather than Tools. Update Region Resonances's
eyebrow from `A Tool of Vinotheca` to `A Correspondence of Vinotheca`.
The repo name stays `region-resonances` (working name).

### 6.3 To be built — The Grape Affinities study (paired study)

Per §2, every Work has both a Tool face and a Study face. Grape
Affinities is currently a Tool without its Study. The Study needs to be
built using the same format as Soul of Wine: question, findings, why it
matters, documents, method.

**Pending:**
- Working title for the study (`[NEEDS NAME]`)
- Repo decision (separate repo, or part of `tasterank-explorer`?)
- Content authoring

### 6.4 To be built — `vinotheca-reference` repo

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

### 6.5 To be built — Winemaker's Constellation (study) and Winemaker Affinities (tool)

Forthcoming 2026. A 32-winemaker corpus is in preparation; a companion
essay on method will follow. Until both exist, the third Work in the
Vinotheca catalogue is incomplete.

### 6.6 Pass 3 — visual harmonisation

Deferred until at least the second study exists (per §4.7). Includes:

- Pick canonical wine-red across all leaves (currently four close-but-
  not-identical reds)
- Pick canonical paper colour (currently four overlapping warm creams)
- Replace `#fff` panel/footer backgrounds with a `--paper-raised` token
  (Codex Vini's `#FFFDF8` is the model)
- Decide whether atlases (DM Sans body) align with the Library body
  font (EB Garamond) or stay distinct

### 6.7 Local cleanup — `documents_old/` folders

The `documents_old/` folders in `tasterank-explorer`, `region-affinities`,
and `region-resonances` (gitignored, local only) are rollback safety nets
from the documentation alignment session. Once Jure is confident in the
new docs, these can be `rm -rf`'d locally — purely a local cleanup,
nothing to commit.

---

## 7. Recently completed (reverse chronological)

### 2026-05-08

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

# Region Resonances — Planning Doc

> A Vinotheca tool that matches user-entered metaphors to wine regions via NLP semantic similarity.

**Status:** Planned — to be built after Region Affinities is finalized and integrated into Vinotheca.

---

## The idea

Each of the 59 wine regions in Soul of Wine carries a one-word metaphor — Burgundy → *Devotion*, Bordeaux → *Business*, Santorini → *Survival*, Mosel → *Poetry*. These metaphors are the most narratively resonant element of the project, and feedback indicates they're what wine readers connect with most.

The tool lets users:

1. **Browse** all 59 region metaphors interactively
2. **Match** their own metaphor (any word, phrase, or short prose) against the canonical 59 and see which regions resonate most strongly

Examples of the matching experience:

- User types **"resilience"** → top matches: Santorini (Survival), Barossa (Fortitude), Finger Lakes (Conviction), Douro (Endurance)
- User types **"the feeling of late summer"** → top matches: Tokaj (Melancholy), Galicia (Longing), Provence (Pleasure)
- User types **"old soul"** → top matches: Burgundy (Devotion), Rioja (Patience), Tokaj (Melancholy), Sardinia (Stubbornness)

The reward is recognition. Users see *their* feeling reflected in a region they may not have considered, and discover wines through the back door of poetry rather than the front door of geography.

---

## Where it fits in Vinotheca

Not in Region Affinities. That tool is the structural argument — D-scores, clusters, kinship. Adding a metaphor-matching mode would muddy its identity.

This is a **separate Vinotheca tool**, sibling to Region Affinities, under the **Tools** section.

**Working name: *Region Resonances***. Fits the *Affinities* family pattern (Grape Affinities, Region Affinities, Region Resonances), reads as a poetic instrument rather than a feature, and frames the matching as kinship between user feeling and place identity rather than a mechanical lookup.

Other candidates considered: *Metaphor Match*, *Wine Mood*, *The Metaphor Index*, *Echoes*. *Region Resonances* won on family pattern + tone.

---

## Data sources — RESOLVED

### Canonical metaphor names

**Source:** `regions.json` from the live Soul of Wine site (`https://jskarabot18.github.io/soul-of-wine/data/regions.json`).

### Canonical description text

**Source:** `The Soul of Wine — Region Profiles · Identity` (the Layer 1 identity narratives PDF, 59 regions × 280–320 words each).

### Verification

A diff of metaphor names across the two sources shows **0 mismatches across all 59 regions**. The two sources are perfectly synchronized:

- Both list exactly 59 regions
- All 59 metaphors match exactly (Tuscany = Art, Rioja = Patience, Goriška Brda = Fortune, Beaujolais = Joy, Loire = Sentimentality, Veneto = Commerce, Pfalz = Generosity, Rheingau = Nobility, Nahe = Subtlety, etc.)
- Cluster assignments match between the two sources

This means the data foundation for Region Resonances is **already canonical and consistent** — no reconciliation work needed, just extraction.

### What gets embedded for each region

For each region, the embedding input concatenates:

```
{metaphor}. {full ~280-320 word identity narrative}
```

Example for Tokaj:

> *Melancholy. Tokaj is a region where sweetness and sadness are the same thing. The concept that defines it is melancholy — not depression, which is pathological, but the richer, more complex emotional state of someone who understands that beauty and loss are inseparable, that the most precious things are precious precisely because they do not last. The region faces inward with the quiet intensity of a culture that has been great, has fallen, and is uncertain whether it will be great again...* [continues for ~280 more words]

This gives the matcher rich semantic signal — far better than just the one-word metaphor. The Layer 1 narratives are dense, evocative, and consistent in voice (they're written from the same authorial perspective with the same vocabulary register), which makes them ideal embedding input. Conceptual queries like "old soul" or "stubborn quiet" should match against the *spirit* of the descriptions, not just the surface words.

### Pre-computation pipeline

A one-time Python script:

```
scripts/build_metaphor_embeddings.py
  Input:
    - regions.json (canonical metaphors + cluster assignments)
    - layer1-descriptions.txt (extracted from PDF, one entry per region)
  Process:
    For each region:
      text = f"{metaphor}. {full_description}"
      vector = embedding_api.embed(text)
    Output: { regions: [{ name, metaphor, identity_cluster, terroir_cluster, embedding: [1536 floats] }, ... ] }
  Output: public/data/region_embeddings.json
```

Run once. Re-run only if metaphors or descriptions change (rare).

**Note for the build phase:** Step 1 of the build sequence (originally "decide canonical descriptions") is now trivial — extract Layer 1 PDF to text per region. Estimate: 1 hour, not half a day.

---

## Architecture decision: server-side embeddings via Cloudflare Worker

### Three options considered

| Option | Cost | Quality | Complexity | Verdict |
|---|---|---|---|---|
| A. Pre-computed region embeddings + live query embedding via API | ~$0.0001/query | High | Low | **Chosen** |
| B. Local embedding model in browser (transformers.js) | Free | Medium | Medium | Rejected — model download cost, mobile concerns |
| C. Lexical thesaurus matching | Free | Low | Medium | Rejected — kills the magic |

### Chosen architecture

```
User types "melancholy of autumn" in Region Resonances
  ↓
Frontend POSTs query to Cloudflare Worker proxy
  ↓
Worker calls embedding API (OpenAI text-embedding-3-small or Voyage voyage-3-lite)
  ↓
Worker returns embedding vector to frontend
  ↓
Frontend computes cosine similarity vs. 59 pre-computed vectors
  ↓
Renders top-N matches with similarity scores
```

### Why server-side

A Cloudflare Worker exists solely to hold the API key and rate-limit. Without it, exposing the API key in client-side JS would be a security/cost disaster. Free tier handles ~100k requests/day, more than enough.

### Embedding model choice

**Recommendation:** OpenAI `text-embedding-3-small` (1536 dimensions, $0.00002 per 1K tokens). At ~5 tokens per query, each user lookup costs ~$0.0000001 — effectively free. Pre-computation cost for all 59 regions × ~320 words ≈ 19,200 tokens total ≈ $0.0004 one-time.

Alternative: Voyage `voyage-3-lite` if cost or vendor-independence becomes a concern.

---

## UI design

### Layout

Two-column, similar to Region Affinities Tab 4:

**Left (1/3) — Input panel:**
- Large freeform text input ("Type a word, phrase, or feeling…")
- Below the input: example chips (clickable): *aspiration · grit · old soul · careful joy · the feeling of late summer · stubborn quiet*
- "Match" button (or auto-match on input pause via debounce)
- Below: recent searches (session-only, no persistence)

**Right (2/3) — Results panel:**
- Top-N matched regions (default N=5) as cards, ranked by similarity
- Each card shows:
  - Region name + country
  - Metaphor in italic wine-red
  - Similarity score (0–100% scale, easier to read than 0–1 cosine)
  - First 1–2 sentences of the description (extracted from Layer 1)
  - Cluster pills (identity + terroir)
  - "View full profile →" link to Region Affinities → Region Atlas with this region pre-selected
- Below cards: "Show all 59 ranked" expand link for the curious

### Default state

Empty input shows a **browse mode**: all 59 regions in alphabetical or grouped layout, click any to see its metaphor + description. This makes the tool useful even before the user types anything.

### Loading state

Embedding API call takes ~200ms. Show a wine-glass-pour loading indicator or simple spinner. If it takes >2s, show a "Still thinking…" message.

### Error states

- Network error → "Couldn't reach the matcher. Try again?"
- Empty input → just stays in browse mode
- Garbage input (e.g. emoji-only, single character) → still attempt; embedding models handle unusual input gracefully

---

## Curated example chips

The example chips on the input panel should:
1. Show the user *what kind of input works* (single words, phrases, feelings)
2. Surface metaphor categories that aren't in the canonical 59 (so users see the matcher actually does work, not just retrieves exact matches)

### Suggested chips

Final lineup of seven chips, each picked to pull on a distinct emotional register so the set collectively covers a wide range of input types. None exactly match a canonical metaphor (avoiding trivial 1:1 lookups), and each is expected to pull 3+ regions across different clusters — which validates the matcher is doing real semantic work rather than thesaurus lookup.

- **old soul** → expected to match Burgundy-Devotion, Rioja-Patience, Tokaj-Melancholy *(introspective depth)*
- **careful joy** → expected to match Beaujolais-Joy, Steiermark-Clarity *(gentle warmth)*
- **stubborn quiet** → expected to match Sardinia-Stubbornness, Hunter Valley-Defiance, Galicia-Longing *(withdrawn pride)*
- **the feeling of late summer** → expected to match Tokaj-Melancholy, Provence-Pleasure *(seasonal melancholy; visually anchors the set as the longest chip, signalling "full phrases work too")*
- **quiet defiance** → expected to match Hunter Valley-Defiance, Sardinia-Stubbornness, Macedonia-Austerity *(resistance/grit)*
- **earned ease** → expected to match Margaret River-Composure, Hawke's Bay-Confidence, Provence-Pleasure *(grounded contentment)*
- **second chances** → expected to match Sicily-Resurrection, Etna-Awakening, Campania-Memory *(renewal/rebirth)*

These should be tested during the prototype phase to validate that matches feel right.

---

## Tech stack

- **Frontend**: React + Vite (consistent with Region Affinities)
- **Hosting**: GitHub Pages (single-page app, just like Region Affinities)
- **API proxy**: Cloudflare Worker (~30 lines of code, free tier)
- **Embedding model**: OpenAI text-embedding-3-small
- **Data**: One static JSON file with 59 pre-computed region vectors

### Repo structure (anticipated)

```
region-resonances/
├── public/
│   └── data/
│       └── region_embeddings.json
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── InputPanel.jsx
│   │   ├── ResultsPanel.jsx
│   │   ├── RegionCard.jsx
│   │   └── BrowseMode.jsx
│   └── lib/
│       ├── matcher.js          (cosine similarity)
│       └── api.js              (Cloudflare Worker call)
├── scripts/
│   ├── extract_layer1.py       (PDF → JSON of region descriptions)
│   └── build_metaphor_embeddings.py
└── worker/
    └── index.js                (Cloudflare Worker proxy)
```

---

## Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Embedding quality disappoints — too many "obvious" matches, not enough surprise | Medium | Test extensively pre-launch with curated queries; if poor, switch to a model with stronger semantic depth |
| Layer 1 descriptions are too stylistically uniform — every region's text uses similar vocabulary so embeddings cluster on style not content | Low–Medium | Validate during prototype. Layer 1 descriptions ARE in a consistent voice, but each describes a distinctly different concept, so semantic differentiation should still emerge. If problematic, prepend metaphor word with extra weight or use shorter excerpts |
| API key abuse (someone scrapes our worker for free embeddings) | Low | Rate-limit in Worker (e.g. 10 req/min per IP); add CORS origin restriction to Vinotheca domain |
| Cost runs away unexpectedly | Very low | Even at 10k queries/day, monthly cost <$1; set hard budget cap in OpenAI dashboard |
| Anthropic / OpenAI API ToS prohibits this use case | Very low | Both explicitly support embedding-based search; this is canonical use |
| Tool seems gimmicky next to the rigour of the Soul of Wine study | Medium | Frame as "playful companion" in copy; keep visual design serious; don't oversell — describe as "a way to discover regions through resonance" |

---

## Out of scope (for v1)

- **Multi-language input.** English only. The metaphors and descriptions are English; embedding multilingual queries would create asymmetry.
- **User accounts / saved searches.** Session-only history is enough.
- **Search history aggregation / analytics.** Privacy-respecting tool. No tracking.
- **Inverse mode** ("type a region, get a metaphor"). That's already what the Soul of Wine site does.
- **Adding new regions or editing metaphors.** Locked to the canonical 59.

---

## Build sequence (when activated)

1. **Extract Layer 1 narratives from PDF** — script that converts the PDF into per-region JSON entries. Output: `layer1-narratives.json`. Estimate: 1 hour.
2. **Build embedding pipeline** — Python script that calls OpenAI API and writes `region_embeddings.json`. Estimate: 1 hour.
3. **Set up Cloudflare Worker** — proxy with rate-limiting and CORS. Estimate: 1 hour.
4. **Build React app** — scaffold like Region Affinities. Tabs/sections: input, results, browse. Estimate: 1.5 days.
5. **Test with curated queries** — iterate on UX, similarity score thresholds, match-count display. Estimate: half a day.
6. **Deploy + integrate into Vinotheca** — link from Vinotheca Tools section. Estimate: 1 hour.

**Total: ~3 working days from start to live.**

---

## Open questions to resolve before building

1. **API provider.** OpenAI vs. Voyage vs. Anthropic embeddings? (Recommendation: OpenAI text-embedding-3-small unless cost/vendor concerns dictate otherwise)
2. **Auto-match vs. button.** Type-and-wait debounce, or explicit "Match" button?
3. **How many results to show by default.** 3? 5? Top match large, others small?
4. **Should clicking a region card jump to Region Affinities Region Atlas, or open inline detail here?** Inline = self-contained tool. Jump = ecosystem connection.
5. **Excerpt length on result cards** — first sentence (very tight), first 2 sentences (1–2 lines), or first paragraph (more context)?

---

*Planning doc · Created May 2026, after Region Affinities Tab 4 ships, before integration polish phase.*
*Updated when Layer 1 narratives PDF was confirmed as canonical description source — verified 0 metaphor mismatches across all 59 regions vs. live regions.json.*
*Updated to revise example chips — replaced rebellion/opulence/resilience with quiet defiance/earned ease/second chances for broader emotional coverage and to avoid trivial 1:1 metaphor matches.*

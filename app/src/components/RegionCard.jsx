/**
 * RegionCard
 *
 * A single region in the results list. Renders at one of three tiers:
 *
 *   - 'hero':      top-3 matches. Large, prose excerpt visible, prominent
 *                  metaphor, full cluster pill on expansion.
 *   - 'secondary': ranks 4-7. Medium. Metaphor + first-sentence excerpt.
 *   - 'compact':   ranks 8+ (revealed via "show all 59"). One line —
 *                  region, metaphor only.
 *
 * Clicking any card toggles inline expansion to show the full identity
 * narrative (with a small drop-cap for editorial gravitas) and a
 * "View in Region Affinities →" link.
 *
 * Note on scoring: this card no longer renders a numeric match score.
 * After testing, the raw cosine values (typically 0.10–0.30 for queries,
 * 0.36–0.74 for region-to-region) read as "low match" to casual users
 * and consistently undermined good results. Position on the page now
 * conveys rank; the tier system handles emphasis. The `score` field on
 * the region data remains, just unrendered — easy to bring back.
 *
 * The first-place hero card carries a small "STRONGEST RESONANCE" eyebrow
 * so it's unambiguously marked as the top match without using a number.
 */

import { useState } from 'react';
import { clusterClassSuffix } from '@/lib/matcher';
import { regionAtlasLink } from '@/lib/regionLinks';

export default function RegionCard({
  region,
  tier = 'secondary',
  rank = null,
  staggerDelay = 0,
}) {
  const [expanded, setExpanded] = useState(false);

  const clusterClass = `pill pill--${clusterClassSuffix(region.cluster)}`;

  return (
    <article
      className="card-interactive p-5 fade-in-stagger"
      style={{ '--stagger-delay': `${staggerDelay}ms` }}
      onClick={() => setExpanded((v) => !v)}
    >
      {tier === 'hero' && <HeroLayout region={region} rank={rank} />}
      {tier === 'secondary' && <SecondaryLayout region={region} />}
      {tier === 'compact' && <CompactLayout region={region} />}

      {/* Expanded detail — same content shape regardless of tier */}
      {expanded && (
        <div className="mt-5 pt-5 border-t border-parchment-edge">
          <p className="drop-cap font-serif text-ink leading-relaxed text-base whitespace-pre-line">
            {region.narrative}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <span className={clusterClass}>{region.cluster}</span>
            <a
              href={regionAtlasLink(region)}
              className="font-sans text-xs uppercase tracking-widest text-wine hover:text-wine-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
            >
              View in Region Affinities →
            </a>
          </div>
        </div>
      )}
    </article>
  );
}

/* -------------------- Hero (top 3) -------------------- */

function HeroLayout({ region, rank }) {
  return (
    <div>
      {rank === 1 && (
        <p className="small-caps text-wine mb-2">
          Strongest resonance
        </p>
      )}
      <p className="small-caps mb-1">{region.country}</p>
      <h3 className="font-serif text-3xl text-ink leading-tight mb-1">
        {region.region}
      </h3>
      <p className="metaphor text-2xl mb-3">{region.metaphor}</p>
      <p className="font-serif text-ink-muted text-base leading-relaxed">
        {firstSentences(region.narrative, 2)}
      </p>
    </div>
  );
}

/* -------------------- Secondary (4-7) -------------------- */

function SecondaryLayout({ region }) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1">
        <h4 className="font-serif text-xl text-ink">{region.region}</h4>
        <span className="text-ink-subtle text-sm font-sans">
          {region.country}
        </span>
      </div>
      <p className="metaphor text-lg mb-2">{region.metaphor}</p>
      <p className="font-serif text-ink-muted text-sm leading-relaxed">
        {firstSentences(region.narrative, 1)}
      </p>
    </div>
  );
}

/* -------------------- Compact (8+) -------------------- */

function CompactLayout({ region }) {
  return (
    <div className="flex items-baseline gap-3">
      <h5 className="font-serif text-lg text-ink shrink-0">{region.region}</h5>
      <span className="metaphor text-base">{region.metaphor}</span>
    </div>
  );
}

/* -------------------- Helpers -------------------- */

/**
 * Take the first N complete sentences from the narrative. Good enough
 * for our purposes — narratives use straight periods, no abbreviations,
 * so naive sentence splitting works reliably.
 */
function firstSentences(text, n) {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
  return sentences.slice(0, n).join(' ').trim();
}

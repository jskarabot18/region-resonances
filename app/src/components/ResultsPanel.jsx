/**
 * ResultsPanel
 *
 * Right column. Renders ranked regions in three visual tiers:
 *   - Top 3 as hero cards (rank 1 gets a "Strongest resonance" eyebrow)
 *   - Ranks 4–7 as secondary cards
 *   - "Show all 59 ranked" expansion reveals ranks 8–59 as compact cards
 *
 * Stagger-fades cards in on first render so the result list feels alive.
 * The stagger is capped so the very last card doesn't feel too late.
 */

import { useState } from 'react';
import RegionCard from './RegionCard';

const HERO_COUNT = 3;
const SECONDARY_END = 7;       // tiers: 0-2 hero, 3-6 secondary, 7+ compact
const STAGGER_STEP = 50;       // ms between successive cards
const STAGGER_MAX = 600;       // cap (so 'show all' doesn't take 3 seconds)

export default function ResultsPanel({ ranked }) {
  const [showAll, setShowAll] = useState(false);

  if (!ranked || ranked.length === 0) {
    return null;
  }

  const hero = ranked.slice(0, HERO_COUNT);
  const secondary = ranked.slice(HERO_COUNT, SECONDARY_END);
  const rest = ranked.slice(SECONDARY_END);

  return (
    <section className="space-y-6">
      {/* Tier 1: hero cards (top 3) */}
      <div className="space-y-4">
        {hero.map((region, i) => (
          <RegionCard
            key={region.id}
            region={region}
            tier="hero"
            rank={i + 1}
            staggerDelay={Math.min(i * STAGGER_STEP, STAGGER_MAX)}
          />
        ))}
      </div>

      {/* Tier 2: secondary cards (ranks 4-7) */}
      {secondary.length > 0 && (
        <div className="space-y-3">
          {secondary.map((region, i) => (
            <RegionCard
              key={region.id}
              region={region}
              tier="secondary"
              rank={HERO_COUNT + i + 1}
              staggerDelay={Math.min(
                (HERO_COUNT + i) * STAGGER_STEP,
                STAGGER_MAX
              )}
            />
          ))}
        </div>
      )}

      {/* Tier 3: expandable "show all 59 ranked" */}
      {rest.length > 0 && (
        <div className="pt-4">
          {!showAll ? (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="font-sans text-xs uppercase tracking-widest text-ink-muted hover:text-wine transition-colors"
            >
              Show all {ranked.length} ranked →
            </button>
          ) : (
            <>
              <div className="flex items-baseline justify-between mb-3">
                <p className="small-caps">All ranked, by resonance</p>
                <button
                  type="button"
                  onClick={() => setShowAll(false)}
                  className="font-sans text-xs uppercase tracking-widest text-ink-muted hover:text-wine transition-colors"
                >
                  Collapse ↑
                </button>
              </div>
              <div className="space-y-2">
                {rest.map((region, i) => (
                  <RegionCard
                    key={region.id}
                    region={region}
                    tier="compact"
                    rank={SECONDARY_END + i + 1}
                    /* No stagger when expanded — just a snappy reveal */
                    staggerDelay={0}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

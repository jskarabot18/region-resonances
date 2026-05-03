/**
 * BrowseMode
 *
 * Default state when the user hasn't typed anything. Lists all 59 regions
 * grouped by cluster, with each region showing its metaphor. Clicking a
 * region card opens its full identity narrative.
 *
 * The point of this view is that the tool is useful even without typing —
 * users can graze across the metaphors and stumble into one that resonates.
 * That's a different (and arguably more important) discovery path than
 * the active-typing one.
 */

import { useMemo } from 'react';
import RegionCard from './RegionCard';

// Cluster order chosen for editorial flow: from the most inward/contemplative
// to the most outward/commercial. This isn't arbitrary — it shapes the
// browsing experience as a journey rather than an alphabetical list.
const CLUSTER_ORDER = [
  'Old World Interior',
  'Against the Odds',
  'Old World Exterior',
  'New World Reinvention',
  'The Moderates',
  'Outward Ease',
];

export default function BrowseMode({ regions }) {
  const grouped = useMemo(() => {
    const map = new Map();
    CLUSTER_ORDER.forEach((c) => map.set(c, []));
    for (const r of regions) {
      if (!map.has(r.cluster)) map.set(r.cluster, []);
      // Browse mode displays without similarity scores — give them a
      // neutral score field so the card components stay simple.
      map.get(r.cluster).push({ ...r, score: null });
    }
    // Alphabetise within each cluster
    for (const list of map.values()) {
      list.sort((a, b) => a.region.localeCompare(b.region));
    }
    return Array.from(map.entries()).filter(([, list]) => list.length > 0);
  }, [regions]);

  return (
    <section className="space-y-10">
      <div>
        <p className="small-caps mb-2">Or browse</p>
        <h2 className="font-serif text-2xl text-ink leading-tight">
          The fifty-nine regions, grouped by kinship
        </h2>
        <p className="mt-2 font-serif text-ink-muted leading-relaxed max-w-2xl">
          Each region carries a one-word metaphor — the concept that
          most clearly defines its cultural character. Click any region
          to read its full identity narrative.
        </p>
      </div>

      {grouped.map(([cluster, list]) => (
        <div key={cluster}>
          <h3 className="small-caps mb-3 text-ink-muted">{cluster}</h3>
          <div className="space-y-2">
            {list.map((region) => (
              <RegionCard
                key={region.id}
                region={region}
                tier="compact"
                staggerDelay={0}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

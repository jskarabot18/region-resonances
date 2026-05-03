/**
 * regionLinks.js
 *
 * Helpers for linking out to Region Affinities. The exact URL pattern
 * depends on how Region Affinities accepts a deep-link to a specific
 * region in its Region Atlas tab — this is encapsulated here so we
 * have one place to update if that pattern changes.
 *
 * Currently assumes Region Affinities supports a hash-based deep link:
 *   https://jskarabot18.github.io/region-affinities/#/atlas?region=<id>
 *
 * If the actual scheme differs, only this file needs updating.
 */

const REGION_AFFINITIES_BASE = 'https://jskarabot18.github.io/region-affinities/';

/**
 * Build the deep-link URL into Region Affinities Region Atlas for
 * a specific region.
 */
export function regionAtlasLink(region) {
  // Use both id and a URL-friendly slug so the destination has options
  // for which to honour. id is the canonical identifier.
  return `${REGION_AFFINITIES_BASE}#/atlas?region=${region.id}`;
}

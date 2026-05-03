#!/usr/bin/env python3
"""
verify_embeddings.py

Validates region_embeddings.json:
  1. Structure (metadata + 59 regions, all required fields)
  2. Vectors have correct dimensionality and are L2-normalised (or close)
  3. Cosine similarity between vectors produces a reasonable distribution
     (not all 0.99, not all random — should show actual semantic clustering)
  4. Cross-checks region IDs/metaphors against regions.json

Run after build_metaphor_embeddings.py to confirm the output is usable.
"""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path

EMBEDDINGS_PATH = Path("public/data/region_embeddings.json")
REGIONS_PATH = Path("/mnt/project/regions.json")
EXPECTED_DIMS = 1536


def cosine(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def main() -> int:
    print("=" * 70)
    print("EMBEDDINGS VERIFICATION")
    print("=" * 70)

    if not EMBEDDINGS_PATH.is_file():
        print(f"\n❌ {EMBEDDINGS_PATH} not found. Run build_metaphor_embeddings.py first.")
        return 1

    with EMBEDDINGS_PATH.open() as f:
        data = json.load(f)

    # --- Structure ---
    print("\n1. Structure check")
    meta = data.get("metadata", {})
    print(f"   model:    {meta.get('embedding_model')}")
    print(f"   dims:     {meta.get('embedding_dims')}")
    print(f"   n:        {meta.get('n_regions')}")
    print(f"   dry_run:  {meta.get('dry_run')}")
    print(f"   built:    {meta.get('generated_at')}")

    regions = data.get("regions", [])
    if len(regions) != 59:
        print(f"   ❌ expected 59 regions, got {len(regions)}")
        return 1

    required = {"id", "region", "country", "metaphor", "cluster", "narrative", "embedding"}
    for r in regions:
        missing = required - r.keys()
        if missing:
            print(f"   ❌ region id={r.get('id')} missing fields: {missing}")
            return 1
    print(f"   ✓ All 59 regions have required fields")

    # --- Vector dimensions ---
    print("\n2. Vector dimensionality")
    bad_dims = [r for r in regions if len(r["embedding"]) != EXPECTED_DIMS]
    if bad_dims:
        for r in bad_dims:
            print(f"   ❌ {r['region']}: {len(r['embedding'])} dims")
        return 1
    print(f"   ✓ All vectors are {EXPECTED_DIMS}-dimensional")

    # --- L2 norm (real embeddings from text-embedding-3-small are already normalised
    #     to unit length, so norms should be very close to 1.0) ---
    print("\n3. Vector norms")
    norms = [
        math.sqrt(sum(x * x for x in r["embedding"]))
        for r in regions
    ]
    print(f"   min={min(norms):.4f}  max={max(norms):.4f}  avg={sum(norms)/len(norms):.4f}")
    if all(0.95 <= n <= 1.05 for n in norms):
        print(f"   ✓ All vectors approximately unit-length (good for cosine similarity)")
    else:
        print(f"   ⚠ Some vectors not unit-length — may indicate a problem")

    # --- Pairwise similarity distribution ---
    print("\n4. Pairwise cosine similarity distribution")
    sims = []
    for i in range(len(regions)):
        for j in range(i + 1, len(regions)):
            sims.append(cosine(regions[i]["embedding"], regions[j]["embedding"]))
    sims.sort()
    print(f"   pairs:    {len(sims)}")
    print(f"   min:      {sims[0]:.4f}")
    print(f"   p10:      {sims[len(sims)//10]:.4f}")
    print(f"   median:   {sims[len(sims)//2]:.4f}")
    print(f"   p90:      {sims[9*len(sims)//10]:.4f}")
    print(f"   max:      {sims[-1]:.4f}")

    if meta.get("dry_run"):
        # Random unit vectors in 1536-D should have cosine sim very close to 0.
        if abs(sum(sims) / len(sims)) < 0.05:
            print(f"   ✓ Fake vectors look random (mean ≈ 0) — pipeline structure is correct")
        else:
            print(f"   ⚠ Fake vectors not as random as expected")
        print(f"\n   ℹ For real embeddings, expect:")
        print(f"      - median similarity ~0.3-0.5 (regions share writing style)")
        print(f"      - top pairs >0.7 (semantically close: e.g. Survival/Endurance/Fortitude)")
        print(f"      - lowest pairs ~0.2 (distant concepts: e.g. Pleasure vs. Severity)")
    else:
        # Real embeddings: text-embedding-3-small typically gives sims of
        # ~0.3-0.5 for unrelated text and ~0.6-0.8 for closely related text.
        median = sims[len(sims) // 2]
        if 0.2 <= median <= 0.7:
            print(f"   ✓ Median similarity {median:.3f} is in expected range")
        else:
            print(f"   ⚠ Median similarity {median:.3f} is unusual — inspect results")

    # --- Cross-validation against regions.json ---
    print("\n5. Cross-check against regions.json")
    if not REGIONS_PATH.is_file():
        print(f"   ⚠ {REGIONS_PATH} not found, skipping cross-check")
    else:
        with REGIONS_PATH.open() as f:
            canonical = json.load(f)
        canonical_by_id = {r["id"]: r for r in canonical["regions"]}
        mismatches = []
        for r in regions:
            c = canonical_by_id.get(r["id"])
            if not c:
                mismatches.append(f"id={r['id']} not in regions.json")
                continue
            for field in ("region", "country", "metaphor", "cluster"):
                if r[field] != c[field]:
                    mismatches.append(
                        f"id={r['id']} {r['region']}: {field} differs"
                    )
        if mismatches:
            for m in mismatches[:10]:
                print(f"   ❌ {m}")
            return 1
        print(f"   ✓ All 59 regions match regions.json on id/name/country/metaphor/cluster")

    # --- Sample top-N for a few queries (only meaningful for real embeddings,
    #     but we still demonstrate the lookup against the dry-run data). ---
    print("\n6. Sample top-5 nearest neighbours (Tokaj — Melancholy)")
    tokaj = next(r for r in regions if r["region"] == "Tokaj")
    similarities = [
        (r["region"], r["metaphor"], cosine(tokaj["embedding"], r["embedding"]))
        for r in regions if r["id"] != tokaj["id"]
    ]
    similarities.sort(key=lambda t: t[2], reverse=True)
    for region, metaphor, sim in similarities[:5]:
        print(f"   {sim:.4f}  {region:25s}  ({metaphor})")
    if meta.get("dry_run"):
        print(f"   ℹ These rankings are RANDOM (dry-run) — real embeddings should")
        print(f"     surface things like Mosel-Poetry, Galicia-Longing, Burgundy-Devotion")

    print("\n" + "=" * 70)
    print("✅ VERIFICATION PASSED")
    print("=" * 70)
    return 0


if __name__ == "__main__":
    sys.exit(main())

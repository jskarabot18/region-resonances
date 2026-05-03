#!/usr/bin/env python3
"""Validate layer1-narratives.json against regions.json."""
import json
from pathlib import Path

narratives_path = Path("/home/claude/region-resonances/data/layer1-narratives.json")
regions_path = Path("/mnt/project/regions.json")

with narratives_path.open() as f:
    narratives = json.load(f)

with regions_path.open() as f:
    regions = json.load(f)

print("=" * 70)
print("LAYER 1 NARRATIVES VALIDATION")
print("=" * 70)

# 1. Counts
n_narr = len(narratives["regions"])
n_reg = len(regions["regions"])
print(f"\nRegion count: narratives={n_narr}, regions.json={n_reg}")
assert n_narr == n_reg == 59, f"Expected 59 regions in both"

# 2. Build lookup maps by id
narr_by_id = {r["id"]: r for r in narratives["regions"]}
reg_by_id = {r["id"]: r for r in regions["regions"]}

# 3. Cross-check every region: id, name, country, metaphor, cluster
print("\nCross-checking each region (id, name, country, metaphor, cluster)...")
mismatches = []
for rid in sorted(reg_by_id.keys()):
    r = reg_by_id[rid]
    n = narr_by_id.get(rid)
    if n is None:
        mismatches.append(f"  id={rid}: missing in narratives")
        continue
    for field in ("region", "country", "metaphor", "cluster"):
        if r[field] != n[field]:
            mismatches.append(
                f"  id={rid} {r['region']}: {field} mismatch — "
                f"regions.json='{r[field]}' narratives='{n[field]}'"
            )

if mismatches:
    print(f"  ❌ {len(mismatches)} mismatches:")
    for m in mismatches:
        print(m)
else:
    print(f"  ✓ All 59 regions match on id, name, country, metaphor, cluster")

# 4. Word count check
print("\nWord count check (narrative actual vs declared, target 280-320)...")
wc_issues = []
for rid in sorted(narr_by_id.keys()):
    n = narr_by_id[rid]
    actual_wc = len(n["narrative"].split())
    declared = n["word_count"]
    if not (250 <= actual_wc <= 350):
        wc_issues.append(f"  id={rid} {n['region']}: actual={actual_wc} (out of expected 250-350 range)")
    # large drift between declared and actual
    if abs(actual_wc - declared) > 30:
        wc_issues.append(
            f"  id={rid} {n['region']}: declared={declared} but actual={actual_wc} (drift > 30)"
        )

if wc_issues:
    print(f"  ⚠ {len(wc_issues)} word count concerns:")
    for w in wc_issues:
        print(w)
else:
    print(f"  ✓ All narratives in healthy word-count range")

# 5. Min/max/avg
wcs = [len(n["narrative"].split()) for n in narratives["regions"]]
print(f"\nNarrative length stats (words):")
print(f"  min={min(wcs)}, max={max(wcs)}, avg={sum(wcs)/len(wcs):.1f}")

# 6. Each narrative starts with the region name (sanity)
print("\nNarrative opening sanity check (first 60 chars of each)...")
for rid in sorted(narr_by_id.keys())[:5]:
    n = narr_by_id[rid]
    print(f"  {rid:2d}. {n['region']:25s} → {n['narrative'][:60]}...")
print("  ... (showing first 5)")

# 7. Embedding-input preview for one region
print("\nEmbedding-input preview (Tokaj, what gets sent to the API):")
print("-" * 70)
tokaj = narr_by_id[23]
embedding_input = f"{tokaj['metaphor']}. {tokaj['narrative']}"
print(embedding_input[:400] + "...")
print("-" * 70)
print(f"Total length of Tokaj embedding input: {len(embedding_input)} chars, ~{len(embedding_input.split())} words")

# 8. Total tokens estimate (rough: chars/4)
total_chars = sum(len(f"{n['metaphor']}. {n['narrative']}") for n in narratives["regions"])
print(f"\nTotal embedding-input size across all 59 regions: {total_chars} chars (~{total_chars//4} tokens)")
print(f"Estimated one-time embedding cost at $0.00002/1K tokens: ${(total_chars/4) * 0.00002 / 1000:.6f}")

print("\n" + "=" * 70)
if not mismatches and not wc_issues:
    print("✅ VALIDATION PASSED — file is ready for Step 2 (embedding pipeline)")
else:
    print("⚠ VALIDATION COMPLETED WITH WARNINGS — review above")
print("=" * 70)

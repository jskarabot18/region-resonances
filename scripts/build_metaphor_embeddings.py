#!/usr/bin/env python3
"""
build_metaphor_embeddings.py

Reads layer1-narratives.json, builds the embedding input string for each region
(metaphor + narrative), sends one batched request to OpenAI's embeddings API,
and writes region_embeddings.json — the static data file that ships with the
React app.

Usage:
    # Dry run (no API call, fake vectors — for verifying output structure)
    python build_metaphor_embeddings.py --dry-run

    # Real run (requires OPENAI_API_KEY env var)
    python build_metaphor_embeddings.py

    # Custom paths
    python build_metaphor_embeddings.py \\
        --input  data/layer1-narratives.json \\
        --output public/data/region_embeddings.json

Cost (real run, one-time): ~$0.0006 across all 59 regions at the current
text-embedding-3-small price of $0.00002 / 1K tokens.

Re-run only when metaphors or narratives change.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import random
import sys
import time
from pathlib import Path
from typing import Any

# Embedding model — locked to text-embedding-3-small per planning doc.
# 1536 dimensions, $0.00002 / 1K tokens, 8191-token context.
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMS = 1536


def build_embedding_input(metaphor: str, narrative: str) -> str:
    """
    Concatenate metaphor + narrative into the string that gets embedded.

    Format: "{metaphor}. {narrative}" — matches the planning doc spec.
    Newlines are collapsed to single spaces (the API tolerates them, but
    OpenAI's own example code strips them, so we match that convention
    for reproducibility).
    """
    text = f"{metaphor}. {narrative}"
    # Collapse all whitespace runs (including the \n\n paragraph breaks) to
    # single spaces. This makes the embedding input a single line and
    # avoids any chance of the API treating paragraph breaks as signal.
    text = " ".join(text.split())
    return text


def fake_embedding(seed_text: str, dims: int = EMBEDDING_DIMS) -> list[float]:
    """
    Generate a deterministic fake embedding for dry-run mode.

    Uses the seed text to seed Python's random module so the same input
    always produces the same vector — useful for testing the pipeline
    end-to-end without spending API credits. The vector is L2-normalised
    so cosine similarity behaves sensibly during front-end testing.
    """
    rng = random.Random(seed_text)
    raw = [rng.gauss(0.0, 1.0) for _ in range(dims)]
    norm = math.sqrt(sum(x * x for x in raw))
    return [x / norm for x in raw]


def load_narratives(path: Path) -> dict[str, Any]:
    if not path.is_file():
        sys.exit(f"ERROR: input not found: {path}")
    with path.open(encoding="utf-8") as f:
        data = json.load(f)
    if "regions" not in data or not isinstance(data["regions"], list):
        sys.exit(f"ERROR: {path} missing 'regions' array")
    n = len(data["regions"])
    if n != 59:
        print(f"WARNING: expected 59 regions, found {n}", file=sys.stderr)
    return data


def call_openai(inputs: list[str]) -> list[list[float]]:
    """
    Send a single batched embeddings request and return one vector per input,
    in the same order. Uses the official openai SDK.
    """
    try:
        from openai import OpenAI  # type: ignore
    except ImportError:
        sys.exit(
            "ERROR: openai package not installed.\n"
            "  pip install openai\n"
            "(or use --dry-run to skip the API call)"
        )

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        sys.exit(
            "ERROR: OPENAI_API_KEY environment variable not set.\n"
            "  export OPENAI_API_KEY='sk-...'\n"
            "(or use --dry-run to skip the API call)"
        )

    client = OpenAI(api_key=api_key)

    # text-embedding-3-small accepts batched inputs (up to 2048 items per
    # request, 300K tokens total). 59 * ~470 tokens = ~28K — well within
    # the limit. One request total.
    print(f"  Calling OpenAI ({EMBEDDING_MODEL}) with {len(inputs)} inputs...")
    t0 = time.time()
    resp = client.embeddings.create(input=inputs, model=EMBEDDING_MODEL)
    elapsed = time.time() - t0
    print(f"  ✓ Response received in {elapsed:.2f}s")
    print(f"  Tokens used: {resp.usage.total_tokens} prompt / {resp.usage.total_tokens} total")

    # The API returns data sorted by index; we return embeddings in the same
    # order as inputs. Verify rather than trust.
    vectors = [None] * len(inputs)
    for item in resp.data:
        vectors[item.index] = item.embedding
    if any(v is None for v in vectors):
        sys.exit("ERROR: API response missing embeddings for some indices")

    # Sanity-check dimensions.
    for i, v in enumerate(vectors):
        if len(v) != EMBEDDING_DIMS:
            sys.exit(
                f"ERROR: embedding {i} has {len(v)} dims, "
                f"expected {EMBEDDING_DIMS}"
            )

    return vectors


def build(input_path: Path, output_path: Path, dry_run: bool) -> None:
    print(f"Loading narratives from {input_path}...")
    data = load_narratives(input_path)
    regions = data["regions"]
    print(f"  Loaded {len(regions)} regions")

    print("Building embedding inputs...")
    inputs = [
        build_embedding_input(r["metaphor"], r["narrative"])
        for r in regions
    ]
    total_chars = sum(len(s) for s in inputs)
    approx_tokens = total_chars // 4
    print(f"  Total: {total_chars} chars (~{approx_tokens} tokens)")

    if dry_run:
        print("DRY RUN: generating deterministic fake vectors (no API call)...")
        vectors = [fake_embedding(s) for s in inputs]
    else:
        cost = approx_tokens * 0.00002 / 1000
        print(f"  Estimated cost: ${cost:.6f} at $0.00002 / 1K tokens")
        vectors = call_openai(inputs)

    # Build the output payload. Each region carries everything the React app
    # needs at runtime: metaphor, narrative, cluster, embedding. Identity and
    # terroir cluster live in regions.json; the React app can join on `id` if
    # it needs them, but for self-containment we copy `cluster` here.
    out_regions = []
    for r, vec in zip(regions, vectors):
        out_regions.append({
            "id": r["id"],
            "region": r["region"],
            "country": r["country"],
            "metaphor": r["metaphor"],
            "cluster": r["cluster"],
            "narrative": r["narrative"],
            "embedding": vec,
        })

    payload = {
        "metadata": {
            "source": "Region Resonances — pre-computed embeddings",
            "embedding_model": EMBEDDING_MODEL,
            "embedding_dims": EMBEDDING_DIMS,
            "n_regions": len(out_regions),
            "input_format": "{metaphor}. {narrative}",
            "dry_run": dry_run,
            "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        },
        "regions": out_regions,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        # Compact embeddings (no per-float pretty-printing) but human-readable
        # structure. Saves ~40% on file size vs. indent=2 throughout.
        json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))

    size_kb = output_path.stat().st_size / 1024
    print(f"\n✓ Wrote {output_path}")
    print(f"  Size: {size_kb:.1f} KB")
    print(f"  Regions: {len(out_regions)}")
    print(f"  Vector dims: {EMBEDDING_DIMS}")
    if dry_run:
        print("\n⚠ DRY RUN — vectors are FAKE. Re-run without --dry-run for real embeddings.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Build region_embeddings.json from layer1-narratives.json",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "--input", "-i",
        type=Path,
        default=Path("data/layer1-narratives.json"),
        help="Path to layer1-narratives.json (default: data/layer1-narratives.json)",
    )
    parser.add_argument(
        "--output", "-o",
        type=Path,
        default=Path("public/data/region_embeddings.json"),
        help="Path to write region_embeddings.json (default: public/data/region_embeddings.json)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Generate deterministic fake vectors instead of calling the API",
    )
    args = parser.parse_args()

    build(args.input.resolve(), args.output.resolve(), args.dry_run)


if __name__ == "__main__":
    main()

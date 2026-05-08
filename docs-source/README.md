# docs-source

LaTeX sources for the four PDFs in this repo's documentation set.

## Files

- `RegionResonances_Summary.tex` — plain-language overview
- `RegionResonances_Technical_Appendix.tex` — algorithms and computation
- `RegionResonances_Methods_Primer.tex` — guide to the methods
- `RegionResonances_Data_Appendix.tex` — sources and edge tables
- `vinotheca-preamble.tex` — shared family preamble (typography, colours, environments)

The shared preamble is identical to the copies in `region-affinities` and
`tasterank-explorer`. If amended, all three copies should be updated together.

## Recompiling

Each `.tex` file compiles to a same-name `.pdf` in this repo. From inside
the `docs-source/` directory:

```bash
pdflatex -interaction=nonstopmode RegionResonances_Summary.tex
pdflatex -interaction=nonstopmode RegionResonances_Summary.tex   # second pass for refs
mv RegionResonances_Summary.pdf ../app/public/docs/
```

Run twice for cross-references and ToC. Then move the `.pdf` to
`app/public/docs/` (where the deployed Header.jsx links it) and clean up
the auxiliary files (`*.aux`, `*.log`, `*.out`, `*.toc`).

## Editing

The shared preamble defines:
- typography (EB Garamond body, Cormorant Garamond display, IM Fell English SC for small caps)
- the `wine` accent colour
- shared environments (`\frontmatter`, `\methodsbox`, etc.)

Changes to the preamble affect all four documents — recompile all of them.

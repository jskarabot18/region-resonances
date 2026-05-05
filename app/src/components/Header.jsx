import { useState, useRef, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Header — Vinotheca-family banner.
//
// Matches region-affinities Header.jsx structure:
//   - TopStrip with wordmark, Vinotheca link, Documentation dropdown
//   - Title block: eyebrow ("A Tool of The Soul of Wine"), mixed-italic
//     title ("Region Resonances"), subtitle with structural prose
//
// Region Resonances has no tab navigation (single view), so the tab nav
// from region-affinities is omitted — title block sits directly above the
// main content area.
//
// Documentation menu: three documents.
//   1. Methodology and Interpretation — companion document for general
//      readers, explaining the matching procedure conceptually.
//   2. Technical Appendix — mathematical concepts behind the procedure.
//   3. Region Profiles — Identity (Layer 1) — the source text the matcher
//      operates on. Other Soul of Wine PDFs (terroir, technical, narrative,
//      methods) are out of scope for this tool's purpose, so we don't
//      expose them here.
//
// PDF link convention: always append #page=1 so the browser forces page 1
// instead of remembering the user's last scroll position from a prior visit.
// Local PDFs live in app/public/docs/ and are served at <BASE>docs/* by Vite.
// We prefix with import.meta.env.BASE_URL so the same code works both in
// local dev (BASE_URL = '/') and on GitHub Pages (BASE_URL = '/region-resonances/').
// ---------------------------------------------------------------------------

const SOUL_OF_WINE_BASE = 'https://jskarabot18.github.io/soul-of-wine';
const BASE = import.meta.env.BASE_URL;

// Region Resonances ships its own methodology and technical primer, plus
// the Layer 1 Identity narratives from the parent project (the source text
// for the semantic matcher).
const DOCS = [
  { label: 'Methodology and Interpretation', href: `${BASE}docs/region_resonances_methodology.pdf#page=1` },
  { label: 'Technical Appendix',             href: `${BASE}docs/region_resonances_technical.pdf#page=1` },
  { label: 'Region Profiles — Identity',     href: `${SOUL_OF_WINE_BASE}/docs/layer1-descriptions.pdf#page=1` },
];

export default function Header() {
  return (
    <header>
      <TopStrip />

      <div className="bg-parchment-warm border-b border-parchment-edge">
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-8">
          <div className="flex items-baseline gap-4 mb-1">
            <p className="small-caps text-wine">A Tool of The Soul of Wine</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic mb-2">
            Region <span className="not-italic font-semibold">Resonances</span>
          </h1>
          <p className="text-ink-muted text-base md:text-lg max-w-2xl leading-relaxed">
            Type a word, a phrase, a feeling.
            <span className="text-ink-subtle">
              {' '}· Find the wine regions whose identities echo it.
            </span>
          </p>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// TopStrip — wordmark + Vinotheca link + Documentation dropdown
// ---------------------------------------------------------------------------

function TopStrip() {
  return (
    <div className="bg-parchment border-b border-parchment-edge">
      <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
        <span className="font-serif italic text-lg text-wine tracking-tight">
          Region Resonances
        </span>

        <div className="flex items-center gap-1 text-xs font-sans">
          {/* Vinotheca is parent navigation — use same tab, not a new one */}
          <a
            href="https://jskarabot18.github.io/vinotheca/"
            className="px-3 py-2 uppercase tracking-widest text-ink-muted hover:text-wine transition-colors"
          >
            Vinotheca
          </a>
          <span className="text-ink-subtle">·</span>
          <DocumentationDropdown />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DocumentationDropdown — opens on click, closes on outside click / Escape
// ---------------------------------------------------------------------------

function DocumentationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="px-3 py-2 uppercase tracking-widest text-ink-muted hover:text-wine
                   transition-colors flex items-center gap-1.5"
      >
        Documentation
        <svg viewBox="0 0 10 6" className="w-2.5 h-1.5" fill="currentColor" aria-hidden="true">
          <path d="M0 0 L5 6 L10 0 Z" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 w-72 bg-parchment border border-parchment-edge
                     rounded-md shadow-lg z-50 overflow-hidden"
        >
          {DOCS.map((doc) => (
            <a
              key={doc.label}
              href={doc.href}
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-serif text-ink hover:bg-parchment-warm
                         hover:text-wine border-b border-parchment-edge last:border-b-0
                         normal-case tracking-normal"
            >
              {doc.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

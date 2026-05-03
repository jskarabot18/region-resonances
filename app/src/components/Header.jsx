/**
 * Header
 *
 * Top of every page. Consistent with region-affinities visual language:
 * serif title, .small-caps subtitle, and a thin parchment-edge border below.
 *
 * The subtitle's max-width is set so it breaks at a natural line, avoiding
 * an orphan "own." on its own line at typical desktop widths.
 */
export default function Header() {
  return (
    <header className="border-b border-parchment-edge bg-parchment">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-baseline justify-between gap-6">
          <div>
            <p className="small-caps mb-1">The Soul of Wine</p>
            <h1 className="font-serif text-4xl text-ink leading-tight">
              Region Resonances
            </h1>
          </div>

          <nav className="hidden sm:flex items-baseline gap-1">
            <a
              href="https://jskarabot18.github.io/soul-of-wine/"
              className="nav-link"
            >
              Soul of Wine
            </a>
            <a
              href="https://jskarabot18.github.io/region-affinities/"
              className="nav-link"
            >
              Region Affinities
            </a>
          </nav>
        </div>

        {/*
          max-w-xl (~36rem / ~576px) gives the subtitle a deliberate measure
          so it wraps at a natural point. Avoids the orphan-word problem
          that occurs at full-width with the previous max-w-2xl.
        */}
        <p className="mt-3 text-ink-muted text-base italic max-w-xl">
          Discover wine regions through resonance — a word, a phrase, a
          feeling, and the regions whose identities echo your own.
        </p>
      </div>
    </header>
  );
}

/**
 * Footer
 *
 * Brief, editorial. Includes the project attribution and a
 * small note on how the matching works (so curious users have
 * a thread to pull on without it dominating the layout).
 */
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-parchment-edge bg-parchment">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-ink-muted">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <p>
            <span className="small-caps">Region Resonances</span>
            <span className="mx-2 text-ink-subtle">·</span>
            A Vinotheca companion tool by Jure Skarabot
          </p>
          <p className="text-ink-subtle font-sans text-xs tracking-wide">
            Matching uses semantic embeddings of the 59 region narratives.
            Nothing you type is stored.
          </p>
        </div>
      </div>
    </footer>
  );
}

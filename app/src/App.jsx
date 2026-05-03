/**
 * App
 *
 * The orchestrator. Holds the user's query state, debounces it, fires
 * the embedding API call, and renders either browse mode or results.
 *
 * Logic flow:
 *   user types → query state updates immediately (controlled input)
 *   → useDebouncedValue waits 600ms of stillness
 *   → debounced query fires fetchQueryEmbedding (cancellable via AbortController)
 *   → on response, rank all regions and render results
 *   → if query is empty, fall back to browse mode
 *
 * Behaviour on error:
 *   - If we have previous successful results, keep them visible and show
 *     the error message in the input panel. This is "Google" behaviour —
 *     a failed request shouldn't yank the user back to a blank state.
 *   - If we never had results, the input panel error is the only feedback;
 *     the right column shows nothing rather than reverting to browse mode
 *     (which would be confusing — the user clearly has a query in flight).
 */

import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import BrowseMode from './components/BrowseMode';
import { useEmbeddings } from './lib/useEmbeddings';
import { useDebouncedValue } from './lib/useDebouncedValue';
import { fetchQueryEmbedding, EmbeddingError } from './lib/api';
import { rankRegionsByQuery } from './lib/matcher';

// 600ms gives users enough time to type compound phrases ("the feeling
// of late summer") without firing intermediate requests, while still
// feeling responsive after a true pause.
const DEBOUNCE_MS = 600;

export default function App() {
  const { regions, loading: embeddingsLoading, error: embeddingsError } = useEmbeddings();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS);

  const [ranked, setRanked] = useState(null);
  const [status, setStatus] = useState('idle');     // 'idle' | 'loading' | 'error' | 'ready'
  const [errorMessage, setErrorMessage] = useState(null);

  const abortRef = useRef(null);

  useEffect(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      // Query cleared — return to idle state. Drop ranked so browse renders.
      setRanked(null);
      setStatus('idle');
      setErrorMessage(null);
      return;
    }
    if (!regions) {
      // Embeddings haven't loaded yet — do nothing; effect will re-run
      // when `regions` becomes available.
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('loading');
    setErrorMessage(null);

    fetchQueryEmbedding(trimmed, controller.signal)
      .then((vector) => {
        if (controller.signal.aborted) return;
        const result = rankRegionsByQuery(vector, regions);
        setRanked(result);
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        // Note: we deliberately do NOT clear `ranked` here. If the user
        // had a successful previous query, we keep those results visible
        // so a transient failure doesn't yank them back to blank state.
        setStatus('error');
        if (err instanceof EmbeddingError) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage('Something unexpected happened.');
        }
      });

    return () => controller.abort();
  }, [debouncedQuery, regions]);

  // Decide which mode to render:
  //   - Have ranked results → show them (regardless of current status; this
  //     keeps stale results visible during a new request or error).
  //   - No ranked results AND query is empty → browse mode.
  //   - No ranked results AND query exists → show nothing in the right
  //     column (the input panel is showing 'Listening…' or an error).
  const showResults = ranked && ranked.length > 0;
  const queryIsEmpty = debouncedQuery.trim().length === 0;
  const showBrowse = !showResults && queryIsEmpty && regions;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        {embeddingsError && (
          <div className="card p-6 max-w-2xl">
            <p className="font-serif text-wine text-lg">
              Couldn't load the regions.
            </p>
            <p className="mt-2 text-ink-muted text-sm">
              {embeddingsError}. Try refreshing the page.
            </p>
          </div>
        )}

        {embeddingsLoading && !embeddingsError && (
          <p className="text-ink-subtle italic font-serif">
            Gathering the fifty-nine regions…
          </p>
        )}

        {regions && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
              <InputPanel
                query={query}
                onQueryChange={setQuery}
                status={status}
                errorMessage={errorMessage}
              />
            </div>
            <div className="lg:col-span-2">
              {showResults && <ResultsPanel ranked={ranked} />}
              {showBrowse && <BrowseMode regions={regions} />}
              {/*
                The remaining case — query is set but no results yet
                (loading, or first-ever request errored) — intentionally
                renders nothing here. The input panel handles status
                feedback for that state.
              */}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

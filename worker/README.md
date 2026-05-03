# Region Resonances — Embedding Proxy

A Cloudflare Worker that proxies user queries to OpenAI's embeddings API. The browser cannot call OpenAI directly because that would expose the API key; this Worker holds the key, rate-limits, and restricts CORS.

## What it does

```
Browser                 Cloudflare Worker             OpenAI
  │                            │                         │
  │  POST { query: "old soul" }│                         │
  ├───────────────────────────>│                         │
  │                            │ ① Check origin (CORS)   │
  │                            │ ② Check rate limit      │
  │                            │ ③ Validate query        │
  │                            │                         │
  │                            │  POST embeddings        │
  │                            ├────────────────────────>│
  │                            │  Bearer sk-...          │
  │                            │                         │
  │                            │   { embedding: [...] }  │
  │                            │<────────────────────────┤
  │                            │                         │
  │   { embedding: [...] }     │                         │
  │<───────────────────────────┤                         │
```

## Files

```
worker/
├── src/index.js      ← the Worker code (~150 lines, single function)
├── wrangler.toml     ← Cloudflare config (name, compat date, rate limit)
├── package.json      ← wrangler dev dependency
└── README.md         ← this file
```

## First-time setup

```bash
# 1. From the worker/ directory, install wrangler
npm install

# 2. Authenticate with your Cloudflare account
npx wrangler login

# 3. Store the OpenAI API key as an encrypted secret
#    (Wrangler will prompt you to paste the key; it never goes in source.)
npx wrangler secret put OPENAI_API_KEY

# 4. Deploy
npx wrangler deploy
```

After step 4, Wrangler prints the deployed URL — something like
`https://region-resonances-proxy.<your-subdomain>.workers.dev`. That's
what the React app will call.

## Local development

```bash
npx wrangler dev
```

This starts the Worker on `http://localhost:8787`. You'll need to also
add localhost to the Worker's CORS allowlist (already done in
`src/index.js`).

For the OpenAI key in dev, either set it as a secret first (it will be
read in `wrangler dev` too) or create a `.dev.vars` file:

```
# .dev.vars  (gitignored — never commit)
OPENAI_API_KEY=sk-...
```

## Testing the deployed Worker

```bash
curl -X POST https://region-resonances-proxy.<subdomain>.workers.dev \
  -H "Content-Type: application/json" \
  -H "Origin: https://jskarabot18.github.io" \
  -d '{"query": "old soul"}'
```

Expected response:

```json
{
  "embedding": [0.0023, -0.0091, ..., -0.0028],
  "usage": { "prompt_tokens": 3, "total_tokens": 3 },
  "model": "text-embedding-3-small"
}
```

Without the `Origin` header, you should still get a valid response (curl
isn't subject to CORS). Adding an `Origin` not on the allowlist should
return 403.

## Watching the logs

```bash
npx wrangler tail
```

Streams live request logs from production. Useful when debugging issues
or watching for abuse patterns.

## Cost & limits

- **Cloudflare Workers free tier**: 100,000 requests/day. Plenty.
- **OpenAI embeddings (`text-embedding-3-small`)**: $0.00002 / 1K tokens.
  A typical query is ~5 tokens → effectively free.
- **Rate limit**: 10 req/min per IP. Adjust in `wrangler.toml` under
  `[[ratelimits]]` if you need to tune it.

At rate-limit-saturating rates from a single IP, monthly OpenAI cost
would be about $0.005 — and Cloudflare's free tier wouldn't be
threatened either.

## Security notes

- The OpenAI key never appears in source. `wrangler secret put` stores
  it encrypted in Cloudflare's edge.
- CORS allowlist is enforced both via Access-Control-Allow-Origin (browser
  enforcement) and a server-side origin check (which catches non-browser
  clients).
- Rate limit defends against budget exhaustion.
- Query length is capped at 500 characters — defends against using the
  proxy as a free generic-embeddings API.
- OpenAI error bodies are not surfaced to the client (could leak account
  details in edge cases); they go to Worker logs instead.

## Adjusting things

- **Add a domain to CORS**: edit `ALLOWED_ORIGINS` in `src/index.js`.
- **Change rate limit**: edit `simple = { limit = ..., period = ... }` in
  `wrangler.toml`. Redeploy.
- **Change query length cap**: edit `MAX_QUERY_LENGTH` in `src/index.js`.
- **Switch embedding model**: edit `EMBEDDING_MODEL` in `src/index.js`.
  Make sure the React app's pre-computed `region_embeddings.json` was
  built with the same model — mixing models will give junk results.

/**
 * Region Resonances — embedding proxy
 *
 * A thin Cloudflare Worker that:
 *   1. Holds the OpenAI API key (injected as a secret, never in source)
 *   2. Restricts CORS to known Vinotheca origins
 *   3. Rate-limits per IP via Cloudflare's native rate-limit binding
 *   4. Validates the user query is a sane length / content-type
 *   5. Forwards to OpenAI's embeddings endpoint and returns the vector
 *
 * The browser POSTs:
 *   { "query": "old soul" }
 * and gets back:
 *   { "embedding": [1536 floats], "usage": { "total_tokens": 5 } }
 *
 * Why a Worker at all? If the OpenAI key were in browser JS, anyone could
 * scrape it and burn the budget. This Worker is the only thing on the
 * internet that knows the key.
 */

const EMBEDDING_MODEL = "text-embedding-3-small";

// Hard cap on user query length (in characters). Embedding model accepts up
// to ~8000 tokens but a search query has no business being that long, and
// a small cap defends against someone trying to use the proxy as a free
// generic-embeddings API.
const MAX_QUERY_LENGTH = 500;

// CORS allowlist. Add domains here as the tool gets deployed elsewhere.
// Localhost is included so `npm run dev` works during development.
const ALLOWED_ORIGINS = new Set([
  "https://jskarabot18.github.io",        // GitHub Pages (Soul of Wine / Vinotheca)
  "http://localhost:5173",                 // Vite default dev port
  "http://localhost:3000",                 // Common alternate dev port
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
]);

/**
 * Build the CORS headers for a given origin. If the origin isn't on the
 * allowlist, returns headers with no Access-Control-Allow-Origin — the
 * browser will then block the response.
 */
function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",  // cache preflight 24h
    "Vary": "Origin",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin");

    // --- CORS preflight ---
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // --- Method gate ---
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, origin);
    }

    // --- Origin gate ---
    // The CORS headers handle browser enforcement, but a non-browser client
    // (curl, scrapers) ignores CORS — so we also reject server-side. This
    // is defence-in-depth; the real protection is the rate limit and the
    // fact that the API key never leaves the Worker.
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return jsonResponse({ error: "Origin not allowed" }, 403, origin);
    }

    // --- Rate limit by client IP ---
    // Cloudflare's CF-Connecting-IP header gives the real client IP.
    // 10 req/min per IP is plenty for an interactive search tool — it
    // allows debounced auto-match comfortably while making scraping
    // unprofitable. Configure the actual numbers in wrangler.toml.
    const clientIp =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For") ||
      "unknown";

    const { success: notLimited } = await env.RATE_LIMITER.limit({
      key: clientIp,
    });
    if (!notLimited) {
      return jsonResponse(
        { error: "Rate limit exceeded. Try again in a moment." },
        429,
        origin,
      );
    }

    // --- Parse + validate body ---
    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin);
    }

    const query = payload?.query;
    if (typeof query !== "string") {
      return jsonResponse(
        { error: "Missing or invalid 'query' (must be a string)" },
        400,
        origin,
      );
    }

    const trimmed = query.trim();
    if (trimmed.length === 0) {
      return jsonResponse({ error: "Query cannot be empty" }, 400, origin);
    }
    if (trimmed.length > MAX_QUERY_LENGTH) {
      return jsonResponse(
        { error: `Query too long (max ${MAX_QUERY_LENGTH} characters)` },
        400,
        origin,
      );
    }

    // --- Call OpenAI ---
    let openaiResponse;
    try {
      openaiResponse = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          input: trimmed,
        }),
      });
    } catch (err) {
      // Network error reaching OpenAI. Surface a generic error to the
      // client; the real error goes to Worker logs via Cloudflare.
      console.error("OpenAI fetch failed:", err);
      return jsonResponse(
        { error: "Upstream service unavailable" },
        502,
        origin,
      );
    }

    if (!openaiResponse.ok) {
      // Don't leak OpenAI's error body to the client (could include account
      // info in some edge cases). Log it server-side, return a clean error.
      const errorText = await openaiResponse.text();
      console.error(
        `OpenAI error ${openaiResponse.status}: ${errorText.slice(0, 500)}`,
      );
      // 401/403 from OpenAI = our key is bad → that's our problem, not theirs
      const status = openaiResponse.status >= 500 ? 502 : 500;
      return jsonResponse(
        { error: "Embedding service error" },
        status,
        origin,
      );
    }

    const data = await openaiResponse.json();
    const embedding = data?.data?.[0]?.embedding;
    if (!Array.isArray(embedding)) {
      console.error("Unexpected OpenAI response shape:", JSON.stringify(data).slice(0, 500));
      return jsonResponse(
        { error: "Embedding service returned unexpected response" },
        502,
        origin,
      );
    }

    // --- Return the vector ---
    return jsonResponse(
      {
        embedding,
        usage: data.usage,
        model: EMBEDDING_MODEL,
      },
      200,
      origin,
    );
  },
};

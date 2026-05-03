/**
 * test-worker.mjs
 *
 * Lightweight smoke tests for the Worker logic. Stubs out env.RATE_LIMITER
 * and env.OPENAI_API_KEY so we can exercise CORS, validation, and error
 * paths without deploying.
 *
 * Run:   node test-worker.mjs
 *
 * NOTE: This does NOT call OpenAI — when the Worker would forward the
 * request, we intercept and return a fake embedding. The point is to
 * verify our request handling, not to verify OpenAI works.
 */

import worker from "./src/index.js";

// --- Stubs ---

// Stub env: a fake rate limiter that always succeeds, plus a fake API key.
function makeEnv(opts = {}) {
  return {
    OPENAI_API_KEY: "sk-fake-test-key",
    RATE_LIMITER: {
      limit: async ({ key }) => ({ success: opts.allowRate ?? true }),
    },
  };
}

// Stub fetch: intercept calls to api.openai.com and return a fake response
// with a 1536-D zero vector. Pass `failMode` to simulate failure paths.
function installFetchStub({ failMode = null } = {}) {
  const original = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    if (typeof url === "string" && url.includes("api.openai.com")) {
      if (failMode === "network") throw new Error("Simulated network failure");
      if (failMode === "401") {
        return new Response("Bad key", { status: 401 });
      }
      if (failMode === "500") {
        return new Response("Server error", { status: 500 });
      }
      if (failMode === "malformed") {
        return new Response(JSON.stringify({ wrong: "shape" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      const body = JSON.parse(init.body);
      const fakeEmbedding = Array(1536).fill(0);
      return new Response(
        JSON.stringify({
          object: "list",
          data: [{ object: "embedding", embedding: fakeEmbedding, index: 0 }],
          model: "text-embedding-3-small",
          usage: { prompt_tokens: body.input.length, total_tokens: body.input.length },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    return original(url, init);
  };
  return () => { globalThis.fetch = original; };
}

// --- Test helpers ---

let pass = 0, fail = 0;
function assert(cond, label) {
  if (cond) { pass++; console.log(`  ✓ ${label}`); }
  else      { fail++; console.log(`  ✗ ${label}`); }
}

function makeRequest(body, { method = "POST", origin = "https://jskarabot18.github.io" } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (origin) headers["Origin"] = origin;
  headers["CF-Connecting-IP"] = "192.0.2.1";
  return new Request("https://worker.example.com/", {
    method,
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

// --- Tests ---

console.log("\n[1] CORS preflight");
{
  const req = new Request("https://worker.example.com/", {
    method: "OPTIONS",
    headers: { "Origin": "https://jskarabot18.github.io" },
  });
  const res = await worker.fetch(req, makeEnv());
  assert(res.status === 204, "returns 204 for OPTIONS");
  assert(
    res.headers.get("Access-Control-Allow-Origin") === "https://jskarabot18.github.io",
    "echoes allowed origin"
  );
}

console.log("\n[2] CORS for disallowed origin");
{
  const req = new Request("https://worker.example.com/", {
    method: "OPTIONS",
    headers: { "Origin": "https://evil.example.com" },
  });
  const res = await worker.fetch(req, makeEnv());
  assert(
    !res.headers.get("Access-Control-Allow-Origin"),
    "no Allow-Origin header for disallowed origin"
  );
}

console.log("\n[3] Method gate — GET rejected");
{
  const res = await worker.fetch(
    new Request("https://worker.example.com/", { method: "GET" }),
    makeEnv()
  );
  assert(res.status === 405, "returns 405 for GET");
}

console.log("\n[4] Origin gate — server-side rejection of bad origin");
{
  const req = makeRequest({ query: "anything" }, { origin: "https://evil.example.com" });
  const res = await worker.fetch(req, makeEnv());
  assert(res.status === 403, "returns 403 for non-allowlisted origin");
}

console.log("\n[5] Rate limit triggered");
{
  const req = makeRequest({ query: "anything" });
  const res = await worker.fetch(req, makeEnv({ allowRate: false }));
  assert(res.status === 429, "returns 429 when rate-limited");
}

console.log("\n[6] Body validation");
{
  // invalid JSON
  const r1 = await worker.fetch(makeRequest("not json"), makeEnv());
  assert(r1.status === 400, "rejects invalid JSON");

  // missing query
  const r2 = await worker.fetch(makeRequest({}), makeEnv());
  assert(r2.status === 400, "rejects missing query");

  // non-string query
  const r3 = await worker.fetch(makeRequest({ query: 42 }), makeEnv());
  assert(r3.status === 400, "rejects non-string query");

  // empty query
  const r4 = await worker.fetch(makeRequest({ query: "   " }), makeEnv());
  assert(r4.status === 400, "rejects empty/whitespace query");

  // overlong query
  const r5 = await worker.fetch(makeRequest({ query: "x".repeat(501) }), makeEnv());
  assert(r5.status === 400, "rejects query > 500 chars");
}

console.log("\n[7] Successful round-trip (with stubbed OpenAI)");
{
  const restore = installFetchStub();
  try {
    const res = await worker.fetch(makeRequest({ query: "old soul" }), makeEnv());
    assert(res.status === 200, "returns 200 on success");
    const body = await res.json();
    assert(Array.isArray(body.embedding), "response has embedding array");
    assert(body.embedding.length === 1536, "embedding has 1536 dims");
    assert(body.model === "text-embedding-3-small", "response includes model");
    assert(body.usage?.total_tokens > 0, "response includes usage");
    assert(
      res.headers.get("Access-Control-Allow-Origin") === "https://jskarabot18.github.io",
      "CORS header present on success response"
    );
  } finally {
    restore();
  }
}

console.log("\n[8] Upstream failure modes");
{
  // OpenAI network failure → 502
  let restore = installFetchStub({ failMode: "network" });
  try {
    const res = await worker.fetch(makeRequest({ query: "test" }), makeEnv());
    assert(res.status === 502, "network failure → 502");
  } finally { restore(); }

  // OpenAI 401 (bad key) → 500 (our problem, not theirs)
  restore = installFetchStub({ failMode: "401" });
  try {
    const res = await worker.fetch(makeRequest({ query: "test" }), makeEnv());
    assert(res.status === 500, "OpenAI 401 → our 500");
    const body = await res.json();
    assert(!JSON.stringify(body).includes("Bad key"), "doesn't leak upstream error body");
  } finally { restore(); }

  // OpenAI 500 → 502 (upstream is down)
  restore = installFetchStub({ failMode: "500" });
  try {
    const res = await worker.fetch(makeRequest({ query: "test" }), makeEnv());
    assert(res.status === 502, "OpenAI 500 → our 502");
  } finally { restore(); }

  // OpenAI returns malformed JSON → 502
  restore = installFetchStub({ failMode: "malformed" });
  try {
    const res = await worker.fetch(makeRequest({ query: "test" }), makeEnv());
    assert(res.status === 502, "malformed OpenAI response → 502");
  } finally { restore(); }
}

console.log("\n--------------------------------------------------");
console.log(`${pass} passed, ${fail} failed`);
console.log("--------------------------------------------------");
process.exit(fail === 0 ? 0 : 1);

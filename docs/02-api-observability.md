# 02 — API observability and vendor de-risking

**Goal:** when the QuikTrak API changes or breaks, we know within minutes *which endpoint*, *what changed*,
*how many customers are affected*, and we can either fix it server-side without an app release or hand the vendor
an evidence package they cannot argue with.

There are five layers. Build them in this order; each one is useful on its own.

---

## Layer 1 — One instrumented HTTP client and an endpoint registry

Today every call in `api/*.ts` constructs its own axios call with its own host, verb, content-type and error
handling. Nothing knows what an "endpoint" is, so nothing can report on one.

### 1.1 Endpoint registry (`api/registry.ts`)

A single declarative inventory — the source of truth for the app, the monitor, the alerting and the vendor
incident reports.

```ts
export const Endpoints = {
  AUTH_LOGIN: {
    id: "auth.login",
    host: "prod",              // "prod" | "upload" | "osrm" — never "test"
    path: "/Quikloc8/V1/user/Auth2",
    method: "GET",
    encoding: "query",         // query | form-data | url-encoded | json
    critical: true,            // failure = app unusable
    timeoutMs: 15000,
    retries: 1,
    schema: LoginResponseSchema,
  },
  ASSETS_DYNAMIC: { id: "assets.dynamic", ... critical: true,  schema: DynamicAssetRowSchema },
  ASSETS_STATIC:  { id: "assets.static",  ... critical: true,  schema: StaticAssetRowSchema },
  ASSET_EDIT:     { id: "assets.edit",    ... critical: false, schema: EditAssetResponseSchema },
  // ...one entry per call currently in api/*.ts (about 35)
} as const;
```

Deliverables: every call site in `api/*.ts` migrates to `request(Endpoints.X, params)`. No axios calls outside
`api/client.ts`. Add an ESLint rule banning `axios` imports outside that file so it stays true.

### 1.2 The client (`api/client.ts`)

One axios instance with interceptors that give every call, for free:

- **Correlation id** — a per-request UUID sent as `X-Request-Id` and attached to every log/event/alert, so a
  customer complaint can be traced to an exact request.
- **Timing** — `startedAt`/`durationMs`.
- **Timeouts and retry** — per-endpoint, exponential backoff, retry only idempotent GETs and only on network
  errors/5xx, never on a vendor `MajorCode` failure.
- **Typed errors** — replace the bare `throw` in `api/utils.ts` with:

```ts
export class ApiError extends Error {
  constructor(readonly detail: {
    endpointId: string;
    kind: "network" | "timeout" | "http" | "vendor" | "contract" | "auth";
    httpStatus?: number;
    majorCode?: string;
    minorCode?: string;
    vendorMessage?: string;
    correlationId: string;
    durationMs: number;
    contractIssues?: ContractIssue[];
  }) { super(`${detail.endpointId}:${detail.kind}`); }
}
```

  `kind` is what makes triage instant. `network`/`timeout` → the customer's connection or the vendor is down.
  `http` → the vendor's infrastructure. `vendor` → a business-rule rejection we should surface to the user.
  `contract` → **the vendor changed their API**; this one always pages us.
- **Redaction** — a single scrubber strips `Password`, `MinorToken`, `MajorToken`, `DealerToken`, `deviceToken`
  and email addresses from anything that leaves the device. Write this once, in the client, and never think
  about it again.

### 1.3 Fix the known-bad call sites while migrating

- Repoint `loadAssetAlarms` (`api/assets.ts:93`), `loadAssetInfo` (`api/assets.ts:126`) and
  `functions/src/apis/assets.ts:36` off `testapi.quiktrak.co`. If the vendor has no production equivalent,
  that is itself a finding to escalate — and it goes in the registry as `host: "test"` with a loud startup warning
  so we can never forget again.
- Give `api/playback.ts` OSRM call a timeout and a fallback to unsnapped points instead of failing playback.

**Effort:** ~5–8 days. Touches `api/*` only.

---

## Layer 2 — Contract validation (the thing that catches silent breakage)

This is the layer that addresses R1, and it is the highest-value part of this whole document.

### 2.1 Runtime schemas

Add `zod` (~12kB gzipped) and declare a schema per endpoint response, derived from the existing types in
`types/index.ts`. Validation runs on **every** response in every build — not just debug. The cost is
microseconds; the benefit is that a shape change becomes a loud, attributable event instead of corrupted UI.

### 2.2 Positional arrays get a dedicated decoder

The asset arrays cannot be validated by shape alone — they are just `string[]`. So we validate by **arity and
sentinel fields**:

```ts
// api/decoders/staticAsset.ts
export const STATIC_ASSET_ARITY = 84;          // assert exact length
export const STATIC_ASSET_SENTINELS = [
  { index: 1, name: "imei",  test: (v) => /^\d{14,17}$/.test(v) },
  { index: 5, name: "speedUnit", test: (v) => ["KT","KPH","MPS","MPH"].includes(v) },
  { index: 9, name: "activationDate", test: (v) => !v || isParseableDate(v) },
  // ...8-12 well-spread sentinels, including near the end of the array
];
```

- **Arity mismatch** → the vendor added or removed a column. Emit `contract.arity_changed`, refuse to map the
  row, and fall back to the last known-good persisted asset list rather than showing garbage.
- **Sentinel mismatch** → columns shifted even though the count is the same (an insert plus a delete). Emit
  `contract.field_shifted` with the index and the offending value.

Spread the sentinels across the array. A sentinel at index 1 and index 80 will catch an insert anywhere between
them. Do the same for `initDynamicAssetData` (arity 23, sentinels on IMEI, lat, lng, speed, positionTime).

### 2.3 Golden fixtures + contract tests

Capture one real, redacted response per endpoint into `api/__fixtures__/`. Write Jest tests that decode each
fixture and assert the mapped object field-by-field. These are the regression tests that prove our decoders are
right, and they are also the artifact we hand the vendor: *"here is the response shape we were built against on
2026-09-22, here is what you are returning now."*

This also seeds the CI setup that R7 needs and that document 03 will require for ELD certification.

**Effort:** ~5–8 days, plus ~1 day per endpoint to capture fixtures.

---

## Layer 3 — Telemetry: crash reporting + a first-party API health stream

Two pipelines, deliberately. One for humans debugging a crash, one that **we own** for API health analytics.

### 3.1 Crash and error reporting — Sentry

`@sentry/react-native` gives native crashes, JS exceptions, breadcrumbs, release health (crash-free-session rate
per release) and source-mapped stack traces. Wire it to:

- `components/ErrorBoundary.tsx:20` — fill in the empty `componentDidCatch`.
- The `api/client.ts` interceptor — every `ApiError` becomes a Sentry event **grouped by `endpointId` + `kind`**,
  not by stack trace. This is the difference between "3,000 unrelated errors" and "assets.static/contract is
  failing for 212 users."
- Redux — a middleware adding rejected thunk actions as breadcrumbs (redacted).
- Set `release` from the app version and `dist` from the build number so we can tell a vendor break (all
  releases at once) from a regression we shipped (one release).

*Alternative:* Firebase Crashlytics is free and Firebase is already in the project, but its error grouping and
search are much weaker for this use case. Sentry is worth the ~$26–80/mo. Crashlytics can run alongside for
native crash coverage if desired.

### 3.2 First-party API health events

Sentry is for exceptions. We also need **the denominator** — total calls, latency distribution, success rate —
and we need to own that data, because it's the evidence in a vendor dispute and later a compliance artifact.

One event per API call, batched (flush every 30s or 50 events, and on background/foreground), sent to a Firebase
callable → BigQuery (or Firestore → BigQuery export):

```jsonc
{
  "ts": "2026-09-22T14:02:11Z",
  "correlationId": "…",
  "endpointId": "assets.static",
  "host": "newapi.quiktrak.co",
  "ok": false,
  "kind": "contract",
  "httpStatus": 200,
  "majorCode": "000", "minorCode": "0000",
  "durationMs": 412,
  "contractIssue": "arity_changed:84->85",
  "appVersion": "1.1.0", "build": "24", "platform": "ios", "osVersion": "18.2",
  "accountHash": "sha256(account)[0:16]",   // never the raw account
  "assetCount": 37
}
```

Deliberately: hashed account (blast-radius counting without storing identifiers), no PII, no tokens.

Retention 13 months — long enough to show a vendor a year of trend data.

**Effort:** ~4–6 days.

---

## Layer 4 — Synthetic monitoring (know before the customer does)

Client telemetry only tells us about breakage *our users already hit*. A canary tells us first.

A scheduled Cloud Function (Cloud Scheduler, every 5 minutes) that:

1. Logs in with a dedicated **monitoring account** that owns 2–3 real test devices.
2. Walks the endpoint registry and calls every endpoint with known-good inputs.
3. Runs the **same zod schemas and the same positional decoders the app uses** — this is why the registry and
   decoders must be shareable between `api/` and `functions/` (extract them to a small local workspace package,
   e.g. `packages/api-contract/`, consumed by both).
4. Writes a result row per endpoint per run, and computes a rolling health state.

Escalation policy:

| Condition | Severity | Action |
|---|---|---|
| Contract violation (arity/sentinel/schema) on any endpoint | **P1** | Page immediately. This is a breaking change. |
| `critical: true` endpoint failing 3 consecutive runs | **P1** | Page. |
| Non-critical endpoint failing 3 consecutive runs | P2 | Slack + email. |
| p95 latency > 3× 7-day baseline for 15 min | P2 | Slack. |
| Client-side error rate for one endpoint > 5% over 15 min across ≥ 10 users | P2 | Slack. |

Alert delivery: Slack webhook + email. The alert body names the endpoint id, the exact diff (expected vs.
received shape), the correlation id of a failing sample, and a link to the dashboard.

**Effort:** ~4–6 days (including extracting the shared contract package).

---

## Layer 5 — The backend proxy (the strategic fix)

Layers 1–4 tell us fast. Layer 5 is what lets us *fix it* fast, and it is the real answer to
"their API could brick my app."

**Today:** vendor changes a response shape → our app is broken → we patch the app → build → submit to Apple and
Google → wait for review → wait for users to update. Realistically 3–10 days, and old versions stay broken
forever.

**With a proxy:** vendor changes a response shape → we patch the mapping in the proxy → deploy → **fixed in
minutes, for every installed version, with no app release.**

### Design

A thin Cloud Run (or Cloud Functions v2) service that the app talks to exclusively:

```
App ──HTTPS(our auth)──▶ api.reconogps.com ──▶ newapi.quiktrak.co
                              │
                              ├─ normalises the 4 vendor namespaces into one clean REST/JSON API
                              ├─ decodes positional arrays into named objects (ONE place, server-side)
                              ├─ validates contracts and emits health events server-side
                              ├─ caches static-ish data (products, asset types, SSP)
                              ├─ enforces our own auth (Firebase Auth), vendor creds never touch the device
                              └─ feature-flag kill switches + graceful degradation
```

The app then consumes **our** API, which we version properly. We can fix the vendor's mistakes, shim removed
fields, and even serve stale-but-cached data while the vendor is down.

Two more things it buys us:

- **Vendor credentials leave the device.** This kills R4's worst case and is a precondition for anything ELD.
- **It is the same backend the ELD product needs anyway** (document 04). Building it now is not a detour.

### Migration — strangler pattern, not a rewrite

1. Stand up the proxy with **pass-through** routes for all endpoints, returning the vendor payload untouched.
2. Move the app's `API_URL` to the proxy. Behaviour identical, but now every call is observable and patchable
   server-side. *This alone is most of the value.*
3. Endpoint by endpoint, starting with the riskiest (`assets.static`, `assets.dynamic`, `auth.login`), replace
   pass-through with a normalised, named-field response and delete the positional decoder from the app.
4. Add caching and degradation as needed.

Keep a remote-config kill switch per endpoint so we can force the app back to a degraded-but-working mode
(e.g. hide the alarms screen) without a release.

**Effort:** ~2 weeks to steps 1–2 (which is where the payoff is). Steps 3–4 are incremental, endpoint by endpoint.

---

## Vendor accountability

Instrumentation is also leverage. Build a small internal tool (or a scheduled report) that, on any P1, generates:

- Endpoint id, full vendor URL, request (redacted), expected vs. received response shape as a diff.
- First-seen timestamp, current failure rate, distinct affected accounts.
- The golden fixture from `api/__fixtures__/` showing the shape we were built against.

Send it to the vendor within the hour, same format every time. Separately, take it to the commercial
relationship: ask for a written change-notification commitment (N days' notice of breaking changes), a staging
environment we can test against, and a support SLA. Having a year of uptime and contract-drift data makes that
conversation very different from "things seem to break sometimes."

---

## Summary of deliverables

| Layer | Deliverable | Effort | Priority |
|---|---|---|---|
| 1 | `api/registry.ts`, `api/client.ts`, `ApiError`, redaction, migrate all call sites, fix `testapi` hosts | 5–8 d | **P0** |
| 2 | zod schemas, positional decoders with arity+sentinels, golden fixtures, Jest contract tests, CI | 5–8 d | **P0** |
| 3 | Sentry wiring + first-party health events → BigQuery + dashboard | 4–6 d | **P0** |
| 4 | Synthetic canary Cloud Function + alert routing + shared `packages/api-contract` | 4–6 d | P1 |
| 5 | Proxy: pass-through + cutover (steps 1–2), then normalise per endpoint | 2 w + incremental | P1 |
| — | Vendor incident report generator + commercial ask | 2 d | P2 |

Layers 1–3 (~3–4 weeks) are the minimum bar before the app goes to general release.

# 01 — Current state assessment

A map of what is in the repo today, and a risk register of the things that will hurt us. Every claim below has a
file reference so it can be verified.

## 1. Architecture map

**App:** React Native 0.79.6 / React 19, Expo 53 (bare workflow — `android/` and `ios/` are checked in),
TypeScript, Redux Toolkit + redux-persist over AsyncStorage, React Navigation 6 (drawer + native stack),
Mapbox (`@rnmapbox/maps`), Firebase (messaging + callable functions), Stripe React Native SDK.

**Backend:** there isn't really one. `functions/` holds three Firebase callable functions
(`createAccount`, `fetchSubscriptionProducts`, `createSubscriptionPaymentIntent`, plus
`loadAssetActivationInfo`). Everything else in the app calls the QuikTrak vendor API **directly from the device**.

**Vendor API surface.** Calls are spread across `api/*.ts` (13 modules) hitting these hosts:

| Host | Used by | Notes |
|---|---|---|
| `newapi.quiktrak.co` | most of the app, via `API_URL` and `API_DOMIAN1/2/3` in `api/utils.ts` | production |
| `testapi.quiktrak.co` | `api/assets.ts:93`, `api/assets.ts:126`, `functions/src/apis/assets.ts:36` | **test environment, in production code paths** |
| `upload.quiktrak.co` | `api/assets.ts:148` (asset image upload) | |
| `helper.quiktrak.com.au` | `api/reports.ts` (report logo) | AU host used from a CA product |
| `osrm.sinopacific.com.ua` | `api/playback.ts:48` (playback route snapping) | third-party, `.ua` domain, no fallback |

The vendor API is split across four inconsistent product namespaces — `QuikTrak/V1`, `QUIKTRAK/V2`,
`Quikloc8/V1`, `QuikProtect/V1/Client`, `Common/v1` — with inconsistent casing, inconsistent verbs
(GET with query params, POST with `multipart/form-data`, POST with `x-www-form-urlencoded`, POST with JSON) and
a single response envelope: `{ MajorCode, MinorCode, Data }`.

**The only validation we do** is `validateResponseData` in `api/utils.ts`:

```ts
if (!(res && res.data && res.data.MajorCode === "000" &&
      (res.data.MinorCode === "0000" || res.data.MinorCode === "000"))) {
  throw res?.data?.Data || "invalid_data";
}
```

It throws a **string or an arbitrary object**, never an `Error`. No endpoint name, no HTTP status, no timing, no
request id, no stack. This is the direct cause of "something is broken and I can't tell what."

## 2. Risk register

### R1 — Positional array decoding of the entire asset list *(critical)*

`utils/assets.ts:210` (`mapAssetArray`) decodes ~80 fields out of an untagged string array using `index++`,
and `utils/assets.ts:312` (`initDynamicAssetData`) does the same for 23 live-position fields.

```ts
const staticAsset: StaticAsset = {
  id: assetValues[index++],
  imei: assetValues[index++],
  name: assetValues[index++],
  ...
```

If QuikTrak inserts, removes or reorders a single column, every field after it silently shifts. Nothing throws.
Users see the wrong make/model, wrong mileage, wrong lat/lng, wrong subscription state. This is the worst kind of
breaking change: invisible.

Compounding it: the asset list actually comes from the **login response** (`redux/reducers/assets.ts:59`,
`login.fulfilled` → `mapArrayOfAssetArrays(action.payload.data.AssetArray)`). The dedicated
`loadStaticAssets` thunk's result is **discarded** — `redux/reducers/assets.ts:67` has the mapping commented out
and only sets a success flag. So the entire asset list depends on one undocumented positional array in one endpoint.

### R2 — Production code calling the vendor's test environment *(critical)*

`api/assets.ts:93` (`loadAssetAlarms`), `api/assets.ts:126` (`loadAssetInfo`) and
`functions/src/apis/assets.ts:36` (`loadAssetInfo`) all hardcode `https://testapi.quiktrak.co`. A test
environment carries no uptime expectation and can be wiped or re-pointed without notice. The asset activation
flow — the one we want to sell hardware through — depends on it.

### R3 — No error or crash reporting anywhere *(critical)*

A repo-wide grep for `sentry|crashlytics|bugsnag|datadog` returns nothing. `components/ErrorBoundary.tsx`
catches render crashes and its `componentDidCatch` body is a comment: `// Future: send to crash reporting service`.
We currently have **zero** visibility into production failures. This is document 02's subject.

### R4 — Credentials stored in plaintext and replayed *(high)*

`redux/reducers/auth.ts:102` persists `account` **and `password`** through redux-persist into AsyncStorage, which
is unencrypted on both platforms. `services/AuthManager.tsx:13` then replays that plaintext password to
re-authenticate on every cold start. A rooted/jailbroken device, an Android backup, or an iOS unencrypted backup
leaks fleet credentials. Fix this before the customer base grows — a credential leak scales with the number of
fleets on the platform, and it is table stakes for any enterprise or channel conversation.

### R5 — Stripe flow is half-built and cannot work in production *(high)*

- `functions/src/apis/stripe.ts:14` — `liveProducts: string[] = []` is **empty**. Production has no products.
- `screens/SubscribeAssetsScreen.tsx:48` — calls `fetchSubscriptionProducts({ dev: true })`, hardcoded.
- **No Stripe webhook exists.** `functions/src/index.ts` exports only account, stripe and
  `loadAssetActivationInfo`. So a successful payment does nothing: no device activation is called, nothing is
  persisted outside Stripe metadata, and there is no reconciliation. Today a customer could pay and receive nothing.
- `screens/SubscribeAssetsScreen.tsx:133` — `initPaymentSheet` errors are swallowed into an empty `if (error) {}`.
- `screens/AddAssetsScreen.tsx:40` — IMEI state is initialised to a hardcoded test value `"0868450045012661"`.
- `functions/src/apis/stripe.ts:77` — an empty `catch {}` around the pending-subscription lookup.

### R6 — Single shared dealer credential with broken refresh *(medium)*

`functions/src/apis/AuthSession.ts` logs into the vendor API with one account from
`functions.config().auth`, caches the tokens in module memory, and the **refresh path is commented out**
(`getSession()` only ever starts a session if there is no token; the expiry branch is disabled). On token
expiry every server-side call fails until the function instance is recycled. `createAccount`
(`functions/src/apis/account.ts:49`) also hardcodes a `SecurityCode`, `WebSiteCode`, `CountryCode: "CAN"` and
`TimeZone: "Pacific Standard Time_-8"` for every new customer.

### R7 — No tests, no CI *(medium)*

`jest.config.js` exists with the React Native preset; there are **no test files** in the repo and no
`.github/` directory. There is a `validate` script (`tsc --noEmit`) that nothing runs automatically.
As tracker volume grows, this is what turns a vendor contract change into a silent data-corruption incident
nobody catches — see [doc 02](./02-api-observability.md).

### R8 — Polling architecture is foreground-only *(medium)*

`services/DynamicAssetDataLoader.tsx` polls `GetPosInfosDB` for all assets every 30s while the app is
foregrounded, and stops entirely when backgrounded. That is fine for "where is my truck" and completely
unsuitable for duty-status recording, which must continue with the app backgrounded or killed and must survive
offline periods. Any future duty-status or utilisation feature needs its own ingestion path, not this one.

### R9 — Third-party single points of failure *(low–medium)*

`api/playback.ts:48` posts playback history to `osrm.sinopacific.com.ua` with no timeout, no retry and no
fallback. `api/position.ts` has a two-host geocoding fallback, which is the right instinct — it should be the
pattern everywhere, not the exception.

## 3. What is actually good

Worth saying, because the plan builds on it:

- The API layer is already **isolated in `api/*.ts`** and consumed through Redux thunks. Nothing in the UI calls
  axios directly. That means the proxy and instrumentation work in document 02 touches one directory, not the
  whole app.
- Types are already declared for the vendor payloads (`types/index.ts`, `types/api.ts`), so runtime schema
  validation has something to validate against.
- The activation/checkout screens, the form, the Stripe payment sheet theming and the navigation wiring are all
  already built. Document 05 is mostly about **fulfilment**, not UI.
- `api/position.ts` shows the fallback pattern; `components/ErrorBoundary.tsx` shows the hook for crash reporting
  is already in place and just needs a body.

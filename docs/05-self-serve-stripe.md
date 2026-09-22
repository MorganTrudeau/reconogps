# 05 — Finishing self-serve onboarding, hardware sales and Stripe

This is the shortest path to new revenue in the repo, and it is a hard prerequisite for the ELD play: if we are
going to sell GPS trackers to trucking fleets, customers have to be able to buy a device, activate it and start a
subscription without a human in the loop.

Most of the **UI already exists**. What is missing is **fulfilment** — the part that turns a successful payment
into a working device.

---

## 1. What exists today

| Piece | File | State |
|---|---|---|
| Account creation | `screens/SignUpScreen.tsx` → `functions/src/apis/account.ts` | Works, but hardcodes `SecurityCode`, `WebSiteCode`, `CountryCode: "CAN"`, PST timezone, and the new user's password is the literal `"888888"` (`SignUpScreen.tsx:101`) |
| Enter IMEI → look up device | `screens/AddAssetsScreen.tsx` → `loadAssetActivationInfo` | Works. State is initialised to a hardcoded test IMEI (`AddAssetsScreen.tsx:40`) |
| Asset details form (solution, type, make/model/colour/year) | `components/Assets/AddAssetForm.tsx` | Works |
| Multi-asset cart | `screens/AddAssetsScreen.tsx` | Works |
| Stripe product/price lookup | `functions/src/apis/stripe.ts` | **`liveProducts: []` is empty — production is non-functional** |
| Subscription + PaymentIntent | `functions/src/apis/stripe.ts` | Creates an incomplete subscription, reuses a pending one. Reasonable shape |
| Payment sheet + checkout UI | `screens/SubscribeAssetsScreen.tsx` | Works, themed. Calls `fetchSubscriptionProducts({ dev: true })` hardcoded; swallows `initPaymentSheet` errors |
| **Post-payment fulfilment** | — | **Does not exist.** No webhook, no activation call, no persistence, no reconciliation |

**The critical gap:** after `presentPaymentSheet()` succeeds, the app shows
`Alert.alert("Success", "Your order is confirmed!")` and **nothing else happens**. The device is never activated
on the QuikTrak side, no record is written anywhere we control, and the asset data the user typed into
`AddAssetForm` is never sent anywhere. A customer can pay and receive nothing.

---

## 2. Target flow

```
1. Sign up / log in
2. Enter IMEI  ──▶ loadAssetActivationInfo (product + available solutions)
3. Fill asset details, choose solution, add to cart  (repeat per device)
4. Review + price  ──▶ createSubscriptionPaymentIntent  (creates order record FIRST)
5. Stripe Payment Sheet
        │
        ▼
6. Stripe webhook: invoice.paid / payment_intent.succeeded
        │
        ▼
7. Fulfilment worker (idempotent, retried):
     a. mark order paid
     b. call vendor activation for each IMEI
     c. write asset details (name, type, make/model/colour/year) via Device/Edit
     d. mark each line item active, or flag for manual intervention
        │
        ▼
8. Push notification + in-app state: "Your tracker is live"
9. Ongoing: subscription lifecycle webhooks → suspend / reactivate / deactivate assets
```

**Key principle: the order record is created before payment, not after.** It is the thing that makes fulfilment
idempotent and makes failures recoverable. Today there is no record at all — the only trace of a purchase is
`metadata.imeis` on a Stripe subscription.

---

## 3. Work items

### 3.1 Order + fulfilment backend *(the missing half)*

New collection/table `orders`:

```jsonc
{
  "id": "ord_…",
  "customerAccount": "…", "stripeCustomerId": "cus_…",
  "status": "pending_payment | paid | fulfilling | active | failed | refunded",
  "stripeSubscriptionId": "sub_…", "stripePaymentIntentId": "pi_…",
  "lineItems": [{
    "imei": "…", "productCode": "…", "solution": "Loc8",
    "assetDetails": { "name": "…", "type": "…", "make": "…", "model": "…", "colour": "…", "year": "…" },
    "activationStatus": "pending | activated | failed",
    "activationAttempts": 0, "lastError": null, "vendorAssetId": null
  }],
  "createdAt": "…", "fulfilledAt": null
}
```

- `createSubscriptionPaymentIntent` writes the order **before** returning the client secret, and puts `orderId`
  in the Stripe subscription metadata (keep `imeis` too).
- **New: `stripeWebhook` HTTP function** with signature verification
  (`stripe.webhooks.constructEvent`), handling `invoice.paid`, `payment_intent.succeeded`,
  `payment_intent.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`.
  **Idempotent by Stripe event id** — store processed event ids and no-op on replay; Stripe retries.
- **New: fulfilment worker** — per line item: call the vendor activation endpoint, then push asset details via
  `Device/Edit`, update `activationStatus`. Retry with backoff. After N failures, flag the order and alert us
  (reuse the alerting channel from [doc 02](./02-api-observability.md)) so a human fixes it before the customer
  complains.
- **Reconciliation job** (hourly): find orders `paid` for > 15 min but not `active`, and any Stripe subscription
  with no matching order. This catches dropped webhooks, which do happen.

**Open question to answer first:** *what is the actual vendor activation call?* The repo only has the SSP lookup
(`Common/v1/Activation/SSP`, `Common/v1/Activation/GetAssetsInfo`) — there is no code that activates a device.
Ask QuikTrak for the activation endpoint and its contract before estimating this work. If activation is a manual
dealer-portal step, the interim design is: order → alert us → we activate manually within X hours → mark active.
Ship that, and automate when the endpoint exists.

### 3.2 Fix the production blockers

- Populate `liveProducts` in `functions/src/apis/stripe.ts:14`, or better: **stop hardcoding product ids** —
  look products up by a Stripe metadata tag (`metadata.env=live`, `metadata.solution=loc8`) so adding a product
  is a Stripe dashboard change, not a deploy.
- Replace `{ dev: true }` in `screens/SubscribeAssetsScreen.tsx:48` with the build's environment
  (`react-native-config` already provides `.env.dev` / `.env.live`).
- Handle the swallowed `initPaymentSheet` error (`SubscribeAssetsScreen.tsx:133`) — show a real message and a
  retry; today it silently leaves the user on a spinner.
- Remove the hardcoded IMEI in `screens/AddAssetsScreen.tsx:40`.
- Fill the empty `catch {}` in `functions/src/apis/stripe.ts:77`.
- Pass `customerEphemeralKeySecret` to `initPaymentSheet` so returning customers see saved payment methods
  (requires a `stripe.ephemeralKeys.create` call in the payment-intent function).

### 3.3 Fix the account-creation path

- `SignUpScreen.tsx:101` logs the new user in with the hardcoded password `"888888"`. That is presumably a
  vendor default. It must be replaced by a real password chosen at signup, or an immediate forced password
  change. As it stands, every new account has a publicly guessable password.
- `functions/src/apis/account.ts:49` — move the hardcoded `SecurityCode`, `WebSiteCode`, country and timezone
  into config, and set timezone from the device/user rather than assuming Pacific.
- Fix `functions/src/apis/AuthSession.ts` — the token refresh path is commented out; re-enable it with a real
  expiry check and a retry-on-401, or every server-side call fails when the shared dealer token expires.

### 3.4 Security *(do this before launch, not after)*

- Stop persisting the user's password (`redux/reducers/auth.ts:102`) and stop replaying it
  (`services/AuthManager.tsx:13`). Move to `react-native-keychain` and a proper token refresh. This matters
  independently, and it is table stakes for any ELD conversation.

### 3.5 Subscription lifecycle

- Failed payment / cancellation → suspend or deactivate the asset with the vendor; reflect state in the app so
  a lapsed tracker isn't silently dead.
- In-app subscription management: view plan, update card, cancel, add devices to an existing subscription.
- Proration when a device is added mid-cycle (Stripe handles it; the UI has to explain it).

### 3.6 Canadian tax and compliance

- **GST/HST/PST applies** to both hardware and the subscription, and rates vary by province. Use **Stripe Tax**
  rather than hand-rolling it. Registration thresholds and the requirement to show tax separately on invoices
  are accountant questions — get them answered before charging the first live card.
- Invoices/receipts: Stripe's hosted invoices are sufficient to start.

### 3.7 Hardware sales (the ELD prerequisite)

Currently the flow assumes **the customer already has a device with an IMEI**. To sell trackers in-app:

- Product catalogue with hardware SKUs (one-time charge) alongside the subscription.
- Shipping address collection, shipping rates, tax on goods, fulfilment/tracking-number emails.
- Inventory and IMEI assignment: either ship a device and have the customer enter its IMEI (the current flow —
  simplest, keep it), or pre-associate the IMEI to the order at pick-and-pack and activate on first power-up.
  **Recommend the former to start**: it needs no warehouse integration and the screens already exist.
- Returns/RMA policy.

### 3.8 App store policy

Apple's IAP rules require in-app purchase for digital content consumed *in* the app, and permit external payment
for **physical goods and for services consumed outside the app**. A GPS tracker plus a vehicle-tracking service
is squarely in the latter category, so Stripe is the right and permitted mechanism — this is the same model
Geotab, Samsara and every fleet SaaS uses. Two practical notes: make it visibly clear in the flow that the
purchase is hardware + a real-world tracking service, and be ready with that explanation if a reviewer asks.
Google Play's equivalent carve-out is the same shape.

---

## 4. Suggested order of work

| # | Item | Effort | Why now |
|---|---|---|---|
| 1 | Order record + Stripe webhook + idempotent fulfilment + reconciliation | 6–10 d | Without this the feature cannot ship at all |
| 2 | Production blockers (§3.2) | 2–3 d | Trivial, blocking |
| 3 | Account-creation fixes incl. the `"888888"` password (§3.3) | 2–4 d | Security |
| 4 | Credentials → Keychain (§3.4) | 2–3 d | Security; ELD prerequisite |
| 5 | Subscription lifecycle (§3.5) | 4–6 d | Prevents revenue leakage and dead trackers |
| 6 | Stripe Tax (§3.6) | 2–3 d + accountant | Legal |
| 7 | Hardware SKUs + shipping (§3.7) | 5–8 d | Unlocks device sales — the ELD business model |

Roughly **4–7 weeks** for the whole thing, and items 1–4 (~2–3 weeks) are enough to take real money safely.

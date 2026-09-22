# 06 — Roadmap, cost and decisions

---

## 1. The strategic question, answered directly

> *"With this risk involved I feel like releasing my app which looks nicer isn't really worth it because I don't
> think that's really what is holding the business back."*

Half right. A nicer-looking app is not, on its own, a growth lever — that's a correct read. But the conclusion
that the vendor-API risk is a reason **not** to release is backwards, for one concrete reason:

**Owning the client is the only way to get out from under the vendor's API.** Today, a QuikTrak breaking change
is fixable only by shipping new binaries through two app-store reviews — days at best, and older installs stay
broken forever. Route every call through our own backend proxy ([doc 02, Layer 5](./02-api-observability.md))
and the same break becomes a server-side patch deployed in minutes, for every installed version, with no app
release. That is a genuine, durable capability, and it is unavailable through the Cordova app we don't control.

So the sequence is: **de-risk first, then release.** Don't ship the new app on the same fragile direct-to-vendor
wiring the old one has — ship it on the proxy, and the app becomes the risk *mitigation* rather than another
exposure.

And the instinct that the business needs a second reason to exist is right. ELD is a plausible one. It is also
a 9–18 month, six-figure bet against entrenched competitors, gated on a hardware question we haven't answered.
That is exactly the kind of bet that should be **validated cheaply first**, which is what Phase 2 is for.

---

## 2. Phased roadmap

### Phase 0 — De-risk the vendor API *(weeks 1–4)* — do this first, no conditions

| Deliverable | Ref |
|---|---|
| Endpoint registry + instrumented client + typed `ApiError` + redaction | [02 §L1](./02-api-observability.md) |
| Fix the three production call sites pointing at `testapi.quiktrak.co` | [01 R2](./01-current-state.md) |
| zod schemas + positional decoders with arity/sentinel checks + golden fixtures + Jest + CI | [02 §L2](./02-api-observability.md) |
| Sentry + first-party API health events → BigQuery + dashboard | [02 §L3](./02-api-observability.md) |
| Proxy stood up in pass-through mode; app cut over to it | [02 §L5](./02-api-observability.md) |

**Exit criteria:** a deliberately corrupted vendor response in a test produces a specific, attributable alert
naming the endpoint, and a mapping change can be deployed without an app release.
**→ Release the app after this.**

### Phase 1 — Revenue: finish self-serve *(weeks 3–10, overlaps Phase 0)*

| Deliverable | Ref |
|---|---|
| Order record + Stripe webhook + idempotent fulfilment + reconciliation | [05 §3.1](./05-self-serve-stripe.md) |
| Production blockers: live products, env flag, swallowed errors, hardcoded IMEI | [05 §3.2](./05-self-serve-stripe.md) |
| Account creation fixes incl. the hardcoded `"888888"` password; AuthSession refresh | [05 §3.3](./05-self-serve-stripe.md) |
| Credentials → Keychain/Keystore | [05 §3.4](./05-self-serve-stripe.md) |
| Subscription lifecycle + Stripe Tax | [05 §3.5–3.6](./05-self-serve-stripe.md) |
| Hardware SKUs + shipping | [05 §3.7](./05-self-serve-stripe.md) |

**Blocking unknown:** what is the vendor's device **activation** endpoint? Ask this week. If it doesn't exist,
ship with a manual activation step behind an alert.

### Phase 2 — ELD discovery *(weeks 1–12, runs in parallel, mostly non-engineering)* — the go/no-go gate

| # | Action | Owner |
|---|---|---|
| 1 | Survey the customer base: federal vs. provincial, province, GVWR, model years, current ELD and price | Commercial |
| 2 | Obtain CCMTA Technical Standard **1.3.1** + the Canadian ELD Test Procedures; write a gap analysis | Eng + regulatory |
| 3 | Quotes from **all three** certification bodies — full and white-label — plus queue times and 1.3→1.3.1 transition dates | Commercial |
| 4 | Confirm the tracker hardware in writing: J1939/J1708/OBD-II? ECM odometer? engine hours? VIN? | Eng + supplier |
| 5 | Scout white-label partners among already-certified vendors | Commercial |
| 6 | Competitive/pricing read: Geotab, ISAAC, Samsara, Motive, BigRoad, J.J. Keller, HOS247 | Commercial |
| 7 | Legal: liability exposure if our ELD is decertified or loses data | Legal |

**Gate:** proceed to Phase 4 only if (a) enough customers are actually subject to the mandate or would buy
anyway, (b) ECM-capable hardware exists (ours or a partner's), and (c) a written quote plus a real engineering
estimate lands inside a budget we can afford to lose entirely.

### Phase 3 — Ship the non-certified logbook *(weeks 8–20)* — worth doing whatever Phase 2 says

Backend RODS schema, HOS rule engine + test vectors, driver app duty-status + daily log + edits + certification,
carrier portal. Steps 1–4 of [doc 04 §8](./04-eld-architecture.md).

Marketed honestly as a **trip and duty log**, not an ELD. Serves exempt customers, equipment/machine fleets and
operator-hour tracking. It is also ~70% of the certifiable product, so it de-risks Phase 4 by proving the
product before the cheque clears.

### Phase 4 — Certification *(6–12 months, only on a positive Phase 2 gate)*

Steps 5–10 of [doc 04 §8](./04-eld-architecture.md): ECM integration, malfunction/diagnostic monitoring, output
file + transfer + roadside display, tamper-evidence and security review, then pre-verification self-assessment
and the certification body engagement. **Prefer the white-label route (Route A) if Phase 2 shows it materially
reduces scope.**

---

## 3. Indicative budget

Engineering is expressed in person-weeks; convert at your own rate.

| Phase | Engineering | Third-party cash |
|---|---|---|
| 0 — De-risk | 6–9 person-weeks | Sentry ~$30–80/mo; GCP ~$50–200/mo |
| 1 — Self-serve | 5–8 person-weeks | Stripe fees; accountant for tax setup |
| 2 — ELD discovery | 1–2 person-weeks | Standard + test procedures purchase; legal ~$5–15k |
| 3 — Logbook (non-certified) | 12–20 person-weeks | — |
| 4 — Certification | 12–24 person-weeks | **US$50k–120k+** certification fees; legal $15–40k; hardware TBD |

Phases 0–3 are a normal product investment with a return regardless of the ELD outcome. Phase 4 is the actual
bet, and Phase 2 exists so it's made with evidence.

---

## 4. Decisions needed from you

| # | Decision | Needed by | Notes |
|---|---|---|---|
| 1 | Approve the proxy approach — our own backend between app and vendor | Before Phase 0 starts | Everything else assumes it; also the ELD backend |
| 2 | Sentry vs. Crashlytics (or both) | Week 1 | Recommend Sentry for endpoint-level grouping |
| 3 | Ask QuikTrak for the **device activation** endpoint contract | This week | Blocks Phase 1 fulfilment |
| 4 | Ask QuikTrak why production code calls `testapi.quiktrak.co`, and whether production equivalents exist | This week | Blocks Phase 0 |
| 5 | Open the commercial conversation: breaking-change notice period, staging environment, support SLA | Week 2–4 | Doc 02's telemetry makes this conversation winnable |
| 6 | Get the **hardware spec sheets** and answer the ECM questions | Phase 2 | Decides whether ELD is possible at all |
| 7 | Budget ceiling for Phase 4 — the number we're willing to lose | End of Phase 2 | Sets Route A vs. Route B |
| 8 | Run the customer survey | Weeks 1–4 | The cheapest, highest-information action in this whole plan |

---

## 5. The three things to do this week

1. **Email QuikTrak** with decisions 3, 4 and 5 above. Three questions, one email, today.
2. **Survey the customers** — federal or provincial, what province, what trucks, do they already run an ELD and
   what do they pay. Ten phone calls will tell you more about whether ELD is worth $150k than any amount of
   further research.
3. **Get the hardware spec sheets** and answer: do these trackers read the ECM? Everything about the ELD strategy
   hinges on that one answer, and it costs nothing to find out.

Meanwhile, engineering starts Phase 0 — which is worth doing no matter how any of the above turns out.

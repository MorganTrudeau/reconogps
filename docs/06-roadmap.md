# 06 — Roadmap and priorities

Revised September 2026, after the ELD direction was set aside and the growth constraint was identified as
distribution and unit economics rather than product. See [doc 03](./03-growth-strategy.md).

---

## 1. The shape of the problem

The business has **zero churn across 37 customers and 129 trackers**, at **$20 gross margin per tracker per
month (80%)**. That is a strong position: the product works, the bucket doesn't leak, and everything added
compounds. The constraint is entirely on the input side — too few customers, too few trackers per customer,
and growth funded out of founder hours rather than out of the margin that is already there.

This splits the work cleanly in two:

- **Growth work** — pricing, account expansion, channel. Not engineering. This is what moves 129 toward 2,000,
  and it is where the founder's time should go.
- **Engineering work** — keeping the platform from breaking as volume grows, and letting customers buy without
  a human in the loop. This doesn't grow the business directly; it stops growth from being capped or reversed.

The engineering below is deliberately modest in scope. Nothing here is a reason to delay §2.

---

## 2. Growth track — the priority

Owned by the founder, not by engineering. Full detail in [doc 03](./03-growth-strategy.md).

| # | Action | When |
|---|---|---|
| 1 | Call all 37 customers: assets owned vs. tracked, and why the rest isn't | Weeks 1–3 |
| 2 | Machine technician onto a written recurring referral agreement | Week 1 |
| 3 | Decide pricing: $35/mo upfront-at-cost, or $45/mo with $0 down on a 36-month term | Week 2 |
| 4 | Test the price increase on 3–5 existing accounts; offer $0 down to expansion prospects | Weeks 3–4 |
| 5 | List 20 channel partner candidates; contact the first five | Week 4 |

**Expansion inside the existing 37 accounts is the single highest-return action available** — lifting the
average from 3.5 to 10 trackers is ~3x growth with no CAC and no new relationships.

---

## 3. Engineering track

### Phase 0 — De-risk the vendor API *(4–6 weeks, do this first)*

Detail in [doc 02](./02-api-observability.md).

| Deliverable |
|---|
| Endpoint registry, instrumented client, typed `ApiError`, redaction |
| Fix the three production call sites pointing at `testapi.quiktrak.co` |
| Runtime schemas + positional decoders with arity/sentinel checks + golden fixtures + CI |
| Sentry + first-party API health events + alerting |
| Backend proxy in pass-through mode; app cut over to it |

**Why this stays first even though it doesn't grow revenue.** At 129 trackers a silent QuikTrak breakage is an
annoyance you hear about from a customer. At 1,000 it is a company-ending support event across dozens of
accounts, with no way to tell which endpoint broke and no way to fix it without an app-store release. It is
insurance whose premium rises with every tracker sold — and the proxy is the only thing that turns a vendor
break from a multi-day app release into a server-side patch.

The positional array decoding (`utils/assets.ts:210`, ~80 fields read by index) is the specific hazard: one
inserted column silently corrupts every field after it, with no error.

### Phase 1 — Let customers buy without you *(4–7 weeks)*

Detail in [doc 05](./05-self-serve-stripe.md).

The activation and payment UI is largely built; **fulfilment is missing entirely** — there is no Stripe webhook,
so a successful payment currently activates nothing. Also: `liveProducts` is empty, so production cannot load
products at all, and new accounts are created with the hardcoded password `"888888"`.

Priority order: order record + webhook + idempotent fulfilment → production blockers → account-creation and
credential security → subscription lifecycle → Stripe Tax.

**How this connects to growth.** A channel partner cannot sell for you if every order needs you to process it
manually. Self-serve is what makes §2's partner network scale past a handful of deals — and the 36-month term
pricing needs somewhere to live.

### Deferred

**ELD / electronic logbook** — archived, with rationale and research preserved in
[docs/archive](./archive/README.md). Revisit only if the business starts winning federally regulated trucking
fleets that require it, and then by licensing a white-labelled certified device rather than building one.

**Native app general release** — the new app should ship on the proxy (Phase 0), not on the current
direct-to-vendor wiring. It is not itself a growth lever; it is the vehicle for the proxy, and it removes the
Cordova app's dependence on QuikTrak's release cycle.

---

## 4. Sequencing

Growth (§2) and engineering (§3) run in parallel and don't compete — they need different people and different
hours. If they ever do compete, **growth wins**. A better-instrumented platform with 129 trackers is worth less
than a fragile one with 500.

The one genuine dependency: **self-serve (Phase 1) should land before the channel gets busy**, or partner
deals will bottleneck on manual order processing. That puts it roughly two quarters out, which fits the
channel ramp in [doc 03 §7](./03-growth-strategy.md).

---

## 5. Open questions

| # | Question | Blocks |
|---|---|---|
| 1 | Installation time and loaded labour cost per unit | The last estimate in doc 03 §3; sets the $0-down monthly rate |
| 2 | Concentration of the 129 trackers across the 37 accounts | Revenue concentration risk; breadth vs. depth in the expansion push |
| 3 | What is QuikTrak's device **activation** endpoint? | Phase 1 fulfilment — ask them directly |
| 4 | Why does production code call `testapi.quiktrak.co`? | Phase 0 |
| 5 | Will QuikTrak commit to breaking-change notice, a staging environment, and a support SLA? | Reduces the risk Phase 0 is mitigating |
| 6 | Is revenue concentrated in one or two large accounts? | Risk exposure worth naming |

Questions 3–5 are one email to QuikTrak. Send it this week.

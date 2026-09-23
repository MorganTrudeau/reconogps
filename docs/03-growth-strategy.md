# 03 — Growth strategy: 129 → 2,000 trackers

## 1. What the numbers actually say

| Metric | Value |
|---|---|
| Active trackers | 129 |
| Customers | 37 |
| Average trackers per customer | **3.5** |
| Churn | **Zero** |
| Acquisition channel | Cold outreach + personal connections (+ one informal referrer) |
| Price per tracker | $25 / month |
| QuikTrak platform cost | $5 / month |
| **Gross margin** | **$20 / tracker / month (80%)** |
| Hardware & installation | Passed through **at cost** — $90 device + $175 install = **$265 per vehicle, paid by the customer upfront** |
| Target | ~2,000 trackers |

At 129 trackers that is **$3,225 MRR and ~$31,000 a year of gross profit**. At the target it is **$50,000 MRR
and $480,000 a year of gross profit** — a genuinely good business, on SaaS-like margins.

Three findings fall straight out of this.

### The distribution matters more than the average

Trackers per customer, top of the list:

```
31  25  14  9  8  6  6  6  5  5  4  4  4  …
```

| | Trackers | Share of 129 |
|---|---|---|
| Largest account | 31 | **24%** |
| Top 2 | 56 | **43%** |
| Top 3 | 70 | **54%** |
| Top 5 | 87 | **67%** |
| Top 13 | 127 | **98%** |

Two things follow, and both are more useful than the 3.5 average.

**1. "3.5 trackers per customer" was a misleading way to describe this business.** The mean is dragged up by two
large accounts; the *median* customer has somewhere around one to three trackers. So there isn't a uniform
population of 37 mid-sized fleets to expand — there are **two substantial accounts, a middle tier of eight to
ten, and a long tail of very small ones.** Each tier needs a different move (§4).

**2. Revenue concentration is a real risk that zero churn is currently masking.** The top two accounts are
**43% of the business** — about **$13,400 a year of gross profit**. Nothing has churned yet, but "we've never
lost a customer" and "losing one customer costs us a quarter of our revenue" are both true at the same time.
Those two accounts deserve deliberate relationship management, not just good service.

> **A number that doesn't reconcile.** The visible 13 customers already total **127 trackers**, which leaves
> only 2 trackers for the remaining 24 customers — impossible. Either the active-tracker total is higher than
> 129 (if the tail continues 4, 3, 3, 2, 2, 1 … the real total is nearer **165–170**, mean ~4.5, median ~2), or
> a number of the 37 accounts have no active devices at all. **Worth resolving before planning against it** —
> it changes the size of the tail and therefore the size of the expansion opportunity.

### Finding 1: Zero churn is the most important number in the business

Thirty-seven customers and not one has left. In a subscription business that is the number that matters most,
and it is excellent. It means:

- **The product works and customers value it.** Whatever is wrong with the Cordova app's looks, it is not
  costing customers.
- **The bucket doesn't leak.** Every tracker added compounds instead of backfilling a loss.
- **The switching cost is real.** Once hardware is installed in a truck or a machine, nobody rips it out.

It also means the constraint is unambiguous: **this is a top-of-funnel and account-expansion problem, and
nothing else.** Not features, not the app, not ELD. That diagnosis is now settled and the rest of this document
assumes it.

### Finding 2: You have already proven you can land 25–31 tracker accounts

This is the most encouraging fact in the data and it was invisible in the average.

Two customers run 25 and 31 trackers. That means fleets of that size **exist in your market, will buy from
you, and will pay ~$8,000 upfront to do it** — customer #1 paid roughly `31 × $265 = $8,215` in hardware and
installation before the subscription even started. Whatever you did to land those two is repeatable, and it is
worth far more than grinding the tail upward.

**The arithmetic:** five more accounts the size of #2 is **+125 trackers and ~$30,000 a year of gross profit** —
roughly doubling the business, from five customers rather than thirty-six. Compare that to signing 36 new
two-tracker customers for the same result.

So the highest-value question in the business right now is: **what do those two accounts have in common?**
Industry, size, how they found you, who signed off, what problem they were solving. That is your ideal
customer profile, derived from evidence rather than guessed at — and it should redirect the outreach in §6.

### Finding 3: You can afford to spend far more on growth than you are

An 80% gross margin and zero churn together mean the lifetime value of a customer is enormous:

| | |
|---|---|
| Gross profit per tracker | $20 / month |
| LTV per tracker (5 years, zero churn) | **$1,200** |
| LTV per customer (3.5 trackers) | **~$4,200** |
| Affordable CAC at a healthy 3:1 ratio | **~$1,400 per customer** |
| Cash currently spent per customer acquired | **$0** |

That last pair of rows is the finding. **You could pay well over a thousand dollars to land a customer and
still have a strong business** — and you are spending nothing but founder time. Growth is currently funded
entirely out of the one resource that doesn't scale.

This reframes the whole problem. It isn't that the money to grow doesn't exist. It's that the margin is being
banked instead of deployed, and the only acquisition channel is the founder's calendar.

## 2. What actually constrains growth

Two things, and neither is what it first looked like.

### Constraint 1 — Founder time is the only sales channel

Thirty-seven customers came from cold outreach and personal connections. That motion works — zero churn proves
the pitch and the product both land — but it consumes the one input that cannot be bought more of. Reaching
2,000 trackers at today's 3.5 per customer needs roughly **535 customers**. There is no version of that which
is founder-led.

The fix is not to work harder at outreach; it is to convert acquisition from a **fixed cost paid in founder
hours** into a **variable cost paid out of gross margin** — which, at $20 a tracker with no churn, is very
affordable. That is what the channel model in §5 does.

### Constraint 2 — The upfront cost is a conversion barrier

Hardware and installation are passed through at cost, which is generous and is presumably part of why nothing
churns. But "at cost" is not "free": **$90 hardware + $175 installation = $265 per vehicle**, paid on day one.

| Fleet | Cheque before the service has proved itself |
|---|---|
| 3 vehicles | **$795** |
| 5 vehicles | **$1,325** |
| 10 vehicles | **$2,650** |

That is a serious barrier for a small contractor, and it explains the shape of the distribution: a long tail of
accounts that bought two or three trackers for the vehicles they worried about most and stopped, because
expanding means another four-figure cheque.

It cuts both ways, though — the two large accounts paid **$6,625 and $8,215** upfront without blinking. The
barrier is real for the tail and largely irrelevant at the top, which is another reason the two tiers need
different treatment.

> **Correction to an earlier draft of this document.** A previous version claimed a ~$168,000 working-capital
> wall from funding hardware. That was wrong: the customer funds the hardware today, so no such wall exists
> under the current model. It becomes real only if you adopt the $0-down option in §3 — where it is a
> deliberate, financeable choice rather than a constraint.

## 3. Pricing: you are underpriced, and the channel pays for itself

### You are at the bottom of the market

SMB fleet-telematics pricing runs roughly **$30–75 per vehicle per month**. You are at $25 — below
self-serve OBD dongles like Matrack ($19.95–24.95), which ship a device in the post and leave the customer to
it. **You install it, you support it locally, and you track machines as well as vehicles.** That is a
materially better product being sold below the cheapest competitor in the category.

Zero churn across 37 customers, with no price experimentation, is a classic symptom of this: nobody leaves
because it is too cheap to be worth the bother.

### Three options

Install labour is **$175 (confirmed)**, so the figures below are the real model, not an illustration.

| | **A — Today** | **B — Raise price** | **C — $0 down, 36-month term** |
|---|---|---|---|
| Customer pays upfront | **$265** | **$265** | **$0** |
| Monthly price | $25 | $35 | $45 |
| QuikTrak | −$5.00 | −$5.00 | −$5.00 |
| Hardware amortized | — | — | −$2.50 |
| Install amortized | — | — | −$4.86 |
| **Net, sold direct** | **$20.00** | **$30.00** | **$32.64** |
| **Net, after 20% partner share** | — | **$23.00** | **$23.64** |

**Read the bottom row.** A tracker sold *by a partner* under B or C nets more than a tracker you sell yourself
today. The channel is not a cost you have to find room for — **the price increase pays for it, and you still
come out ahead.**

### Recommendation: offer both B and C

Let the customer choose, the way phone carriers do:

- **"Pay upfront, pay less monthly"** — ~$90 + install, then $35/month, no term. Cash-neutral for you.
- **"Nothing down"** — $0 today, $45/month on a 36-month term. Removes the barrier in §2 entirely.

Self-selection is strictly better than guessing, and the $0-down option is what unlocks both larger initial
deals and expansion into the rest of an existing customer's fleet.

**On the term commitment:** with zero churn it costs you almost nothing — customers aren't leaving anyway. It
exists so the hardware recovery is contractually matched to its payback period, and so contracted MRR becomes
something a lender will advance against. That is what funds the $0-down option at volume: at 2,000 trackers it
implies roughly $170,000 of hardware and install carried on the balance sheet, which is financeable against
committed contracts but not against month-to-month revenue.

### Fastest cash available

Raising the existing base from $25 to $35 is **+$1,290/month, ~$15,500/year, essentially all of it gross
profit** — a ~50% increase in the profitability of the business from one decision, with no new customers.
Given zero churn the risk is low. Test it on three to five accounts first, and consider grandfathering the
earliest customers as a goodwill gesture; it costs little and they are the ones most likely to refer.

## 4. Lever 1 — Work the existing 37 accounts, by tier

Still the first thing to do, and still phone calls rather than engineering — but the distribution says to treat
the tiers differently rather than chasing one average.

**Call all 37 regardless.** Two questions, every time:

1. *How many vehicles and machines do you own in total?*
2. *What's not tracked, and why not?*

The first is your pipeline, quantified. The second tells you whether the blocker is the $265 upfront, the
installation hassle, or something about the product. **Expect the upfront cost to dominate the tail** — and if
it does, the $0-down option in §3 is not a pricing tweak, it is the thing that unlocks this lever. Take that
offer with you on the calls and you can close expansion on the spot instead of booking a follow-up.

Then treat the tiers differently:

| Tier | Accounts | Move |
|---|---|---|
| **Top 2** (31, 25) | 2 | **Protect first, expand second.** 43% of the business. Deliberate relationship management: a scheduled check-in, a named contact, early access to anything new. Ask each for a referral and a testimonial — they are your proof for lookalike prospects (§6). |
| **Middle** (14, 9, 8, 6, 6, 6, 5, 5) | ~8 | **The best expansion targets.** Proven willingness to buy multiple units, and likely real headroom in the fleet. The $0-down offer should land hardest here. |
| **Tail** (4 and below) | ~27 | **Qualify before investing effort.** Some are genuinely small businesses with two trucks and no headroom; some are large fleets that stalled at the upfront cost. Question 1 separates them in a single call. Don't spend equal effort on both. |

**Temper the expansion target accordingly.** "Lift the average to 10" only works if the fleets are actually
there — you cannot sell a three-truck contractor ten trackers. The realistic ceiling is whatever question 1
returns, which is exactly why the calls come before the plan. The middle tier is where this lever pays; the
tail is mostly a qualification exercise.

---

## 5. Lever 2 — Formalize and replicate the referral channel

The machine technician is an accidental channel partner. Make him a real one, then find ten more like him.

**You can afford to pay generously.** At a 20% share of a $45/month tracker that is $9 per tracker per month,
and §3 shows a partner-sold tracker still nets you more than one you sell yourself today. Given an affordable
CAC around $1,400 a customer (§1, Finding 3), 20% recurring is not aggressive — it is conservative.

**Pay recurring, not a bounty.** A one-time finder's fee buys one referral; a share of the subscription for as
long as the account lives buys a partner who keeps selling. At 20% of $45, a partner with ten 5-tracker
accounts earns **$450 a month in passive income** — real money to a tradesperson, compounding for them exactly
as it does for you.

A hybrid works well if partners want cash sooner: a **$50 per tracker signing bonus plus 10% recurring**. On a
3.5-tracker customer that is $175 up front against ~$840 a year of gross profit — payback inside three months,
against an account that has never churned.

**Who to recruit** — people already standing in your customer's yard, with a trusted reason to be there:

- Heavy equipment mechanics and mobile repair techs (proven — you have one)
- Equipment and truck dealers — tracker fitted at point of sale
- **Equipment rental yards** — they need tracking on their own fleet *and* they touch every contractor in the region
- Auto electricians, upfitters, installers
- Insurance brokers — theft recovery is a real hook

**The pitch:** *"You're already in their shop fixing their machine. Mention us, we do the install, and you get
paid every month for as long as they stay a customer."*

**The arithmetic:** 10 active partners × 4 customers a year × 8 trackers = **320 trackers a year**, worth
~$88,000 of annual gross profit at the proposed pricing after the partner's share. Unlike cold outreach it
compounds — partners get better at it, and referred customers refer.

Start with one: put your machine technician on a written recurring agreement this month and see what he does
when there's money in it.

---

## 6. Lever 3 — Verticalize the outreach you're already doing

Thirty-seven customers from cold outreach with zero churn means **the pitch works**. Don't abandon it —
aim it.

**Start from the top two accounts, not from the market.** Per Finding 2, you have already proven that 25–31
tracker fleets will buy from you. Profile those two — industry, fleet composition, company size, how they found
you, who signed off, what problem they were solving — and make that your target. Then go find businesses that
look like them, and use the two accounts themselves as the reference (which is why §4 says to ask them for a
testimonial).

Chasing lookalikes of your best customers beats chasing volume: **five accounts like #2 is worth more than
thirty-six like the tail**, for less total sales effort.

Then concentrate by vertical: same language, same references, same trade associations, same trade shows. In a
tight trade community, five reference customers who all know each other is worth more than fifty scattered
logos.

**Also test the theft-and-immobilization angle.** The platform already supports geolock, relay immobilization
and door lock (`api/assets.ts` — `changeGeolockStatus`, `changeRelayStatus`). Equipment and trailer theft is an
expensive, emotional problem for contractors. *"Someone's taking your excavator — shut it down from your
phone"* is a fundamentally stronger pitch than *"see where your trucks are."* One sells insurance against a
disaster; the other sells a dot on a map. Worth A/B testing in your outreach this quarter, since it costs
nothing to try.

---

## 7. The path to 2,000

Zero churn means nothing has to be replaced — everything added stays. That makes the target reachable, but
not quickly:

| Period | Motion | Trackers |
|---|---|---|
| Months 1–3 | Fix pricing; raise price on existing base; call all 37 accounts | ~129 → 200 |
| Months 4–12 | Work the expansion pipeline; sign first 5 partners | → ~450 |
| Year 2 | Channel ramps to ~10 partners; vertical focus in outreach | → ~1,000 |
| Year 3 | Channel compounds; larger accounts land | → ~2,000 |

**A realistic three-year path.** It ends at roughly **$50,000 MRR and $480,000 a year of gross profit** at
today's $25 price, or meaningfully more at the pricing in §3.

If you take the $0-down option, it also means carrying roughly **$170,000 of hardware and installation** on the
balance sheet by the end — recovered over each contract's 36 months, and financeable against committed
contracts. That is a deliberate trade for removing the upfront barrier, not a constraint you are forced into:
the pay-upfront option stays cash-neutral.

What it is *not* is more of the current motion. Thirty-seven customers came from founder-led cold outreach;
535 will not. The change isn't effort, it's mechanism: expansion and channel instead of one-at-a-time direct sales.

---

## 8. Next 30 days

1. **Reconcile the tracker count** — the visible 13 accounts already total 127 of a stated 129. Establish the
   real active total and how many of the 37 accounts have zero devices. *(Week 1, an hour)*
2. **Profile the top two accounts.** Industry, fleet, how they found you, who signed off, what they were
   solving. This is your ideal customer profile and it redirects all outreach. *(Week 1)*
3. **Call all 37 customers**, tiered per §4. Total assets owned vs. tracked, and why the rest isn't. Build the
   sheet. Ask the top two for a referral and a testimonial. *(Weeks 1–3)*
4. **Put the machine technician on a written recurring referral agreement.** *(Week 1)*
5. **Decide pricing** — the two-option model in §3: $35/month with hardware and install paid upfront at cost,
   or $45/month with $0 down on a 36-month term. *(Week 2)*
6. **Test the price increase** on 3–5 existing accounts before rolling it out, and offer the $0-down option to
   the first expansion prospects from step 1. *(Week 3–4)*
7. **List 20 potential channel partners** — mechanics, dealers, rental yards, installers — and contact the
   first five. *(Week 4)*

Note that none of this is engineering. The engineering that matters is in
[doc 02](./02-api-observability.md) and [doc 05](./05-self-serve-stripe.md), and it's there to keep the
platform from breaking as volume grows and to let customers buy without you — not to grow the business
directly.

---

## 9. Open items

| Item | Why it matters |
|---|---|
| **Reconcile 129 vs. the 127 visible in the top 13** | Determines the true size of the tail, and therefore how much expansion headroom actually exists. An hour's work and it gates the rest of the plan. |
| **Profile of the top two accounts** | The empirically derived ideal customer profile. Redirects §6 outreach from generic to targeted. |
| **Concentration risk** | Top two accounts are ~43% of revenue. Not a number to fix, but one to manage deliberately. |

Pricing, vendor cost, install cost and margin are all now known and modelled in §3.

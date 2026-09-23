# 03 — Growth strategy: 129 → 2,000 trackers

## 1. What the numbers actually say

| Metric | Value |
|---|---|
| Active trackers | 129 |
| Customers | 37 |
| Average trackers per customer | **3.5** |
| Churn | **Zero** |
| Acquisition channel | Cold outreach + personal connections (+ one informal referrer) |
| Hardware margin | **Zero** — trackers cost $90, sold at cost |
| Installation margin | **Zero** — given away deliberately, to remove friction |
| Target | ~2,000 trackers |

Three findings fall straight out of this.

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

### Finding 2: 3.5 trackers per customer is the real problem

At the current average, reaching 2,000 trackers requires roughly **535 customers**. Acquired one at a time
through cold outreach, that is not a plan — it's a decade.

Raise the average to 10 and the same target needs about **190 customers**. Same revenue, a third of the
relationships to win and support.

And the fastest source of that lift is not new customers at all — see §4.

### Finding 3: The zero-margin model makes scale mathematically impossible

Giving hardware and installation away at cost is the right instinct at 129 trackers — friction kills small
deals, and the payback comes through a subscription that, with zero churn, runs effectively forever. But the
same decision creates two hard walls on the way to 2,000, and both come from the same root.

---

## 2. The two walls

### Wall 1 — Working capital

Going from 129 to 2,000 trackers means buying **1,871 trackers × $90 = ~$168,000 of hardware**, paid out
before a dollar of it comes back, plus the labour to install every one of them. At current scale that cost is
invisible. At the target it is the entire game, and no amount of sales effort gets past it.

The business currently funds each tracker out of pocket and recovers it over months. That works while you are
adding a few trackers a month. It cannot fund hundreds.

### Wall 2 — No margin to share with a channel

**You already have proof the channel model works for you.** A machine technician, unpaid and unmanaged, sends
you customers. That is the single strongest signal in the business — it says there is a class of tradesperson
who is already inside your customer's yard, already trusted, and already willing to recommend you.

But you cannot build a partner network on a product with no gross margin. A referral partner needs a cut of
something, and right now hardware is at cost, installation is at cost, and the subscription is shared with
QuikTrak. There is nothing to pay them with.

**The one lever with genuine leverage is closed off by a pricing decision.**

---

## 3. The fix: keep zero friction, stop giving away the margin

The friction argument for free hardware and installation is correct, and should be preserved. But "free to the
customer on day one" and "no margin" are not the same thing, and conflating them is what created both walls.

**Move from "hardware at cost, month to month" to "zero upfront, amortized into the subscription, on a
36-month term."** The customer's experience is unchanged — they still pay nothing to get started. What changes
is that the monthly price now covers hardware recovery, installation, a partner's cut, and actual profit.

Illustrative, at a $45/month rate (fill in your real figures — see §8):

| Component | Per tracker / month |
|---|---|
| Hardware recovery ($90 ÷ 36) | $2.50 |
| Installation recovery (~$225 ÷ 36) | $6.25 |
| QuikTrak platform cost | ~$8.00 |
| Channel partner share (15%) | $6.75 |
| **Gross margin retained** | **~$21.50** |

Compare that to the current model at, say, $25/month with no partner: roughly $8/month retained, and nothing
to offer a referrer. The difference between those two rows is the difference between a business that can
recruit a channel and one that cannot.

### Why a term commitment is safe here specifically

Normally asking for a 36-month term costs you deals. **With zero churn it costs you almost nothing** — your
customers aren't leaving anyway. The contract isn't there to trap anyone. It exists so that:

- the hardware investment is contractually matched to its recovery period, and
- **contracted MRR becomes financeable.** A lender or a receivables facility will advance against committed
  contract revenue in a way they never will against month-to-month. That is how Wall 1 gets solved: the
  pricing change funds the hardware.

### You are probably underpriced

Zero churn across 37 customers, with no price experimentation, is very often a symptom of underpricing —
nobody leaves because it is too cheap to be worth the bother of switching. Note also who you're comparing
against: the $20–25/month players are self-serve OBD dongles with no installation, no local support, and no
ability to handle machines. **You install it, you support it, and you track equipment as well as vehicles.**
That is a materially different product and it can carry a materially higher price.

**Fastest cash in the business:** a modest increase on the existing base. 129 trackers × $10/month = **$1,290
per month, ~$15,500 per year** — which funds roughly 170 trackers of hardware. Given zero churn, the risk of
that is low and it is testable on a handful of accounts first.

---

## 4. Lever 1 — Expand inside the 37 accounts you already have

**This is the highest-return action available and it is phone calls, not engineering.**

Your customers are fleet businesses with trucks *and* machines. At 3.5 trackers each, they are almost
certainly tracking a fraction of what they own. A customer with 3 trackers and 14 machines is not a small
customer — they're a large customer you've sold 20% of.

The arithmetic:

| Scenario | Trackers |
|---|---|
| Today: 37 customers × 3.5 | 129 |
| Same 37 customers × 10 | **370** |
| Same 37 customers × 15 | **555** |

**Nearly 3x growth with zero new customers, zero CAC, and no sales cycle** — just expansion into accounts that
already trust you and have never churned.

**Do this in the next 30 days.** Call all 37. Two questions:

1. *How many vehicles and machines do you own in total?*
2. *What's not tracked, and why not?*

The first answer is your entire near-term pipeline, quantified. The second is worth more than any market
research you could buy — it tells you whether the blocker is cost, installation hassle, not knowing it was
possible, or something about the product. Whatever comes back is the thing to fix.

Track the answers in a spreadsheet: customer, total assets, tracked, untracked, stated reason. That sheet
becomes the operating document for the next year.

---

## 5. Lever 2 — Formalize and replicate the referral channel

The machine technician is an accidental channel partner. Make him a real one, then find ten more like him.

**Pay recurring, not a bounty.** A one-time finder's fee buys one referral. A percentage of the subscription,
paid for as long as the account is active, buys a partner who keeps selling. At 15% of a $45/month tracker, a
partner with ten 5-tracker accounts earns ~$340/month in passive income — real money to a tradesperson, and it
compounds for them exactly as it does for you.

**Who to recruit** — people already standing in your customer's yard, with a trusted reason to be there:

- Heavy equipment mechanics and mobile repair techs (proven — you have one)
- Equipment and truck dealers — tracker fitted at point of sale
- **Equipment rental yards** — they need tracking on their own fleet *and* they touch every contractor in the region
- Auto electricians, upfitters, installers
- Insurance brokers — theft recovery is a real hook

**The pitch:** *"You're already in their shop fixing their machine. Mention us, we do the install, and you get
paid every month for as long as they stay a customer."*

**The arithmetic:** 10 active partners × 4 customers a year × 8 trackers = **320 trackers a year**, and unlike
cold outreach it compounds — partners get better at it, and referred customers refer.

Start with one: put your machine technician on a written recurring agreement this month and see what he does
when there's money in it.

---

## 6. Lever 3 — Verticalize the outreach you're already doing

Thirty-seven customers from cold outreach with zero churn means **the pitch works**. Don't abandon it —
concentrate it.

Look at the 37 and find the densest industry. Then go all-in on that vertical: same language, same references,
same trade associations, same trade shows. In a tight trade community, five reference customers who all know
each other is worth more than fifty scattered logos.

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

**A realistic three-year path**, requiring roughly $170k of hardware financing along the way — which the
pricing change is what makes fundable.

What it is *not* is more of the current motion. Thirty-seven customers came from founder-led cold outreach;
535 will not. The change isn't effort, it's mechanism: expansion and channel instead of one-at-a-time direct sales.

---

## 8. Next 30 days

1. **Call all 37 customers.** Total assets owned vs. tracked, and why the rest isn't. Build the sheet. *(Week 1–3)*
2. **Put the machine technician on a written recurring referral agreement.** *(Week 1)*
3. **Decide the new pricing model** — zero upfront, 36-month term, rate that carries hardware + install +
   partner margin. *(Week 2)*
4. **Test a price increase** on 3–5 existing accounts before rolling it out. *(Week 3–4)*
5. **List 20 potential channel partners** — mechanics, dealers, rental yards, installers — and contact the
   first five. *(Week 4)*

Note that none of this is engineering. The engineering that matters is in
[doc 02](./02-api-observability.md) and [doc 05](./05-self-serve-stripe.md), and it's there to keep the
platform from breaking as volume grows and to let customers buy without you — not to grow the business
directly.

---

## 9. Inputs still needed

The pricing model in §3 is parameterized because these numbers aren't known here:

| Input | Why it matters |
|---|---|
| Current monthly price per tracker | Sets the baseline for the new model and the size of the increase |
| What QuikTrak charges per tracker per month | The floor under any pricing decision, and it determines whether channel margin is even available |
| Installation time and loaded labour cost per unit | The largest hidden cost in the model; drives both the amortization and whether installation should stay free at volume |
| Concentration of the 129 | If one customer holds 20+, revenue concentration is a risk worth naming |

Fill these in and §3's table becomes a real financial model rather than an illustration.

# Recono GPS — Strategy & Implementation Plan

*Last revised September 2026.*

The business has **129 active trackers across 37 customers, with zero churn**, and a target of a couple of
thousand trackers. This folder is the plan for getting there.

## The short version

**Zero churn is the headline.** The product works, customers stay, and everything added compounds. That
settles the diagnosis: this is a **distribution and pricing problem, not a product problem.** Nothing in this
codebase is why there are 129 trackers rather than 2,000.

**The economics are better than they look.** At $25 a tracker with $5 going to QuikTrak, gross margin is
**$20 per tracker per month — 80%**. Hardware and installation pass through to the customer at cost. With zero
churn that puts lifetime value around **$4,200 per customer** and an affordable acquisition cost near
**$1,400** — against the **$0 of cash currently spent acquiring anyone.**

So the constraint isn't that the money to grow doesn't exist. It's that:

- **Founder time is the only sales channel.** 37 customers came from cold outreach. Reaching 2,000 trackers at
  today's 3.5 per customer needs ~535 customers, which no amount of founder-led selling delivers. Acquisition
  has to become a variable cost paid out of margin — which is exactly what a channel does.
- **$25 is below the market floor.** SMB fleet telematics runs $30–75 per vehicle. You sit under the
  self-serve OBD dongles, while installing, supporting and tracking machines they can't. A move to $35 is
  **+$15,500 a year of almost pure profit** on the existing base alone — and it means a *partner-sold* tracker
  nets more than a tracker sold direct does today. **The channel pays for itself.**
- **The customer's upfront cost is a conversion barrier.** At cost is not free: ~$90 plus installation per
  vehicle, so a five-machine contractor writes a four-figure cheque before the service has proved itself.
  That is the likely reason accounts stall at 3.5 trackers.

The fastest growth available needs no new customers at all: **at 3.5 trackers per customer, the existing 37
accounts are tracking a fraction of what they own.** Lifting that average to 10 is ~3x growth with no
acquisition cost. That's phone calls, and it's the first thing to do.

**The ELD / electronic logbook direction was investigated and set aside** — 117 certified products already on
Transport Canada's register, price erosion toward $20/truck/month, ~US$50k per platform to certify with a
permanent recertification treadmill, and a hard ECM hardware requirement. The research is preserved in
[archive](./archive/README.md) in case the business later wins fleets that require it.

## Documents

| # | Document | What it covers |
|---|---|---|
| 01 | [Current state assessment](./01-current-state.md) | Architecture map and a risk register with file references |
| 02 | [API observability & vendor de-risking](./02-api-observability.md) | Contract validation, error tracking, synthetic monitoring, the backend proxy |
| 03 | [**Growth strategy**](./03-growth-strategy.md) | Pricing and unit economics, account expansion, the channel model, the path to 2,000 |
| 05 | [Self-serve onboarding & Stripe](./05-self-serve-stripe.md) | Finishing the half-built activation and payment flow |
| 06 | [Roadmap and priorities](./06-roadmap.md) | How the growth and engineering tracks sequence |
| — | [Archive](./archive/README.md) | ELD certification and architecture research, set aside |

## Where the effort goes

**Growth work comes first and it isn't engineering** — pricing, calling the existing 37 accounts, formalizing
the referral channel. That is what moves the tracker count.

**Engineering exists to keep growth from being capped or reversed.** Two things matter: de-risking the QuikTrak
API before a silent breakage at 1,000 trackers becomes a company-ending support event
([doc 02](./02-api-observability.md)), and finishing self-serve so a channel partner can sell without a human
processing every order ([doc 05](./05-self-serve-stripe.md)).

If the two tracks ever compete for time, growth wins.

# Recono GPS — Strategy & Implementation Plan

*Last revised September 2026.*

The business has **129 active trackers across 37 customers, with zero churn**, and a target of a couple of
thousand trackers. This folder is the plan for getting there.

## The short version

**Zero churn is the headline.** The product works, customers stay, and everything added compounds. That
settles the diagnosis: this is a **distribution and unit-economics problem, not a product problem.** Nothing in
this codebase is why there are 129 trackers rather than 2,000.

Two things block scale, and both trace to one pricing decision:

- **Working capital.** Reaching 2,000 trackers means ~$168,000 of hardware bought before any of it is
  recovered. Hardware is currently sold at cost.
- **No channel margin.** A machine technician already refers customers for free — proof the channel model
  works here. But with hardware and installation both at cost, there is nothing to pay a partner with, so the
  one lever with real leverage stays closed.

The fix keeps the friction advantage that made zero churn possible — **customers still pay nothing upfront** —
but amortizes hardware, installation and a partner's cut into a higher monthly rate on a 36-month term. With
zero churn, a term commitment costs almost nothing and makes the contracted revenue financeable.

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

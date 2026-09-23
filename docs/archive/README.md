# Archive

Research kept for reference, not part of the active plan.

## ELD / electronic logbook (archived September 2026)

Two documents investigating whether to build and certify an Electronic Logging Device for the Canadian market:

- [eld-canada-certification.md](./eld-canada-certification.md) — the regulation, the accredited certification bodies, process, cost, timeline, and the ECM hardware gate
- [eld-architecture.md](./eld-architecture.md) — RODS data model, HOS rule engine, ingestion modes, roadside inspection

**Why it was set aside.** The research found the market saturated rather than underserved — 117 certified products already on Transport Canada's register, price erosion toward ~$20/truck/month, and a certification cost of roughly US$50k per platform with a permanent recertification treadmill (standard 1.2 → 1.3 → 1.3.1 in under a year). On top of that, the standard requires ECM synchronization, so a phone-only app cannot be certified — it is necessarily a hardware play.

Separately, and more decisively: the current customer base does not need ELDs, and the real growth constraint turned out to be distribution and unit economics rather than missing product capability. See [../03-growth-strategy.md](../03-growth-strategy.md).

**When this might become relevant again.** If the business reaches a few thousand trackers and starts winning federally regulated trucking fleets, ELD becomes a checkbox those deals require. At that point the right move is almost certainly to **license a white-labelled certified ELD** (FPInnovations offers white-label and product-family certification paths) rather than build and certify one — buy the compliance checkbox, keep the engineering on the platform. The regulatory research in these documents holds up and would save the discovery work.

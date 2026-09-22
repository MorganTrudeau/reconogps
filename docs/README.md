# Recono GPS — Strategy & Implementation Plan

This folder is the working plan for three linked pieces of work:

1. **De-risking the QuikTrak vendor API** so a breaking change on their side cannot brick our app, and so we can pinpoint a failure to an exact endpoint within seconds.
2. **Becoming a certified Canadian Electronic Logging Device (ELD)** — the regulatory path, the technical gap, the cost, and an honest read on whether it's worth it.
3. **Finishing self-serve onboarding** (add your own assets → buy hardware → pay by Stripe → device activates), which is both new revenue today and a hard prerequisite for the ELD play.

## Documents

| # | Document | What it covers |
|---|---|---|
| 01 | [Current state assessment](./01-current-state.md) | Architecture map, and a risk register of what is actually in the repo today with file references |
| 02 | [API observability & vendor de-risking](./02-api-observability.md) | Error/API tracking design, contract validation, synthetic monitoring, the backend proxy strategy |
| 03 | [Canadian ELD certification](./03-eld-canada-certification.md) | The regulation, the certification bodies, the process, cost, timeline, and the hardware gate |
| 04 | [ELD product architecture](./04-eld-architecture.md) | Data model, HOS rule engine, manual vs. automatic logging, roadside inspection, what must live on our own backend |
| 05 | [Self-serve onboarding & Stripe](./05-self-serve-stripe.md) | Finishing the half-built activation + payment flow, fulfilment, subscription lifecycle, app-store rules |
| 06 | [Roadmap, cost and decisions](./06-roadmap.md) | Phasing, effort, budget, go/no-go gates, and the recommendation |

## Executive summary

**On the vendor API risk.** The fear is well-founded and the repo shows why. The whole asset list is decoded from
untagged positional arrays (`utils/assets.ts:210`, `utils/assets.ts:312`) — roughly 80 fields read by index. If
QuikTrak inserts one column anywhere in that array, every field after it silently shifts to the wrong place. No
exception is thrown. The app just shows wrong data. On top of that, three production code paths point at the
vendor's **test** environment (`testapi.quiktrak.co`), the error envelope carries no endpoint or status context, and
there is no crash or error reporting in the project at all.

**But the conclusion "so releasing our own app isn't worth it" is backwards.** Today a vendor break is fixable only
by shipping a new binary through two app stores — days, at Apple's discretion. The single highest-leverage change
available is to route every vendor call through our own thin backend proxy. Then a breaking change is a server-side
patch deployed in minutes, with no app release, for both our app *and* eventually the Cordova one. That capability
only exists if we own the client. It is the strongest argument *for* releasing our own app, not against.

**On ELD.** The market read is right — Canada mandates ELDs, the fit with asset tracking is real, and it is a
legitimate second reason to own the app. But three things need to be understood before committing:

- Canada does **not** allow self-certification (unlike the US). An ELD must be tested and certified by a
  Transport Canada accredited third party — currently FPInnovations (PIT Group), CSA Group, and COMDriver Tech —
  against 400+ test procedures. Publicly reported cost is on the order of **US$50k per device/platform**, roughly
  doubling if both iOS and Android are certified, plus ongoing surveillance and recertification.
- The technical standard requires ELDs on model-year-2000-and-newer commercial vehicles to read **engine data from
  the vehicle's ECM** — engine power status, engine hours, odometer, VIN. **A phone-only app cannot be certified for
  those trucks.** This is the single biggest technical gate, and it means ELD is a hardware play. That happens to
  align perfectly with the "sell our own GPS trackers" plan, but the trackers must be ECM/J1939-connected.
- The mandate binds **federally regulated carriers** (extra-provincial, GVWR ≥ 4,500 kg). Several provinces have not
  mandated it for intra-provincial carriers. A lot of "businesses with trucks and machines in their fleet" may not
  legally need an ELD at all. **Survey the existing book of business before spending a dollar on certification.**

**Recommended sequence.** Do not gate the app release on ELD.

- **Phase 0 (2–4 weeks)** — observability + proxy foundation. Worth doing regardless; directly answers the
  "they brick my app" fear; makes our app demonstrably safer than the Cordova one. *Ship the app after this.*
- **Phase 1 (4–8 weeks)** — finish self-serve + Stripe. New revenue now, and the prerequisite for selling ELD hardware.
- **Phase 2 (runs in parallel, weeks 1–12, low cost)** — ELD discovery: customer survey, quotes from all three
  certification bodies, gap analysis against Technical Standard 1.3, hardware/ECM decision. This is the go/no-go gate.
- **Phase 3 (6–12 months, only if Phase 2 says go)** — build and certify.

Sources for the regulatory claims are listed at the end of [document 03](./03-eld-canada-certification.md).

# 03 — Getting recognized as a certified ELD in Canada

Everything below is research as of **September 2026**. Regulatory details change; treat this as the map, and
confirm every number directly with Transport Canada, CCMTA and the certification bodies before committing budget.
Sources are listed at the bottom.

---

## 1. The regulation in one page

**The law.** The *Commercial Vehicle Drivers Hours of Service Regulations* (SOR/2005-313), amended by
SOR/2019-165, require an ELD. The mandate came into force **12 June 2021**, with a progressive-enforcement
period that ended **1 January 2023**. Enforcement is now full.

**Who must use one.** Federally regulated carriers — i.e. **extra-provincial** operations (crossing a provincial
or international border) — running a commercial motor vehicle with a **GVWR of 4,500 kg or more**.

**Who doesn't.**
- Vehicles with a **model year before 2000** (determined by the VIN, not the engine).
- Driveaway-towaway operations (the vehicle is the cargo).
- Vehicles under a rental agreement of **30 days or less**.
- Operations under a statutory exemption or a Transport Canada permit.
- Drivers who are otherwise exempt from keeping a daily log (short-radius operations etc.).
- **Intra-provincial carriers**, unless their province has adopted the requirement. Reporting indicates
  Alberta, Saskatchewan, Prince Edward Island and Nunavut have not mandated ELDs for provincially regulated
  carriers. **Verify current provincial status directly — this is the single most important commercial fact
  in this document.**

**The technical standard.** *Technical Standard for Electronic Logging Devices*, published by CCMTA:

| Version | Date | Status |
|---|---|---|
| 1.2 | 27 Oct 2020 | The version most currently certified devices were tested against |
| 1.3 | 29 Sep 2025 | Published; Transport Canada leading the transition/coming-into-force |
| 1.3.1 | 22 Jul 2026 | Replaces 1.3. Adds concurrent authentication for team drivers, clarifies driver notifications and multi-unit RODS recording |

**This matters enormously for us.** Anyone certifying today has to target a *moving* standard, and existing
certified vendors have to re-test. That is a cost for us, but it is also the one genuine opening: incumbents are
re-certifying too, so a new entrant is not as far behind as it looks. Get the transition dates from Transport
Canada in writing before scoping.

---

## 2. Canada is not the US: no self-certification

This is the crux of the whole exercise.

In the US, a vendor **self-certifies** their ELD and registers it with FMCSA. It costs almost nothing and takes
days. That is why there are hundreds of US ELDs and why FMCSA regularly removes non-compliant ones.

In Canada, an ELD **must be tested and certified by a third-party certification body accredited by Transport
Canada**, and certification bodies are themselves accredited by the **Standards Council of Canada** under
**ISO/IEC 17065**. Certification is contingent on passing **400+ test procedures**. The motor carrier is legally
responsible for using only a certified device, and Transport Canada publishes both a list of certified ELDs and
a list of devices that are **no longer certified**.

**Accredited certification bodies (confirm the current registry before contacting):**

| Body | Notes |
|---|---|
| **FPInnovations** (via its **PIT Group** division) | First accredited, Oct 2020. Publishes an explicit certification service with initial, **product-family**, and **white-labelled product** evaluation paths. |
| **CSA Group** (Mississauga, ON) | Second accredited body. |
| **COMDriver Tech** | Third accredited body. |

The white-label and product-family options are commercially significant for us — see §5.

---

## 3. The certification process

Drawn from FPInnovations' published process; CSA and COMDriver are procedurally similar.

1. **Get the device and app actually ready.** Not a prototype. The submitted build is the build that gets certified.
2. **Request the application package** from the certification body's certification team.
3. **Complete the application + pre-verification assessment.** This is a self-assessment against the standard —
   in practice it's where most first-timers discover they have months of work left. It is also cheap, which makes
   it the ideal gate for our Phase 2 go/no-go.
4. **Sign the certification agreement** (this is where the fee schedule becomes concrete).
5. **Ship the devices** (hardware units + the app builds) to the body for testing.
6. **Testing against the Canadian ELD Test Procedures** — the 400+ tests. FPInnovations states the validation
   window is roughly **three to four weeks** once testing starts. That is the *testing* window, not the
   end-to-end timeline.
7. **Internal review → recommendation → Certification Authority decision.**
8. **Listing.** The certified device appears on Transport Canada's public list of certified ELDs. *This is the
   "recognized by the Canadian government" moment — and the marketing asset.*
9. **Ongoing.** Surveillance and periodic re-testing to stay certified, plus re-certification when the technical
   standard version changes. A certified device can be **decertified**, at which point carriers using it must
   stop — a fleet's whole operation depends on us staying on that list. That is both the moat and the liability.

**Realistic end-to-end timeline for a new entrant: 9–18 months** from decision to listing. Reported industry
experience is "up to a year" to get an ELD approved, and that assumes the product is already largely built and
correct. A failed test round means fixing, re-submitting and re-queuing.

**Cost.** Reported industry figures put certification at **roughly US$50,000 per device/platform, and about
double if both iOS and Android are certified**. Treat that as an order of magnitude, not a quote. Get written
quotes from all three bodies. Budget on top of that:

| Item | Rough order |
|---|---|
| Certification fees (both platforms, one hardware model) | US$50k–120k |
| Re-test after a failed round (assume one) | +25–50% of the above |
| Recertification against a new standard version (recurring) | Recurring, unbudgeted at your peril |
| Engineering to build a compliant ELD (see doc 04) | 6–12 person-months minimum |
| Legal/regulatory advisory | $15k–40k |
| ECM-connected hardware development or sourcing | Depends entirely on §4 |

---

## 4. The hardware gate — read this before anything else

**An ELD must be integrally synchronized with the vehicle's engine control module (ECM).** The standard requires
the ELD to establish a link to the engine ECM and automatically receive **engine power status, vehicle motion
status, total vehicle distance (odometer) and total engine hours**, and to automatically capture the **VIN** when
it is available on the ECM or databus. In practice that means hardwired or plugged into the diagnostic port —
**J1939, J1708 or OBD-II**.

The consequences:

- **A phone-only app cannot be certified as an ELD** for model-year-2000-and-newer commercial vehicles. Phone GPS
  is not an acceptable substitute for ECM odometer and engine hours. Any plan that is "our app is the logbook"
  stops here.
- **Therefore ELD is necessarily a hardware play** — which is exactly the direction already intended ("they'd buy
  our GPS trackers"). The strategy is coherent. But the trackers have to be the right kind of tracker.
- **Immediate action: find out what the QuikTrak/Recono devices actually are.** The repo shows the fleet carries
  IMEIs, product codes, solutions (`QProtect`, `Loc8`, `Track`), engine hours (`launchHours`,
  `initialAccHours`), mileage and ignition/ACC state — which *suggests* at least some units read engine data.
  That is not the same as certifiable J1939/OBD-II ECM synchronization with odometer and VIN. Get the hardware
  spec sheets and confirm:
  - Does the unit connect to J1939 / J1708 / OBD-II, or is it battery/ignition-wire only?
  - Does it report ECM odometer (not GPS-derived distance) and ECM total engine hours?
  - Does it read VIN off the databus?
  - Can it push data in real time, and buffer offline?
  - Is there a documented device-to-app link (BLE) we control?

  If the answer is no, the ELD path requires **sourcing or building different hardware**, which changes the
  entire cost model and probably the supplier relationship.

---

## 5. Three strategic routes — ranked

### Route A — White-label / resell an already-certified ELD *(recommended first move)*

FPInnovations explicitly offers **white-labelled product evaluation and certification**, and **product-family
certification**. If we partner with an existing certified ELD vendor and put our brand and our app around their
certified core, the certification scope collapses — we are certifying a variant of an already-passing product, not
a new one.

- **Pros:** fastest to market (months, not years); dramatically lower cost and risk; we learn the compliance
  domain with real customers before spending $100k+; and it gets us on the certified list, which is the growth
  argument.
- **Cons:** margin shared with the partner; we depend on *another* vendor's platform (the exact pattern we are
  trying to escape with QuikTrak — so the contract must include the change-notice and SLA terms document 02
  recommends); less differentiation.
- **Verify first:** confirm with a certification body exactly how much scope a white-label submission actually
  removes, and what the licensor must provide.

### Route B — Build and certify our own ELD end to end

- **Pros:** full control, full margin, a real moat (the certification requirement is itself a barrier to entry
  that protects us once we're through it), and it composes with the tracking product.
- **Cons:** 9–18 months, US$100k+ in fees alone, 6–12 person-months of engineering, a moving standard (1.3 →
  1.3.1), hardware dependency, and ongoing recertification forever.
- **Only justified once Phase 2 shows real demand.**

### Route C — Ship a non-certified "trip log / duty log" feature

Build the logbook UX — manual duty status, automatic trip detection from our trackers, driver confirmation, PDF
export — and **market it honestly as a record-keeping tool, not an ELD**.

- **Pros:** weeks, not months. Serves the customers who are *exempt* (intra-provincial in AB/SK/PE/NU,
  pre-2000 vehicles, short-radius) and still want logs. Serves machine/equipment fleets, which are outside the
  ELD regime entirely but still want operator hours. **It is also 70% of the work of Route B** — the data model,
  the rule engine, the edit/annotation flow and the driver UX all carry over.
- **Cons:** cannot be called an ELD, cannot be used for compliance by federally regulated carriers, no
  government listing.
- **This is the right thing to build in parallel with Phase 2 discovery.** It de-risks Route B by proving the
  product before the cheque, and it ships value either way.

**Recommendation: Phase 2 discovery → Route C immediately → Route A if discovery is positive → Route B only if
Route A proves the demand and the margin justifies it.**

---

## 6. Phase 2 discovery — the concrete action list

This is the cheap work that decides everything. ~4–8 weeks, mostly not engineering.

1. **Survey the existing customer base.** For every account: federally or provincially regulated? Province?
   Vehicle GVWR and model years? Currently using an ELD, and which one, at what price? Would they switch?
   *If most of the book is provincially regulated equipment fleets in a non-mandating province, ELD is not the
   growth lever it appears to be and this document's answer is Route C only.* Do this first.
2. **Get the standard.** Obtain CCMTA Technical Standard **1.3.1** (and the Canadian ELD Test Procedures, via a
   certification body). Read it properly. Produce a written gap analysis against what we have.
3. **Contact all three certification bodies** — FPInnovations/PIT Group, CSA Group, COMDriver Tech. Ask each for:
   the application package, a written quote for (a) full certification iOS+Android+one hardware model and
   (b) white-label/product-family certification, the current queue time, the 1.3 → 1.3.1 transition dates, and
   what a white-label submission actually requires from the licensor.
4. **Confirm the hardware** — the §4 checklist, in writing, from the supplier.
5. **Scout white-label partners** (Route A): which certified vendors license their platform, on what terms.
6. **Competitive/pricing read:** Geotab, ISAAC Instruments, Samsara, Motive, BigRoad, J.J. Keller, HOS247.
   What do they charge per truck per month, and what is the wedge for us? (Likely: we are the only one who also
   tracks *non-vehicle* assets — machines, trailers, equipment — on the same platform and the same bill.)
7. **Cross-border check:** carriers running into the US need an **FMCSA-registered** ELD as well. US registration
   is self-certification and comparatively cheap. Any serious Canadian ELD product supports both rule sets — scope
   it in from the start, and note it is a much cheaper second market.
8. **Legal review** of carrier-facing liability: if our ELD is decertified or loses data, what is our exposure to
   a fleet that gets fined or put out of service? Get the terms of service and insurance right *before* launch.

**Go/no-go gate at the end of Phase 2:** proceed only if (a) a meaningful share of the customer base is actually
subject to the mandate or willing to buy anyway, (b) the hardware can do ECM sync or a partner's can, and
(c) a written quote plus a realistic engineering estimate lands inside the budget we are prepared to lose.

---

## Sources

Regulatory and process claims above come from the following; the Transport Canada and CCMTA pages are the
authoritative ones and should be re-read directly before acting.

- [Transport Canada — Electronic logging devices (portal)](https://tc.canada.ca/en/road-transportation/electronic-logging-devices)
- [Transport Canada — Certification of electronic logging devices](https://tc.canada.ca/en/road-transportation/electronic-logging-devices/certification-electronic-logging-devices)
- [Transport Canada — Registry of accredited certification bodies](https://tc.canada.ca/en/road-transportation/electronic-logging-devices/registry-accredited-certification-bodies)
- [Transport Canada — List of electronic logging devices](https://tc.canada.ca/en/road-transportation/electronic-logging-devices/list-electronic-logging-devices)
- [Transport Canada — ELD handout for motor carriers and drivers](https://tc.canada.ca/en/road-transportation/electronic-logging-devices/eld-handout-motor-carriers-drivers)
- [CCMTA — Canadian ELD Technical Standard FAQ](https://www.ccmta.ca/en/eld-faq)
- [CCMTA — Technical Standard for ELDs, Version 1.3 (29 Sep 2025)](https://www.ccmta.ca/web/default/files/PDF/ELD/Canadian%20ELD%20Technical%20Standard%201.3%20-%20EN%20-%20September%2029,%202025.pdf)
- [CCMTA — Canadian ELD Standard v1.3.1, Summary of amendments (22 Jul 2026)](https://www.ccmta.ca/web/default/files/PDF/ELD/Canadian%20ELD%20Standard%20ver.%201.3.1%20-%20Summary%20of%20amendments_EN_07-22-2026.pdf)
- [Standards Council of Canada — Transport Canada ELD accreditation program](https://scc-ccn.ca/accreditation/accreditation-programs/product-process-service/transport-canada-electronic-logging-devices)
- [FPInnovations — ELD Certification](https://web.fpinnovations.ca/certification/)
- [Geotab — Canadian ELD certification FAQ](https://www.geotab.com/blog/canadian-eld-certification/)
- [Heavy Duty Trucking — Canada adds third ELD certification body](https://www.truckinginfo.com/10148042/canada-adds-third-eld-certification-body)
- [Trucking Info — Transport Canada decertifies ELDs](https://www.truckinginfo.com/10216340/transport-canada-decertifies-8-elds)
- [RS2000 — The Canadian ELD deadline and certification costs](https://rs2000tax.com/rs2000-tax-blog/the-canadian-eld-deadline-and-certification-costs) (source of the ~US$50k/platform figure — secondary, verify)
- [ISAAC Instruments — Who is exempt from using ELDs in Canada?](https://www.isaacinstruments.com/blog/compliance-regulation/who-is-exempt-from-using-elds-in-canada/)
- [J.J. Keller — Electronic logging devices (Canada)](https://jjkellercompliancenetwork.com/regsense/electronic-logging-devices-canada)
- [Justice Laws — Commercial Vehicle Drivers Hours of Service Regulations (SOR/2005-313)](https://laws-lois.justice.gc.ca/eng/regulations/SOR-2005-313/page-2.html)

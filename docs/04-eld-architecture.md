# 04 — ELD product architecture

How the logbook is actually built, on top of what's in the repo today. This design is written so that **Route C**
(a non-certified trip/duty log, shippable in weeks) is a strict subset of **Route B** (a certifiable ELD) — same
data model, same rule engine, same UX. Nothing built for C is thrown away.

---

## 1. The hard constraint: this cannot live on the vendor API

The record of duty status (RODS) is a **regulated legal record**. It must be tamper-evident, retain original
values through every edit, be available to the driver for the current day plus 14 days, be retained by the
carrier per the HOS regulations, and be producible at roadside on demand. It also must not silently change
shape because a third party shipped a release.

So: **RODS data lives in our own backend and nowhere else.** The QuikTrak API is a *position and telemetry
source* feeding our ingestion pipeline — nothing more. This is the same backend document 02 Layer 5 calls for,
which is why building the proxy first is not a detour.

```
                     ┌──────────────────────────────┐
ECM-connected ──────▶│  Ingestion                   │
tracker (J1939/OBD)  │  - position + engine events  │
   │                 │  - dedupe, order, backfill   │
   │ (via QuikTrak   └──────────────┬───────────────┘
   │  or direct)                    │
   │                                ▼
   │                 ┌──────────────────────────────┐        ┌────────────────────┐
Driver app ─────────▶│  RODS service (our backend)  │◀──────▶│ HOS rule engine    │
 - duty status       │  - append-only event log     │        │ (Cycle 1/2, 13/14/ │
 - login/logout      │  - edits keep originals      │        │  16, 8+2, deferral)│
 - certify logs      │  - malfunction/diagnostics   │        └────────────────────┘
 - roadside display  │  - output file generation    │
 - offline queue     └──────────────┬───────────────┘
                                    ▼
                     ┌──────────────────────────────┐
Carrier web portal ─▶│  Transfer: email / web svc,  │──▶ Authorized safety official
                     │  optional USB / Bluetooth    │
                     └──────────────────────────────┘
```

**Stack recommendation:** Cloud Run + **PostgreSQL** (Cloud SQL) for RODS. Not Firestore — RODS is relational,
needs strong transactional guarantees, needs auditable append-only semantics, and needs real queries across
drivers/dates for the carrier portal and for producing an inspection output file. Keep Firebase for auth, push
and the existing callable functions.

---

## 2. Data model

Append-only event log. **Records are never updated or deleted** — a correction is a new record that supersedes
an earlier one, and the original stays queryable forever. This is a certification requirement, and it is also
just the right design.

```
carrier          id, name, usdot/nsc number, home_terminal_address, home_terminal_timezone, cycle_default
driver           id, carrier_id, name, licence_number, licence_province, eld_username, exempt_flag + reason
vehicle          id, carrier_id, unit_number, vin, plate, imei (link to StaticAsset.imei), eld_serial
eld_device       id, serial, model, firmware, certification_number, registration_id
duty_event       id, driver_id, vehicle_id, seq,
                 type,                    -- off_duty | sleeper | driving | on_duty_not_driving
                 origin,                  -- automatic | driver | carrier_proposed | unidentified
                 status,                  -- active | inactive_changed | inactive_change_requested | inactive_change_rejected
                 event_at_utc, recorded_at_utc, timezone_offset,
                 lat, lng, location_description, distance_since_last_valid_coords,
                 odometer_km, engine_hours,       -- from ECM, not GPS
                 supersedes_event_id, annotation, edit_reason,
                 data_check_value                 -- tamper-evidence checksum
engine_event     power_on / power_off, with odometer, engine hours, lat/lng, timestamp
login_event      driver login / logout, with the same context fields
malfunction      code, detected_at, cleared_at            -- P/E/T/L/R/S/O codes per the standard
diagnostic       code, detected_at, cleared_at            -- 1..6 per the standard
certification    driver_id, log_date, certified_at, recertified_count
unidentified_log duty events with no driver, held for carrier assignment
output_file      generated inspection file + transfer receipt
```

**Non-negotiable rules, straight from the standard — get these right from day one:**

- **Automatically recorded driving time can never be shortened or reassigned by a driver.** A driver may
  annotate it, and may request a change, but the original driving record stands. The *only* mechanisms for
  reclassifying driving are **personal conveyance** and **yard moves** (selected *before* the movement, with an
  annotation), and carrier assignment of **unidentified driving**.
  → **This directly constrains the "here are your trips today, confirm them" idea.** See §5.
- **Every edit requires an annotation** (minimum character count per the standard) and preserves the original.
- **Location for automatic events is recorded at a defined precision**; the ELD must not permit manual location
  entry to substitute for it except where the standard allows.
- **The ELD must be tamper-evident**: unauthorized access must not be able to alter records, and the device
  must detect and record attempts. A data-check value per record plus append-only storage plus signed sync is
  the standard shape.

---

## 3. HOS rule engine

A pure, deterministic, heavily unit-tested module: `(driver, events[], now) → { available, violations[], warnings[] }`.
No I/O, no dates from the device clock. This is the single most test-worthy piece of code in the product.

Canadian federal rules it must implement (south of latitude 60°N):

| Rule | Limit |
|---|---|
| Daily driving | max **13 hours** |
| Daily on-duty | max **14 hours** |
| Elapsed window | all driving within **16 hours** of coming on duty |
| Daily off-duty | min **10 hours**, of which **8 must be consecutive**; the other 2 may be split in blocks of ≥ 30 min |
| Cycle 1 | max **70 on-duty hours in 7 days** |
| Cycle 2 | max **120 on-duty hours in 14 days** (with the mandatory 24-h off-duty requirement before hour 76) |
| Cycle reset | **36 consecutive hours off** (Cycle 1) / **72 consecutive hours off** (Cycle 2) |
| Off-duty deferral | up to **2 hours** of day-1 off-duty deferred to day 2, under the standard's conditions |
| Mandatory off-duty | **24 consecutive hours off** in the preceding 14 days |

Also required: **north of 60°N** variants, **team driving** (and, per standard 1.3.1, **concurrent
authentication for team drivers** — build for two simultaneously authenticated drivers from the start),
**personal conveyance** and **yard move** special statuses, **adverse driving conditions** and **emergency**
provisions, and **US FMCSA rule sets** for cross-border carriers (11/14/60/70, 30-minute break, split sleeper).

Design the engine as pluggable rule sets from day one — `CA_SOUTH_60`, `CA_NORTH_60`, `US_60_7`, `US_70_8` —
rather than hardcoding Canadian numbers. Retrofitting this later is a rewrite.

**Testing:** table-driven test vectors, one per rule, per edge case, including timezone boundaries, DST
transitions, deferral across midnight, and cycle resets. This test suite is also evidence for the certification
body and the thing that makes a 400-test certification round survivable.

---

## 4. Ingestion — two modes

### Mode 1: manual / phone-based (ships first, Route C)

The driver sets duty status in the app. Phone GPS stamps location. Trips can be *suggested* from phone motion.

- Ships in weeks; works for every customer, no hardware.
- **Not certifiable** for MY2000+ CMVs — no ECM odometer, no engine hours, no VIN. Market it as a trip/duty log.
- Needs background location (`expo-location` is already a dependency) with proper iOS
  `UIBackgroundModes: location` + "Always" permission, Android foreground service + battery-optimization
  exemption guidance, and an offline queue. Note that `services/DynamicAssetDataLoader.tsx` explicitly stops
  polling when backgrounded — duty-status capture must **not** reuse that pattern.

### Mode 2: automatic / tracker-based (the ELD path, and the reason to sell hardware)

The ECM-connected tracker is the source of truth for driving time, odometer and engine hours. The phone is the
driver interface and the display; the tracker is the recorder.

- Ingest engine power on/off, motion start/stop, odometer, engine hours from the device.
- Derive `driving` automatically at the standard's thresholds (movement ≥ 8 km/h starts driving; driving ends
  after 5 consecutive minutes stationary with no driver response within 1 minute — confirm exact values against
  standard 1.3.1).
- The app pairs to the device (BLE) so the driver's identity attaches to the vehicle's records, and so roadside
  display works without connectivity.
- **Dependency:** this requires the hardware questions in [doc 03 §4](./03-eld-canada-certification.md) to be
  answered yes, and it requires either a real-time feed from QuikTrak (their positions API, polled/streamed) or
  a direct device feed to our backend. **A direct feed is strongly preferable** — putting a regulated record's
  ingestion path through the vendor API we're trying to de-risk reintroduces the exact problem.

---

## 5. The "confirm your trips" idea — what's allowed and what isn't

The instinct is right and it is genuinely the best UX in this category. But it has to be built inside the rules:

**Allowed and good:**
- Present the day's automatically detected trips as a timeline and ask the driver to **certify** the log. Log
  certification is a required ELD function, so this *is* the compliant flow, not a workaround.
- Ask the driver to classify the **non-driving** gaps: off-duty vs. sleeper vs. on-duty-not-driving. This is
  where almost all the genuine ambiguity lives, and it is fully editable.
- Let the driver **annotate** anything ("detour, road closure on Hwy 1").
- Let the driver claim **unidentified driving** records that belong to them, and let the carrier propose
  assignments the driver accepts or rejects.
- Prompt for **personal conveyance** / **yard move** *before* the movement, with an annotation.
- For Mode 1 (non-certified), where everything is manual anyway, the confirmation flow is unconstrained — and
  it is a great product.

**Not allowed:**
- Letting a driver delete, shorten or reassign automatically recorded driving time. That is the bright line.
  The UI must make reclassification of driving *impossible*, not merely discouraged — a certification body will
  test exactly this.
- Silently dropping a trip the driver doesn't confirm. Unconfirmed is still recorded; it's just uncertified.

So the shipping UX is: **"Here's your day. Fill in what you were doing when you weren't driving, add notes, and
sign it."** Driving time is presented as fact.

---

## 6. Roadside inspection and data transfer

Required capability: on demand, produce and transfer records for **the current 24-hour period plus the previous
14 consecutive days**.

- **Display mode** — a dedicated, read-only screen an officer can operate, showing the graph grid and the
  required header data. **Must work with no connectivity** — cache locally, encrypted. This is the mode most
  likely to be used and the one most often botched.
- **Transfer** — the standard requires **email** transfer of the output file at minimum; **web services** is
  the other primary method. **USB 2.0 and Bluetooth** local transfer are optional additions. Confirm the exact
  required set against standard 1.3.1 before building.
- **Output file** — exact format, field order, encoding and file naming are specified in the standard. Build a
  generator plus a validator, and test against the certification body's test procedures. Do not hand-roll this
  from a blog post; work from the standard document.
- Display the **ELD certification number / registration ID** where the standard requires it.

---

## 7. Malfunctions and data diagnostics

An ELD must self-monitor and record malfunctions and diagnostic events, notify the driver visually/audibly, and
carry the documented fallback procedure (revert to paper logs, carrier must repair within 14 days). Categories:
power, engine synchronization, timing, positioning, data recording, data transfer, and "other". Each maps to a
detection rule, a driver-facing notification, and a record.

This is a large, unglamorous chunk of work that first-time ELD builders consistently underestimate. Budget for it.

---

## 8. Build order (Route C first, Route B is a superset)

| Step | Scope | Certifiable? |
|---|---|---|
| 1 | Backend: RODS schema, append-only event log, auth, carrier/driver/vehicle model | foundation |
| 2 | HOS rule engine + full test-vector suite (CA south/north of 60, then US) | foundation |
| 3 | Driver app: duty status, daily log graph grid, edits + annotations, certification | Mode 1 — **ship this** |
| 4 | Carrier web portal: driver list, logs, violations, unidentified driving assignment, retention/export | Mode 1 |
| 5 | Automatic trip detection from tracker data + the confirmation flow of §5 | Mode 2 |
| 6 | ECM integration: odometer, engine hours, VIN, engine power events | **required for cert** |
| 7 | Malfunction/diagnostic monitoring + driver notifications | **required for cert** |
| 8 | Output file generation + email/web-services transfer + roadside display mode | **required for cert** |
| 9 | Tamper-evidence, data-check values, security review, penetration test | **required for cert** |
| 10 | Pre-verification self-assessment → certification body engagement | → certification |

Steps 1–4 are the Route C product and are worth shipping on their own merits. Steps 5–10 are the certification
delta.

# K Performance Assessment App — Project Brief (v1.4)

*For Claude Code. Built the same way as kperformance.uk and its /calculator page — direct file edits, git, deployed via Netlify. This document is the complete starting context; no need to reconstruct it from conversation history.*

---

## The problem

A real assessment session currently runs across five disconnected tools:

1. **ActivForce app (iPad) + ActivForce2 device** — strength testing (dynamometry)
2. **iPhone** — manually calculating the athlete's decimal age
3. **Paper run sheet + pencil** — every single result, handwritten
4. **kperformance.uk/calculator** — leg length calculation
5. **My Jump Lab 3 (iPhone)** — CMJ, broad jump, single-leg hops, sprint splits, overhead squat video

After the session, everything on paper gets manually retyped into the Excel workbook (`Assessment_Calculator.xlsx`) for calculation and eventual report writing.

**The real cost isn't the number of apps — it's double data entry.** Every result is written once by hand, then typed again later, with no check between those two steps. That's where transcription errors and wasted admin time actually happen, not in switching apps mid-session.

## The architectural principle

**K Performance becomes the system of record for an assessment. ActivForce and My Jump Lab remain measurement sources.**

This was investigated directly:
- **ActivForce**: no publicly documented, generally available third-party API/SDK exists today. Their 2025 developer diary mentions a "Device Web SDK v3" for partner integration (Chrome/Edge), but current live documentation still describes AF2 as working exclusively through their own companion app. **Not a Phase 1 dependency** — worth Mike contacting ActivForce directly about partner access as a separate track, but the app should not be designed around it existing yet.
- **My Jump Lab**: not a target for replication. It's markerless motion capture, AI pose estimation, and video-based measurement — a full commercial computer-vision product, not a feature. It stays a separate app, permanently, by design, not just for now.

**Every value in the system gets a `source` field**: `ActivForce`, `MyJumpLab`, or `Manual`. K Performance always knows where a number came from.

## What "done" looks like for a real session

Mike opens the app on his iPad or iPhone. It walks him through, in order:

1. **Athlete + session metadata** — name, DOB (auto-calculates decimal age — no iPhone calculator), sex, sport, session date, assessor, testing conditions (surface/wet-dry/wind — see `01_session_run_sheet.md` for the exact field list)
2. **Anthropometrics** — height, sitting height, mass. Leg length and maturity offset calculate automatically (this logic already exists in `kperformance.uk/calculator` — port it in, don't rebuild it from scratch)
3. **Strength (ActivForce)** — for each test (hip abduction, hip adduction, knee flexion, knee extension, ankle plantarflexion — both sides), the screen shows: *"Open ActivForce → run the test → come back → enter the result."* Trial-variance logic runs automatically (same >10% threshold rule already in the Excel workbook) — if trial 1 and 2 disagree beyond the threshold, the app prompts for a third trial itself, rather than Mike remembering to do it.
4. **Power & speed (My Jump Lab)** — same "open external app, perform, return, enter result" pattern for CMJ, broad jump, single-leg hop (L/R), and sprint splits (0–10m, 10–20m).
5. **Overhead squat** — **do not attempt video analysis.** Capture Mike's own coaching observation as structured fields (depth, left/right shift, knee movement, trunk movement, other notes) — clearly tagged as `source: Manual, type: Observation`, never conflated with a measurement. This is a direct extension of the observation → measurement → interpretation hierarchy already established in `06_sport_interpretation_notes.md` — the data model should enforce that separation, not just the report wording.
6. **Endurance (Cooper 12-minute)** — GPS-tracked distance with a 12-minute countdown, phone in the athlete's pocket, Strava/Nike-Run-Club style. This is the one piece of "automatic" capture worth building natively, since it's standard, well-supported functionality (no third-party blocker).
7. **Complete assessment** — produces one structured record, not a pile of numbers or a photographed run sheet.

## Where this lives

**This is not a new project or a new repo.** It's built as new routes inside the existing `kperformance_website-main` repo, reusing what's already there rather than standing up parallel infrastructure.

The repo currently contains three genuinely separate things:
1. The public marketing site (React/Vite, being distilled per its own v1.5 implementation brief)
2. The `/calculator` page — already built, already in production use for assessment sessions
3. A **dormant, legacy Soft Tissue Therapy intake/AI-report system** (`/intake`, `/admin`, `generateIntakeAIReport.ts`, `submitIntake.ts`, body-map assets) — from an earlier, more ambitious phase of the business. **Do not touch, extend, remove, or build on this.** Leave it exactly as untouched as the site's own implementation brief already treats it. It exists in the repo; it is not part of this project.

The new assessment app is a fourth thing, built alongside the first three without disturbing any of them — new pages, new Firestore collections, new Cloud Functions, clearly namespaced so there's no ambiguity with the dormant intake system (e.g. `submitAssessment.ts`, not anything that could be confused with the existing `submitIntake.ts`).

## Technical approach

**Not a native iOS app.** A mobile-first web app / PWA — works on Mike's iPad and iPhone from one codebase, no App Store friction, realistic for iterative Claude Code development.

- **Frontend**: React + Vite + TypeScript — matching the existing repo exactly, not Next.js. There's already a working build setup here; don't fork it.
- **Backend**: the *existing* Firebase project — Firestore for the database, Firebase Auth, Storage where needed, Cloud Functions only where genuinely necessary. Reuse the project, don't create a second one.
- **Deployment**: the existing Netlify deployment for this same repo
- **Styling**: reuse existing Tailwind config, design tokens, and components (`Button`, `Card`, `SectionHeading`) already built for the K Performance brand — don't create new variants unless a screen genuinely can't be expressed with them
- **PWA**: installable, usable offline where the session itself doesn't need connectivity (GPS Cooper test should degrade gracefully without signal)

## Authentication — hard prerequisite, not a later phase

This repo's own standing principle (`CLAUDE.md`, point 5) already establishes this: **the moment anything gains persistence — real, saved athlete records — client-side auth stops being adequate and real server-side authentication is required before that feature ships.** The assessment app is exactly this case. Firebase Auth (or equivalent real server-side auth) must be in place before any real assessment data is written — this is not something to defer to "later" or treat as a nice-to-have alongside Phase 1. Test/dummy data during development is fine without it; anything touching a real athlete's record is not.

## Data model — non-negotiable requirements

- Every field has a `source`: `ActivForce`, `MyJumpLab`, or `Manual`
- Every field has a `type`: `Measurement`, `Observation`, or `Derived` (calculated) — this is the same measurement/observation/interpretation distinction that already governs report wording; it needs to be a real schema-level distinction, not just prose discipline
- One calculation exists in exactly one place. Right now decimal age, leg length, and maturity offset each live in a different tool. In the new system, each is computed once, centrally, and never re-derived by hand anywhere else.
- The schema should be built to feed the *existing* K Performance report system eventually (see `13_report_production_process.md`), not a new one — the assessment engine's job is clean data capture, not replacing the reporting/interpretation work already built.

## Debrief — Evidence Review, not Candidate Generation

**Established after Mike's first real dry run (Henry Cooper's data), and worth treating as a hard architectural boundary, not a preference.**

The debrief step (two genuine strengths, top priorities) must never be fully automated, and the reason isn't caution for its own sake — it's Henry's own case. His strength data had zero flags below 90%. A threshold rule would have found nothing. His actual two priorities came from synthesising strength results, the movement screen, his growth stage, and Mike's own direct observation of his squat — real coaching judgement, not something a rule would have produced. This is exactly the situation `13_report_production_process.md`'s standing rule anticipates: *"a flag identifies something to review; it doesn't automatically make it a training priority."*

**The fix isn't a blank text box, and it isn't a "candidate list" either.** Both were considered and rejected:
- A blank box forces Mike to reconstruct the whole assessment from memory, defeating the point of replacing paper.
- A system-generated "candidates" list — even framed as suggestions, even with "you decide" language — anchors the assessor. Putting something in a highlighted box signals "the system thinks this matters," which is precisely the influence this system must not have.

**The actual design: an Evidence Review screen.** Organise and display everything already captured — never rank, select, or label anything as a candidate.

- **Flags** — results crossing an already-established rule (e.g. LSI <90%). Neutral language only: *"Hip adduction — 90.9% LSI."*
- **Near-threshold results** — only where the protocol already defines a threshold to be near (e.g. the 90% LSI line makes 90.0% worth flagging as *"near assessment threshold"*). This is not the same as inventing a "borderline" or "notable" category from nothing.
- **Assessor observations** — every `assessorComments` field already captured (movement range, strength, power, endurance) — displayed with equal visual prominence to the numeric evidence, never subordinate to it. This is the single most important rule in this section: the interface must never imply "no flags = nothing here," because Henry's real priority came entirely from observation, not a flag.
- **Context** — age, maturity stage, sport.

**Every item shown must carry visible provenance** — not just the number, but where it came from and what kind of evidence it is:
> *"Hip adduction — 90.9% LSI — Measured result"*
> *"Hop — 90.0% LSI — Near symmetry threshold"*
> *"Squat depth — side-to-side difference — Assessor observation"*
> *"Rear-view knee pattern — Video observation, worth checking, not confirmed"* (the exact middle-tier language from `06_sport_interpretation_notes.md` — reuse it verbatim if this evidence type is ever surfaced here)

**Explicitly do not build:**
- Any "notably strong" or "top X%" algorithm — there's no established normative reference for what counts as a strong result, and inventing one here would repeat a mistake already rejected elsewhere in this project.
- Any weighted scoring formula for priorities (asymmetry × severity × sport relevance × maturity, or anything resembling it). The moment such an algorithm disagrees with what Mike actually observed, the system is fighting the coach rather than supporting him — precisely backwards.
- Anything that ranks or highlights one piece of evidence above another algorithmically.

**What Mike still does, entirely himself:** decide what counts as a genuine strength, decide what deserves priority, combine evidence across sections, weigh his own direct observation, consider sport and athlete context, write the actual rationale, choose exercises. None of this is automatable, and none of it should be attempted.

**Acceptance test for this feature, before it's considered done:** could Mike open Henry's assessment, see immediately that there are no hard strength flags, see the borderline hop result, see the movement and maturity evidence displayed plainly — and arrive at the same two real priorities he actually reached, without the software ever telling him what they should be? If yes, the right part of the process has been automated. If the panel visibly nudges toward an answer, it hasn't.

## Normative ratings on youth results — no rating without a properly-matched reference

**Established after Mike asked for a poor/below-average/average/above-average/excellent rating on the Cooper-derived VO2max, researched properly rather than built on assumption.**

Solid, authoritative adult VO2max normative data exists (ACSM/Cooper Institute, ~80,000 adults) — not usable here, since applying adult bands to a 15-year-old directly contradicts the product's own stated promise: *"benchmarked against your child's age, sport, and stage of growth, not generic adult norms."*

Large, legitimate youth reference datasets also exist (Eurofit 2018, ~2.78M results across 30 countries; FitBack, ~8M results across 34 countries, including UK data) — but their cardiorespiratory fitness test is the **20m shuttle run, not the Cooper 12-minute run**. A norm built for one test cannot be reattached to a different test just because both estimate the same underlying quality. UK-specific evidence exists too (Armstrong et al. 1991, 420 British 11–16 year olds, explicitly considers maturity) — right population, right country, but VO2*peak* measured directly by treadmill/cycle ergometry, not Cooper-*estimated* VO2max. Still the wrong test to build Cooper-test bands from.

**The rule this establishes: never attach a normative label to a result unless the reference data was built from the same test, in a comparable population, at a comparable age.** "Close enough" isn't close enough — a mismatched reference produces a confident-looking label that's actually answering a different question than the one being asked. Worth remembering this applies to more than VO2max — any future normative-rating feature needs the same test-and-population match before it ships, not just plausible-sounding data.

**Current behaviour:** calculate and display the Cooper-derived VO2max number — that's correct and stays. Do not attach any category label (poor/below average/average/above average/excellent, or anything equivalent) to it. No rating is a legitimate, honest output — it's not a missing feature, it's the correct response to not yet having evidence that would support one.

**Worth remembering for K Performance specifically:** even a properly-matched general youth population reference would answer *"how does this athlete compare to adolescents generally"* — not *"how does this rower compare to other rowers,"* which is the more useful question given who K Performance actually assesses. A future, better version of this feature would need sport-specific reference data, not just age-matched population data — worth keeping in mind if this is ever revisited, rather than treating a population-wide norm as the finished answer.

**Future research task, not urgent:** if a normative rating is ever wanted here, the actual research needed is adolescent studies using the Cooper 12-minute test specifically — UK first, Europe second, other populations after that — with the test protocol verified to match before any band gets built from it. Not attempted as part of this build.

## Phased build plan

1. **Data schema** — the actual assessment record structure. Unglamorous, most important, do this first.
2. **Session UI** — the step-by-step flow itself. Big touch targets, minimal typing, automatic calculations, forward/back navigation, autosave. Nothing else — no dashboard, no reports, no styling polish yet.
3. **External measurement capture** — the explicit "open ActivForce / open My Jump Lab, then enter result" screens, with trial-variance logic built in for strength tests.
4. **Validation** — run 5–10 real sessions on the new tool alongside (not instead of) the current paper process, and compare: time taken, transcription errors, missed fields, device-switch friction, post-session admin time. Don't skip this step or treat it as optional.
5. **Centralized calculations** — once raw capture is proven reliable, port every derived calculation (age, leg length, maturity offset, LSI, %BM, ratios) into the app as the single source of truth.
6. **Report integration** — only once the data model is stable, connect this to the existing report-production pipeline.
7. **Future integrations** — ActivForce Web SDK (once/if partner access is actually granted), and anything else — deliberately last, not a prerequisite for anything above.

## Explicit non-goals (for now)

- Direct ActivForce Bluetooth integration
- Any form of video/motion analysis (jump height, sprint timing, squat form) — that work stays in My Jump Lab, permanently
- A report-generation engine — the existing K Performance report system already does this well; this app's job is clean data capture, nothing more, until Phase 6
- Polishing visual design before the core session flow is proven to actually save time and reduce errors in real use

## Reference documents

Pull field lists, protocol logic, and governance principles directly from the existing project rather than re-deriving them. These live in the separate `athlete_assessment_system` documentation folder, not in this repo — copy the specific values/logic needed, don't import the whole folder into the codebase:

- `01_session_run_sheet.md` — the exact test battery and field list
- `06_sport_interpretation_notes.md` — the observation/measurement/interpretation hierarchy, and the trial-variance and video-analysis governance rules
- `13_report_production_process.md` — how this data eventually needs to feed into report production
- `Assessment_Calculator.xlsx` — the current formulas for every derived value (LSI, %BM, maturity offset, etc.) — port the logic, don't reinvent it

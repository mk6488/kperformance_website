# K Performance Website — Project Context

Read this before doing anything else in this repo. Condensed version of a long design and review process — full reasoning lives in the conversation history between Mike, Claude, and ChatGPT, but this file is what to know before touching code.

## New work as of 2026-08-19: the assessment app

A second, separate work stream is starting in this repo — a session-capture app for Mike's actual youth performance assessments (replacing a fragmented paper + Excel workflow). Full spec: `19_assessment_app_brief.md`.

**This is a different project from the v1.5 site work above, built alongside it, not instead of it.** New routes, new Firestore collections, new Cloud Functions — reusing this repo's existing build tooling, Firebase project, and design system, not forking them.

**It does not touch the dormant Soft Tissue Therapy intake system** (`/intake`, `/admin`, `generateIntakeAIReport.ts`, `submitIntake.ts`) described below. That system stays exactly as untouched as everything else in this file already treats it — legacy, preserved, not extended, not a reference implementation for the new work.

**This is precisely the "gains persistence" case standing principle #5 below was written for.** The assessment app saves real athlete data permanently. Client-side auth is not adequate here under any circumstances — real server-side authentication is a hard prerequisite before any assessment data is written to a real (non-test) record, not a nice-to-have to add later.

## What this is

The public website for K Performance, Mike Katholnig's youth athlete assessment service, Leigh Woods, Bristol. Live at kperformance.uk.

**Status as of 2026-08-15:** design signed off, distilled to v1.5 — the site represents only the youth athlete assessment service, not the broader multi-service business (adult/youth soft tissue therapy, pricing, mobile visits, group sessions) the site originally launched with. That broader proposition isn't currently real. Don't reintroduce it because it's easy to — it was removed deliberately, not because of a technical limitation.

## What v1.5 actually is (the current, approved page structure)

Hero → Why it matters → Assessment (90 / We measure / Result) → About Mike → Contact → Footer.

No pricing. No booking system (contact form only). No adult/therapy content. No stock photography — the K mark, typography, color, and whitespace carry the page's identity. This was a deliberate choice, arrived at after trying stock photography and finding it undermined the "any sport" positioning.

**Design tokens (already established, don't reinvent):** `brand-navy #215681`, `brand-blue #4A86B7`, `brand-green #5CBF88`, `brand-amber #E3A857`, `brand-offWhite #F7F9FC`, `brand-charcoal #1F2A35`, `brand-slate #334155`. Reusable components: `Button` (pill-shaped, navy primary), `Card` (white, `rounded-xl`, restrained shadow), `SectionHeading` (blue eyebrow, charcoal heading, slate subtitle).

**Sections removed from the public render path (not deleted from the repo):** `FocusSection`, `WhoIHelpSection`, `ServicesSection`, `HowItWorksSection`, `PricingSection`. These may come back when the business genuinely expands — that's a real future decision, not a default to drift back toward.

**Not currently in scope:** testimonials (none exist yet), the intake wizard on the public path, any new photography, animation, or additional sections beyond what's listed above. If a task seems to call for adding one of these, that's a design decision, not an implementation one — flag it rather than deciding.

## The calculator (`/calculator`)

A separate internal tool — an assessment data calculator (LSI, %BM, ratios, flags), originally built as a standalone stateless HTML file, now rebranded to match the site and hosted at a hidden, gated URL.

**Protected by a client-side credential check** (SHA-256 hash comparison in the browser, session flag in `sessionStorage`) — not real server-side authentication. This is a deliberate, documented decision, acceptable *specifically* because the calculator is fully stateless: nothing is saved or transmitted, so there's nothing sensitive behind the gate to protect.

**This reasoning has a hard boundary.** If the calculator (or anything else in this repo) ever gains persistence — saved athlete results, linked records, accounts — client-side auth stops being adequate immediately, and real server-side authentication must be built before that feature ships. Don't assume the current gate is still fine because it was fine before; the risk profile changes the moment persistence is added.

## Standing principles (apply to any future change, not just past ones)

1. **The current design is settled.** Don't propose new visual directions, sections, or content changes on your own initiative — implement what's specified, flag anything that seems to call for a new decision instead of making it.
2. **This is a subtractive, controlled evolution of an existing site**, not a rebuild. Reuse existing components wherever practical. A parallel static implementation or from-scratch redesign is out of bounds.
3. **No booking language anywhere the mechanism is actually a contact form.** "Get in touch," not "Book," until a real booking flow exists.
4. **No new public-facing content implies a service that isn't real yet** — no coaching-block promises, no "8 weeks," no pricing, no availability claims that aren't literally true.
5. **Client-side auth is fine only where there's nothing behind it worth protecting.** See the calculator section above.
6. **Significant design or product decisions get reviewed by both Claude and ChatGPT before they ship**, not reconciled after deployment. If you're implementing something that arrived through only one channel and looks like a real design decision rather than a small fix, say so before proceeding.

## Working with this repo

- Show the diff before committing anything non-trivial. For anything touching a whole section (adding, removing, or substantially restructuring), get explicit confirmation first.
- Run whatever build/lint/test commands this repo has configured before considering a change complete.
- Check both desktop and mobile rendering for any visual change — don't assume a change that looks right in code renders right in the browser.
- After committing and pushing, report the commit hash and deployment status back rather than assuming it's understood to have worked.

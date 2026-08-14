# K Performance Website — v1.5 Implementation Brief

**Status: design signed off. This is an implementation task, not a design task.**

Read this in full before touching any code. If anything here seems to call for a design decision rather than an implementation choice, stop and ask rather than deciding — the design phase is closed.

---

## The constraint, stated plainly

Implement the approved design in the existing K Performance React codebase (`mk6488/kperformance_website`). Preserve the existing architecture and reusable components wherever practical. **Do not introduce a parallel static implementation or redesign the underlying system.** Remove the superseded sections from the public render path — don't delete them from the repo, they may be needed again when the business expands. Modify existing components where the brief calls for it. Add only the genuinely new sections this brief specifies.

If you find yourself wanting to restructure something the brief doesn't mention, don't. That's a new design decision, and this document is the boundary of what's been agreed.

---

## What this actually is

The existing site (`kperformance.uk`) presents K Performance as a broad, multi-service business — youth performance coaching, soft tissue therapy, pricing, intake forms, admin backend. That's ahead of where the business actually is. K Performance today is one thing: a youth athlete physical assessment service, run by Mike Katholnig in Leigh Woods, Bristol.

This is not a new site. It's the existing brand — same logo, same palette, same components — **distilled** to represent only what's real right now. When another service genuinely launches later, it gets added back into this same system deliberately, not invented fresh.

---

## Section-by-section: keep / modify / remove / new

**`App.tsx` — render path change:**
Remove from the default route's render: `FocusSection`, `WhoIHelpSection`, `ServicesSection`, `HowItWorksSection`, `PricingSection`. Keep the components' files in the repo — just stop rendering them on the public page. Do not touch the `/admin`, `/admin/*`, `/intake`, or `/privacy` routes or their components — out of scope entirely.

**`Header.tsx` — modify:**
Nav links reduce to just a single "Get in touch" CTA (or remove the nav-link list entirely and keep the CTA). Remove "Who I Help / Services / How It Works / About / Pricing" — those sections no longer exist on the page. Keep the logo + wordmark treatment as-is. Remove the "Youth Performance Coaching • Soft Tissue Therapy" tagline under the wordmark — replace with something accurate to current scope, or remove the tagline entirely.

**`HeroSection.tsx` — modify, no photography:**
Remove the `heroImage` background and gradient-over-photo treatment. Replace with a navy-to-blue gradient background (`brand-navy` → `brand-blue`, diagonal). Logo (`logo-k-circle`) large and centred, ~140px, treated as the visual anchor — not repeated as a small icon plus separate text wordmark. No "K PERFORMANCE" text label near it; the mark alone does that job.

Content, in order:
1. Logo (large, centred)
2. H1: "A clear picture of how your child is developing — and exactly what to work on next."
3. Subhead (smaller, secondary weight): "Not a printout of numbers you're left to interpret yourself — a structured assessment, explained in plain English."
4. Technical signature line (small caps, muted): `90 MIN · STRENGTH · POWER · MOVEMENT · FITNESS`
5. CTA button, inverted (white bg, navy text) since it's on a dark background — scrolls to `#contact`

Do **not** include a safeguarding line in the hero — that content belongs in the About section (see below).

**"Why it matters" — new section:**
Doesn't exist in the current site. Build using `SectionHeading` conventions but as an asymmetric two-column layout on desktop (roughly 45/55 split), not centred:
- Left: eyebrow "Why it matters" + large statement, styled as an oversized heading: "Young athletes change fast."
- Right: two paragraphs —
  > "Growth spurts, shifting training loads, technique, and the simple unpredictability of adolescence all shape how a child's body is adapting to their sport — and it isn't always obvious, even to an attentive parent or coach, exactly what a child needs physically at any given point."
  >
  > "K Performance gives you a clearer picture: a structured read on where your child's physical development actually stands, and the specific things worth focusing on next — whatever sport they play."

Stacks to single column on mobile, left column first.

**"What actually happens" — new section, replaces the old Services/HowItWorks pairing conceptually:**
A vertical progression, not a card grid. Three steps, each with a large typographic anchor on the left (fixed-width column) and heading+paragraph on the right:

1. **Anchor:** "90" (large, bold, navy) / "MINUTES" (small caption) — **Body:** "A structured assessment in Leigh Woods" / "Based in a dedicated testing space, with nearby Ashton Court used for the endurance test. You're there throughout."
2. **Anchor:** "We measure" (medium weight label, navy) — **Body:** "Strength, symmetry, power, and movement" / "Left/right strength symmetry using a force dynamometer, jump and sprint performance, a movement screen, and a fitness test scaled to your child's own sport."
3. **Anchor:** "Result" (large, bold, green — the one deliberate color accent in this section) — **Body:** "A written report — not just numbers" / "Two genuine strengths, the three things most worth working on next, and why those three specifically. Something you can hand straight to their coach, or simply keep for yourselves." *(This wording is deliberate, not overstated — the report format was designed to be handoff-ready for a club coach. Keep as-is.)*

Below the three steps, a small labeled sequence (not a hero-level graphic — subtle, in the page flow): **ASSESS → UNDERSTAND → NEXT STEPS**. This deliberately does *not* say "8 weeks" or "retest" — that would imply an active coaching engagement K Performance isn't currently offering. Keep it to these three words only.

Below that, one `Card` (reuse the existing component, don't reinvent) — the only card in this section, holding the report contents:
> **In the report** (eyebrow, green)
> - Two genuine strengths, named specifically
> - The three priorities most worth working on next
> - Why those three, explained in plain English
> - Numbers with context — not just a printout

**`AboutSection.tsx` — modify:**
- New lead sentence, replacing "Hi, I'm Mike — soft tissue therapist and strength coach": lead with assessment/coaching experience, not therapy.
- Body copy: "Mike Katholnig has spent years coaching young athletes directly — including junior strength & conditioning work at City of Bristol Rowing Club, working with 12–18 year olds across full training cycles. That's where this assessment actually comes from: not a generic test battery, but a structured way of identifying the things years of hands-on coaching taught him to look for."
- Remove `soft-tissue-upper-body-treatment.png` — therapy-specific, not relevant here.
- Credentials as a plain list (not badges/pills): Level 4 Diploma Advanced Personal Training, Level 5 Diploma Soft Tissue Therapy, Level 2 British Rowing Coach, Fully insured.
- **Keep the existing safeguarding callout box unchanged** — "Safeguarding & working with under-18s" pattern already exists and is exactly right. This is where the safeguarding/DBS message belongs, not the hero.
- Right-hand panel: replace with a single confirmed stat, styled as one visual unit, not split into separate lines: **"7+ Years"** (large) with a caption underneath: "Coaching young athletes — including junior S&C at City of Bristol Rowing Club." This is a real, already-used figure (also appears in Mike's assessment report template) — not a new claim.

**`ContactSection.tsx` — modify, this is the one place a real regression needs fixing:**
The current live form collects "is this for you or your child," child's age, and prompts for the child's sport/injury details in the message field. **Remove all of that.** The form must be exactly four fields:
- Name (required)
- Email (required)
- Phone (optional)
- Message (optional prompt text: "How can I help?")

No "for me / for my child" selector. No child-age field. This is a deliberate data-minimisation decision — the public enquiry form should never invite a minor's name, age, sport, or health information. This is more restrictive than the current live form, not a stylistic preference.

Preserve whatever form-submission mechanism the current `ContactSection` actually uses (the Netlify POST/fetch handler) — don't rebuild that plumbing, just reduce the field set going through it.

Copy: "Get in touch, and we'll find a time that works." (Simpler than earlier drafts — cut "K Performance currently works with a small number of families at a time," which reads as scarcity marketing the rest of the page doesn't need.)

Keep the consent checkbox and its existing wording.

**`Footer.tsx` — modify:**
Update "Bristol, UK — mobile soft tissue therapy" — no longer accurate. Reconcile with whatever's actually true right now (not mobile, not therapy). Keep the Privacy Policy link and consent/under-18 line if still accurate; check `PrivacyPolicy.tsx` content separately, since it may also reference services no longer being offered — flag to Mike if so, don't rewrite it unilaterally.

---

## Explicitly not in scope for this pass

- Pricing, anywhere
- Booking/scheduling flow
- The intake wizard (`/intake`) — untouched, not linked from the public page
- Admin panel — untouched
- Testimonials — none exist yet
- Any new photography — the no-photo hero is deliberate, not a placeholder waiting to be filled

---

## Design tokens (unchanged — these are already K Performance, not new)

Colors: `brand-navy #215681`, `brand-blue #4A86B7`, `brand-green #5CBF88`, `brand-amber #E3A857`, `brand-offWhite #F7F9FC`, `brand-charcoal #1F2A35`, `brand-slate #334155`.
Components: existing `Button` (pill-shaped, navy primary), `Card` (white, subtle border, `rounded-xl`), `SectionHeading` (blue eyebrow, charcoal heading, slate subtitle) — reuse these, don't create new variants unless a section genuinely can't be expressed with them.

---

## Workflow from here

Implement → Mike and I inspect the actual rendered site (local dev or deployed) → critique the real result → targeted corrections. Not another round of static mockups. If something in the real implementation doesn't match this brief, that's worth flagging precisely (component + what's wrong) rather than re-opening design discussion from scratch.

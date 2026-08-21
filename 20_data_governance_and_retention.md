# K Performance Assessment App — Data Governance & Retention (v1.0, draft)

*Written after ChatGPT flagged a real gap in Claude Code's Phase 1 schema: a blanket "no delete, ever" Firestore rule justified as "it's a clinical record, permanent" — an engineering instinct that's basically right, resting on a legal conclusion that isn't established. This document exists to fix that properly rather than let an unreviewed assumption harden into the architecture.*

**Status: draft. The specific retention periods and the special-category data classification are explicitly not finalised — see open items. This document establishes the shape of the policy, not every number in it.**

---

## The core distinction that was missing

*"Assessment records should be protected from casual/accidental deletion"* is a sound engineering principle.

*"Assessment records are permanent because they're a clinical record"* is a much stronger legal claim that doesn't automatically follow — and this system holds data about children, where the right to erasure (UK GDPR Article 17) is real and, per ICO guidance, arguably more significant precisely because the data subject is a child. A system with genuinely no path to honour a legitimate erasure request — not even for Mike, as the business owner, through anything other than manually bypassing the app via the Firebase console — is a real gap, not just caution.

## The governing principle

> Personal data is retained only for as long as there is a documented, legitimate purpose for retaining it. Ordinary deletion is restricted to protect data integrity, but legitimate data-subject rights and any defined retention limits must remain genuinely exercisable — through a controlled, documented process, not an informal console workaround.

## The architecture: immutable by default, erasure by controlled exception

**Not** `allow delete: if false` with no exception path, and **not** normal delete access for ordinary admin use either. Both are wrong in different directions.

**Ordinary app usage (Mike, day to day):**
- Create: yes
- Edit: tightly scoped — prefer *correction*, not silent overwrite (see below)
- Delete: no — this part of Claude Code's instinct was right and stays

**Exceptional data-rights process (separate from ordinary CRUD, not exposed as a casual button):**
- A genuinely separate, more privileged path must exist to honour a legitimate erasure request
- For now, this can be a manual, documented process (Mike, via Firebase console, with the reason and date logged somewhere real — even a simple written note is better than nothing) rather than a built app feature — but it must be **documented and auditable**, not just "technically possible if you know how"
- This is explicitly a placeholder for Phase 1. It does not need to be a polished admin screen yet. It does need to exist as a real, written process before this system holds real children's data.

## Corrections, not silent overwrites

The common real-world case isn't "erase this person's data" — it's "I mistyped a result." That should be handled as a correction with an audit trail, not a raw field overwrite and not a deletion:

```
originalValue: 120
status: 'corrected'
correctedValue: 102
correctedBy: 'Mike'
correctedAt: <timestamp>
reason: 'data-entry error'
```

This preserves both data integrity (a real audit trail) and the ability to fix genuine mistakes without needing destructive delete access for routine use.

## Treat the collections differently — and treat health-adjacent fields as their own category

- **`athletes` (identity data)** — name, DOB, sex, sport. Clearly personal data. "Archived/inactive" is operationally useful but is *not* equivalent to erasure — the ICO is explicit that archiving still requires ongoing justification, it isn't a substitute for actually dealing with a retention or erasure question.
- **`assessments` (measurements, observations)** — stronger legitimate case for protecting historical integrity (longitudinal athlete development is the whole point of retesting), but "protected from casual deletion" ≠ "must be retained forever."
- **Injury/pain/health-adjacent fields specifically** (injury history, red-flag screening results, anything describing physical health) — potentially **special-category data** under UK GDPR, not just "assessment data" generically. The ICO's definition of health data is broad enough to plausibly include test results and examination-style data. This may need its own classification, its own Article 9 lawful basis, and potentially its own retention logic, separate from routine performance numbers like jump height. Not resolved here — flagged for the open items below.

## What NOT to do yet

- **Don't invent a specific retention period** ("keep for 7 years," etc.) — there's no single UK GDPR rule dictating this for youth athlete assessment data, and inventing one without a documented purpose behind it is its own problem, not a solution.
- **Don't describe this data as "a clinical record"** in code, comments, or documentation, as if that phrase carries a specific legal retention exemption. It doesn't, on its own — K Performance isn't a regulated healthcare provider operating under a statutory retention regime, and borrowing that language without the underlying basis is misleading, not protective.
- **Don't build the exceptional-erasure admin screen yet.** A documented manual process is a legitimate starting point for a solo-founder early-stage system. Build the real screen later if/when it's actually needed.

## Open items — not resolved by this document

- [ ] **A real UK data-protection professional should review this before real (non-test) children's data is captured and retained under this architecture long term.** This is genuinely one of the few points in this whole project where outside professional advice is the right call, not just thorough internal review — the question isn't "does a Firestore app need a lawyer," it's "are we about to encode a legal/governance assumption into the permanent architecture of a system holding children's potentially sensitive data."
- [ ] Formal classification: which specific fields (if any) constitute special-category health data under Article 9, and what that means for access control and retention specifically for those fields
- [ ] An actual retention schedule, once the above is resolved — what's kept, why, for how long, and what happens at the end (deletion, anonymisation, or a defined review)
- [ ] Whether a DPIA (Data Protection Impact Assessment) is warranted given this involves children's data — the ICO's Children's Code guidance suggests this is worth considering, not assumed unnecessary just because the system is small

---

*Until the open items are resolved, this system should be treated as under active data-governance development, not as a finished, compliant record-keeping system — real assessment data can be captured for testing/development, but the retention and erasure architecture shouldn't be treated as settled until a professional has actually looked at it.*

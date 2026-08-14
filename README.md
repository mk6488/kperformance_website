# kperformance_website

## Firebase environment variables (Vite)

Set these in `.env` (or Netlify/Vercel environment) for the intake form submission to work. Firebase Functions are expected to be deployed in `europe-west2`.

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Backend (Firebase Functions) setup

- Install: `cd functions && npm install`
- Local emulators (optional): `firebase emulators:start`
- Deploy functions: `firebase deploy --only functions`
- Deploy rules: `firebase deploy --only firestore:rules`

Notes:
- Functions deploy to `europe-west2`
- Phase 6.2 will implement `submitIntake` logic
- Set `.firebaserc` `projects.default` to your Firebase project ID before deploying

### Go-live checklist (Intake form)
- Netlify env vars set: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
- Anonymous auth enabled in Firebase.
- Functions deployed: `firebase deploy --only functions` (region `europe-west2`).
- Firestore rules deployed: `firebase deploy --only firestore:rules` (intakes locked down).
- Run a fake submission on `/intake`; confirm success reference shows and a document appears in `intakes` with `createdAt/createdByUid/status/emailLower/payload`.
- Confirm no draft banner appears after a successful submit (draft cleared).
- Verify no intake payload logs are emitted (keep logging to intakeId/uid only if needed).
- Share the intake link only via direct message; do not add to public navigation.
- Admin queries:
  - If Firestore requests a composite index for `intakes` with `status` + `createdAt` (desc), create one at: `Collection: intakes`, Fields: `status` ASC, `createdAt` DESC.

## Admin data model & retention (GDPR-aware)
- Storage locations:
  - `intakes` collection (per submission; includes payload, status, submittedAt metadata, archivedAt/archivedByUid)
  - `intakes/{id}/internalNotes` subcollection (admin-only notes)
  - `intakes/{id}/audit` subcollection (admin-only audit trail of status changes, note additions, reviewed events)
- Admin access model:
  - Only allowlisted admins (`adminUsers/{uid}`) can read/write intakes, notes, and audit subcollections.
  - No public reads of intakes; client submissions go through the callable Cloud Function (Admin SDK), so rules do not affect writes.
- Retention guidance (recommended):
  - Archive first (`status=archived`, sets `archivedAt`, `archivedByUid`); archive date is surfaced in the admin UI.
  - Optional purge action is feature-flagged off by default; enable only when policies are confirmed and apply to archived items older than the cutoff.
  - To remove admin access, delete the admin’s document in `adminUsers/{uid}` and sign them out.

## AI assistant (admin-only)
- Backend callable: `generateIntakeAIReport` (Firebase Functions, region `europe-west2`).
- Env vars (Functions): `OPENAI_API_KEY` (kept server-side; never exposed to the client).
- Security model:
  - Callable requires Firebase Auth and allowlist (`adminUsers/{uid}`).
  - Only admins can read/write `intakes/{id}/aiReports/*` (rules enforced).
  - Minimal PHI sent to the model (no names/emails/phones/DOB; only anonymised clinical fields, ageYears + under18).
  - Consent required: intake must have `consent.aiDraftConsent === true`; admin UI disables generation otherwise.
- Storage:
  - AI outputs saved under `intakes/{id}/aiReports/{reportId}` with metadata and logged to `audit` as `ai_generated`.
- Consent note:
  - Intended for internal clinician use; review before sharing any output with patients.
- Admin UX:
  - “AI-assisted draft — clinician review required” banner shown.
  - No aiReports content stored in localStorage; loaded live from Firestore.


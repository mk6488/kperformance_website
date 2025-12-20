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

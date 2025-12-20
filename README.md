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

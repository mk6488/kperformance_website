import { initializeApp } from 'firebase-admin/app';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

initializeApp();

export const submitIntake = onCall({ region: 'europe-west2' }, async (request) => {
  throw new HttpsError('unimplemented', 'submitIntake not implemented yet');
});

import { initializeApp } from 'firebase-admin/app';
import { onCall, HttpsError, setGlobalOptions } from 'firebase-functions/v2/https';

initializeApp();
setGlobalOptions({ region: 'europe-west2' });

export const submitIntake = onCall((request) => {
  throw new HttpsError('unimplemented', 'Not implemented yet');
});

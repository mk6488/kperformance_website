import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

type Marker = { view: 'front' | 'back' | 'left' | 'right'; x: number; y: number };

type IntakePayload = {
  client?: any;
  problem?: any;
  medical?: any;
  lifestyle?: any;
  bodyMap?: any;
  consent?: any;
  submittedAtClientISO?: any;
  formVersion?: any;
};

const db = getFirestore();

const trimOrEmpty = (v: any) => (typeof v === 'string' ? v.trim() : '');
const cap = (v: string, max: number) => (v.length > max ? v.slice(0, max) : v);
const safeEmailLower = (v: any) => cap(trimOrEmpty(v).toLowerCase(), 120);
const toBool = (v: any) => v === true;
const toNumberOrNull = (v: any) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const isValidEmail = (email: string) => email.includes('@') && email.includes('.');
const isValidDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

function validateAndSanitise(data: IntakePayload) {
  const errors: string[] = [];

  const client = data.client || {};
  const problem = data.problem || {};
  const medical = data.medical || {};
  const lifestyle = data.lifestyle || {};
  const bodyMap = data.bodyMap || {};
  const consent = data.consent || {};

  const clientFullName = cap(trimOrEmpty(client.fullName), 120);
  if (!clientFullName) errors.push('client.fullName is required');

  const clientDob = trimOrEmpty(client.dob);
  if (!clientDob || !isValidDate(clientDob)) errors.push('client.dob is required in yyyy-mm-dd');

  const clientEmail = safeEmailLower(client.email);
  if (!clientEmail || !isValidEmail(clientEmail)) errors.push('client.email is required and must be valid');

  const clientPhone = cap(trimOrEmpty(client.phone), 120);
  const under18 = !!client.under18;

  const guardian = client.guardian || {};
  const guardianFullName = cap(trimOrEmpty(guardian.fullName), 120);
  const guardianEmail = safeEmailLower(guardian.email);
  const guardianPhone = cap(trimOrEmpty(guardian.phone), 120);
  const guardianRelationship = cap(trimOrEmpty(guardian.relationship), 120);

  if (under18) {
    if (!guardianFullName) errors.push('guardian.fullName is required when under18');
    if (!guardianEmail || !isValidEmail(guardianEmail)) errors.push('guardian.email is required and must be valid when under18');
    if (!guardianPhone) errors.push('guardian.phone is required when under18');
  }

  const mainConcern = cap(trimOrEmpty(problem.mainConcern), 2000);
  if (!mainConcern) errors.push('problem.mainConcern is required');
  const onset = cap(trimOrEmpty(problem.onset), 280);
  const locationText = cap(trimOrEmpty(problem.locationText), 280);
  const painNow = toNumberOrNull(problem.painNow);
  if (painNow !== null && (painNow < 0 || painNow > 10)) errors.push('problem.painNow must be 0..10');
  const aggravators = cap(trimOrEmpty(problem.aggravators), 2000);
  const easers = cap(trimOrEmpty(problem.easers), 2000);
  const goals = cap(trimOrEmpty(problem.goals), 2000);

  const conditions = cap(trimOrEmpty(medical.conditions), 2000);
  const surgeries = cap(trimOrEmpty(medical.surgeries), 2000);
  const medications = cap(trimOrEmpty(medical.medications), 2000);
  const allergies = cap(trimOrEmpty(medical.allergies), 2000);
  const medCheckboxes: Record<string, boolean> = {};
  if (medical.checkboxes && typeof medical.checkboxes === 'object') {
    Object.keys(medical.checkboxes).forEach((k) => {
      medCheckboxes[k] = toBool(medical.checkboxes[k]);
    });
  }
  const redFlags = Array.isArray(medical.redFlags)
    ? medical.redFlags
        .map((f: unknown) => cap(trimOrEmpty(f), 280))
        .filter((v): v is string => Boolean(v))
    : [];

  const activity = cap(trimOrEmpty(lifestyle.activity), 280);
  const weeklyLoad = cap(trimOrEmpty(lifestyle.weeklyLoad), 280);
  const sleepHours = cap(trimOrEmpty(lifestyle.sleepHours), 120);
  const stressScore = toNumberOrNull(lifestyle.stressScore);
  if (stressScore !== null && (stressScore < 0 || stressScore > 10)) errors.push('lifestyle.stressScore must be 0..10');

  const markers: Marker[] = Array.isArray(bodyMap?.markers)
    ? bodyMap.markers
        .map((m: any) => {
          const view = typeof m?.view === 'string' ? m.view : '';
          const x = typeof m?.x === 'number' ? m.x : NaN;
          const y = typeof m?.y === 'number' ? m.y : NaN;

          if (!['front', 'back', 'left', 'right'].includes(view)) return null;
          if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
          if (x < 0 || x > 1 || y < 0 || y > 1) return null;

          return { view: view as 'front' | 'back' | 'left' | 'right', x, y };
        })
        .filter((m): m is Marker => Boolean(m))
    : [];

  const consentHealth = toBool(consent.healthDataConsent);
  const consentTruthful = toBool(consent.confirmTruthful);
  if (!consentHealth) errors.push('consent.healthDataConsent must be true');
  if (!consentTruthful) errors.push('consent.confirmTruthful must be true');

  const contactPrefs = {
    email: toBool(consent.contactPrefs?.email),
    sms: toBool(consent.contactPrefs?.sms),
    phone: toBool(consent.contactPrefs?.phone),
  };

  const submittedAtClientISO = cap(trimOrEmpty((data as any).submittedAtClientISO), 120);
  const formVersion = cap(trimOrEmpty((data as any).formVersion), 40) || 'intake-v2';

  if (errors.length) {
    throw new HttpsError('invalid-argument', errors.join('; '));
  }

  return {
    client: {
      fullName: clientFullName,
      dob: clientDob,
      email: clientEmail,
      phone: clientPhone,
      under18,
      guardian: under18
        ? {
            fullName: guardianFullName,
            email: guardianEmail,
            phone: guardianPhone,
            relationship: guardianRelationship,
          }
        : undefined,
    },
    problem: {
      mainConcern,
      onset,
      locationText,
      painNow,
      aggravators,
      easers,
      goals,
    },
    medical: {
      conditions,
      surgeries,
      medications,
      allergies,
      checkboxes: medCheckboxes,
      redFlags,
    },
    lifestyle: {
      activity,
      weeklyLoad,
      sleepHours,
      stressScore,
    },
    bodyMap: {
      markers,
    },
    consent: {
      healthDataConsent: consentHealth,
      confirmTruthful: consentTruthful,
      contactPrefs,
    },
    submittedAtClientISO,
    formVersion,
  };
}

export const submitIntake = onCall({ region: 'europe-west2' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const uid = request.auth.uid;
  const data = request.data as IntakePayload;

  let payload;
  try {
    payload = validateAndSanitise(data);
  } catch (err: any) {
    if (err instanceof HttpsError) throw err;
    throw new HttpsError('invalid-argument', 'Invalid payload');
  }

  try {
    const docRef = await db.collection('intakes').add({
      createdAt: FieldValue.serverTimestamp(),
      createdByUid: uid,
      status: 'submitted',
      emailLower: payload.client.email,
      formVersion: payload.formVersion || 'intake-v2',
      submittedAtClientISO: payload.submittedAtClientISO || null,
      payload,
    });

    return { intakeId: docRef.id };
  } catch (err: any) {
    throw new HttpsError('internal', 'Unable to save intake');
  }
});

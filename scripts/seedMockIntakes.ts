import { FieldValue } from 'firebase-admin/firestore';
import {
  initAdmin,
  firstExisting,
  getAtPath,
  setAtPath,
  isPlainObject,
  randomPastDate,
  asTimestamp,
  SERVER_TIME,
} from './_seedUtils.js';

const TEST_DOMAIN = 'test.local';

type Identity = {
  firstName: string;
  lastName: string;
  email: string;
  dobISO: string;
  isUnder18: boolean;
  parent: null | {
    name: string;
    email: string;
    phone: string;
    relationship: string;
  };
};

function makeEmail(first: string, last: string) {
  return `${first}.${last}@${TEST_DOMAIN}`.toLowerCase();
}

function genMarkers() {
  return [
    { view: 'front', x: 0.52, y: 0.62, label: 'Right knee' },
    { view: 'back', x: 0.48, y: 0.4, label: 'Lower back' },
  ];
}

function mergeTemplate(template: any): any {
  return JSON.parse(JSON.stringify(template || {}));
}

function detectPayloadRoot(doc: any): string | null {
  const hit = firstExisting(doc, ['payload', 'data', 'form', 'intake', 'answers']);
  if (hit && isPlainObject(hit.value)) return hit.path;
  return null;
}

function applyIdentity(doc: any, payloadRoot: string | null, identity: Identity) {
  const { firstName, lastName, email, dobISO, isUnder18, parent } = identity;

  setAtPath(doc, 'firstName', firstName);
  setAtPath(doc, 'lastName', lastName);
  setAtPath(doc, 'email', email);
  setAtPath(doc, 'emailLower', email.toLowerCase());
  setAtPath(doc, 'testData', true);

  const dobTargets = ['dob', 'dateOfBirth', 'payload.about.dob', 'payload.about.dateOfBirth'];
  let wroteDob = false;
  for (const p of dobTargets) {
    if (getAtPath(doc, p) !== undefined) {
      setAtPath(doc, p, dobISO);
      wroteDob = true;
      break;
    }
  }
  if (!wroteDob) {
    if (payloadRoot) setAtPath(doc, `${payloadRoot}.about.dateOfBirth`, dobISO);
    else setAtPath(doc, 'dob', dobISO);
  }

  if (payloadRoot) {
    const clientPath = `${payloadRoot}.client`;
    if (!isPlainObject(getAtPath(doc, clientPath))) {
      setAtPath(doc, clientPath, {});
    }
    setAtPath(doc, `${clientPath}.fullName`, `${firstName} ${lastName}`);
    setAtPath(doc, `${clientPath}.email`, email);
    setAtPath(doc, `${clientPath}.phone`, '07700 900111');
    setAtPath(doc, `${clientPath}.dob`, dobISO);
    setAtPath(doc, `${clientPath}.under18`, isUnder18);
    if (isUnder18 && parent) {
      setAtPath(doc, `${clientPath}.guardian`, {
        fullName: parent.name,
        email: parent.email,
        phone: parent.phone,
        relationship: parent.relationship,
      });
    }

    const consentPath = `${payloadRoot}.consent`;
    if (!isPlainObject(getAtPath(doc, consentPath))) {
      setAtPath(doc, consentPath, {});
    }
    setAtPath(doc, `${consentPath}.healthDataConsent`, true);
    setAtPath(doc, `${consentPath}.confirmTruthful`, true);
    setAtPath(doc, `${consentPath}.contactPrefs`, { email: true, sms: false, phone: true });
    if (getAtPath(doc, `${consentPath}.isUnder18`) === undefined) {
      setAtPath(doc, `${consentPath}.isUnder18`, isUnder18);
    }
    if (isUnder18 && parent) {
      const parentPaths = [
        `${consentPath}.parentContact`,
        `${payloadRoot}.about.parentContact`,
        `${payloadRoot}.about.guardian`,
      ];
      const existing = parentPaths.find((p) => getAtPath(doc, p) !== undefined);
      const target = existing || parentPaths[0];
      setAtPath(doc, target, parent);
    }
  }
}

function applyBodyMap(doc: any, payloadRoot: string | null) {
  const markers = genMarkers();
  const candidates = payloadRoot
    ? [`${payloadRoot}.bodyMap`, `${payloadRoot}.problem.bodyMap`, 'bodyMap', 'payload.bodyMap']
    : ['bodyMap', 'payload.bodyMap'];

  let rootPath: string | null = null;
  for (const c of candidates) {
    const v = getAtPath(doc, c);
    if (v !== undefined) {
      rootPath = c;
      break;
    }
  }
  if (!rootPath) rootPath = candidates[0];

  setAtPath(doc, rootPath, {
    markers,
  });
}

function applyWorkflow(doc: any, admin: any, status: string) {
  setAtPath(doc, 'status', status);
  if (status === 'reviewed') {
    setAtPath(doc, 'reviewedAt', FieldValue.serverTimestamp());
    setAtPath(doc, 'reviewedByUid', admin.uid);
  } else {
    if (getAtPath(doc, 'reviewedAt') === undefined) setAtPath(doc, 'reviewedAt', null);
    if (getAtPath(doc, 'reviewedByUid') === undefined) setAtPath(doc, 'reviewedByUid', null);
  }
  if (status === 'archived') {
    setAtPath(doc, 'archivedAt', FieldValue.serverTimestamp());
    setAtPath(doc, 'archivedByUid', admin.uid);
  }
}

async function main() {
  const { db, auth } = initAdmin();

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) throw new Error('Missing ADMIN_EMAIL in .env.local');
  const adminUser = await auth.getUserByEmail(adminEmail);

  const templateSnap = await db.collection('intakes').orderBy('createdAt', 'desc').limit(1).get();
  const templateDoc = templateSnap.docs[0]?.data() || {};
  const payloadRoot = detectPayloadRoot(templateDoc);

  console.log('Template found:', templateSnap.docs[0]?.id ? 'YES' : 'NO');
  console.log('Detected payload root:', payloadRoot || '(none)');

  const mockClients = [
    { first: 'Tom', last: 'Harris', dob: '1996-04-12', intakes: 2, under18: false },
    { first: 'Alex', last: 'Green', dob: '2001-01-03', intakes: 3, under18: false },
    { first: 'Sam', last: 'Patel', dob: '2010-09-18', intakes: 2, under18: true },
    { first: 'Jamie', last: 'Brown', dob: '2009-06-22', intakes: 1, under18: true },
    { first: 'Ben', last: 'Wilson', dob: '1998-11-02', intakes: 1, under18: false },
    { first: 'Chris', last: 'Adams', dob: '1989-02-19', intakes: 1, under18: false },
    { first: 'Riley', last: 'Cooper', dob: '2011-03-07', intakes: 2, under18: true },
    { first: 'Taylor', last: 'Morgan', dob: '1994-08-30', intakes: 1, under18: false },
  ];

  const statuses = ['submitted', 'needs_followup', 'reviewed', 'archived'] as const;

  for (const c of mockClients) {
    const email = makeEmail(c.first, c.last);
    const parent = c.under18
      ? {
          name: `${c.first}'s Parent`,
          email: `parent.of.${c.first}.${c.last}@${TEST_DOMAIN}`.toLowerCase(),
          phone: '07700 900123',
          relationship: 'Parent/Guardian',
        }
      : null;

    for (let i = 0; i < c.intakes; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const createdAt = asTimestamp(randomPastDate(60));

      const doc = mergeTemplate(templateDoc);
      setAtPath(doc, 'createdAt', createdAt);
      setAtPath(doc, 'createdByUid', adminUser.uid);
      applyIdentity(doc, payloadRoot, {
        firstName: c.first,
        lastName: c.last,
        email,
        dobISO: c.dob,
        isUnder18: c.under18,
        parent,
      });

      if (payloadRoot) {
        if (getAtPath(doc, `${payloadRoot}.problem`) === undefined) {
          setAtPath(doc, `${payloadRoot}.problem`, {});
        }
        if (getAtPath(doc, `${payloadRoot}.problem.mainConcern`) === undefined) {
          setAtPath(doc, `${payloadRoot}.problem.mainConcern`, 'Mock: knee pain during sport');
        }
        if (getAtPath(doc, `${payloadRoot}.lifestyle`) === undefined) {
          setAtPath(doc, `${payloadRoot}.lifestyle`, { activity: 'Mock: football', weeklyLoad: '3x/week' });
        }
      }

      applyBodyMap(doc, payloadRoot);
      applyWorkflow(doc, adminUser, status);

      const intakeRef = db.collection('intakes').doc();
      await intakeRef.set(doc);

      await intakeRef.collection('internalNotes').add({
        text:
          status === 'needs_followup'
            ? 'Mock note: follow-up needed re symptoms + safeguarding.'
            : 'Mock note: reviewed; no major red flags noted.',
        createdAt: SERVER_TIME,
        createdByUid: adminUser.uid,
        createdByEmail: adminEmail,
        testData: true,
      });

      await intakeRef.collection('audit').add({
        type: 'status_change',
        createdAt: SERVER_TIME,
        actorUid: adminUser.uid,
        actorEmail: adminEmail,
        meta: { fromStatus: 'submitted', toStatus: status },
        testData: true,
      });

      if (status === 'reviewed') {
        await intakeRef.collection('audit').add({
          type: 'reviewed',
          createdAt: SERVER_TIME,
          actorUid: adminUser.uid,
          actorEmail: adminEmail,
          meta: {},
          testData: true,
        });
      }

      console.log(`✅ Seeded ${intakeRef.id} :: ${email} :: ${status}`);
    }
  }

  console.log('\nDone.');
  console.log(`Seeded mock data uses *@${TEST_DOMAIN} emails and testData=true for safe cleanup.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

type ReportType = 'clinician_summary' | 'treatment_plan' | 'followup_questions' | 'both';

const MODEL = 'gpt-4o-mini';
const PROMPT_VERSION = 'v2-lite-mode-controller-minimised';

const systemPrompt = `
You are "Soft Tissue Therapist Assistant", operating in Clinician Mode by default.

MODE CONTROLLER (Lite+):
- Clinician Mode: concise, professional, clinical phrasing; audience is the treating clinician.
- Patient Mode: plain-language, reassuring; audience is the patient. Use only if explicitly requested.
- If not specified, stay in Clinician Mode.

Required output structure (adjust headings to match report type):
1) Clinical summary
2) Key risks / red flags (note if none apparent)
3) Treatment plan / next steps
4) Follow-up questions
5) Safety / referral flags

Guidance:
- Base outputs solely on provided intake context. Do not invent identifiers or appointments.
- Be cautious with red flags; suggest escalation only when warranted.
- If information is missing, state that it is missing rather than guessing.
`.trim();

const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const urlPattern = /\bhttps?:\/\/\S+/gi;
const phonePattern = /\b(?:0\d{9,10}|\+?\d{1,3}[-\s]?\d{2,4}[-\s]?\d{3,4}[-\s]?\d{3,4})\b/g;
const dobPattern = /\b(?:dob|dateofbirth|date_of_birth)\b/i;

function scrubText(input: any): string {
  if (typeof input !== 'string') return '';
  return input.replace(emailPattern, '[redacted-email]').replace(urlPattern, '[redacted-url]').replace(phonePattern, '[redacted-phone]');
}

function ensureString(v: any) {
  return typeof v === 'string' ? scrubText(v) : '';
}

function computeAgeYears(dobAny: any): number | null {
  let d: Date | null = null;
  if (dobAny?.toDate && typeof dobAny.toDate === 'function') {
    d = dobAny.toDate();
  } else if (typeof dobAny === 'string') {
    d = new Date(dobAny);
  }
  if (!d || Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) {
    age--;
  }
  if (age < 0 || age > 120) return null;
  return age;
}

function scrubObject(obj: any): any {
  if (Array.isArray(obj)) return obj.map((v) => scrubObject(v));
  if (obj && typeof obj === 'object') {
    const res: any = {};
    Object.keys(obj).forEach((k) => {
      res[k] = scrubObject(obj[k]);
    });
    return res;
  }
  if (typeof obj === 'string') return scrubText(obj);
  return obj;
}

function containsIdentifiers(str: string) {
  const email = new RegExp(emailPattern);
  const url = new RegExp(urlPattern);
  const phone = new RegExp(phonePattern);
  const dob = new RegExp(dobPattern);
  return email.test(str) || url.test(str) || phone.test(str) || dob.test(str);
}

function minimiseContext(intake: any) {
  const payload = intake?.payload || intake?.data || intake || {};
  const client = payload.client || {};
  const problem = payload.problem || {};
  const medical = payload.medical || {};
  const lifestyle = payload.lifestyle || {};
  const consent = payload.consent || {};
  const bodyMap = payload.bodyMap || payload?.problem?.bodyMap || {};

  const ageYears =
    typeof client.ageYears === 'number'
      ? client.ageYears
      : computeAgeYears(client.dob || intake?.dob || payload?.dob || payload?.client?.dob);
  const under18 = typeof client.under18 === 'boolean' ? client.under18 : ageYears === null ? null : ageYears < 18;

  const ctx = {
    status: intake?.status || 'submitted',
    formVersion: intake?.formVersion || payload?.formVersion || 'unknown',
    client: {
      label: 'client',
      ageYears: ageYears ?? null,
      under18,
    },
    problem: {
      mainConcern: ensureString(problem.mainConcern),
      onset: ensureString(problem.onset),
      locationText: ensureString(problem.locationText),
      painNow: problem.painNow ?? null,
      aggravators: ensureString(problem.aggravators),
      easers: ensureString(problem.easers),
      goals: ensureString(problem.goals),
    },
    medical: {
      conditions: ensureString(medical.conditions),
      surgeries: ensureString(medical.surgeries),
      medications: ensureString(medical.medications),
      allergies: ensureString(medical.allergies),
      redFlags: Array.isArray(medical.redFlags) ? scrubObject(medical.redFlags).slice(0, 12) : [],
      checkboxes: typeof medical.checkboxes === 'object' ? scrubObject(medical.checkboxes) : {},
    },
    lifestyle: {
      activity: ensureString(lifestyle.activity),
      weeklyLoad: ensureString(lifestyle.weeklyLoad),
      sleepHours: ensureString(lifestyle.sleepHours),
      stressScore: lifestyle.stressScore ?? null,
    },
    consent: {
      healthDataConsent: !!consent.healthDataConsent,
      confirmTruthful: !!consent.confirmTruthful,
      aiConsent: !!consent.aiConsent,
    },
    bodyMap: {
      markers: Array.isArray(bodyMap.markers)
        ? bodyMap.markers
            .filter(
              (m: any) =>
                m &&
                ['front', 'back', 'left', 'right'].includes(m.view) &&
                typeof m.x === 'number' &&
                typeof m.y === 'number',
            )
            .map((m: any) => ({
              view: m.view,
              x: m.x,
              y: m.y,
              label: ensureString(m.label),
            }))
        : [],
    },
  };

  const scrubbed = scrubObject(ctx);
  const json = JSON.stringify(scrubbed);
  if (containsIdentifiers(json)) {
    throw new HttpsError('failed-precondition', 'Context contains identifiable data; generation blocked.');
  }
  return { context: scrubbed, ageYears, under18 };
}

export const generateIntakeAIReport = onCall({ region: 'europe-west2' }, async (request) => {
  const uid = request.auth?.uid;
  const email = (request.auth?.token as any)?.email || null;
  if (!uid) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }

  const { intakeId, reportType, mode } = (request.data || {}) as {
    intakeId?: string;
    reportType?: ReportType;
    mode?: 'clinician' | 'patient';
  };

  if (!intakeId || typeof intakeId !== 'string') {
    throw new HttpsError('invalid-argument', 'intakeId is required.');
  }
  const allowedTypes: ReportType[] = ['clinician_summary', 'treatment_plan', 'followup_questions', 'both'];
  if (!reportType || !allowedTypes.includes(reportType)) {
    throw new HttpsError('invalid-argument', 'reportType is invalid.');
  }

  const db = getFirestore();
  // Verify admin allowlist
  const adminDoc = await db.collection('adminUsers').doc(uid).get();
  if (!adminDoc.exists) {
    throw new HttpsError('permission-denied', 'Admin access required.');
  }

  const snap = await db.collection('intakes').doc(intakeId).get();
  if (!snap.exists) {
    throw new HttpsError('not-found', 'Intake not found.');
  }
  const intakeData = snap.data();
  const { context, ageYears, under18 } = minimiseContext(intakeData);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new HttpsError('failed-precondition', 'OPENAI_API_KEY not configured.');
  }

  // Optional write-back of computed age/under18 (no DOB stored)
  if (ageYears !== null || under18 !== null) {
    const update: any = {};
    if (ageYears !== null) update.ageYears = ageYears;
    if (under18 !== null) update.under18 = under18;
    await db.collection('intakes').doc(intakeId).set(update, { merge: true });
  }

  const modeLabel = mode === 'patient' ? 'Patient Mode' : 'Clinician Mode';
  const typeLabel =
    reportType === 'clinician_summary'
      ? 'Clinical summary'
      : reportType === 'treatment_plan'
      ? 'Treatment plan'
      : reportType === 'followup_questions'
      ? 'Follow-up questions'
      : 'Clinical summary + treatment plan';

  const userPrompt = `
Generate ${typeLabel} in ${modeLabel}.
Use the intake context (already minimal and de-identified):
${JSON.stringify(context, null, 2)}

Keep headings as specified, concise, and actionable. If data is missing, note it clearly. Refer to the person only as "the client".
`.trim();

  const body = {
    model: MODEL,
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_output_tokens: 800,
  };

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('OpenAI error', text);
    throw new HttpsError('internal', 'AI generation failed');
  }

  const data = await response.json();
  const content: string =
    data.output_text ||
    data?.output?.[0]?.content?.map((c: any) => c.text).join('\n') ||
    data?.choices?.[0]?.message?.content?.map?.((c: any) => c.text).join('\n') ||
    data?.choices?.[0]?.message?.content ||
    '';

  if (!content) {
    throw new HttpsError('internal', 'Empty AI response');
  }

  const reportDoc = {
    type: reportType,
    reportType, // kept for backward compatibility
    mode: mode === 'patient' ? 'patient' : 'clinician',
    model: MODEL,
    promptVersion: PROMPT_VERSION,
    content,
    createdAt: FieldValue.serverTimestamp(),
    createdByUid: uid,
    createdByEmail: email,
  };

  const reportRef = await db.collection('intakes').doc(intakeId).collection('aiReports').add(reportDoc);

  await db.collection('intakes').doc(intakeId).collection('audit').add({
    type: 'ai_report_generated',
    createdAt: FieldValue.serverTimestamp(),
    actorUid: uid,
    actorEmail: email,
    meta: { reportId: reportRef.id, reportType, model: MODEL },
  });

  return { reportId: reportRef.id, content, model: MODEL };
});


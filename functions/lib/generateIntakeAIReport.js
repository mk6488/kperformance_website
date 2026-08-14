"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIntakeAIReport = void 0;
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
const pricing_1 = require("./pricing");
const MODEL = 'gpt-4o-mini';
const PROMPT_VERSION = 'v2-lite-mode-controller-minimised';
const ADMIN_DAILY_LIMIT = 50;
const INTAKE_DAILY_LIMIT = 10;
const ADMIN_COOLDOWN_MS = 30000;
const EST_COST_PER_CALL_USD = 0.001; // fallback conservative estimate per call
const DAILY_SPEND_CAP_USD = 5; // configurable ceiling; adjust as needed
const MAX_RETRIES = 2;
const ENFORCE_DAILY_SPEND_CAP = Number.isFinite(DAILY_SPEND_CAP_USD) && DAILY_SPEND_CAP_USD > 0;
function utcDayKey(d = new Date()) {
    // YYYY-MM-DD in UTC
    return d.toISOString().slice(0, 10);
}
const CLINICIAN_SUMMARY_RESPONSE_FORMAT = {
    type: 'json_schema',
    json_schema: {
        name: 'clinician_summary',
        strict: true,
        schema: {
            type: 'object',
            additionalProperties: false,
            required: ['presentingSnapshot', 'workingHypothesis', 'differentials', 'plan', 'referralTriggers'],
            properties: {
                presentingSnapshot: { type: 'string' },
                workingHypothesis: { type: 'string' },
                differentials: {
                    type: 'array',
                    items: {
                        type: 'object',
                        additionalProperties: false,
                        required: ['name', 'rationale'],
                        properties: {
                            name: { type: 'string' },
                            rationale: { type: 'string' },
                        },
                    },
                },
                plan: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['handsOn', 'movementLoad', 'education', 'selfCare', 'reassess'],
                    properties: {
                        handsOn: { type: 'array', items: { type: 'string' } },
                        movementLoad: { type: 'array', items: { type: 'string' } },
                        education: { type: 'array', items: { type: 'string' } },
                        selfCare: { type: 'array', items: { type: 'string' } },
                        reassess: { type: 'array', items: { type: 'string' } },
                    },
                },
                referralTriggers: { type: 'array', items: { type: 'string' } },
            },
        },
    },
};
function formatClinicianSummaryMarkdown(json) {
    const lines = [];
    lines.push('AI-assisted draft — clinician review required.');
    lines.push('');
    lines.push('## Presenting Snapshot');
    lines.push(json.presentingSnapshot?.trim() || '—');
    lines.push('');
    lines.push('## Working Hypothesis');
    lines.push(json.workingHypothesis?.trim() || '—');
    lines.push('');
    lines.push('## Differentials');
    if (Array.isArray(json.differentials) && json.differentials.length > 0) {
        json.differentials.forEach((d) => {
            const name = (d?.name || '').trim();
            const rationale = (d?.rationale || '').trim();
            if (name && rationale)
                lines.push(`- **${name}**: ${rationale}`);
            else if (name)
                lines.push(`- **${name}**`);
        });
    }
    else {
        lines.push('—');
    }
    lines.push('');
    lines.push('## Plan');
    const plan = json.plan || {};
    const section = (title, items) => {
        lines.push(`### ${title}`);
        if (Array.isArray(items) && items.length > 0) {
            items.forEach((it) => {
                const t = typeof it === 'string' ? it.trim() : '';
                if (t)
                    lines.push(`- ${t}`);
            });
        }
        else {
            lines.push('—');
        }
        lines.push('');
    };
    section('Hands-on', plan.handsOn);
    section('Movement / load', plan.movementLoad);
    section('Education', plan.education);
    section('Self-care', plan.selfCare);
    section('Reassess', plan.reassess);
    lines.push('## Referral Triggers');
    if (Array.isArray(json.referralTriggers) && json.referralTriggers.length > 0) {
        json.referralTriggers.forEach((t) => {
            const s = typeof t === 'string' ? t.trim() : '';
            if (s)
                lines.push(`- ${s}`);
        });
    }
    else {
        lines.push('—');
    }
    lines.push('');
    return lines.join('\n');
}
function isClinicianSummaryJson(v) {
    if (!v || typeof v !== 'object')
        return false;
    if (typeof v.presentingSnapshot !== 'string')
        return false;
    if (typeof v.workingHypothesis !== 'string')
        return false;
    if (!Array.isArray(v.differentials))
        return false;
    if (!v.plan || typeof v.plan !== 'object')
        return false;
    if (!Array.isArray(v.referralTriggers))
        return false;
    return true;
}
const systemPrompt = `
You are "Soft Tissue Therapist Assistant" (Clinician Mode by default). Follow MODE CONTROLLER (Lite+), Safety, and Output rules exactly. UK English only.

MODE CONTROLLER (Lite+):
- Clinician Mode: concise, professional, clinical phrasing; audience is the treating clinician.
- Patient Mode: plain-language, reassuring; audience is the patient. Use only if explicitly requested.
- If not specified, stay in Clinician Mode.

Safety:
- Base outputs solely on provided intake context. Do not invent identifiers or appointments.
- Be cautious with red flags; suggest escalation only when warranted.
- If information is missing, state that it is missing rather than guessing.
- Refer to the person only as "the client."

Output formats:
- Default to concise bullet points; avoid generic filler.
- Do not repeat the same intake facts across sections.
- If key information is missing: state ONE assumption, then proceed.
- Max bullets per section: 8.
- Always include a short "Referral triggers" section.
`.trim();
const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const urlPattern = /\bhttps?:\/\/\S+/gi;
const phonePattern = /\b(?:0\d{9,10}|\+?\d{1,3}[-\s]?\d{2,4}[-\s]?\d{3,4}[-\s]?\d{3,4})\b/g;
const dobPattern = /\b(?:dob|dateofbirth|date_of_birth)\b/i;
function scrubText(input) {
    if (typeof input !== 'string')
        return '';
    return input.replace(emailPattern, '[redacted-email]').replace(urlPattern, '[redacted-url]').replace(phonePattern, '[redacted-phone]');
}
function ensureString(v) {
    return typeof v === 'string' ? scrubText(v) : '';
}
function computeAgeYears(dobAny) {
    let d = null;
    if (dobAny?.toDate && typeof dobAny.toDate === 'function') {
        d = dobAny.toDate();
    }
    else if (typeof dobAny === 'string') {
        d = new Date(dobAny);
    }
    if (!d || Number.isNaN(d.getTime()))
        return null;
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) {
        age--;
    }
    if (age < 0 || age > 120)
        return null;
    return age;
}
function scrubObject(obj) {
    if (Array.isArray(obj))
        return obj.map((v) => scrubObject(v));
    if (obj && typeof obj === 'object') {
        const res = {};
        Object.keys(obj).forEach((k) => {
            res[k] = scrubObject(obj[k]);
        });
        return res;
    }
    if (typeof obj === 'string')
        return scrubText(obj);
    return obj;
}
function containsIdentifiers(str) {
    const email = new RegExp(emailPattern);
    const url = new RegExp(urlPattern);
    const phone = new RegExp(phonePattern);
    const dob = new RegExp(dobPattern);
    return email.test(str) || url.test(str) || phone.test(str) || dob.test(str);
}
function minimiseContext(intake) {
    const payload = intake?.payload || intake?.data || intake || {};
    const client = payload.client || {};
    const problem = payload.problem || {};
    const medical = payload.medical || {};
    const lifestyle = payload.lifestyle || {};
    const consent = payload.consent || {};
    const bodyMap = payload.bodyMap || payload?.problem?.bodyMap || {};
    const ageYears = typeof client.ageYears === 'number'
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
            aiDraftConsent: !!consent.aiDraftConsent,
        },
        bodyMap: {
            markers: Array.isArray(bodyMap.markers)
                ? bodyMap.markers
                    .filter((m) => m &&
                    ['front', 'back', 'left', 'right'].includes(m.view) &&
                    typeof m.x === 'number' &&
                    typeof m.y === 'number')
                    .map((m) => ({
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
        throw new https_1.HttpsError('failed-precondition', 'Context contains identifiable data; generation blocked.');
    }
    return { context: scrubbed, ageYears, under18 };
}
exports.generateIntakeAIReport = (0, https_1.onCall)({ region: 'europe-west2' }, async (request) => {
    const uid = request.auth?.uid;
    const email = request.auth?.token?.email || null;
    if (!uid) {
        throw new https_1.HttpsError('unauthenticated', 'Authentication required.');
    }
    const { intakeId, reportType, mode } = (request.data || {});
    if (!intakeId || typeof intakeId !== 'string') {
        throw new https_1.HttpsError('invalid-argument', 'intakeId is required.');
    }
    const allowedTypes = ['clinician_summary', 'treatment_plan', 'followup_questions', 'both'];
    if (!reportType || !allowedTypes.includes(reportType)) {
        throw new https_1.HttpsError('invalid-argument', 'reportType is invalid.');
    }
    const db = (0, firestore_1.getFirestore)();
    // Verify admin allowlist
    const adminDoc = await db.collection('adminUsers').doc(uid).get();
    if (!adminDoc.exists) {
        throw new https_1.HttpsError('permission-denied', 'Admin access required.');
    }
    const snap = await db.collection('intakes').doc(intakeId).get();
    if (!snap.exists) {
        throw new https_1.HttpsError('not-found', 'Intake not found.');
    }
    const intakeData = snap.data();
    const { context, ageYears, under18 } = minimiseContext(intakeData);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new https_1.HttpsError('failed-precondition', 'OPENAI_API_KEY not configured.');
    }
    // ---------------------------------------------------------------------------
    // Atomic reservation (limits/cooldown) BEFORE any OpenAI call.
    // Schema:
    // - adminUsage/{uid}/days/{YYYY-MM-DD}
    // - intakeUsage/{intakeId}/days/{YYYY-MM-DD}
    // Each day doc stores:
    // - countSuccess: number
    // - countPending: number
    // - estCostUsd: number
    // - lastCallAt: Timestamp (admin only)
    // ---------------------------------------------------------------------------
    const todayKey = utcDayKey();
    const adminDayRef = db.collection('adminUsage').doc(uid).collection('days').doc(todayKey);
    const intakeDayRef = db.collection('intakeUsage').doc(intakeId).collection('days').doc(todayKey);
    const nowMs = Date.now();
    let reservationSucceeded = false;
    const readDayCounts = (data) => {
        const countSuccess = typeof data?.countSuccess === 'number'
            ? data.countSuccess
            : typeof data?.count === 'number'
                ? data.count
                : 0;
        const countPending = typeof data?.countPending === 'number'
            ? data.countPending
            : typeof data?.pendingCount === 'number'
                ? data.pendingCount
                : 0;
        const estCostUsd = typeof data?.estCostUsd === 'number' ? data.estCostUsd : 0;
        const lastCallAt = data?.lastCallAt?.toDate && typeof data.lastCallAt.toDate === 'function'
            ? data.lastCallAt.toDate()
            : data?.lastCallAttemptAt?.toDate && typeof data.lastCallAttemptAt.toDate === 'function'
                ? data.lastCallAttemptAt.toDate()
                : null;
        return { countSuccess, countPending, estCostUsd, lastCallAt };
    };
    const reserveOrThrow = async () => {
        await db.runTransaction(async (txn) => {
            const [adminSnap, intakeSnap] = await Promise.all([txn.get(adminDayRef), txn.get(intakeDayRef)]);
            const adminData = adminSnap.exists ? adminSnap.data() : {};
            const intakeUsageData = intakeSnap.exists ? intakeSnap.data() : {};
            const adminCounts = readDayCounts(adminData);
            const intakeCounts = readDayCounts(intakeUsageData);
            if (adminCounts.lastCallAt && nowMs - adminCounts.lastCallAt.getTime() < ADMIN_COOLDOWN_MS) {
                throw new https_1.HttpsError('failed-precondition', 'Please wait before generating another report.');
            }
            if (adminCounts.countSuccess + adminCounts.countPending >= ADMIN_DAILY_LIMIT) {
                throw new https_1.HttpsError('resource-exhausted', 'Daily AI generation limit reached. Try again tomorrow.');
            }
            if (intakeCounts.countSuccess + intakeCounts.countPending >= INTAKE_DAILY_LIMIT) {
                throw new https_1.HttpsError('resource-exhausted', 'Daily AI generation limit reached for this intake. Try again tomorrow.');
            }
            if (ENFORCE_DAILY_SPEND_CAP && adminCounts.estCostUsd >= DAILY_SPEND_CAP_USD) {
                throw new https_1.HttpsError('resource-exhausted', 'Daily AI spend limit reached. Try again tomorrow.');
            }
            txn.set(adminDayRef, {
                countSuccess: adminCounts.countSuccess,
                countPending: adminCounts.countPending + 1,
                estCostUsd: adminCounts.estCostUsd,
                lastCallAt: firestore_1.FieldValue.serverTimestamp(),
            }, { merge: true });
            txn.set(intakeDayRef, {
                countSuccess: intakeCounts.countSuccess,
                countPending: intakeCounts.countPending + 1,
                estCostUsd: intakeCounts.estCostUsd,
            }, { merge: true });
        });
    };
    const finaliseReservation = async (outcome, costUsd) => {
        await db.runTransaction(async (txn) => {
            const [adminSnap, intakeSnap] = await Promise.all([txn.get(adminDayRef), txn.get(intakeDayRef)]);
            const adminData = adminSnap.exists ? adminSnap.data() : {};
            const intakeUsageData = intakeSnap.exists ? intakeSnap.data() : {};
            const adminCounts = readDayCounts(adminData);
            const intakeCounts = readDayCounts(intakeUsageData);
            const nextAdminPending = Math.max(0, adminCounts.countPending - 1);
            const nextIntakePending = Math.max(0, intakeCounts.countPending - 1);
            const costToAdd = outcome === 'success' ? (typeof costUsd === 'number' ? costUsd : EST_COST_PER_CALL_USD) : 0;
            txn.set(adminDayRef, {
                countPending: nextAdminPending,
                countSuccess: adminCounts.countSuccess + (outcome === 'success' ? 1 : 0),
                estCostUsd: adminCounts.estCostUsd + costToAdd,
            }, { merge: true });
            txn.set(intakeDayRef, {
                countPending: nextIntakePending,
                countSuccess: intakeCounts.countSuccess + (outcome === 'success' ? 1 : 0),
                estCostUsd: intakeCounts.estCostUsd + costToAdd,
            }, { merge: true });
        });
    };
    // Reserve (must succeed before calling OpenAI)
    await reserveOrThrow();
    reservationSucceeded = true;
    // Optional write-back of computed age/under18 (no DOB stored)
    if (ageYears !== null || under18 !== null) {
        const update = {};
        if (ageYears !== null)
            update.ageYears = ageYears;
        if (under18 !== null)
            update.under18 = under18;
        await db.collection('intakes').doc(intakeId).set(update, { merge: true });
    }
    const modeLabel = mode === 'patient' ? 'Patient Mode' : 'Clinician Mode';
    const typeLabel = reportType === 'clinician_summary'
        ? 'Clinical summary'
        : reportType === 'treatment_plan'
            ? 'Treatment plan'
            : reportType === 'followup_questions'
                ? 'Follow-up questions'
                : 'Clinical summary + treatment plan';
    const perReportInstruction = (() => {
        if (reportType === 'clinician_summary') {
            return [
                'Headings exactly: Presenting Snapshot / Working Hypothesis / Plan / Referral Triggers',
                'Keep bullets concise; no repetition across sections.',
            ];
        }
        if (reportType === 'treatment_plan') {
            return [
                'Headings exactly: Session 1 Structure / Home Items / Reassess / Referral Triggers',
                'Home Items: 3–5 bullets. Max 8 bullets per subsection.',
            ];
        }
        if (reportType === 'followup_questions') {
            return [
                'Headings exactly: Safety / Clarifying / Goals',
                'Provide 6–10 total questions split across those headings.',
            ];
        }
        return [];
    })();
    const userPrompt = `
Generate ${typeLabel} in ${modeLabel}.
Use the intake context (already minimal and de-identified):
${JSON.stringify(context, null, 2)}

Instruction block for this report:
${perReportInstruction.map((p) => `- ${p}`).join('\n')}

Global constraints:
- Do not repeat intake facts across sections.
- If key info is missing: state ONE assumption, then proceed.
- Max bullets per section: 8.

Keep headings exactly as specified above, concise bullets, UK English, and actionable.
`.trim();
    const body = {
        model: MODEL,
        input: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        max_output_tokens: reportType === 'clinician_summary'
            ? 900
            : reportType === 'treatment_plan'
                ? 1100
                : reportType === 'followup_questions'
                    ? 700
                    : reportType === 'both'
                        ? 1400
                        : 900,
        temperature: 0.25,
    };
    if (reportType === 'clinician_summary') {
        body.response_format = CLINICIAN_SUMMARY_RESPONSE_FORMAT;
    }
    const doFetch = async (attempt = 0) => {
        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (response.ok) {
            return response.json();
        }
        const status = response.status;
        let code;
        let message;
        try {
            const errJson = await response.json();
            code = errJson?.error?.code;
            message = errJson?.error?.message;
            console.error('OpenAI error', { status, code, message });
        }
        catch {
            const text = await response.text();
            console.error('OpenAI error', { status, text });
        }
        // Never retry invalid_api_key or insufficient_quota.
        if (code === 'insufficient_quota') {
            throw new https_1.HttpsError('failed-precondition', 'OpenAI quota exceeded.');
        }
        if (status === 401 || code === 'invalid_api_key') {
            throw new https_1.HttpsError('unauthenticated', 'Invalid OpenAI API key.');
        }
        // Retry ONLY rate limit (HTTP 429), max 2 retries, exponential backoff + jitter.
        if (status === 429) {
            if (attempt < MAX_RETRIES) {
                const backoff = 500 * Math.pow(2, attempt) + Math.floor(Math.random() * 200);
                await new Promise((r) => setTimeout(r, backoff));
                return doFetch(attempt + 1);
            }
            throw new https_1.HttpsError('resource-exhausted', 'Rate limited. Try again in a moment.');
        }
        throw new https_1.HttpsError('internal', 'AI generation failed.');
    };
    let reservationFinalised = false;
    try {
        const data = await doFetch();
        const usage = data?.usage || null;
        const inputTokens = usage?.prompt_tokens ?? usage?.input_tokens ?? null;
        const outputTokens = usage?.completion_tokens ?? usage?.output_tokens ?? null;
        const totalTokens = usage?.total_tokens ??
            (typeof inputTokens === 'number' && typeof outputTokens === 'number' ? inputTokens + outputTokens : null);
        const estCost = (0, pricing_1.estimateCostUsd)(MODEL, inputTokens, outputTokens) ?? EST_COST_PER_CALL_USD;
        const rawText = data?.output_text ||
            (Array.isArray(data?.output)
                ? data.output
                    .map((item) => (item?.content ? item.content.map((c) => c?.text || '').join('\n') : ''))
                    .join('\n')
                : '') ||
            (Array.isArray(data?.choices)
                ? data.choices
                    .map((choice) => Array.isArray(choice?.message?.content)
                    ? choice.message.content.map((c) => c?.text || '').join('\n')
                    : choice?.message?.content || '')
                    .join('\n')
                : '') ||
            data?.choices?.[0]?.message?.content ||
            '';
        if (!rawText) {
            throw new https_1.HttpsError('internal', 'Empty AI response');
        }
        let contentText = rawText;
        let contentJson = null;
        if (reportType === 'clinician_summary') {
            let parsed = null;
            try {
                parsed = JSON.parse(rawText);
            }
            catch {
                // Some Responses API variants may still wrap JSON; attempt to extract first {...} block.
                const first = rawText.indexOf('{');
                const last = rawText.lastIndexOf('}');
                if (first !== -1 && last !== -1 && last > first) {
                    parsed = JSON.parse(rawText.slice(first, last + 1));
                }
                else {
                    throw new https_1.HttpsError('internal', 'AI response was not valid JSON for clinician summary.');
                }
            }
            if (!isClinicianSummaryJson(parsed)) {
                throw new https_1.HttpsError('internal', 'AI response JSON did not match expected clinician summary schema.');
            }
            contentJson = parsed;
            contentText = formatClinicianSummaryMarkdown(parsed);
        }
        const reportDoc = {
            type: reportType,
            reportType, // kept for backward compatibility
            mode: mode === 'patient' ? 'patient' : 'clinician',
            model: MODEL,
            promptVersion: PROMPT_VERSION,
            usage: {
                inputTokens: inputTokens ?? null,
                outputTokens: outputTokens ?? null,
                totalTokens: totalTokens ?? null,
            },
            estCostUsd: estCost ?? null,
            content: contentText,
            contentText,
            ...(contentJson ? { contentJson } : {}),
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            createdByUid: uid,
            createdByEmail: email,
        };
        const reportRef = await db.collection('intakes').doc(intakeId).collection('aiReports').add(reportDoc);
        await db.collection('intakes').doc(intakeId).collection('audit').add({
            type: 'ai_report_generated',
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            actorUid: uid,
            actorEmail: email,
            meta: { reportId: reportRef.id, reportType, model: MODEL },
        });
        // Finalise reservation only once all post-reservation work succeeded.
        await finaliseReservation('success', estCost ?? EST_COST_PER_CALL_USD);
        reservationFinalised = true;
        console.log('AI report generated', { intakeId, reportType, promptVersion: PROMPT_VERSION, model: MODEL });
        return { reportId: reportRef.id, content: contentText, model: MODEL };
    }
    catch (err) {
        if (reservationSucceeded && !reservationFinalised) {
            await finaliseReservation('failure');
        }
        throw err;
    }
});

import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { AIReport } from '../IntakeDetail';
import { ReportType } from '../../../lib/aiApi';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

type Props = {
  uid: string | null;
  intakeId: string;
  aiAllowed: boolean;
  aiGenerating: string | null;
  aiError: string | null;
  aiSuccess: boolean;
  aiContent: string;
  aiReports: AIReport[];
  selectedReportId: string | null;
  setSelectedReportId: Dispatch<SetStateAction<string | null>>;
  setAiContent: Dispatch<SetStateAction<string>>;
  handleGenerateAI: (type: ReportType) => Promise<void>;
  handleCopyAI: () => Promise<void>;
  addNoteFromAI: () => Promise<void>;
  savingNoteFromAI: boolean;
  updatingStatus: boolean;
  updateStatus: (status: string) => Promise<void>;
  copyMessage: string | null;
};

export function IntakeAI({
  uid,
  intakeId,
  aiAllowed,
  aiGenerating,
  aiError,
  aiSuccess,
  aiContent,
  aiReports,
  selectedReportId,
  setSelectedReportId,
  setAiContent,
  handleGenerateAI,
  handleCopyAI,
  addNoteFromAI,
  savingNoteFromAI,
  updatingStatus,
  updateStatus,
  copyMessage,
}: Props) {
  const [reportType, setReportType] = useState<ReportType>('clinician_summary');
  const [adminTodayUsed, setAdminTodayUsed] = useState<number | null>(null);
  const [intakeTodayUsed, setIntakeTodayUsed] = useState<number | null>(null);
  const [adminTodayCostUsd, setAdminTodayCostUsd] = useState<number | null>(null);

  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    if (!uid || !intakeId) return;
    const db = getFirestore();
    const adminRef = doc(db, 'adminUsage', uid, 'days', todayKey);
    const intakeRef = doc(db, 'intakeUsage', intakeId, 'days', todayKey);

    const parseUsed = (d: any) => {
      const countSuccess = typeof d?.countSuccess === 'number' ? d.countSuccess : typeof d?.count === 'number' ? d.count : 0;
      const countPending =
        typeof d?.countPending === 'number' ? d.countPending : typeof d?.pendingCount === 'number' ? d.pendingCount : 0;
      const estCostUsd = typeof d?.estCostUsd === 'number' ? d.estCostUsd : 0;
      return { used: countSuccess + countPending, estCostUsd };
    };

    const unsubAdmin = onSnapshot(adminRef, (snap) => {
      const data = snap.exists() ? (snap.data() as any) : {};
      const parsed = parseUsed(data);
      setAdminTodayUsed(parsed.used);
      setAdminTodayCostUsd(parsed.estCostUsd);
    });

    const unsubIntake = onSnapshot(intakeRef, (snap) => {
      const data = snap.exists() ? (snap.data() as any) : {};
      const parsed = parseUsed(data);
      setIntakeTodayUsed(parsed.used);
    });

    return () => {
      unsubAdmin();
      unsubIntake();
    };
  }, [uid, intakeId, todayKey]);

  const formatTokens = (r: AIReport) => {
    const total = r.usage?.totalTokens;
    if (typeof total === 'number') return `${total.toLocaleString()} tok`;
    const inT = r.usage?.inputTokens;
    const outT = r.usage?.outputTokens;
    if (typeof inT === 'number' && typeof outT === 'number') return `${(inT + outT).toLocaleString()} tok`;
    return null;
  };

  const formatUsd = (usd: number) => {
    const abs = Math.abs(usd);
    const decimals = abs > 0 && abs < 0.01 ? 4 : 2;
    return `$${usd.toFixed(decimals)}`;
  };

  const usageLine = useMemo(() => {
    const adminPart = adminTodayUsed === null ? '—/50' : `${adminTodayUsed}/50`;
    const intakePart = intakeTodayUsed === null ? '—/10' : `${intakeTodayUsed}/10`;
    const costPart = adminTodayCostUsd === null ? '—' : formatUsd(adminTodayCostUsd);
    return `Today: ${adminPart} • Intake: ${intakePart} • Est: ${costPart}`;
  }, [adminTodayUsed, intakeTodayUsed, adminTodayCostUsd]);

  const markdownFromClinicianSummaryJson = (v: any) => {
    if (!v || typeof v !== 'object') return null;
    if (typeof v.presentingSnapshot !== 'string' || typeof v.workingHypothesis !== 'string') return null;
    const plan = v.plan || {};
    const toBullets = (arr: any) =>
      Array.isArray(arr) ? arr.map((x) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean) : [];
    const diffLines =
      Array.isArray(v.differentials) && v.differentials.length
        ? v.differentials
            .map((d: any) => {
              const name = typeof d?.name === 'string' ? d.name.trim() : '';
              const rationale = typeof d?.rationale === 'string' ? d.rationale.trim() : '';
              if (name && rationale) return `- **${name}**: ${rationale}`;
              if (name) return `- **${name}**`;
              return null;
            })
            .filter(Boolean)
            .join('\n')
        : '—';
    const section = (title: string, items: string[]) => {
      if (!items.length) return `### ${title}\n—`;
      return `### ${title}\n${items.map((t) => `- ${t}`).join('\n')}`;
    };
    const referral =
      Array.isArray(v.referralTriggers) && v.referralTriggers.length
        ? v.referralTriggers
            .map((t: any) => (typeof t === 'string' ? t.trim() : ''))
            .filter(Boolean)
            .map((t: string) => `- ${t}`)
            .join('\n')
        : '—';
    return [
      'AI-assisted draft — clinician review required.',
      '',
      '## Presenting Snapshot',
      v.presentingSnapshot.trim() || '—',
      '',
      '## Working Hypothesis',
      v.workingHypothesis.trim() || '—',
      '',
      '## Differentials',
      diffLines,
      '',
      '## Plan',
      section('Hands-on', toBullets(plan.handsOn)),
      '',
      section('Movement / load', toBullets(plan.movementLoad)),
      '',
      section('Education', toBullets(plan.education)),
      '',
      section('Self-care', toBullets(plan.selfCare)),
      '',
      section('Reassess', toBullets(plan.reassess)),
      '',
      '## Referral Triggers',
      referral,
      '',
    ].join('\n');
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-brand-navy">AI Assistant</h3>
      <p className="text-sm text-amber-700">AI-assisted draft — clinician review required.</p>
      <p className="text-xs text-slate-600">{usageLine}</p>
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <select
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            disabled={!!aiGenerating || !aiAllowed}
          >
            <option value="clinician_summary">Clinician summary</option>
            <option value="treatment_plan">Treatment plan (Session 1)</option>
            <option value="followup_questions">Follow-up questions</option>
            <option value="both">Give both (Clinician + Client)</option>
          </select>
          <Button
            type="button"
            variant="primary"
            className="text-sm"
            disabled={!!aiGenerating || !aiAllowed}
            onClick={() => handleGenerateAI(reportType)}
          >
            {aiGenerating ? 'Generating…' : 'Generate'}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <Button
            type="button"
            variant="secondary"
            className="text-xs"
            disabled={!!aiGenerating || !aiAllowed}
            onClick={() => {
              setReportType('clinician_summary');
              handleGenerateAI('clinician_summary');
            }}
          >
            Quick: Clinician summary
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="text-xs"
            disabled={!!aiGenerating || !aiAllowed}
            onClick={() => {
              setReportType('followup_questions');
              handleGenerateAI('followup_questions');
            }}
          >
            Quick: Follow-up Qs
          </Button>
        </div>
      </div>
      {!aiAllowed ? (
        <p className="text-sm text-amber-700">AI generation is disabled because client AI consent was not provided.</p>
      ) : null}
      {aiError ? <p className="text-sm text-red-600">{aiError}</p> : null}
      {aiSuccess ? <p className="text-sm text-green-700">Generated and saved.</p> : null}
      {aiContent ? (
        <Card className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" onClick={handleCopyAI}>
                Copy
              </Button>
              <Button type="button" variant="secondary" disabled={savingNoteFromAI} onClick={addNoteFromAI}>
                {savingNoteFromAI ? 'Saving…' : 'Save to notes'}
              </Button>
            </div>
            {copyMessage ? <span className="text-sm text-green-700">{copyMessage}</span> : null}
          </div>
          <pre className="whitespace-pre-wrap text-sm text-slate-800">{aiContent}</pre>
        </Card>
      ) : null}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-brand-charcoal">Saved AI reports</p>
        {aiReports.length === 0 ? (
          <p className="text-sm text-slate-600">No AI reports yet.</p>
        ) : (
          <div className="space-y-2">
            {aiReports.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelectedReportId(r.id);
                  const jsonPreferred = r.reportType === 'clinician_summary' ? markdownFromClinicianSummaryJson(r.contentJson) : null;
                  setAiContent(jsonPreferred || r.contentText || r.content);
                }}
                className={`w-full rounded border px-3 py-2 text-left ${
                  selectedReportId === r.id ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex justify-between text-sm text-brand-charcoal">
                  <span>{r.reportType}</span>
                  <span className="text-xs text-slate-600">{r.createdAt ? r.createdAt.toLocaleString() : 'pending'}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
                  {r.model ? <span>Model: {r.model}</span> : null}
                  {formatTokens(r) ? <span>Tokens: {formatTokens(r)}</span> : null}
                  {typeof r.estCostUsd === 'number' ? <span>Est: {formatUsd(r.estCostUsd)}</span> : null}
                </div>
                <p className="mt-1 text-xs text-slate-600 truncate">{(r.contentText || r.content).slice(0, 140)}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

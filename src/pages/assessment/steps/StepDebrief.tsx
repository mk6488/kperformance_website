import type { Assessment } from '../../../assessment/types';
import { saveAssessment } from '../../../assessment/assessmentApi';

type Props = {
  assessment: Assessment;
  update: (fn: (prev: Assessment) => Assessment) => void;
  onComplete: () => void;
};

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[52px]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">{label}</label>
      {children}
    </div>
  );
}

async function completeSession(assessment: Assessment) {
  const { id, ...rest } = assessment;
  await saveAssessment(id, { ...rest, status: 'complete' });
}

export default function StepDebrief({ assessment, update, onComplete }: Props) {
  const deb = assessment.debrief;

  function setStrength(idx: number, val: string) {
    update(a => {
      const strengths = [...a.debrief.strengths];
      strengths[idx] = val;
      return { ...a, debrief: { ...a.debrief, strengths } };
    });
  }

  async function handleComplete() {
    update(a => ({ ...a, status: a.status === 'partialRedFlag' ? 'partialRedFlag' : 'complete' }));
    await completeSession({ ...assessment, status: assessment.status === 'partialRedFlag' ? 'partialRedFlag' : 'complete' });
    onComplete();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Two genuine strengths — named specifically</p>
        <Field label="Strength 1">
          <input className={inputCls} value={deb.strengths[0] ?? ''} onChange={e => setStrength(0, e.target.value)} placeholder="e.g. Excellent bilateral hip strength symmetry" />
        </Field>
        <Field label="Strength 2">
          <input className={inputCls} value={deb.strengths[1] ?? ''} onChange={e => setStrength(1, e.target.value)} placeholder="e.g. Above-average countermovement jump for age" />
        </Field>
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Top 3 priorities — flagged for mandatory retest</p>
        <p className="text-xs text-brand-slate">Enter the field names to flag (e.g. "hipAbductionLsi", "cmjBest"). These must be retested regardless of the standard battery.</p>
        {[0, 1, 2].map(i => (
          <Field key={i} label={`Priority ${i + 1}`}>
            <input
              className={inputCls}
              value={deb.priorityMeasures[i] ?? ''}
              onChange={e => {
                update(a => {
                  const priorities = [...a.debrief.priorityMeasures];
                  priorities[i] = e.target.value;
                  return { ...a, debrief: { ...a.debrief, priorityMeasures: priorities.filter(Boolean) } };
                });
              }}
              placeholder={`Priority measure ${i + 1}`}
            />
          </Field>
        ))}
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Follow-up</p>
        <Field label="Booked retest date — book in the room before they leave">
          <input type="date" className={inputCls} value={deb.retestDate ?? ''} onChange={e => update(a => ({ ...a, debrief: { ...a.debrief, retestDate: e.target.value || null } }))} />
        </Field>
        <Field label="Package sold">
          <div className="flex gap-2">
            {(['Yes', 'No'] as const).map(opt => (
              <button
                key={opt}
                onClick={() => update(a => ({ ...a, debrief: { ...a.debrief, packageSold: opt === 'Yes' } }))}
                className={`flex-1 py-3 rounded-full text-sm font-semibold border transition-colors min-h-[52px] ${deb.packageSold === (opt === 'Yes') ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-brand-slate border-slate-200'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <hr className="border-[#e9eef5]" />

      <button
        onClick={handleComplete}
        className="w-full bg-brand-green text-white font-bold text-base py-4 rounded-full min-h-[60px] hover:opacity-90 transition-opacity shadow-sm"
      >
        Complete session
      </button>

      {assessment.status === 'partialRedFlag' && (
        <p className="text-xs text-red-600 text-center">
          This session has a red flag recorded — it will be marked as partial, not complete.
        </p>
      )}
    </div>
  );
}

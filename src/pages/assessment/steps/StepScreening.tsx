import type { Assessment } from '../../../assessment/types';

type Props = { assessment: Assessment; update: (fn: (prev: Assessment) => Assessment) => void };

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors';
const textareaCls = inputCls + ' min-h-[96px] resize-y';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-semibold min-h-[56px] transition-colors ${checked ? 'bg-brand-green/10 border-brand-green/40 text-emerald-800' : 'bg-white border-slate-200 text-brand-charcoal'}`}
    >
      <span>{label}</span>
      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${checked ? 'border-brand-green bg-brand-green' : 'border-slate-300'}`}>
        {checked && <span className="text-white text-xs leading-none">✓</span>}
      </span>
    </button>
  );
}

export default function StepScreening({ assessment, update }: Props) {
  const scr = assessment.screening;

  function set(patch: Partial<typeof scr>) {
    update(a => ({ ...a, screening: { ...a.screening, ...patch } }));
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Checklist</p>
        <Toggle label="Parental consent form signed" checked={scr.consentFormSigned} onChange={v => set({ consentFormSigned: v })} />
        <Toggle label="PAR-Q completed" checked={scr.parqCompleted} onChange={v => set({ parqCompleted: v })} />
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Training history</p>
        <Field label="Injury history — what, when, still symptomatic?">
          <textarea className={textareaCls} value={scr.injuryHistory ?? ''} onChange={e => set({ injuryHistory: e.target.value || null })} placeholder="Describe any relevant injuries…" />
        </Field>
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Goals</p>
        <Field label="Athlete's goals — in their own words">
          <textarea className={textareaCls} value={scr.athleteGoals ?? ''} onChange={e => set({ athleteGoals: e.target.value || null })} placeholder="What does the athlete want to achieve?" />
        </Field>
        <Field label="Parent's goals — in their own words">
          <textarea className={textareaCls} value={scr.parentGoals ?? ''} onChange={e => set({ parentGoals: e.target.value || null })} placeholder="What do the parents want to achieve?" />
        </Field>
      </div>

      <hr className="border-[#e9eef5]" />

      <Field label="Assessor comments">
        <textarea className={textareaCls} value={scr.assessorComments ?? ''} onChange={e => set({ assessorComments: e.target.value || null })} placeholder="Any notes from this section…" />
      </Field>
    </div>
  );
}

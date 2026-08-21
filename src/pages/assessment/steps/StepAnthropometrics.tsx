import type { Assessment } from '../../../assessment/types';

type Props = { assessment: Assessment; update: (fn: (prev: Assessment) => Assessment) => void };

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[52px]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">{label}</label>
      {children}
    </div>
  );
}

function ReadoutRow({ label, value, unit, flagged }: { label: string; value: number | string | null; unit?: string; flagged?: boolean }) {
  const display = value === null ? '—' : typeof value === 'number' ? `${value.toFixed(2)}${unit ? ' ' + unit : ''}` : value;
  return (
    <div className={`flex justify-between items-baseline py-2 border-b border-white/10 font-mono text-sm ${flagged ? 'text-red-300' : 'text-brand-green'}`}>
      <span className="text-[#a8c4dc] font-sans text-xs">{label}</span>
      <span className="font-bold">{display}</span>
    </div>
  );
}

export default function StepAnthropometrics({ assessment, update }: Props) {
  const anthr = assessment.anthropometrics;

  function setVal(key: 'standingHeight' | 'sittingHeight' | 'bodyMass', value: number | null) {
    update(a => ({
      ...a,
      anthropometrics: {
        ...a.anthropometrics,
        [key]: { ...a.anthropometrics[key], value },
      },
    }));
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Measurements</p>
        <Field label="Standing height (cm)">
          <input
            type="number" step="0.1" className={inputCls}
            value={anthr.standingHeight.value ?? ''}
            onChange={e => setVal('standingHeight', e.target.value ? Number(e.target.value) : null)}
            placeholder="—" inputMode="decimal"
          />
        </Field>
        <Field label="Sitting height (cm)">
          <input
            type="number" step="0.1" className={inputCls}
            value={anthr.sittingHeight.value ?? ''}
            onChange={e => setVal('sittingHeight', e.target.value ? Number(e.target.value) : null)}
            placeholder="—" inputMode="decimal"
          />
        </Field>
        <Field label="Body mass (kg)">
          <input
            type="number" step="0.1" className={inputCls}
            value={anthr.bodyMass.value ?? ''}
            onChange={e => setVal('bodyMass', e.target.value ? Number(e.target.value) : null)}
            placeholder="—" inputMode="decimal"
          />
        </Field>
      </div>

      {/* Live derived readout */}
      <div className="bg-brand-charcoal rounded-xl p-4 space-y-0">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue mb-3">Derived</p>
        <ReadoutRow label="Leg length" value={anthr.legLength.value} unit="cm" />
        <ReadoutRow label="Decimal age" value={anthr.decimalAge.value} unit="yrs" />
        <ReadoutRow label="Maturity offset" value={anthr.maturityOffset.value} unit="yrs from PHV" />
        <div className="flex justify-between items-baseline py-2 font-mono text-sm">
          <span className="text-[#a8c4dc] font-sans text-xs">PHV status</span>
          <span className="font-bold text-brand-green">{anthr.phvStatus.value ?? '—'}</span>
        </div>
      </div>
    </div>
  );
}

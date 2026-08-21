import { useState } from 'react';
import type { Assessment } from '../../../assessment/types';

type Props = { assessment: Assessment; update: (fn: (prev: Assessment) => Assessment) => void };

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[52px]';
const textareaCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[80px] resize-y';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">{label}</label>
      {children}
    </div>
  );
}

export default function StepMovementRange({ assessment, update }: Props) {
  const mr = assessment.movementRange;
  const [ktwUnit, setKtwUnit] = useState<'cm' | '°'>('cm');

  function setMeasured(key: 'kneeToWallL' | 'kneeToWallR' | 'singleLegBalanceL' | 'singleLegBalanceR', value: number | null, unit?: string) {
    update(a => ({
      ...a,
      movementRange: {
        ...a.movementRange,
        [key]: { ...a.movementRange[key], value, ...(unit ? { unit } : {}) },
      },
    }));
  }

  function setObs(key: keyof typeof mr.overheadSquat, value: string | null) {
    update(a => ({
      ...a,
      movementRange: {
        ...a.movementRange,
        overheadSquat: { ...a.movementRange.overheadSquat, [key]: { ...a.movementRange.overheadSquat[key], value } },
      },
    }));
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Knee-to-wall ankle</p>
          <div className="flex gap-1">
            {(['cm', '°'] as const).map(u => (
              <button key={u} onClick={() => { setKtwUnit(u); setMeasured('kneeToWallL', mr.kneeToWallL.value, u); setMeasured('kneeToWallR', mr.kneeToWallR.value, u); }}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${ktwUnit === u ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-brand-slate border-slate-200'}`}>{u}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label={`Left (${ktwUnit})`}>
            <input type="number" step="0.1" className={inputCls} value={mr.kneeToWallL.value ?? ''} onChange={e => setMeasured('kneeToWallL', e.target.value ? Number(e.target.value) : null, ktwUnit)} placeholder="—" inputMode="decimal" />
          </Field>
          <Field label={`Right (${ktwUnit})`}>
            <input type="number" step="0.1" className={inputCls} value={mr.kneeToWallR.value ?? ''} onChange={e => setMeasured('kneeToWallR', e.target.value ? Number(e.target.value) : null, ktwUnit)} placeholder="—" inputMode="decimal" />
          </Field>
        </div>
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Single-leg balance — eyes open (max 30s)</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Left (s)">
            <input type="number" step="1" max={30} className={inputCls} value={mr.singleLegBalanceL.value ?? ''} onChange={e => setMeasured('singleLegBalanceL', e.target.value ? Math.min(30, Number(e.target.value)) : null)} placeholder="—" inputMode="numeric" />
          </Field>
          <Field label="Right (s)">
            <input type="number" step="1" max={30} className={inputCls} value={mr.singleLegBalanceR.value ?? ''} onChange={e => setMeasured('singleLegBalanceR', e.target.value ? Math.min(30, Number(e.target.value)) : null)} placeholder="—" inputMode="numeric" />
          </Field>
        </div>
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Overhead squat — observation only</p>
        <Field label="Depth">
          <input className={inputCls} value={mr.overheadSquat.depth.value ?? ''} onChange={e => setObs('depth', e.target.value || null)} placeholder="e.g. Full, Limited, Heel rise" />
        </Field>
        <Field label="Heel lift">
          <input className={inputCls} value={mr.overheadSquat.heelLift.value ?? ''} onChange={e => setObs('heelLift', e.target.value || null)} placeholder="e.g. None, Bilateral, Left only" />
        </Field>
        <Field label="Knee position">
          <input className={inputCls} value={mr.overheadSquat.kneePosition.value ?? ''} onChange={e => setObs('kneePosition', e.target.value || null)} placeholder="e.g. Neutral, Valgus L, Valgus bilateral" />
        </Field>
        <Field label="Trunk">
          <input className={inputCls} value={mr.overheadSquat.trunk.value ?? ''} onChange={e => setObs('trunk', e.target.value || null)} placeholder="e.g. Upright, Forward lean, Lean left" />
        </Field>
        <Field label="Notes">
          <textarea className={textareaCls} value={mr.overheadSquat.notes.value ?? ''} onChange={e => setObs('notes', e.target.value || null)} placeholder="Any additional observations…" />
        </Field>
      </div>

      <hr className="border-[#e9eef5]" />

      <Field label="Assessor comments">
        <textarea className={textareaCls} value={mr.assessorComments ?? ''} onChange={e => update(a => ({ ...a, movementRange: { ...a.movementRange, assessorComments: e.target.value || null } }))} placeholder="Any notes from this section…" />
      </Field>
    </div>
  );
}

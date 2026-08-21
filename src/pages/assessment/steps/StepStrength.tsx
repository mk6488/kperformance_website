import { useState } from 'react';
import type { Assessment, StrengthSide } from '../../../assessment/types';
import { trialVariance } from '../../../assessment/calculations';

type Props = { assessment: Assessment; update: (fn: (prev: Assessment) => Assessment) => void };

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[52px] text-center';
const textareaCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[80px] resize-y';

const TESTS = [
  { key: 'hipAbduction',       name: 'Hip Abduction',       position: 'Side-lying, upper leg into belt' },
  { key: 'hipAdduction',       name: 'Hip Adduction',       position: 'Side-lying, lower leg into belt' },
  { key: 'kneeFlexion',        name: 'Knee Flexion',        position: 'Prone, knee at 30°' },
  { key: 'kneeExtension',      name: 'Knee Extension',      position: 'Seated, legs hanging off table' },
  { key: 'anklePlantarflexion',name: 'Ankle Plantarflexion',position: 'Prone or seated' },
] as const;

type TestKey = typeof TESTS[number]['key'];

// SUB-STEP INDICES: 0–4 are the five tests; 5 is the ratios / comments summary
const SUMMARY = TESTS.length;

function fmt(v: number | null, dp = 1) {
  return v === null ? '—' : v.toFixed(dp);
}

function StrengthSideInput({
  label, side, onChange,
}: {
  label: string;
  side: StrengthSide;
  onChange: (patch: Partial<Pick<StrengthSide, 'trials' | 'best'>>) => void;
}) {
  const t1 = side.trials[0] ?? null;
  const t2 = side.trials[1] ?? null;
  const t3 = side.trials[2] ?? null;
  const variance = trialVariance(t1, t2);

  function setTrial(idx: number, val: number | null) {
    const trials = [...side.trials];
    if (val === null) { trials.splice(idx, 1); } else { trials[idx] = val; }
    const valid = trials.filter(v => v > 0);
    onChange({ trials, best: valid.length ? Math.max(...valid) : null });
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-brand-slate uppercase tracking-wide">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {[
          { idx: 0, val: t1, label: 'T1', alwaysShow: true },
          { idx: 1, val: t2, label: 'T2', alwaysShow: true },
          { idx: 2, val: t3, label: variance !== null ? 'T3 ← required' : 'T3', alwaysShow: true },
        ].map(({ idx, val, label: lbl }) => (
          <div key={idx} className="space-y-1">
            <label className={`block text-xs text-center ${idx === 2 && variance !== null ? 'text-amber-600 font-semibold' : 'text-slate-400'}`}>{lbl}</label>
            <input
              type="number" step="0.1" inputMode="decimal"
              className={`${inputCls} ${idx === 2 && variance !== null ? 'border-amber-400 ring-[3px] ring-amber-100' : ''}`}
              value={val ?? ''}
              onChange={e => setTrial(idx, e.target.value ? Number(e.target.value) : null)}
              placeholder="—"
            />
          </div>
        ))}
      </div>
      {variance !== null && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Trials differ by {variance.toFixed(0)}% — protocol requires a third trial
        </p>
      )}
      <p className="text-xs text-slate-500 text-right">
        Best: <span className="font-semibold text-brand-charcoal">{fmt(side.best)} N</span>
      </p>
    </div>
  );
}

export default function StepStrength({ assessment, update }: Props) {
  const [subStep, setSubStep] = useState(0);
  const str = assessment.strength;
  const mass = assessment.anthropometrics.bodyMass.value;

  function setSide(testKey: TestKey, sideKey: 'left' | 'right', patch: Partial<Pick<StrengthSide, 'trials' | 'best'>>) {
    update(a => ({
      ...a,
      strength: {
        ...a.strength,
        [testKey]: { ...a.strength[testKey], [sideKey]: { ...a.strength[testKey][sideKey], ...patch } },
      },
    }));
  }

  if (subStep === SUMMARY) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Strength summary</p>
          <button onClick={() => setSubStep(TESTS.length - 1)} className="text-xs text-brand-slate underline">← Back to tests</button>
        </div>

        {/* Per-test LSI readout */}
        <div className="bg-brand-charcoal rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-blue mb-1">LSI &amp; relative force</p>
          {TESTS.map(t => {
            const d = str[t.key];
            const lsiFlagged = d.lsi.value !== null && d.lsi.value < 90;
            return (
              <div key={t.key} className={`grid grid-cols-4 gap-1 py-2 border-b border-white/5 font-mono text-xs ${lsiFlagged ? 'text-red-300' : 'text-brand-green'}`}>
                <span className="col-span-2 text-[#a8c4dc] font-sans text-[10px] self-center">{t.name}</span>
                <span className="text-center font-bold">{fmt(d.lsi.value)}%</span>
                <span className="text-center text-[10px] text-slate-500">
                  L:{fmt(d.leftPctBM.value)}% R:{fmt(d.rightPctBM.value)}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Cross-test ratios */}
        <div className="bg-brand-charcoal rounded-xl px-4 py-3 grid grid-cols-2 gap-4 font-mono">
          <div>
            <p className="text-[#a8c4dc] text-[10px] uppercase tracking-wide">Adductor : Abductor</p>
            <p className={`font-bold text-2xl ${str.adductorAbductorRatio.value !== null && str.adductorAbductorRatio.value < 0.9 ? 'text-red-300' : 'text-brand-green'}`}>
              {fmt(str.adductorAbductorRatio.value, 2)}
            </p>
            <p className="text-[10px] text-slate-500">flag if &lt; 0.9</p>
          </div>
          <div>
            <p className="text-[#a8c4dc] text-[10px] uppercase tracking-wide">Flexion : Extension</p>
            <p className="font-bold text-2xl text-brand-green">{fmt(str.kneeFlexionExtensionRatio.value, 2)}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">Assessor comments</label>
          <textarea
            className={textareaCls}
            value={str.assessorComments ?? ''}
            onChange={e => update(a => ({ ...a, strength: { ...a.strength, assessorComments: e.target.value || null } }))}
            placeholder="Any notes from this section…"
          />
        </div>
      </div>
    );
  }

  const test = TESTS[subStep];
  const data = str[test.key];
  const lsiFlagged = data.lsi.value !== null && data.lsi.value < 90;

  return (
    <div className="space-y-5">
      {/* Test progress */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">
          Test {subStep + 1} of {TESTS.length}
        </p>
        <button onClick={() => setSubStep(SUMMARY)} className="text-xs text-brand-slate underline">
          View summary
        </button>
      </div>
      <div className="flex gap-1">
        {TESTS.map((_, i) => (
          <button
            key={i} onClick={() => setSubStep(i)}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i === subStep ? 'bg-brand-blue' : i < subStep ? 'bg-brand-green' : 'bg-slate-200'}`}
          />
        ))}
      </div>

      {/* Protocol instruction */}
      <div className="bg-white border border-[#e9eef5] rounded-xl p-4 space-y-1">
        <p className="font-bold text-brand-charcoal text-lg">{test.name}</p>
        <p className="text-sm text-brand-slate">{test.position}</p>
        <p className="text-xs text-brand-blue mt-2 font-medium">
          Open ActivForce → position athlete → run test → return here
        </p>
      </div>

      {/* Trial inputs */}
      <div className="space-y-4">
        <StrengthSideInput label="Left" side={data.left} onChange={p => setSide(test.key, 'left', p)} />
        <StrengthSideInput label="Right" side={data.right} onChange={p => setSide(test.key, 'right', p)} />
      </div>

      {/* Live derived readout */}
      <div className={`grid grid-cols-3 gap-2 bg-brand-charcoal rounded-xl px-3 py-3 font-mono text-xs ${lsiFlagged ? 'ring-2 ring-red-400' : ''}`}>
        <div className="text-center">
          <p className="text-[#a8c4dc] text-[10px]">LSI</p>
          <p className={`font-bold text-lg ${lsiFlagged ? 'text-red-300' : 'text-brand-green'}`}>{fmt(data.lsi.value)}%</p>
        </div>
        <div className="text-center">
          <p className="text-[#a8c4dc] text-[10px]">L %BM</p>
          <p className="font-bold text-lg text-brand-green">{mass ? fmt(data.leftPctBM.value) : '—'}%</p>
        </div>
        <div className="text-center">
          <p className="text-[#a8c4dc] text-[10px]">R %BM</p>
          <p className="font-bold text-lg text-brand-green">{mass ? fmt(data.rightPctBM.value) : '—'}%</p>
        </div>
      </div>

      {/* Sub-step navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setSubStep(s => Math.max(0, s - 1))}
          disabled={subStep === 0}
          className="flex-1 border border-[#e9eef5] text-brand-charcoal font-semibold text-sm py-3 rounded-full min-h-[52px] disabled:opacity-30 hover:border-brand-navy/40 transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={() => setSubStep(s => s + 1)}
          className="flex-1 bg-brand-navy text-white font-semibold text-sm py-3 rounded-full min-h-[52px] hover:bg-brand-blue transition-colors"
        >
          {subStep === TESTS.length - 1 ? 'View summary →' : 'Next test →'}
        </button>
      </div>
    </div>
  );
}

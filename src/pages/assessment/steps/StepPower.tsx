import type { Assessment, PerformanceTest } from '../../../assessment/types';

type Props = { assessment: Assessment; update: (fn: (prev: Assessment) => Assessment) => void };

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[52px] text-center';
const textareaCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[80px] resize-y';

function fmt(v: number | null, dp = 1) {
  return v === null ? '—' : v.toFixed(dp);
}

type TrialCount = 2 | 3;

function PerfTestInput({
  label,
  test,
  trialCount,
  bestFn,
  onChange,
}: {
  label: string;
  test: PerformanceTest;
  trialCount: TrialCount;
  bestFn: (...vals: (number | null)[]) => number | null;
  onChange: (patch: Partial<PerformanceTest>) => void;
}) {
  function setTrial(idx: number, val: number | null) {
    const trials = [...test.trials];
    if (val === null) { trials.splice(idx, 1); } else { trials[idx] = val; }
    const valid = trials.filter((v): v is number => v !== null && !isNaN(v));
    const best = valid.length ? bestFn(...valid) : null;
    onChange({ trials, best });
  }

  const cols = trialCount === 3 ? 'grid-cols-3' : 'grid-cols-2';

  return (
    <div className="bg-white rounded-xl border border-[#e9eef5] shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-brand-charcoal text-sm">{label}</p>
        <p className="text-xs text-brand-slate font-mono">Best: <span className="font-bold text-brand-charcoal">{fmt(test.best, test.unit === 's' ? 2 : 1)} {test.unit}</span></p>
      </div>
      <div className={`grid ${cols} gap-2`}>
        {Array.from({ length: trialCount }, (_, i) => (
          <div key={i} className="space-y-1">
            <label className="block text-xs text-slate-400 text-center">T{i + 1}</label>
            <input
              type="number"
              step={test.unit === 's' ? '0.01' : '0.1'}
              className={inputCls}
              value={test.trials[i] ?? ''}
              onChange={e => setTrial(i, e.target.value ? Number(e.target.value) : null)}
              placeholder="—"
              inputMode="decimal"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function maxBest(...vals: (number | null | undefined)[]): number | null {
  const valid = vals.filter((v): v is number => v !== null && v !== undefined && !isNaN(v));
  return valid.length ? Math.max(...valid) : null;
}

function minBest(...vals: (number | null | undefined)[]): number | null {
  const valid = vals.filter((v): v is number => v !== null && v !== undefined && !isNaN(v));
  return valid.length ? Math.min(...valid) : null;
}

export default function StepPower({ assessment, update }: Props) {
  const pw = assessment.power;

  function setTest(key: keyof typeof pw, patch: Partial<PerformanceTest>) {
    update(a => ({ ...a, power: { ...a.power, [key]: { ...(a.power[key as keyof typeof a.power] as PerformanceTest), ...patch } } }));
  }

  const hopLsiVal = pw.hopLsi.value;
  const hopLsiFlagged = hopLsiVal !== null && hopLsiVal < 90;

  return (
    <div className="space-y-4">
      <p className="text-xs text-brand-slate bg-brand-offWhite border border-[#e9eef5] rounded-lg px-3 py-2.5">
        Open My Jump Lab → perform test → return here → enter result. Fixed camera position, same every session.
      </p>

      <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Jumps (3 trials, best)</p>
      <PerfTestInput label="Countermovement jump (cm)" test={pw.cmj} trialCount={3} bestFn={maxBest} onChange={p => setTest('cmj', p)} />
      <PerfTestInput label="Standing broad jump (cm)" test={pw.broadJump} trialCount={3} bestFn={maxBest} onChange={p => setTest('broadJump', p)} />

      <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Single-leg hop (cm)</p>
      <PerfTestInput label="Left" test={pw.singleLegHopL} trialCount={3} bestFn={maxBest} onChange={p => setTest('singleLegHopL', p)} />
      <PerfTestInput label="Right" test={pw.singleLegHopR} trialCount={3} bestFn={maxBest} onChange={p => setTest('singleLegHopR', p)} />

      <div className={`bg-brand-charcoal rounded-xl px-4 py-3 flex items-center justify-between font-mono ${hopLsiFlagged ? 'ring-2 ring-red-400' : ''}`}>
        <span className="text-[#a8c4dc] text-xs uppercase tracking-wide">Hop LSI</span>
        <span className={`font-bold text-lg ${hopLsiFlagged ? 'text-red-300' : 'text-brand-green'}`}>{hopLsiVal !== null ? `${hopLsiVal.toFixed(1)}%` : '—'}</span>
      </div>

      <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Sprint (2 trials, best)</p>
      <PerfTestInput label="0–10m split (s)" test={pw.sprint0to10} trialCount={2} bestFn={minBest} onChange={p => setTest('sprint0to10', p)} />
      <PerfTestInput label="10–20m split (s)" test={pw.sprint10to20} trialCount={2} bestFn={minBest} onChange={p => setTest('sprint10to20', p)} />
      <PerfTestInput label="20m total (s)" test={pw.sprint20mTotal} trialCount={2} bestFn={minBest} onChange={p => setTest('sprint20mTotal', p)} />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">Sprint notes</label>
        <textarea className={textareaCls} value={pw.sprintNotes ?? ''} onChange={e => update(a => ({ ...a, power: { ...a.power, sprintNotes: e.target.value || null } }))} placeholder="e.g. Only 20m total captured, no split data available" />
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">Assessor comments</label>
        <textarea className={textareaCls} value={pw.assessorComments ?? ''} onChange={e => update(a => ({ ...a, power: { ...a.power, assessorComments: e.target.value || null } }))} placeholder="Any notes from this section…" />
      </div>
    </div>
  );
}

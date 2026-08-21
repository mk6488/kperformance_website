import type { Assessment, AerobicProtocol } from '../../../assessment/types';
import CooperTimer from '../CooperTimer';

type Props = {
  assessment: Assessment;
  update: (fn: (prev: Assessment) => Assessment) => void;
  lockedProtocol?: AerobicProtocol | null;
};

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[52px]';
const textareaCls = inputCls + ' min-h-[80px] resize-y';

const PROTOCOLS: {
  key: AerobicProtocol;
  label: string;
  sport: string;
  resultLabel: string;
  resultUnit: string;
  derivedLabel: string;
  derivedPlaceholder: string;
}[] = [
  {
    key: 'beepTest',
    label: 'Beep test / 20m shuttle',
    sport: 'Team sports',
    resultLabel: 'Level reached',
    resultUnit: 'level.shuttle',
    derivedLabel: 'Est. VO₂max (ml/kg/min)',
    derivedPlaceholder: 'From level-to-VO₂max table',
  },
  {
    key: 'cooper12min',
    label: 'Cooper 12-minute',
    sport: 'Endurance athletes',
    resultLabel: 'Distance run (m)',
    resultUnit: 'm',
    derivedLabel: 'Est. VO₂max (ml/kg/min)',
    derivedPlaceholder: 'Calculate and enter manually',
  },
  {
    key: 'criticalSpeed3min',
    label: '3-min all-out critical speed',
    sport: 'Runners',
    resultLabel: 'Distance at 3 min (m)',
    resultUnit: 'm',
    derivedLabel: 'Critical speed (m/s)',
    derivedPlaceholder: 'Distance ÷ 180 s',
  },
];

export default function StepEndurance({ assessment, update, lockedProtocol }: Props) {
  const end = assessment.endurance;
  const proto = PROTOCOLS.find(p => p.key === end.protocol);

  function setProtocol(key: AerobicProtocol) {
    const p = PROTOCOLS.find(x => x.key === key)!;
    update(a => ({
      ...a,
      endurance: {
        ...a.endurance,
        protocol: key,
        result: { value: null, unit: p.resultUnit, source: 'Manual', type: 'Measurement' },
        derived: { value: null, unit: '', source: 'Derived', type: 'Derived' },
      },
    }));
  }

  function setResult(value: number | null) {
    update(a => ({
      ...a,
      endurance: {
        ...a.endurance,
        result: { ...(a.endurance.result ?? { unit: '', source: 'Manual', type: 'Measurement' }), value },
      },
    }));
  }

  function setDerived(value: number | null) {
    update(a => ({
      ...a,
      endurance: {
        ...a.endurance,
        derived: { ...(a.endurance.derived ?? { unit: '', source: 'Derived', type: 'Derived' }), value },
      },
    }));
  }

  // Called by CooperTimer when GPS run completes — sets result with source: 'GPS'
  function handleCooperComplete(metres: number) {
    update(a => ({
      ...a,
      endurance: {
        ...a.endurance,
        result: { value: metres, unit: 'm', source: 'GPS', type: 'Measurement' },
      },
    }));
  }

  return (
    <div className="space-y-5">
      {/* Protocol selector — locked at retest */}
      {lockedProtocol != null ? (
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Protocol — locked from initial assessment</p>
          <div className="bg-brand-offWhite border border-[#e9eef5] rounded-xl px-4 py-3.5">
            <p className="font-semibold text-brand-charcoal">
              {PROTOCOLS.find(p => p.key === lockedProtocol)?.label ?? lockedProtocol}
            </p>
            <p className="text-xs text-brand-slate mt-0.5">Non-negotiable — same protocol as initial session</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">
            Protocol — choose once per athlete, never change between test and retest
          </p>
          {PROTOCOLS.map(p => (
            <button
              key={p.key}
              onClick={() => setProtocol(p.key)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-colors min-h-[64px] ${
                end.protocol === p.key
                  ? 'bg-brand-navy text-white border-brand-navy'
                  : 'bg-white text-brand-charcoal border-[#e9eef5] hover:border-brand-navy/30'
              }`}
            >
              <p className="font-semibold">{p.label}</p>
              <p className={`text-xs mt-0.5 ${end.protocol === p.key ? 'text-blue-200' : 'text-brand-slate'}`}>
                {p.sport}
              </p>
            </button>
          ))}
        </div>
      )}

      {proto && (
        <>
          <hr className="border-[#e9eef5]" />

          {/* Cooper 12-min: GPS timer replaces manual entry; manual fallback always shown below */}
          {end.protocol === 'cooper12min' && (
            <CooperTimer onComplete={handleCooperComplete} />
          )}

          <div className="space-y-3">
            <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Result</p>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">
                {proto.resultLabel}
                {end.result?.source === 'GPS' && (
                  <span className="ml-2 text-brand-green font-normal normal-case">● GPS</span>
                )}
              </label>
              <input
                type="number" step="0.1" inputMode="decimal"
                className={inputCls}
                value={end.result?.value ?? ''}
                onChange={e => setResult(e.target.value ? Number(e.target.value) : null)}
                placeholder={end.protocol === 'cooper12min' ? 'Auto-filled by timer, or enter manually' : '—'}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">
                {proto.derivedLabel}
              </label>
              {end.protocol === 'cooper12min' ? (
                <div className="w-full rounded-lg border border-slate-200 bg-brand-offWhite px-3 py-3 min-h-[52px] flex items-center">
                  {end.derived?.value != null
                    ? <span className="text-base font-semibold text-brand-charcoal">{end.derived.value} {end.derived.unit}</span>
                    : <span className="text-sm text-brand-slate italic">Enter result above to calculate</span>
                  }
                </div>
              ) : (
                <input
                  type="number" step="0.1" inputMode="decimal"
                  className={inputCls}
                  value={end.derived?.value ?? ''}
                  onChange={e => setDerived(e.target.value ? Number(e.target.value) : null)}
                  placeholder={proto.derivedPlaceholder}
                />
              )}
            </div>
          </div>
        </>
      )}

      <hr className="border-[#e9eef5]" />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">
          Assessor comments
        </label>
        <textarea
          className={textareaCls}
          value={end.assessorComments ?? ''}
          onChange={e =>
            update(a => ({ ...a, endurance: { ...a.endurance, assessorComments: e.target.value || null } }))
          }
          placeholder="Any notes from this section…"
        />
      </div>
    </div>
  );
}

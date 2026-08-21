import type { Assessment, ObservationValue } from '../../../assessment/types';

type Props = { assessment: Assessment; update: (fn: (prev: Assessment) => Assessment) => void };

const textareaCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[80px] resize-y';

function emptyObs(): ObservationValue {
  return { value: null, source: 'Manual', type: 'Observation' };
}

export default function StepRetestPriorities({ assessment, update }: Props) {
  const items = assessment.retestPriorityCapture ?? [];

  function setItem(idx: number, patch: Partial<typeof items[number]>) {
    update(a => {
      const next = [...(a.retestPriorityCapture ?? [])];
      next[idx] = { ...next[idx], ...patch };
      return { ...a, retestPriorityCapture: next };
    });
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Carried priorities</p>
        <div className="bg-white rounded-xl border border-[#e9eef5] shadow-sm px-4 py-6 text-center">
          <p className="text-sm text-brand-slate">No priorities were recorded in the previous session's debrief.</p>
        </div>
      </div>
    );
  }

  const inBattery = items.filter(i => !i.outOfBattery);
  const outOfBattery = items.filter(i => i.outOfBattery);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Carried priorities</p>
        <p className="text-sm text-brand-slate">
          Mark any priority not covered by today's standard tests — those need explicit capture below.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-[#e9eef5] shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-brand-charcoal text-sm">{item.label}</p>
              <button
                onClick={() => setItem(idx, {
                  outOfBattery: !item.outOfBattery,
                  observation: !item.outOfBattery ? emptyObs() : null,
                })}
                className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  item.outOfBattery
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-brand-offWhite text-brand-slate border-[#e9eef5]'
                }`}
              >
                {item.outOfBattery ? 'Needs explicit check' : 'Covered by tests'}
              </button>
            </div>

            {item.outOfBattery && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">
                  Observation at retest
                </label>
                <textarea
                  className={textareaCls}
                  value={item.observation?.value ?? ''}
                  onChange={e =>
                    setItem(idx, {
                      observation: { value: e.target.value || null, source: 'Manual', type: 'Observation' },
                    })
                  }
                  placeholder="What was observed — assessor observation, not a measurement"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {inBattery.length > 0 && (
        <p className="text-xs text-brand-slate bg-brand-offWhite border border-[#e9eef5] rounded-lg px-3 py-2.5">
          {inBattery.length} priorit{inBattery.length === 1 ? 'y' : 'ies'} covered by standard tests — results captured in Strength / Power / Endurance steps.
        </p>
      )}

      {outOfBattery.length > 0 && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
          {outOfBattery.length} priorit{outOfBattery.length === 1 ? 'y' : 'ies'} marked for explicit check — enter observations above before completing.
        </p>
      )}
    </div>
  );
}

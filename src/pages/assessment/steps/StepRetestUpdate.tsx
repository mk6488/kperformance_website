import type { Assessment } from '../../../assessment/types';

type Props = { assessment: Assessment; update: (fn: (prev: Assessment) => Assessment) => void };

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[52px]';
const textareaCls = inputCls + ' min-h-[80px] resize-y';
const selectCls = inputCls;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">{label}</label>
      {children}
    </div>
  );
}

export default function StepRetestUpdate({ assessment, update }: Props) {
  const snap = assessment.athleteSnapshot;
  const meta = assessment.sessionMeta;
  const ru = assessment.retestUpdate;

  function setMeta(patch: Partial<typeof meta>) {
    update(a => ({ ...a, sessionMeta: { ...a.sessionMeta, ...patch } }));
  }

  function setConditions(patch: Partial<typeof meta.conditions>) {
    update(a => ({
      ...a,
      sessionMeta: { ...a.sessionMeta, conditions: { ...a.sessionMeta.conditions, ...patch } },
    }));
  }

  function setRu(patch: Partial<NonNullable<typeof ru>>) {
    update(a => ({
      ...a,
      retestUpdate: { ...a.retestUpdate!, ...patch },
    }));
  }

  if (!ru) return null;

  return (
    <div className="space-y-6">
      {/* Athlete context — read-only */}
      <div className="bg-brand-offWhite border border-[#e9eef5] rounded-xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-semibold text-brand-charcoal">{snap.name || 'Athlete not set'}</p>
          <p className="text-sm text-brand-slate">{snap.sport || '—'}</p>
        </div>
        {ru.weeksSinceInitial !== null && (
          <div className="text-right">
            <p className="text-2xl font-bold text-brand-navy font-mono">{ru.weeksSinceInitial}</p>
            <p className="text-xs text-brand-slate">weeks since initial</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Session</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Session date">
            <input type="date" className={inputCls} value={meta.date} onChange={e => setMeta({ date: e.target.value })} />
          </Field>
          <Field label="Assessor">
            <input className={inputCls} value={meta.assessor} onChange={e => setMeta({ assessor: e.target.value })} placeholder="Name" />
          </Field>
        </div>
        <Field label="Parent / guardian present">
          <div className="flex gap-2">
            {(['Yes', 'No'] as const).map(opt => (
              <button
                key={opt}
                onClick={() => setMeta({ parentGuardianPresent: opt === 'Yes' })}
                className={`flex-1 py-3 rounded-full text-sm font-semibold border transition-colors min-h-[52px] ${meta.parentGuardianPresent === (opt === 'Yes') ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-brand-slate border-slate-200'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Conditions</p>
        <Field label="Surface">
          <input className={inputCls} value={meta.conditions.surface} onChange={e => setConditions({ surface: e.target.value })} placeholder="e.g. Astroturf, grass, concrete" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ground">
            <div className="flex gap-2">
              {(['dry', 'wet'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setConditions({ wetDry: opt })}
                  className={`flex-1 py-3 rounded-full text-sm font-semibold border transition-colors min-h-[52px] capitalize ${meta.conditions.wetDry === opt ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-brand-slate border-slate-200'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Wind">
            <select className={selectCls} value={meta.conditions.wind} onChange={e => setConditions({ wind: e.target.value as typeof meta.conditions.wind })}>
              {(['calm', 'light', 'moderate', 'strong'] as const).map(w => (
                <option key={w} value={w}>{w[0].toUpperCase() + w.slice(1)}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Conditions match initial session?">
          <div className="flex gap-2">
            {(['Yes', 'No'] as const).map(opt => (
              <button
                key={opt}
                onClick={() => setRu({ conditionsMatchInitial: opt === 'Yes', conditionsMismatchNote: opt === 'Yes' ? null : ru.conditionsMismatchNote })}
                className={`flex-1 py-3 rounded-full text-sm font-semibold border transition-colors min-h-[52px] ${ru.conditionsMatchInitial === (opt === 'Yes') ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-brand-slate border-slate-200'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </Field>

        {!ru.conditionsMatchInitial && (
          <Field label="Mismatch — note why and treat comparison with caution">
            <textarea
              className={textareaCls}
              value={ru.conditionsMismatchNote ?? ''}
              onChange={e => setRu({ conditionsMismatchNote: e.target.value || null })}
              placeholder="e.g. Wet surface — initial session was dry"
            />
          </Field>
        )}
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Update — since the initial session</p>
        <Field label="Injuries since last session?">
          <textarea
            className={textareaCls}
            value={ru.injuriesSince ?? ''}
            onChange={e => setRu({ injuriesSince: e.target.value || null })}
            placeholder="What, when, still symptomatic?"
          />
        </Field>
        <Field label="Illness or time off training?">
          <textarea
            className={textareaCls}
            value={ru.illnessTimeOff ?? ''}
            onChange={e => setRu({ illnessTimeOff: e.target.value || null })}
            placeholder="Any illness, enforced rest, or time away?"
          />
        </Field>
        <Field label="Training actually completed vs. plan">
          <textarea
            className={textareaCls}
            value={ru.trainingAdherence ?? ''}
            onChange={e => setRu({ trainingAdherence: e.target.value || null })}
            placeholder="Roughly how much of the planned training was completed?"
          />
        </Field>
        <Field label="Any noticeable growth or size change?">
          <textarea
            className={textareaCls}
            value={ru.growthChange ?? ''}
            onChange={e => setRu({ growthChange: e.target.value || null })}
            placeholder="Growth spurt, voice change, noticeable size change?"
          />
        </Field>
      </div>
    </div>
  );
}

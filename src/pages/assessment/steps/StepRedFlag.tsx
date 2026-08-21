import type { Assessment, RedFlagItem } from '../../../assessment/types';

type Props = { assessment: Assessment; update: (fn: (prev: Assessment) => Assessment) => void };

const textareaCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[80px] resize-y';

function RedFlagItemInput({
  label,
  item,
  onChange,
}: {
  label: string;
  item: RedFlagItem;
  onChange: (patch: Partial<RedFlagItem>) => void;
}) {
  return (
    <div className={`rounded-xl border p-4 space-y-3 transition-colors ${item.result === 'concern' ? 'border-red-300 bg-red-50' : 'border-[#e9eef5] bg-white'}`}>
      <p className="text-sm font-semibold text-brand-charcoal">{label}</p>
      <div className="flex gap-2">
        {(['pass', 'concern'] as const).map(opt => (
          <button
            key={opt}
            onClick={() => onChange({ result: opt })}
            className={`flex-1 py-3 rounded-full text-sm font-semibold border transition-colors min-h-[48px] capitalize ${
              item.result === opt
                ? opt === 'concern'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-brand-green text-white border-brand-green'
                : 'bg-white text-brand-slate border-slate-200'
            }`}
          >
            {opt === 'pass' ? '✓ Pass' : '⚠ Concern'}
          </button>
        ))}
      </div>
      <textarea
        className={textareaCls}
        value={item.notes ?? ''}
        onChange={e => onChange({ notes: e.target.value || null })}
        placeholder="Notes…"
      />
    </div>
  );
}

export default function StepRedFlag({ assessment, update }: Props) {
  const rf = assessment.redFlagScreen;

  function setItem(key: 'passiveHipIR_left' | 'passiveHipIR_right' | 'systemicFlags', patch: Partial<RedFlagItem>) {
    update(a => {
      const updated = { ...a.redFlagScreen, [key]: { ...a.redFlagScreen[key], ...patch } };
      const anyRedFlag =
        updated.passiveHipIR_left.result === 'concern' ||
        updated.passiveHipIR_right.result === 'concern' ||
        updated.systemicFlags.result === 'concern';
      return {
        ...a,
        redFlagScreen: { ...updated, anyRedFlag },
        status: anyRedFlag ? 'partialRedFlag' : a.status === 'partialRedFlag' ? 'draft' : a.status,
      };
    });
  }

  return (
    <div className="space-y-4">
      {rf.anyRedFlag && (
        <div className="bg-red-600 text-white rounded-xl px-4 py-4 space-y-1">
          <p className="font-bold text-sm">⚠ Red flag recorded</p>
          <p className="text-xs opacity-90">
            Complete non-loading portions only. Write the referral note. Do not charge.
          </p>
        </div>
      )}

      <RedFlagItemInput
        label="Passive hip internal rotation — Left"
        item={rf.passiveHipIR_left}
        onChange={patch => setItem('passiveHipIR_left', patch)}
      />
      <RedFlagItemInput
        label="Passive hip internal rotation — Right"
        item={rf.passiveHipIR_right}
        onChange={patch => setItem('passiveHipIR_right', patch)}
      />
      <RedFlagItemInput
        label="Systemic flags — night pain, rest pain, unexplained weight loss, unexplained limp"
        item={rf.systemicFlags}
        onChange={patch => setItem('systemicFlags', patch)}
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">Assessor comments</label>
        <textarea
          className={textareaCls}
          value={rf.assessorComments ?? ''}
          onChange={e =>
            update(a => ({ ...a, redFlagScreen: { ...a.redFlagScreen, assessorComments: e.target.value || null } }))
          }
          placeholder="Any notes from this section…"
        />
      </div>
    </div>
  );
}

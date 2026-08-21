import type { Assessment } from '../../../assessment/types';
import { saveAssessment } from '../../../assessment/assessmentApi';

type Props = {
  assessment: Assessment;
  update: (fn: (prev: Assessment) => Assessment) => void;
  onComplete: () => void;
};

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

async function completeSession(assessment: Assessment) {
  const { id, ...rest } = assessment;
  await saveAssessment(id, { ...rest, status: 'complete' });
}

export default function StepRetestDiscussion({ assessment, update, onComplete }: Props) {
  const disc = assessment.retestDiscussion;

  function setImprovement(idx: number, val: string) {
    update(a => {
      const improvements = [...(a.retestDiscussion?.improvements ?? [])];
      improvements[idx] = val;
      return { ...a, retestDiscussion: { ...a.retestDiscussion!, improvements: improvements.filter((v, i) => i < idx || v) } };
    });
  }

  function setStillNeedsWork(idx: number, val: string) {
    update(a => {
      const stillNeedsWork = [...(a.retestDiscussion?.stillNeedsWork ?? [])];
      stillNeedsWork[idx] = val;
      return { ...a, retestDiscussion: { ...a.retestDiscussion!, stillNeedsWork: stillNeedsWork.filter((v, i) => i < idx || v) } };
    });
  }

  function setDisc(patch: Partial<NonNullable<typeof disc>>) {
    update(a => ({ ...a, retestDiscussion: { ...a.retestDiscussion!, ...patch } }));
  }

  async function handleComplete() {
    const newStatus = assessment.status === 'partialRedFlag' ? 'partialRedFlag' : 'complete';
    update(a => ({ ...a, status: newStatus }));
    await completeSession({ ...assessment, status: newStatus });
    onComplete();
  }

  if (!disc) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">What's improved — named specifically</p>
        {[
          'e.g. Hip adduction symmetry restored — both sides within 5%',
          'e.g. CMJ improved from 28 cm to 34 cm',
          'e.g. Overhead squat depth — heels staying down',
        ].map((placeholder, i) => (
          <Field key={i} label={`Improvement ${i + 1}`}>
            <input
              className={inputCls}
              value={disc.improvements[i] ?? ''}
              onChange={e => setImprovement(i, e.target.value)}
              placeholder={placeholder}
            />
          </Field>
        ))}
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">What still needs work — carries forward to next retest</p>
        {[
          'e.g. Left knee extension still showing asymmetry',
          'e.g. Hop LSI improved but not yet at 90%',
          'e.g. Sprint splits not yet matching initial best',
        ].map((placeholder, i) => (
          <Field key={i} label={`Still needs work ${i + 1}`}>
            <input
              className={inputCls}
              value={disc.stillNeedsWork[i] ?? ''}
              onChange={e => setStillNeedsWork(i, e.target.value)}
              placeholder={placeholder}
            />
          </Field>
        ))}
        <p className="text-xs text-brand-slate">These entries carry forward as priorities if a further retest is booked.</p>
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Next steps</p>
        <Field label="Next training block — or close out if this was the final retest">
          <textarea
            className={textareaCls}
            value={disc.nextBlock ?? ''}
            onChange={e => setDisc({ nextBlock: e.target.value || null })}
            placeholder="Describe the next block, or note that this session closes out the programme"
          />
        </Field>
        <Field label="Next retest date — book in the room if continuing">
          <input
            type="date"
            className={inputCls}
            value={disc.nextRetestDate ?? ''}
            onChange={e => setDisc({ nextRetestDate: e.target.value || null })}
          />
        </Field>
      </div>

      <hr className="border-[#e9eef5]" />

      <button
        onClick={handleComplete}
        className="w-full bg-brand-green text-white font-bold text-base py-4 rounded-full min-h-[60px] hover:opacity-90 transition-opacity shadow-sm"
      >
        Complete retest
      </button>
    </div>
  );
}

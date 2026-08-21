import type { Assessment } from '../../../assessment/types';
import { saveAssessment } from '../../../assessment/assessmentApi';

type EvidenceRow = {
  label: string;
  value: string;
  provenance: string;
};

const STR_TESTS = [
  { key: 'hipAbduction' as const,         name: 'Hip Abduction' },
  { key: 'hipAdduction' as const,         name: 'Hip Adduction' },
  { key: 'kneeFlexion' as const,          name: 'Knee Flexion' },
  { key: 'kneeExtension' as const,        name: 'Knee Extension' },
  { key: 'anklePlantarflexion' as const,  name: 'Ankle Plantarflexion' },
] as const;

function getFlags(a: Assessment): EvidenceRow[] {
  const rows: EvidenceRow[] = [];
  const str = a.strength;

  for (const t of STR_TESTS) {
    const v = str[t.key].lsi.value;
    if (v !== null && v < 90) {
      rows.push({ label: t.name, value: `${v.toFixed(1)}% LSI`, provenance: 'Measured result' });
    }
  }

  const hopLsi = a.power.hopLsi.value;
  if (hopLsi !== null && hopLsi < 90) {
    rows.push({ label: 'Single-leg hop', value: `${hopLsi.toFixed(1)}% LSI`, provenance: 'Measured result' });
  }

  const ratio = str.adductorAbductorRatio.value;
  if (ratio !== null && ratio < 0.9) {
    rows.push({ label: 'Adductor : Abductor ratio', value: ratio.toFixed(2), provenance: 'Derived from measurements' });
  }

  return rows;
}

function getResults(a: Assessment): EvidenceRow[] {
  const rows: EvidenceRow[] = [];
  const str = a.strength;

  for (const t of STR_TESTS) {
    const v = str[t.key].lsi.value;
    if (v !== null && v >= 90) {
      rows.push({ label: t.name, value: `${v.toFixed(1)}% LSI`, provenance: 'Measured result' });
    }
  }

  const hopLsi = a.power.hopLsi.value;
  if (hopLsi !== null && hopLsi >= 90) {
    rows.push({ label: 'Single-leg hop', value: `${hopLsi.toFixed(1)}% LSI`, provenance: 'Measured result' });
  }

  const ratio = str.adductorAbductorRatio.value;
  if (ratio !== null && ratio >= 0.9) {
    rows.push({ label: 'Adductor : Abductor ratio', value: ratio.toFixed(2), provenance: 'Derived from measurements' });
  }

  return rows;
}

function getObservations(a: Assessment): EvidenceRow[] {
  const rows: EvidenceRow[] = [];
  const sq = a.movementRange.overheadSquat;
  const push = (label: string, value: string | null) => {
    if (value) rows.push({ label, value, provenance: 'Assessor observation' });
  };

  push('Squat depth',            sq.depth.value);
  push('Heel lift',              sq.heelLift.value);
  push('Knee position (squat)',  sq.kneePosition.value);
  push('Trunk (squat)',          sq.trunk.value);
  push('Squat — notes',         sq.notes.value);
  push('Movement & range',       a.movementRange.assessorComments);
  push('Strength',               a.strength.assessorComments);
  push('Power & speed',          a.power.assessorComments);
  push('Endurance',              a.endurance.assessorComments);
  push('Screening',              a.screening.assessorComments);

  return rows;
}

function EvidenceSection({ title, items }: { title: string; items: EvidenceRow[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-brand-slate tracking-wide uppercase mb-2">{title}</p>
      <div className="bg-white rounded-xl border border-[#e9eef5] divide-y divide-[#e9eef5]">
        {items.map((item, i) => (
          <div key={i} className="px-4 py-3">
            <p className="text-sm font-semibold text-brand-charcoal">{item.label}</p>
            <p className="text-sm text-brand-charcoal mt-0.5">{item.value}</p>
            <p className="text-xs text-brand-slate mt-1">{item.provenance}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  assessment: Assessment;
  update: (fn: (prev: Assessment) => Assessment) => void;
  onComplete: () => void;
};

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[52px]';

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

export default function StepDebrief({ assessment, update, onComplete }: Props) {
  const deb = assessment.debrief;
  const snap = assessment.athleteSnapshot;
  const anthr = assessment.anthropometrics;

  const flags = getFlags(assessment);
  const results = getResults(assessment);
  const observations = getObservations(assessment);

  function setStrength(idx: number, val: string) {
    update(a => {
      const strengths = [...a.debrief.strengths];
      strengths[idx] = val;
      return { ...a, debrief: { ...a.debrief, strengths } };
    });
  }

  function setPriority(idx: number, val: string) {
    update(a => {
      const priorityMeasures = [...a.debrief.priorityMeasures];
      priorityMeasures[idx] = val;
      return { ...a, debrief: { ...a.debrief, priorityMeasures: priorityMeasures.filter(Boolean) } };
    });
  }

  async function handleComplete() {
    const newStatus =
      assessment.status === 'partialRedFlag' ? 'partialRedFlag' : 'complete';
    update(a => ({ ...a, status: newStatus }));
    await completeSession({ ...assessment, status: newStatus });
    onComplete();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Evidence review</p>

        <div className="bg-brand-offWhite border border-[#e9eef5] rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-brand-slate tracking-wide uppercase">Context</p>
          <div className="mt-1.5 text-sm text-brand-charcoal space-y-0.5">
            {snap.sport && <p>{snap.sport}</p>}
            {anthr.decimalAge.value !== null
              ? <p>{anthr.decimalAge.value.toFixed(1)} years</p>
              : <p className="text-brand-slate italic">Decimal age — check anthropometrics</p>}
            {anthr.phvStatus.value && <p>{anthr.phvStatus.value}</p>}
          </div>
        </div>

        <EvidenceSection title="Flags" items={flags} />
        <EvidenceSection title="Results" items={results} />
        <EvidenceSection title="Assessor observations" items={observations} />
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Two genuine strengths — named specifically</p>
        <Field label="Strength 1">
          <input
            className={inputCls}
            value={deb.strengths[0] ?? ''}
            onChange={e => setStrength(0, e.target.value)}
            placeholder="e.g. Excellent bilateral hip strength symmetry"
          />
        </Field>
        <Field label="Strength 2">
          <input
            className={inputCls}
            value={deb.strengths[1] ?? ''}
            onChange={e => setStrength(1, e.target.value)}
            placeholder="e.g. Above-average countermovement jump for age"
          />
        </Field>
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Top priorities — flagged for mandatory retest</p>
        {[
          'e.g. Left hip adduction symmetry',
          'e.g. Overhead squat depth',
          'e.g. Single-leg hop LSI',
        ].map((placeholder, i) => (
          <Field key={i} label={`Priority ${i + 1}`}>
            <input
              className={inputCls}
              value={deb.priorityMeasures[i] ?? ''}
              onChange={e => setPriority(i, e.target.value)}
              placeholder={placeholder}
            />
          </Field>
        ))}
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Follow-up</p>
        <Field label="Booked retest date — book in the room before they leave">
          <input
            type="date"
            className={inputCls}
            value={deb.retestDate ?? ''}
            onChange={e =>
              update(a => ({ ...a, debrief: { ...a.debrief, retestDate: e.target.value || null } }))
            }
          />
        </Field>
        <Field label="Package sold">
          <div className="flex gap-2">
            {(['Yes', 'No'] as const).map(opt => (
              <button
                key={opt}
                onClick={() =>
                  update(a => ({ ...a, debrief: { ...a.debrief, packageSold: opt === 'Yes' } }))
                }
                className={`flex-1 py-3 rounded-full text-sm font-semibold border transition-colors min-h-[52px] ${
                  deb.packageSold === (opt === 'Yes')
                    ? 'bg-brand-navy text-white border-brand-navy'
                    : 'bg-white text-brand-slate border-slate-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <hr className="border-[#e9eef5]" />

      <button
        onClick={handleComplete}
        className="w-full bg-brand-green text-white font-bold text-base py-4 rounded-full min-h-[60px] hover:opacity-90 transition-opacity shadow-sm"
      >
        Complete session
      </button>

      {assessment.status === 'partialRedFlag' && (
        <p className="text-xs text-red-600 text-center">
          This session has a red flag recorded — it will be marked as partial, not complete.
        </p>
      )}
    </div>
  );
}

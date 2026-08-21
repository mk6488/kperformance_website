import { useState, useEffect } from 'react';
import type { Assessment, Athlete } from '../../../assessment/types';
import { listAthletes, createAthlete } from '../../../assessment/assessmentApi';

type Props = {
  assessment: Assessment;
  update: (fn: (prev: Assessment) => Assessment) => void;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-brand-slate tracking-wide uppercase">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-brand-charcoal focus:outline-none focus:ring-[3px] focus:ring-brand-blue/15 focus:border-brand-blue transition-colors min-h-[52px]';
const selectCls = inputCls;

export default function StepAthleteSession({ assessment, update }: Props) {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [mode, setMode] = useState<'select' | 'new'>('select');
  const snap = assessment.athleteSnapshot;
  const meta = assessment.sessionMeta;

  useEffect(() => {
    listAthletes().then(setAthletes);
  }, []);

  function setSnap(patch: Partial<typeof snap>) {
    update(a => ({ ...a, athleteSnapshot: { ...a.athleteSnapshot, ...patch } }));
  }

  function setMeta(patch: Partial<typeof meta>) {
    update(a => ({ ...a, sessionMeta: { ...a.sessionMeta, ...patch } }));
  }

  function setConditions(patch: Partial<typeof meta.conditions>) {
    update(a => ({
      ...a,
      sessionMeta: { ...a.sessionMeta, conditions: { ...a.sessionMeta.conditions, ...patch } },
    }));
  }

  function handleAthleteSelect(id: string) {
    const athlete = athletes.find(a => a.id === id);
    if (!athlete) return;
    update(a => ({
      ...a,
      athleteId: athlete.id,
      athleteSnapshot: {
        ...a.athleteSnapshot,
        name: athlete.name,
        dob: athlete.dob,
        sex: athlete.sex,
        sport: athlete.primarySport,
      },
    }));
  }

  async function handleCreateAthlete() {
    if (!snap.name || !snap.dob || !snap.sport) return;
    const id = await createAthlete({ name: snap.name, dob: snap.dob, sex: snap.sex, primarySport: snap.sport });
    update(a => ({ ...a, athleteId: id }));
    const refreshed = await listAthletes();
    setAthletes(refreshed);
    setMode('select');
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Athlete</p>

        <div className="flex gap-2">
          <button
            onClick={() => setMode('select')}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold border transition-colors ${mode === 'select' ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-brand-slate border-slate-200'}`}
          >
            Existing athlete
          </button>
          <button
            onClick={() => setMode('new')}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold border transition-colors ${mode === 'new' ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-brand-slate border-slate-200'}`}
          >
            New athlete
          </button>
        </div>

        {mode === 'select' ? (
          <Field label="Athlete">
            <select className={selectCls} value={assessment.athleteId} onChange={e => handleAthleteSelect(e.target.value)}>
              <option value="">— Select athlete —</option>
              {athletes.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.dob})</option>
              ))}
            </select>
          </Field>
        ) : (
          <div className="space-y-3">
            <Field label="Name">
              <input className={inputCls} value={snap.name} onChange={e => setSnap({ name: e.target.value })} placeholder="Athlete full name" />
            </Field>
            <Field label="Date of birth">
              <input type="date" className={inputCls} value={snap.dob} onChange={e => setSnap({ dob: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sex">
                <select className={selectCls} value={snap.sex} onChange={e => setSnap({ sex: e.target.value as 'M' | 'F' | 'Other' })}>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="Primary sport">
                <input className={inputCls} value={snap.sport} onChange={e => setSnap({ sport: e.target.value })} placeholder="e.g. Football" />
              </Field>
            </div>
            <button
              onClick={handleCreateAthlete}
              disabled={!snap.name || !snap.dob || !snap.sport}
              className="w-full bg-brand-green text-white font-semibold text-sm py-3 rounded-full min-h-[52px] hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Save athlete profile
            </button>
          </div>
        )}
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Session</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Training days / wk">
            <input type="number" className={inputCls} value={snap.trainingDaysPerWeek ?? ''} onChange={e => setSnap({ trainingDaysPerWeek: e.target.value ? Number(e.target.value) : null })} placeholder="—" min={0} max={14} />
          </Field>
          <Field label="Years in sport">
            <input type="number" className={inputCls} value={snap.yearsInSport ?? ''} onChange={e => setSnap({ yearsInSport: e.target.value ? Number(e.target.value) : null })} placeholder="—" min={0} />
          </Field>
        </div>
        <Field label="Other sports">
          <input className={inputCls} value={snap.otherSports ?? ''} onChange={e => setSnap({ otherSports: e.target.value || null })} placeholder="e.g. Swimming, Athletics" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="S&C coach?">
            <select className={selectCls} value={snap.hasStrengthCoach === null ? '' : snap.hasStrengthCoach ? 'yes' : 'no'} onChange={e => setSnap({ hasStrengthCoach: e.target.value === 'yes' ? true : e.target.value === 'no' ? false : null })}>
              <option value="">—</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
          {snap.hasStrengthCoach && (
            <Field label="Coach name">
              <input className={inputCls} value={snap.strengthCoachName ?? ''} onChange={e => setSnap({ strengthCoachName: e.target.value || null })} placeholder="Name" />
            </Field>
          )}
        </div>
      </div>

      <hr className="border-[#e9eef5]" />

      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-brand-blue">Session details</p>
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
        <Field label="Temperature °C (optional)">
          <input type="number" className={inputCls} value={meta.conditions.tempC ?? ''} onChange={e => setConditions({ tempC: e.target.value ? Number(e.target.value) : null })} placeholder="—" />
        </Field>
      </div>
    </div>
  );
}

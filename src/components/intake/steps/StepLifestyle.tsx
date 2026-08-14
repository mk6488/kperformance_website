import { IntakeValues } from '../types';

type Props = {
  values: IntakeValues;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onChange: (path: string, value: any) => void;
};

export default function StepLifestyle({ values, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Sport / activity (optional)
          <input
            value={values.lifestyle.activity}
            onChange={(e) => onChange('lifestyle.activity', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            placeholder="e.g. football, running, dance"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Weekly training load (optional)
          <input
            value={values.lifestyle.weeklyLoad}
            onChange={(e) => onChange('lifestyle.weeklyLoad', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            placeholder="e.g. 3 football sessions, 1 gym"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Sleep hours (optional)
          <input
            value={values.lifestyle.sleepHours}
            onChange={(e) => onChange('lifestyle.sleepHours', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            placeholder="e.g. 7-8 hours"
          />
        </label>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium text-slate-800">
            <span>Stress level (0–10)</span>
            <span className="text-slate-600">{values.lifestyle.stressScore ?? 'Not set'}</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={values.lifestyle.stressScore ?? 0}
            onChange={(e) => onChange('lifestyle.stressScore', Number(e.target.value))}
            className="w-full accent-brand-navy"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Sleep quality (optional)
          <select
            value={values.lifestyle.sleepQuality}
            onChange={(e) => onChange('lifestyle.sleepQuality', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
          >
            <option value="">Select</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </label>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-medium text-slate-800">
            <span>Mood (0–10)</span>
            <span className="text-slate-600">{values.lifestyle.moodScore ?? 'Not set'}</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={values.lifestyle.moodScore ?? 0}
            onChange={(e) => onChange('lifestyle.moodScore', Number(e.target.value))}
            className="w-full accent-brand-navy"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Nutrition quality (optional)
          <select
            value={values.lifestyle.nutritionQuality}
            onChange={(e) => onChange('lifestyle.nutritionQuality', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
          >
            <option value="">Select</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Alcohol intake (optional)
          <select
            value={values.lifestyle.alcoholIntake}
            onChange={(e) => onChange('lifestyle.alcoholIntake', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
          >
            <option value="">Select</option>
            <option value="None">None</option>
            <option value="Low">Low</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Smoking (optional)
          <select
            value={values.lifestyle.smoking}
            onChange={(e) => onChange('lifestyle.smoking', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
          >
            <option value="">Select</option>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          What helps you wind down and relax? (optional)
          <textarea
            value={values.lifestyle.windDown}
            onChange={(e) => onChange('lifestyle.windDown', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            rows={2}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          What do you like to do for fun? (optional)
          <textarea
            value={values.lifestyle.fun}
            onChange={(e) => onChange('lifestyle.fun', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            rows={2}
          />
        </label>
      </div>
    </div>
  );
}


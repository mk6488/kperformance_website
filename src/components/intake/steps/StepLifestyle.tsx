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
    </div>
  );
}

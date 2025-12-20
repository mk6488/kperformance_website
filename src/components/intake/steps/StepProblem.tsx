import { IntakeValues } from '../types';

type Props = {
  values: IntakeValues;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onChange: (path: string, value: any) => void;
};

export default function StepProblem({ values, errors, touched, onChange }: Props) {
  const showError = (path: string) => touched[path] && errors[path];

  return (
    <div className="space-y-6">
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
        Main concern <span className="text-red-600">*</span>
        <textarea
          value={values.problem.mainConcern}
          onChange={(e) => onChange('problem.mainConcern', e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
          rows={3}
          placeholder="Describe the main issue or pain"
        />
        {showError('problem.mainConcern') && (
          <p className="text-sm text-red-600">{errors['problem.mainConcern']}</p>
        )}
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          When did it start? (optional)
          <input
            value={values.problem.onset}
            onChange={(e) => onChange('problem.onset', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            placeholder="e.g. 3 weeks ago, after football"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Where is it? (optional)
          <input
            value={values.problem.locationText}
            onChange={(e) => onChange('problem.locationText', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            placeholder="e.g. right hamstring, lower back"
          />
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-medium text-slate-800">
          <span>Pain right now (0–10)</span>
          <span className="text-slate-600">{values.problem.painNow ?? 'Not set'}</span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={values.problem.painNow ?? 0}
          onChange={(e) => onChange('problem.painNow', Number(e.target.value))}
          className="w-full accent-brand-navy"
        />
        {showError('problem.painNow') && <p className="text-sm text-red-600">{errors['problem.painNow']}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          What makes it worse? (optional)
          <textarea
            value={values.problem.aggravators}
            onChange={(e) => onChange('problem.aggravators', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            rows={2}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          What helps? (optional)
          <textarea
            value={values.problem.easers}
            onChange={(e) => onChange('problem.easers', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            rows={2}
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
        Goals for treatment (optional)
        <textarea
          value={values.problem.goals}
          onChange={(e) => onChange('problem.goals', e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
          rows={2}
          placeholder="What would you like to achieve?"
        />
      </label>
    </div>
  );
}

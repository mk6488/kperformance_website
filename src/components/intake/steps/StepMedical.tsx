import { IntakeValues } from '../types';

type Props = {
  values: IntakeValues;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onChange: (path: string, value: any) => void;
};

const medicalOptions = ['diabetes', 'asthma', 'epilepsy', 'high blood pressure', 'heart condition', 'pregnancy', 'recent illness'];

const redFlagOptions = [
  'unexplained weight loss',
  'night pain not eased by rest',
  'numbness/tingling with weakness',
  'changes to bowel/bladder control',
];

export default function StepMedical({ values, onChange }: Props) {
  const toggleCheckbox = (key: string) => {
    onChange(`medical.checkboxes.${key}`, !values.medical.checkboxes[key]);
  };

  const toggleRedFlag = (value: string) => {
    const current = values.medical.redFlags;
    if (current.includes(value)) {
      onChange(
        'medical.redFlags',
        current.filter((v) => v !== value),
      );
    } else {
      onChange('medical.redFlags', [...current, value]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Existing conditions
          <textarea
            value={values.medical.conditions}
            onChange={(e) => onChange('medical.conditions', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            rows={2}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Previous injuries / surgery
          <textarea
            value={values.medical.surgeries}
            onChange={(e) => onChange('medical.surgeries', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            rows={2}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Medication
          <textarea
            value={values.medical.medications}
            onChange={(e) => onChange('medical.medications', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            rows={2}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-800">
          Allergies
          <textarea
            value={values.medical.allergies}
            onChange={(e) => onChange('medical.allergies', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            rows={2}
          />
        </label>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-brand-navy">Common medical history (tick any that apply)</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {medicalOptions.map((item) => (
            <label key={item} className="inline-flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={!!values.medical.checkboxes[item]}
                onChange={() => toggleCheckbox(item)}
                className="h-4 w-4 rounded border border-slate-300 text-brand-navy focus:ring-brand-blue"
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-brand-navy">Red flag checklist (optional)</p>
        <p className="text-sm text-slate-600">
          If you select any of these, Mike may recommend medical assessment before treatment.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {redFlagOptions.map((item) => (
            <label key={item} className="inline-flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={values.medical.redFlags.includes(item)}
                onChange={() => toggleRedFlag(item)}
                className="h-4 w-4 rounded border border-slate-300 text-brand-navy focus:ring-brand-blue"
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}


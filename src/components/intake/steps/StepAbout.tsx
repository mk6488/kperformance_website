import { IntakeValues } from '../types';

type Props = {
  values: IntakeValues;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onChange: (path: string, value: any) => void;
};

export default function StepAbout({ values, errors, touched, onChange }: Props) {
  const showError = (path: string) => touched[path] && errors[path];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800">
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            value={values.client.fullName}
            onChange={(e) => onChange('client.fullName', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            placeholder="e.g. Alex Smith"
          />
          {showError('client.fullName') && <p className="text-sm text-red-600">{errors['client.fullName']}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800">
            Date of birth <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            value={values.client.dob}
            onChange={(e) => onChange('client.dob', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
          />
          {showError('client.dob') && <p className="text-sm text-red-600">{errors['client.dob']}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            value={values.client.email}
            onChange={(e) => onChange('client.email', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            placeholder="name@example.com"
          />
          {showError('client.email') && <p className="text-sm text-red-600">{errors['client.email']}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-800">Phone (optional)</label>
          <input
            type="tel"
            value={values.client.phone}
            onChange={(e) => onChange('client.phone', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
            placeholder="+44..."
          />
        </div>
      </div>

      <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-800">
        <input
          type="checkbox"
          checked={values.client.under18}
          onChange={(e) => onChange('client.under18', e.target.checked)}
          className="h-4 w-4 rounded border border-slate-300 text-brand-navy focus:ring-brand-blue"
        />
        The client is under 18
      </label>

      {values.client.under18 && (
        <div className="space-y-4 rounded-lg border border-slate-200 bg-brand-offWhite px-4 py-4">
          <p className="text-sm font-semibold text-brand-navy">Parent / guardian details</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-800">
                Full name <span className="text-red-600">*</span>
              </label>
              <input
                value={values.client.guardian.fullName}
                onChange={(e) => onChange('client.guardian.fullName', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
                placeholder="Parent/guardian name"
              />
              {showError('client.guardian.fullName') && (
                <p className="text-sm text-red-600">{errors['client.guardian.fullName']}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-800">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={values.client.guardian.email}
                onChange={(e) => onChange('client.guardian.email', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
                placeholder="guardian@example.com"
              />
              {showError('client.guardian.email') && (
                <p className="text-sm text-red-600">{errors['client.guardian.email']}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-800">
                Phone <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                value={values.client.guardian.phone}
                onChange={(e) => onChange('client.guardian.phone', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
                placeholder="+44..."
              />
              {showError('client.guardian.phone') && (
                <p className="text-sm text-red-600">{errors['client.guardian.phone']}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-800">Relationship (optional)</label>
              <input
                value={values.client.guardian.relationship}
                onChange={(e) => onChange('client.guardian.relationship', e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/40"
                placeholder="e.g. parent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


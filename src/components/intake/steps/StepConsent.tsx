import { IntakeValues } from '../types';

type Props = {
  values: IntakeValues;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onChange: (path: string, value: any) => void;
};

export default function StepConsent({ values, errors, touched, onChange }: Props) {
  const showError = (path: string) => touched[path] && errors[path];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="inline-flex items-start gap-3 text-sm font-medium text-slate-800">
          <input
            type="checkbox"
            checked={values.consent.healthDataConsent}
            onChange={(e) => onChange('consent.healthDataConsent', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border border-slate-300 text-brand-navy focus:ring-brand-blue"
          />
          <span>
            Consent to process health information for the purpose of assessment and treatment{' '}
            <span className="text-red-600">*</span>
          </span>
        </label>
        {showError('consent.healthDataConsent') && (
          <p className="text-sm text-red-600">{errors['consent.healthDataConsent']}</p>
        )}

        <label className="inline-flex items-start gap-3 text-sm font-medium text-slate-800">
          <input
            type="checkbox"
            checked={values.consent.confirmTruthful}
            onChange={(e) => onChange('consent.confirmTruthful', e.target.checked)}
            className="mt-1 h-4 w-4 rounded border border-slate-300 text-brand-navy focus:ring-brand-blue"
          />
          <span>
            Information provided is accurate to the best of my knowledge <span className="text-red-600">*</span>
          </span>
        </label>
        {showError('consent.confirmTruthful') && (
          <p className="text-sm text-red-600">{errors['consent.confirmTruthful']}</p>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-brand-navy">Contact preferences (optional)</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <label className="inline-flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={values.consent.contactPrefs.email}
              onChange={(e) => onChange('consent.contactPrefs.email', e.target.checked)}
              className="h-4 w-4 rounded border border-slate-300 text-brand-navy focus:ring-brand-blue"
            />
            Email
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={values.consent.contactPrefs.sms}
              onChange={(e) => onChange('consent.contactPrefs.sms', e.target.checked)}
              className="h-4 w-4 rounded border border-slate-300 text-brand-navy focus:ring-brand-blue"
            />
            SMS
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={values.consent.contactPrefs.phone}
              onChange={(e) => onChange('consent.contactPrefs.phone', e.target.checked)}
              className="h-4 w-4 rounded border border-slate-300 text-brand-navy focus:ring-brand-blue"
            />
            Phone
          </label>
        </div>
      </div>

      <p className="text-sm text-slate-600">
        Your data is handled responsibly. See our{' '}
        <a href="/privacy" className="underline text-brand-navy hover:text-brand-blue">
          Privacy Policy
        </a>
        . Next step: you’ll be able to submit this form securely.
      </p>
    </div>
  );
}

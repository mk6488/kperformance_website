import { useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { IntakeStep, IntakeStepId, IntakeValues, defaultIntakeValues } from './types';
import StepAbout from './steps/StepAbout';
import StepProblem from './steps/StepProblem';
import StepMedical from './steps/StepMedical';
import StepLifestyle from './steps/StepLifestyle';
import StepConsent from './steps/StepConsent';
import useIntakeDraft from './useIntakeDraft';

type Errors = Record<string, string>;

const steps: IntakeStep[] = [
  { id: 'about', title: 'About you', shortLabel: 'About you' },
  { id: 'problem', title: 'Your issue', shortLabel: 'Issue' },
  { id: 'medical', title: 'Medical', shortLabel: 'Medical' },
  { id: 'lifestyle', title: 'Lifestyle', shortLabel: 'Lifestyle' },
  { id: 'consent', title: 'Consent', shortLabel: 'Consent' },
];

function setByPath<T extends object>(obj: T, path: string, value: any): T {
  const parts = path.split('.');
  const clone: any = { ...obj };
  let current: any = clone;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    current[key] = { ...current[key] };
    current = current[key];
  }
  current[parts[parts.length - 1]] = value;
  return clone;
}

function validateEmail(value: string) {
  if (!value) return false;
  return /\S+@\S+\.\S+/.test(value);
}

function validateStep(stepId: IntakeStepId, values: IntakeValues): Errors {
  const errors: Errors = {};

  if (stepId === 'about') {
    if (!values.client.fullName.trim()) errors['client.fullName'] = 'Full name is required.';
    if (!values.client.dob.trim()) errors['client.dob'] = 'Date of birth is required.';
    if (!values.client.email.trim()) errors['client.email'] = 'Email is required.';
    if (values.client.email && !validateEmail(values.client.email)) errors['client.email'] = 'Enter a valid email.';
    if (values.client.under18) {
      if (!values.client.guardian.fullName.trim()) errors['client.guardian.fullName'] = 'Guardian name is required.';
      if (!values.client.guardian.email.trim()) errors['client.guardian.email'] = 'Guardian email is required.';
      if (values.client.guardian.email && !validateEmail(values.client.guardian.email))
        errors['client.guardian.email'] = 'Enter a valid guardian email.';
      if (!values.client.guardian.phone.trim()) errors['client.guardian.phone'] = 'Guardian phone is required.';
    }
  }

  if (stepId === 'problem') {
    if (!values.problem.mainConcern.trim()) errors['problem.mainConcern'] = 'Please describe the main concern.';
    if (values.problem.painNow !== null) {
      if (Number.isNaN(values.problem.painNow) || values.problem.painNow < 0 || values.problem.painNow > 10) {
        errors['problem.painNow'] = 'Pain score must be between 0 and 10.';
      }
    }
  }

  if (stepId === 'consent') {
    if (!values.consent.healthDataConsent) errors['consent.healthDataConsent'] = 'Consent is required.';
    if (!values.consent.confirmTruthful) errors['consent.confirmTruthful'] = 'Please confirm the information is accurate.';
  }

  return errors;
}

function getRequiredPaths(stepId: IntakeStepId, values: IntakeValues): string[] {
  const paths: string[] = [];
  if (stepId === 'about') {
    paths.push('client.fullName', 'client.dob', 'client.email');
    if (values.client.under18) {
      paths.push('client.guardian.fullName', 'client.guardian.email', 'client.guardian.phone');
    }
  }
  if (stepId === 'problem') {
    paths.push('problem.mainConcern');
  }
  if (stepId === 'consent') {
    paths.push('consent.healthDataConsent', 'consent.confirmTruthful');
  }
  return paths;
}

export default function IntakeWizard() {
  const [values, setValues] = useState<IntakeValues>(defaultIntakeValues);
  const [stepIndex, setStepIndex] = useState(0);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { restoreAvailable, restoreDraft, clearDraft } = useIntakeDraft(values);
  const [showRestoreBanner, setShowRestoreBanner] = useState(false);

  useEffect(() => {
    if (restoreAvailable) {
      setShowRestoreBanner(true);
    }
  }, [restoreAvailable]);

  const step = steps[stepIndex];

  const errors = useMemo(() => validateStep(step.id, values), [step.id, values]);

  const isStepValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleChange = (path: string, value: any) => {
    setValues((prev) => setByPath(prev, path, value));
  };

  const markFieldsTouched = (paths: string[]) => {
    setTouched((prev) => {
      const next = { ...prev };
      paths.forEach((p) => {
        next[p] = true;
      });
      return next;
    });
  };

  const handleNext = () => {
    const requiredPaths = getRequiredPaths(step.id, values);
    markFieldsTouched(requiredPaths);
    const stepErrors = validateStep(step.id, values);
    if (Object.keys(stepErrors).length > 0) return;
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const progress = ((stepIndex + 1) / steps.length) * 100;

  const stepProps = {
    values,
    errors,
    touched,
    onChange: handleChange,
  };

  const handleResume = () => {
    const draftValues = restoreDraft();
    if (draftValues) {
      setValues(draftValues);
      setTouched({});
      setStepIndex(0);
    }
    setShowRestoreBanner(false);
  };

  const handleStartAgain = () => {
    clearDraft();
    setValues(defaultIntakeValues);
    setTouched({});
    setStepIndex(0);
    setShowRestoreBanner(false);
  };

  return (
    <div className="space-y-4">
      {showRestoreBanner ? (
        <div className="rounded-lg border border-slate-200 bg-brand-offWhite px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-brand-charcoal space-y-1">
            <p className="font-semibold text-brand-navy">You have a saved form from an earlier visit.</p>
            <p className="text-slate-700">Would you like to continue where you left off?</p>
          </div>
          <div className="flex gap-3">
            <Button type="button" onClick={handleResume}>
              Resume form
            </Button>
            <Button type="button" variant="secondary" onClick={handleStartAgain}>
              Start again
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between text-sm text-slate-700">
        <span className="font-medium text-brand-charcoal">
          Step {stepIndex + 1} of {steps.length}
        </span>
        <span className="text-slate-500">{step.title}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full bg-brand-navy transition-all"
          style={{ width: `${progress}%` }}
          aria-label={`Progress ${Math.round(progress)}%`}
        />
      </div>

      <Card className="space-y-6">
        {step.id === 'about' && <StepAbout {...stepProps} />}
        {step.id === 'problem' && <StepProblem {...stepProps} />}
        {step.id === 'medical' && <StepMedical {...stepProps} />}
        {step.id === 'lifestyle' && <StepLifestyle {...stepProps} />}
        {step.id === 'consent' && <StepConsent {...stepProps} />}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              disabled={stepIndex === 0}
              className="px-5"
            >
              Back
            </Button>
            <Button type="button" onClick={handleNext} className="px-5">
              {stepIndex === steps.length - 1 ? 'Review & continue' : 'Next'}
            </Button>
          </div>
          <p className="text-sm text-slate-600">
            Required fields are marked. Your answers help Mike prepare appropriately.
          </p>
        </div>
      </Card>
    </div>
  );
}

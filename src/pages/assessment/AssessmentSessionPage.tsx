import { useState } from 'react';
import { useAssessment } from '../../assessment/useAssessment';
import StepAthleteSession from './steps/StepAthleteSession';
import StepScreening from './steps/StepScreening';
import StepRedFlag from './steps/StepRedFlag';
import StepAnthropometrics from './steps/StepAnthropometrics';
import StepMovementRange from './steps/StepMovementRange';
import StepStrength from './steps/StepStrength';
import StepPower from './steps/StepPower';
import StepEndurance from './steps/StepEndurance';
import StepDebrief from './steps/StepDebrief';
import StepRetestUpdate from './steps/StepRetestUpdate';
import StepRetestPriorities from './steps/StepRetestPriorities';
import StepRetestPower from './steps/StepRetestPower';
import StepRetestDiscussion from './steps/StepRetestDiscussion';

const INITIAL_STEPS = [
  'Athlete & Session',
  'Screening',
  'Red Flag Screen',
  'Anthropometrics',
  'Movement & Range',
  'Strength',
  'Power & Speed',
  'Endurance',
  'Debrief',
];

const RETEST_STEPS = [
  'Session & Update',
  'Carried Priorities',
  'Strength',
  'Power & Speed',
  'Endurance',
  'Discussion',
];

type Props = { assessmentId: string };

export default function AssessmentSessionPage({ assessmentId }: Props) {
  const { assessment, loading, saveState, update } = useAssessment(assessmentId);
  const [step, setStep] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-offWhite flex items-center justify-center">
        <p className="text-brand-slate text-sm">Loading session…</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-brand-offWhite flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-[#e9eef5] shadow-sm p-6 max-w-sm w-full space-y-3">
          <p className="font-semibold text-brand-charcoal">Session not found</p>
          <a href="/assessment" className="block text-sm text-brand-blue underline">
            Back to assessments
          </a>
        </div>
      </div>
    );
  }

  const saveIndicator =
    saveState === 'saving' ? 'Saving…'
    : saveState === 'saved' ? 'Saved'
    : saveState === 'error' ? 'Save failed'
    : '';

  const isRetest = assessment.sessionType === 'retest';
  const STEPS = isRetest ? RETEST_STEPS : INITIAL_STEPS;
  const carriedPriorities = assessment.retestPriorityCapture?.map(p => p.label) ?? [];
  const lockedProtocol = isRetest ? (assessment.endurance?.protocol ?? null) : undefined;
  const stepProps = { assessment, update };

  function renderStep() {
    if (isRetest) {
      switch (step) {
        case 0: return <StepRetestUpdate {...stepProps} />;
        case 1: return <StepRetestPriorities {...stepProps} />;
        case 2: return <StepStrength {...stepProps} carriedPriorities={carriedPriorities} />;
        case 3: return <StepRetestPower {...stepProps} />;
        case 4: return <StepEndurance {...stepProps} lockedProtocol={lockedProtocol} />;
        case 5: return <StepRetestDiscussion {...stepProps} onComplete={() => { window.location.href = '/assessment'; }} />;
        default: return null;
      }
    }
    switch (step) {
      case 0: return <StepAthleteSession {...stepProps} />;
      case 1: return <StepScreening {...stepProps} />;
      case 2: return <StepRedFlag {...stepProps} />;
      case 3: return <StepAnthropometrics {...stepProps} />;
      case 4: return <StepMovementRange {...stepProps} />;
      case 5: return <StepStrength {...stepProps} />;
      case 6: return <StepPower {...stepProps} />;
      case 7: return <StepEndurance {...stepProps} />;
      case 8: return <StepDebrief {...stepProps} onComplete={() => { window.location.href = '/assessment'; }} />;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-brand-offWhite flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#e9eef5] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <a href="/assessment" className="text-brand-slate hover:text-brand-navy transition-colors text-xl leading-none">
            ←
          </a>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-brand-charcoal text-sm truncate">
              {assessment.athleteSnapshot?.name || 'New session'}
              {isRetest && <span className="ml-2 text-xs font-normal text-brand-slate">Retest</span>}
            </p>
            <p className="text-xs text-brand-slate">{STEPS[step]}</p>
          </div>
          {saveIndicator ? (
            <span className={`text-xs font-medium ${saveState === 'error' ? 'text-red-600' : 'text-brand-slate'}`}>
              {saveIndicator}
            </span>
          ) : null}
        </div>

        {/* Step progress bar */}
        <div className="max-w-2xl mx-auto px-4 pb-2">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i === step ? 'bg-brand-blue' : i < step ? 'bg-brand-green' : 'bg-slate-200'
                }`}
                aria-label={STEPS[i]}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Step content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {renderStep()}
      </main>

      {/* Bottom navigation */}
      <nav className="sticky bottom-0 bg-white border-t border-[#e9eef5] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex-1 border border-[#e9eef5] text-brand-charcoal font-semibold text-sm py-3 rounded-full min-h-[52px] disabled:opacity-30 hover:border-brand-navy/40 transition-colors"
          >
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
              className="flex-1 bg-brand-navy text-white font-semibold text-sm py-3 rounded-full min-h-[52px] hover:bg-brand-blue transition-colors"
            >
              Next
            </button>
          ) : null}
        </div>
      </nav>
    </div>
  );
}

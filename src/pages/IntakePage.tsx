import { useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';

const steps = [
  'About you',
  'Your issue',
  'Body map',
  'Medical',
  'Lifestyle',
  'Consent',
];

export default function IntakePage() {
  const stepperRef = useRef<HTMLDivElement | null>(null);

  const scrollToSteps = () => {
    stepperRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-brand-offWhite text-brand-charcoal min-h-screen">
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-8">
          <SectionHeading
            align="left"
            title="New Patient Intake Form"
            subtitle="Save time and help Mike prepare before your first session. This quick intake covers your details, goals, and any important health notes."
          />

          <Card className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-brand-navy">What to expect</h2>
              <p className="text-slate-700">
                You&apos;ll work through a handful of short steps so I can understand your goals,
                medical history, and current issue. It usually takes a few minutes and helps ensure your
                first appointment is focused and effective.
              </p>
            </div>

            <div ref={stepperRef} className="space-y-4">
              <h3 className="text-lg font-semibold text-brand-navy">Steps</h3>
              <ol className="grid gap-3 sm:grid-cols-2">
                {steps.map((step, index) => (
                  <li
                    key={step}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-brand-offWhite px-4 py-3"
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-white text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-brand-charcoal font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button onClick={scrollToSteps}>Start form</Button>
              <p className="text-sm text-slate-600">
                Your details are kept private. See our{' '}
                <a href="/privacy" className="underline text-brand-navy hover:text-brand-blue">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}

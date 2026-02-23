import { useState } from 'react';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

export function LocationSection() {
  const [logoMissing, setLogoMissing] = useState(false);

  return (
    <Section id="location" variant="muted">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Location"
          title="Now based at CrossFit Clifton"
          subtitle="In-person sessions are now delivered from CrossFit Clifton, Bristol, with coaching options for youth athletes and small groups."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="space-y-3 hover-lift">
            <h3 className="text-lg font-semibold text-brand-charcoal">Training base</h3>
            <p className="text-slate-700">CrossFit Clifton, Bristol</p>
            <p className="text-slate-700">Please contact for exact booking times and session availability.</p>
          </Card>

          <Card className="flex min-h-48 items-center justify-center border-dashed border-slate-300 bg-white/70">
            {!logoMissing ? (
              <img
                src="/crossfit-clifton-logo.png"
                alt="CrossFit Clifton logo"
                className="max-h-32 w-auto"
                onError={() => setLogoMissing(true)}
              />
            ) : (
              <p className="text-center text-sm text-slate-600">
                Add the logo file at <span className="font-semibold">public/crossfit-clifton-logo.png</span> and it will appear here.
              </p>
            )}
          </Card>
        </div>
      </div>
    </Section>
  );
}

export default LocationSection;

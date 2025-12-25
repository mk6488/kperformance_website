import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const tiers = [
  {
    duration: 'Adult session',
    price: '£65',
    notes: '60 minutes of hands-on treatment, movement coaching, and clear next steps for adult athletes.',
  },
  {
    duration: 'Under-18 session',
    price: '£45',
    notes: '60 minutes tailored for juniors, with parent/guardian consent and simple take-home drills.',
  },
  {
    duration: 'First session (assessment-led)',
    price: '75 min',
    notes: 'First visit. Price: £65 adult / £45 under-18.',
  },
  {
    duration: 'Junior athlete block (3 sessions)',
    price: '£120',
    notes: 'Build momentum over 3–6 weeks with consistent hands-on work and progressive home drills.',
  },
];

export function PricingSection() {
  return (
    <Section id="pricing">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Pricing & locations"
          title="Simple, transparent pricing"
          subtitle="Mobile within Bristol; we’ll confirm travel if you’re further out."
        />

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <Card key={tier.duration} className="h-full flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-brand-charcoal">{tier.duration}</h3>
              <p className="text-3xl font-semibold text-brand-navy">{tier.price}</p>
              <p className="text-slate-600">{tier.notes}</p>
            </Card>
          ))}
        </div>

        <p className="text-sm text-slate-600">
          All sessions include assessment, hands-on treatment, and movement coaching. Standard sessions are 60 minutes; the first session is 75 minutes due to a full assessment.
        </p>
        <p className="text-sm text-slate-600">
          All sessions are delivered at your home. Travel within Bristol is included; small additional fees may apply for locations outside the city.
        </p>
      </div>
    </Section>
  );
}

export default PricingSection;




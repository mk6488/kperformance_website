import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const tiers = [
  {
    duration: 'Adult session',
    price: '£65',
    notes: '60 minutes (75 minutes for first session). Assessment, hands-on treatment, and movement coaching included.',
  },
  {
    duration: 'Under-18 session',
    price: '£45',
    notes: '60 minutes (75 minutes for first session). Assessment, hands-on treatment, and movement coaching included.',
  },
  {
    duration: 'Junior athlete block (3 sessions)',
    price: '£120',
    notes: 'Build momentum and consistency over several weeks with assessment, hands-on work, and simple take-home drills.',
  },
];

export function PricingSection() {
  return (
    <Section id="pricing">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Pricing & locations"
          title="Simple, transparent pricing"
          subtitle="All sessions include assessment, hands-on treatment, and movement coaching. Sessions are 60 minutes (75 minutes for first session). Mobile within Bristol; we’ll confirm travel if you’re further out."
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
          All sessions are delivered at your home. Travel within Bristol is included; small additional fees may apply for locations outside the city.
        </p>
      </div>
    </Section>
  );
}

export default PricingSection;




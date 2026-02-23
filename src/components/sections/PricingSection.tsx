import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const tiers = [
  {
    duration: '1:1 Coaching Session',
    price: '£50',
    notes: 'Per athlete, per session.',
  },
  {
    duration: '2:1 Coaching Session',
    price: '£25',
    notes: 'Per athlete, per session (train with a partner).',
  },
  {
    duration: 'Small Group (3–6 athletes)',
    price: '£17',
    notes: 'Per athlete, per session.',
  },
];

export function PricingSection() {
  return (
    <Section id="pricing" variant="muted">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Youth coaching pricing"
          subtitle="Straightforward per-athlete pricing with options for 1:1, partner, and small-group training."
        />

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.duration} className="h-full flex flex-col gap-3 hover-lift">
              <h3 className="text-xl font-semibold text-brand-charcoal">{tier.duration}</h3>
              <p className="text-4xl font-semibold text-brand-navy">{tier.price}</p>
              <p className="text-slate-600">{tier.notes}</p>
            </Card>
          ))}
        </div>

        <p className="text-sm text-slate-700">
          Soft tissue therapy can be added as secondary support for recovery and niggles.
        </p>
      </div>
    </Section>
  );
}

export default PricingSection;

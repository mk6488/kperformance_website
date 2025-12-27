import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const tiers = [
  {
    duration: '45 minutes',
    price: '£45',
    notes: 'Great for targeted soft tissue work, quick tune-ups, or follow-up sessions.',
  },
  {
    duration: '60 minutes',
    price: '£55',
    notes: 'Ideal for a full assessment, hands-on treatment, and movement coaching.',
  },
  {
    duration: '75 minutes',
    price: '£65',
    notes: 'Recommended for more complex issues or multi-area treatment.',
  },
  {
    duration: 'Junior athlete block (3 sessions)',
    price: '£150',
    notes: 'Perfect for building momentum with rehab or performance development over several weeks.',
  },
];

export function PricingSection() {
  return (
    <Section id="pricing">
      <div className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Pricing & locations"
          title="Simple, transparent pricing"
          subtitle="Mobile within Bristol. Travel fees may apply for areas further out — we’ll confirm together."
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




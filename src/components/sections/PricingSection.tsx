import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionHeading } from '../ui/SectionHeading';

const tiers = [
  { duration: '45 minutes', price: '£45', notes: 'Great for focused areas or follow-ups.' },
  { duration: '60 minutes', price: '£55', notes: 'Balanced time for assessment + treatment.' },
  { duration: '75 minutes', price: '£65', notes: 'Extended session for complex needs.' },
  {
    duration: 'Junior athlete block (3 sessions)',
    price: '£150',
    notes: 'Ideal for building momentum with rehab or performance work over several weeks.',
  },
];

export function PricingSection() {
  return (
    <Section id="pricing">
      <div className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Pricing & locations"
          title="Simple, transparent pricing"
          subtitle="Mobile within Bristol. Travel fees may apply for areas further out — we’ll confirm together."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <Card key={tier.duration} className="h-full flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-brand-charcoal">{tier.duration}</h3>
              <p className="text-3xl font-semibold text-brand-navy">{tier.price}</p>
              <p className="text-slate-600">{tier.notes}</p>
            </Card>
          ))}
        </div>

        <p className="text-sm text-slate-600">
          Serving Bristol and nearby areas. I bring the treatment table and equipment; we can plan for
          home, club, or pitch-side locations.
        </p>
      </div>
    </Section>
  );
}

export default PricingSection;

